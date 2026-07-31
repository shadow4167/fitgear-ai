import { GoogleGenAI, Type } from "@google/genai";
import { catalog, equipment } from "@/lib/gear-data";
import {
  cheapestStore,
  deterministicChatReply,
  evaluateArithmetic,
  formatMathAnswer,
  isLikelyPureMath,
} from "@/lib/recommend";
import type { ChatMessage, ChatRec, EquipId, Position, Tier } from "@/types/fitgear";

const MODEL = "gemini-flash-latest";

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

STRICT RULE on equipId/candidateId: set them whenever your reply text names ANY specific product from the catalog by brand + model, for ANY reason — the main recommendation, a substitute, an alternative, or a comparison. The rule is about what your reply text says, not about what the player asked. If the reply names a product, the ids for that exact product are REQUIRED. Only leave them out if your reply names no specific catalog product at all (e.g. general knowledge, off-topic, or a clarifying question back to the player).${mathHint}

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

    return Response.json({ reply: parsed.reply, rec });
  } catch (err) {
    console.error("[api/chat] Gemini call failed, using deterministic fallback:", err);
    const fallback = deterministicChatReply(message, tier, position, budget);
    return Response.json({ reply: fallback.reply, rec: fallback.rec });
  }
}
