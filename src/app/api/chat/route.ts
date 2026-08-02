import { GoogleGenAI, Type } from "@google/genai";
import { catalog, equipment } from "@/lib/gear-data";
import {
  cheapestStore,
  deterministicChatReply,
  evaluateArithmetic,
  formatMathAnswer,
  isLikelyPureMath,
} from "@/lib/recommend";
import type { ChatMessage, ChatRec, EquipId, GearCandidate, Position, Tier } from "@/types/fitgear";

const MODEL = "gemini-flash-latest";

const TIERS: Tier[] = ["Beginner", "House League", "Travel", "AA", "AAA"];
const POSITIONS: Position[] = ["Forward", "Defense", "Goalie"];

interface ChatBody {
  message: string;
  history: ChatMessage[];
  tier: Tier;
  position: Position;
  budget: number;
}

interface ChatModelOutput {
  reply: string;
  equipId?: string;
  candidateId?: string;
  tier?: string;
  position?: string;
  budget?: number;
}

// Backstop for when the model names a real catalog product in its reply text
// but forgets to set equipId/candidateId — resolve the product from the text itself.
// Some model names (e.g. "Sherwood Rekker EK15") are reused verbatim across
// categories, so plain substring matching can pick the wrong category — bias
// toward whichever category's name is also mentioned in the conversation.
function findCandidateByText(reply: string, message: string): { equipId: EquipId; candidate: GearCandidate } | undefined {
  const lc = reply.toLowerCase();
  const hint = `${message} ${reply}`.toLowerCase();
  let best: { equipId: EquipId; candidate: GearCandidate; score: number } | undefined;
  for (const e of equipment) {
    const categoryMentioned = hint.includes(e.name.toLowerCase()) || hint.includes(e.id);
    for (const candidate of catalog[e.id].candidates) {
      const name = `${candidate.brand} ${candidate.model}`.toLowerCase();
      if (!lc.includes(name)) continue;
      const score = name.length + (categoryMentioned ? 1000 : 0);
      if (!best || score > best.score) {
        best = { equipId: e.id, candidate, score };
      }
    }
  }
  return best ? { equipId: best.equipId, candidate: best.candidate } : undefined;
}

function catalogListing(): string {
  return equipment
    .flatMap((e) =>
      catalog[e.id].candidates.map(
        (c) => `- equipId: ${e.id} | candidateId: ${c.id} | ${c.brand} ${c.model} | $${cheapestStore(c).price} | fits: ${c.tierFit.join(", ")}`,
      ),
    )
    .join("\n");
}

export async function POST(req: Request) {
  const { message, history, tier, position, budget } = (await req.json()) as ChatBody;

  const math = evaluateArithmetic(message);
  if (math && isLikelyPureMath(message)) {
    return Response.json({ reply: formatMathAnswer(math) });
  }

  const mathHint = math
    ? `\n\nExact computed result to use if a calculation is relevant: ${formatMathAnswer(math)}. State this exact number verbatim — do not recompute it yourself.`
    : "";

  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `You are the FitGear Coach, a friendly, knowledgeable assistant chatting inside the FitGear AI app. You help with youth hockey equipment shopping, but you're also happy to answer general hockey knowledge questions (rules, positions, techniques, training tips, sizing, care) and reasonable off-topic questions — you're not limited to gear shopping.

Player context: ${tier} skill level, plays ${position}, budget $${budget}.

Conversation so far:
${history.map((m) => `${m.role === "user" ? "Player" : "Coach"}: ${m.text}`).join("\n") || "(none yet)"}

Player just said: "${message}"

Reply conversationally and helpfully, normally 1-4 sentences (longer only if the question genuinely needs it). Never invent a brand, model, or price — only ever name products that appear in the catalog below.

If the player asks for something outside what the catalog can literally answer (e.g. "the best/most expensive/lightest skates ever made"), don't say you can't help — answer with the closest real match from the catalog below (e.g. the most expensive skates in the catalog) and briefly note that's the top option in this catalog.

STRICT BUDGET RULE: never recommend a product priced above the player's budget ($${budget}) if the catalog has ANY item in that equipment category priced at or under budget — pick the best-fitting one that's still within budget. Only recommend something over budget if literally every candidate in that category costs more than the budget (e.g. a $10 budget for skates); in that case pick the single cheapest item in the category and say clearly that it's still above their budget.

STRICT RULE on equipId/candidateId: set them whenever your reply text names ANY specific product from the catalog by brand + model, for ANY reason — the main recommendation, a substitute, an alternative, or a comparison. The rule is about what your reply text says, not about what the player asked. If the reply names a product, the ids for that exact product are REQUIRED. Only leave them out if your reply names no specific catalog product at all (e.g. general knowledge, off-topic, or a clarifying question back to the player).${mathHint}

If the player states a NEW skill level, position, or budget in this message (e.g. "actually my budget is $150", "I play forward now"), set the matching tier/position/budget field to the updated value so we can remember it — tier must be exactly one of Beginner, House League, Travel, AA, AAA and position must be exactly one of Forward, Defense, Goalie. Leave a field unset if the player didn't just state a change to it.

Catalog:
${catalogListing()}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            equipId: { type: Type.STRING },
            candidateId: { type: Type.STRING },
            tier: { type: Type.STRING },
            position: { type: Type.STRING },
            budget: { type: Type.NUMBER },
          },
          required: ["reply"],
        },
      },
    });

    const parsed = JSON.parse(response.text ?? "") as ChatModelOutput;
    let rec: ChatRec | undefined;

    if (parsed.equipId && parsed.candidateId) {
      const equipId = parsed.equipId as EquipId;
      const candidate = catalog[equipId]?.candidates.find((c) => c.id === parsed.candidateId);
      if (candidate) {
        const best = cheapestStore(candidate);
        rec = {
          id: equipId,
          category: catalog[equipId].category,
          brand: candidate.brand,
          model: candidate.model,
          price: best.price,
          store: best.name,
        };
      }
    }

    if (!rec) {
      const found = findCandidateByText(parsed.reply, message);
      if (found) {
        const best = cheapestStore(found.candidate);
        rec = {
          id: found.equipId,
          category: catalog[found.equipId].category,
          brand: found.candidate.brand,
          model: found.candidate.model,
          price: best.price,
          store: best.name,
        };
      }
    }

    const updatedTier = TIERS.find((t) => t === parsed.tier);
    const updatedPosition = POSITIONS.find((p) => p === parsed.position);
    const updatedBudget =
      typeof parsed.budget === "number" && Number.isFinite(parsed.budget) && parsed.budget > 0
        ? parsed.budget
        : undefined;

    return Response.json({
      reply: parsed.reply,
      rec,
      tier: updatedTier,
      position: updatedPosition,
      budget: updatedBudget,
    });
  } catch (err) {
    console.error("[api/chat] Gemini call failed, using deterministic fallback:", err);
    const fallback = deterministicChatReply(message, tier, position, budget);
    return Response.json({ reply: fallback.reply, rec: fallback.rec });
  }
}
