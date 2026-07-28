# FitGear AI — Prototype Implementation Plan

## Scope for this pass

The screen designs already exist and are not final visually — this plan is about making the existing flow **functionally real**: answers actually drive the recommendation, instead of every search returning the same hardcoded object from `gear-data.ts`.

Decisions made with the user before writing this plan:

- **Equipment selection stays single-item-per-search** (matches current `TypeScreen` design). The PRD's literal multi-select checklist is not being built this pass — users can just run another search for a different piece of gear.
- **No live OpenAI integration this pass.** The recommendation engine will be real, deterministic, rule-based logic driven by the user's actual answers (tier, position, age, budget) — not a call to an external AI API. Real OpenAI wiring is captured as a deferred Phase 6 below, for later.
- **API key**: not yet obtained. Phase 6 includes getting `OPENAI_API_KEY` and env setup as an explicit step when that phase is picked up.

## Current-state gaps this plan closes

1. `FitGearApp.tsx` does `const res = results[equip]` — a static lookup keyed **only** on which equipment type was picked. Tier, position, age, and budget are captured in state but never actually influence which product is recommended.
2. There's no **Age** question at all (PRD explicitly lists it). The existing `Division` chips (U10–U18) are an age-bracket proxy but aren't framed as "age."
3. `Tier` values (`House | B | A | AA | AAA`) don't match the PRD's skill-level labels (`Beginner | House League | Travel | AA | AAA`), and these values are rendered directly as button labels — visible mismatch.
4. `gear-data.ts` stores one fixed "top pick" + 3 alternates per equipment category with no tier/position/budget parameters — there's nothing to actually filter or rank.
5. Chat (`replyFor` in `FitGearApp.tsx`) has its own separate, budget-blind lookup logic duplicating (and diverging from) the questionnaire path.
6. No handling for edge cases like a budget below every candidate's price.

---

## Phase 1 — Align the questionnaire data model with the PRD

- In `src/types/fitgear.ts`:
  - Rename `Tier` values to match PRD skill levels: `"Beginner" | "House League" | "Travel" | "AA" | "AAA"`.
  - Keep `Division` as the age-bracket input (U10–U18) but treat it as the answer to the PRD's "Age" question — no separate numeric age field, to avoid a second redundant input. This is an assumption; flag it for sign-off if you'd rather have a raw numeric age field instead.
- Update `LevelScreen.tsx`'s `TIERS` array and any other place `Tier` literals are used (`FitGearApp.tsx` default state, `gear-data.ts` if it references tier strings).
- Search the codebase for the old tier literals (`"House"`, `"B"`, `"A"`) to make sure nothing is left stale.

## Phase 2 — Build a real recommendation engine

- Restructure `src/lib/gear-data.ts` so each `EquipId` maps to a **flat list of product candidates**, not a single fixed top pick. Each candidate needs enough attributes to filter/rank on:
  - `brand`, `model`, `price`, `store`, `specs`
  - `tierFit: Tier[]` — which skill levels it's appropriate for
  - `positionFit?: Position[]` — omit/empty for gear that fits all positions, set explicitly for goalie-specific items
- Add `src/lib/recommend.ts` exporting a pure function, e.g. `getRecommendation(equip, tier, position, budget): ResultEntry`, that:
  - Filters candidates by tier/position appropriateness.
  - Picks the best-fit "top pick": closest to budget without exceeding it; if nothing fits under budget, falls back to the cheapest appropriate candidate (never crashes on a very low budget).
  - Returns 2–3 alternates (e.g. next-closest, best value, premium-over-budget) from the remaining filtered candidates.
  - Generates the "why" explanation via a small template function parameterized by tier/position/budget (rule-based text, not an LLM call) so the explanation actually reflects the user's answers instead of being static copy.
- Update `ResultEntry`/`TopPick`/`AltPick` types only if the new fields require it — keep changes minimal.

## Phase 3 — Wire the real engine into the app

- `FitGearApp.tsx`: replace `const res = results[equip]` with a memoized call to `getRecommendation(equip, tier, position, budget)` (`useMemo` keyed on those four values) so Results/Detail screens reflect actual answers.
- Replace the chat's local `replyFor` lookup with the same `getRecommendation` function (also passing budget, which it currently ignores), so the questionnaire flow and chat guide never disagree on what counts as the "right" pick.
- Leave `SearchScreen`'s animated progress timer as-is — it's a loading animation, not a correctness issue, since the recommendation computation is synchronous and instant.

## Phase 4 — Edge cases & correctness pass

- Very low budget: confirm `getRecommendation` still returns a usable top pick + alternates rather than an empty/broken state, and that the "a bit over budget" badge on `ResultsScreen` shows correctly.
- Goalie position: confirm goalie-specific gear (if any candidates are marked goalie-only) is respected and skater-only gear is excluded when position is Goalie.
- Confirm changing tier/budget/position and re-running a search actually changes the displayed brand/model — this is the core bug being fixed, so it's the main manual test.

## Phase 5 — QA

- `npm run lint`
- `npm run dev`, manually walk the full flow at a mobile viewport width:
  - Home → Level (try multiple tier/position/division combos) → Type → Budget (drag to both extremes) → Search → Results → Detail → back navigation
  - Chat: send a free-text message and a suggestion chip, confirm the reply's rec card matches what the questionnaire would produce for the same inputs
- Confirm no regressions in existing visual design (this pass is logic-only, no intentional UI changes).

---

## Phase 6 — Deferred: real OpenAI integration (not this pass)

Captured now so it's easy to pick up later:

- Obtain an `OPENAI_API_KEY`, add it to a git-ignored `.env.local`.
- Add the `openai` package as a dependency.
- Add a Route Handler (e.g. `src/app/api/recommend/route.ts`, POST) that sends the user's answers **plus** the candidate list for that category from `gear-data.ts` to the model, and asks it to choose the top pick/alternates from those real candidates and write the explanation — keeping prices/stores trustworthy while making the reasoning genuinely AI-generated (this was the preferred approach when discussed, just deferred).
- Swap `SearchScreen`'s fixed animation timer for one driven by the actual fetch latency (with a sensible minimum duration so it doesn't flash).
- Add an error/fallback path: if the API call fails, fall back to the deterministic `recommend.ts` logic from Phase 2 rather than breaking the flow.
- Optionally wire `ChatScreen` to a conversational route grounded in the same catalog data.
