import { GoogleGenAI, Type } from "@google/genai";
import { catalog } from "@/lib/gear-data";
import { cheapestStore, deterministicRecommendation, eligibleCandidates, toAltPick, toTopPick } from "@/lib/recommend";
import type { Division, EquipId, GearCandidate, Position, ResultEntry, Tier } from "@/types/fitgear";

const MODEL = "gemini-flash-latest";

interface RecommendBody {
  equip: EquipId;
  tier: Tier;
  position: Position;
  division: Division;
  budget: number;
}

interface RecommendModelOutput {
  topPickId: string;
  why: string;
  alternates: { id: string; note: string }[];
}

const TIERS: Tier[] = ["Beginner", "House League", "Travel", "AA", "AAA"];
const POSITIONS: Position[] = ["Forward", "Defense", "Goalie"];
const DIVISIONS: Division[] = ["U10", "U12", "U14", "U16", "U18"];

function isValidBody(b: RecommendBody): boolean {
  return (
    Object.hasOwn(catalog, b.equip) &&
    TIERS.includes(b.tier) &&
    POSITIONS.includes(b.position) &&
    DIVISIONS.includes(b.division) &&
    typeof b.budget === "number" &&
    Number.isFinite(b.budget)
  );
}

export async function POST(req: Request) {
  const body = (await req.json()) as RecommendBody;
  if (!isValidBody(body)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const { equip, tier, position, division, budget } = body;
  const entry = catalog[equip];
  const fitting = eligibleCandidates(equip, tier, position);
  const price = (c: GearCandidate) => cheapestStore(c).price;
  const underBudget = fitting.filter((c) => price(c) <= budget);
  const candidateSet = underBudget.length ? underBudget : fitting;

  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `A youth hockey player needs a ${entry.category.toLowerCase()}.
Player: ${tier} skill level, plays ${position}, age division ${division}, budget $${budget}.

Pick the single best product for this player from the candidates below, plus up to 3 alternates. Only ever use the "id" values given below — never invent a product, brand, or price. Every candidate listed already fits the budget${underBudget.length ? "" : " as closely as possible (nothing fully fits, so these are the closest available)"}.

Candidates:
${candidateSet
  .map((c) => `- id: ${c.id} | ${c.brand} ${c.model} | $${cheapestStore(c).price} | fits: ${c.tierFit.join(", ")} | specs: ${c.specs.join("; ")}`)
  .join("\n")}

Write "why" as 1-2 sentences aimed at the player/parent explaining the top pick. Write a short "note" (under 10 words) for each alternate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topPickId: { type: Type.STRING },
            why: { type: Type.STRING },
            alternates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  note: { type: Type.STRING },
                },
                required: ["id", "note"],
              },
            },
          },
          required: ["topPickId", "why", "alternates"],
        },
      },
    });

    const parsed = JSON.parse(response.text ?? "") as RecommendModelOutput;
    const top = candidateSet.find((c) => c.id === parsed.topPickId);
    if (!top) throw new Error("Model returned an unknown candidate id");

    const alts = parsed.alternates
      .map((a) => ({ candidate: candidateSet.find((c) => c.id === a.id), note: a.note }))
      .filter(
        (a): a is { candidate: GearCandidate; note: string } => !!a.candidate && a.candidate.id !== top.id,
      )
      .slice(0, 3);

    const result: ResultEntry = {
      category: entry.category,
      low: entry.low,
      avg: entry.avg,
      high: entry.high,
      top: toTopPick(top, tier, position, parsed.why),
      alts: alts.map((a) => toAltPick(a.candidate, a.note)),
    };

    return Response.json(result);
  } catch (err) {
    console.error("[api/recommend] Gemini call failed, using deterministic fallback:", err);
    return Response.json(deterministicRecommendation(equip, tier, position, budget));
  }
}
