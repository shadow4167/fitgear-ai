import { catalog, equipment } from "./gear-data";
import type {
  AltPick,
  ChatRec,
  EquipId,
  GearCandidate,
  Position,
  ResultEntry,
  StoreOffer,
  Tier,
  TopPick,
} from "@/types/fitgear";

export function cheapestStore(candidate: GearCandidate): StoreOffer {
  return candidate.stores.reduce((a, b) => (b.price < a.price ? b : a), candidate.stores[0]);
}

export function eligibleCandidates(equip: EquipId, tier: Tier, position: Position): GearCandidate[] {
  const all = catalog[equip].candidates;
  const fitting = all.filter(
    (c) => c.tierFit.includes(tier) && (!c.positionFit || c.positionFit.includes(position)),
  );
  return fitting.length ? fitting : all;
}

export function toTopPick(candidate: GearCandidate, tier: Tier, position: Position, why: string): TopPick {
  const best = cheapestStore(candidate);
  return {
    brand: candidate.brand,
    model: candidate.model,
    price: best.price,
    store: best.name,
    fit: `Matched to your ${tier} ${position} answers`,
    why,
    specs: candidate.specs,
    stores: candidate.stores,
  };
}

export function toAltPick(candidate: GearCandidate, note: string): AltPick {
  const best = cheapestStore(candidate);
  return {
    brand: candidate.brand,
    model: candidate.model,
    price: best.price,
    store: best.name,
    fit: candidate.tierFit.join("–"),
    note,
  };
}

export function deterministicRecommendation(
  equip: EquipId,
  tier: Tier,
  position: Position,
  budget: number,
): ResultEntry {
  const entry = catalog[equip];
  const fitting = eligibleCandidates(equip, tier, position);
  const price = (c: GearCandidate) => cheapestStore(c).price;

  const underBudget = fitting.filter((c) => price(c) <= budget);
  const top = underBudget.length
    ? underBudget.reduce((a, b) => (price(b) > price(a) ? b : a))
    : fitting.reduce((a, b) => (price(b) < price(a) ? b : a));
  const withinBudget = price(top) <= budget;

  const alts = fitting
    .filter((c) => c.id !== top.id)
    .sort((a, b) => Math.abs(price(a) - budget) - Math.abs(price(b) - budget))
    .slice(0, 3)
    .map((c) => toAltPick(c, `${c.tierFit.join("–")} fit`));

  const why = withinBudget
    ? `A solid ${tier.toLowerCase()} fit that lines up with your budget.`
    : `The most affordable ${tier.toLowerCase()}-level option we carry, though it still runs above your $${budget} budget.`;

  return {
    category: entry.category,
    low: entry.low,
    avg: entry.avg,
    high: entry.high,
    top: toTopPick(top, tier, position, why),
    alts,
  };
}

const TIER_WORDS: [RegExp, Tier][] = [
  [/\bhouse\s*league\b/i, "House League"],
  [/\btravel\b/i, "Travel"],
  [/\baaa\b/i, "AAA"],
  [/\baa\b/i, "AA"],
  [/\bbeginner\b/i, "Beginner"],
];

export function extractStatedTier(message: string): Tier | undefined {
  if (!/\bi\b/i.test(message)) return undefined;
  for (const [re, tier] of TIER_WORDS) {
    if (re.test(message)) return tier;
  }
  return undefined;
}

export function extractStatedPosition(message: string): Position | undefined {
  const m = message.match(/\bi\b[^.!?]{0,25}\b(forward|defense|goalie)\b/i);
  if (!m) return undefined;
  const word = m[1].toLowerCase();
  if (word === "forward") return "Forward";
  if (word === "defense") return "Defense";
  return "Goalie";
}

export function extractStatedBudget(message: string): number | undefined {
  const m =
    message.match(/budget[^\d]{0,15}\$?\s*(\d{2,5})/i) ?? message.match(/\$\s*(\d{2,5})[^\d]{0,15}budget/i);
  if (!m) return undefined;
  const value = Number(m[1]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function detectEquipId(lc: string): EquipId | null {
  for (const e of equipment) {
    if (lc.includes(e.name.toLowerCase()) || lc.includes(e.id)) return e.id;
  }
  if (lc.includes("skate")) return "skates";
  if (lc.includes("stick")) return "stick";
  if (lc.includes("helmet")) return "helmet";
  return null;
}

const SUPERLATIVE_EXPENSIVE = /most expensive|priciest|top[\s-]of[\s-]the[\s-]line|best money can buy|best possible|best.{0,10}\bever\b/i;
const SUPERLATIVE_CHEAPEST = /cheapest|least expensive|lowest price/i;

export function deterministicChatReply(
  message: string,
  tier: Tier,
  position: Position,
  budget: number,
): { reply: string; rec?: ChatRec; tier?: Tier; position?: Position; budget?: number } {
  const lc = message.toLowerCase();
  const statedTier = extractStatedTier(message);
  const statedPosition = extractStatedPosition(message);
  const statedBudget = extractStatedBudget(message);
  const effectiveTier = statedTier ?? tier;
  const effectivePosition = statedPosition ?? position;
  const effectiveBudget = statedBudget ?? budget;

  const id = detectEquipId(lc);
  if (!id) {
    if (statedTier || statedPosition || statedBudget) {
      return {
        reply: "Got it, updated. What gear are you looking for next?",
        tier: statedTier,
        position: statedPosition,
        budget: statedBudget,
      };
    }
    return {
      reply:
        'Got it. Tell me the piece of gear (helmet, skates, stick…), your level, and your budget and I\'ll find the best-fit model and where to buy it. Or tap "Find my gear" for the guided version.',
    };
  }

  if (SUPERLATIVE_EXPENSIVE.test(lc) || SUPERLATIVE_CHEAPEST.test(lc)) {
    const all = catalog[id].candidates;
    const wantExpensive = SUPERLATIVE_EXPENSIVE.test(lc);
    const pick = all.reduce((a, b) =>
      wantExpensive ? (cheapestStore(b).price > cheapestStore(a).price ? b : a) : cheapestStore(b).price < cheapestStore(a).price ? b : a,
    );
    const best = cheapestStore(pick);
    return {
      reply: `The ${wantExpensive ? "most premium" : "most affordable"} ${catalog[id].category.toLowerCase()} in our catalog is the ${pick.brand} ${pick.model} at $${best.price}.`,
      rec: { id, category: catalog[id].category, brand: pick.brand, model: pick.model, price: best.price, store: best.name },
      tier: statedTier,
      position: statedPosition,
      budget: statedBudget,
    };
  }

  const rec = deterministicRecommendation(id, effectiveTier, effectivePosition, effectiveBudget);
  return {
    reply: `For ${effectiveTier} ${effectivePosition.toLowerCase()} at your budget, I'd go with the ${rec.top.brand} ${rec.top.model}. ${rec.top.why}`,
    rec: {
      id,
      category: rec.category,
      brand: rec.top.brand,
      model: rec.top.model,
      price: rec.top.price,
      store: rec.top.store,
    },
    tier: statedTier,
    position: statedPosition,
    budget: statedBudget,
  };
}

const MATH_WORDS: [RegExp, string][] = [
  [/divided by/gi, "/"],
  [/multiplied by/gi, "*"],
  [/\btimes\b/gi, "*"],
  [/\bplus\b/gi, "+"],
  [/\bminus\b/gi, "-"],
];

const MATH_CUE_WORDS = /divided by|multiplied by|\btimes\b|\bplus\b|\bminus\b|what('?s| is)|calculate|compute|\bequals?\b|how much is/i;

function normalizeMathWords(input: string): string {
  let out = input;
  for (const [pattern, replacement] of MATH_WORDS) out = out.replace(pattern, replacement);
  return out;
}

function parseArithmetic(expr: string): number {
  let i = 0;
  const peek = () => expr[i];
  function number(): number {
    const start = i;
    if (expr[i] === "-") i++;
    while (i < expr.length && /[\d.]/.test(expr[i])) i++;
    if (i === start || (i === start + 1 && expr[start] === "-")) throw new Error("bad number");
    return Number(expr.slice(start, i));
  }
  function factor(): number {
    if (peek() === "(") {
      i++;
      const v = addSub();
      if (peek() !== ")") throw new Error("expected )");
      i++;
      return v;
    }
    return number();
  }
  function mulDiv(): number {
    let v = factor();
    while (peek() === "*" || peek() === "/") {
      const op = expr[i++];
      const rhs = factor();
      v = op === "*" ? v * rhs : v / rhs;
    }
    return v;
  }
  function addSub(): number {
    let v = mulDiv();
    while (peek() === "+" || peek() === "-") {
      const op = expr[i++];
      const rhs = mulDiv();
      v = op === "+" ? v + rhs : v - rhs;
    }
    return v;
  }
  const result = addSub();
  if (i !== expr.length) throw new Error("trailing input");
  return result;
}

export function evaluateArithmetic(message: string): { expression: string; value: number } | null {
  const lc = message.toLowerCase();
  const percentMatch = lc.match(/(-?\d+(?:\.\d+)?)\s*%\s*of\s*(-?\d+(?:\.\d+)?)/);
  if (percentMatch) {
    const x = Number(percentMatch[1]);
    const y = Number(percentMatch[2]);
    const value = (x / 100) * y;
    return Number.isFinite(value) ? { expression: `${x}% of ${y}`, value } : null;
  }

  const normalized = normalizeMathWords(lc);
  const candidates = (normalized.match(/[-+*/().\d\s]+/g) ?? [])
    .map((c) => c.trim())
    .filter((c) => /\d/.test(c) && /[-+*/]/.test(c))
    .sort((a, b) => b.length - a.length);
  const best = candidates[0];
  if (!best) return null;

  // A bare, unspaced hyphen between two numbers (e.g. "2-1") reads as a score in a
  // hockey app, not subtraction — only trust it as math with a clearer signal.
  const hasUnambiguousOperator = /[*/+]/.test(best) || /[()]/.test(best);
  const hasSpacedMinus = /-\s+\d|\d\s+-/.test(best);
  const hasMathCue = MATH_CUE_WORDS.test(message);
  if (!hasUnambiguousOperator && !hasSpacedMinus && !hasMathCue) return null;

  const expr = best.replace(/\s+/g, "");
  if (!/^[-+*/().\d]+$/.test(expr)) return null;

  try {
    const value = parseArithmetic(expr);
    return Number.isFinite(value) ? { expression: best, value } : null;
  } catch {
    return null;
  }
}

export function isLikelyPureMath(message: string): boolean {
  const stripped = message
    .toLowerCase()
    .replace(/divided by|multiplied by|\btimes\b|\bplus\b|\bminus\b|percent|%|\bof\b/g, "")
    .replace(/what('?s| is)|calculate|compute|equals?|please|can you|tell me/g, "")
    .replace(/[-+*/().\d\s?.,!]/g, "");
  return stripped.length === 0;
}

export function formatMathAnswer(math: { expression: string; value: number }): string {
  const rounded = Math.round(math.value * 10000) / 10000;
  const display = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  const readableExpr = math.expression.replace(/\*/g, "×").replace(/\//g, "÷");
  return `${readableExpr} = ${display}`;
}
