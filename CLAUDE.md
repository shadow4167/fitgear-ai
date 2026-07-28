@AGENTS.md

## Project: FitGear AI

Mobile-first web app that recommends youth hockey equipment based on age, skill level, position, and budget. See @PRD.MD for full product spec.

### Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

### Stack

- Next.js 16.2.10 (App Router), React 19, TypeScript (strict mode)
- Path alias `@/*` → `src/*`
- No Tailwind/shadcn installed yet despite PRD mention — current UI uses plain CSS Modules (see `src/components/AppShell.module.css`)

### Structure

- `src/app/` — App Router entry (`layout.tsx`, `page.tsx`, `globals.css`)
- `src/components/FitGearApp.tsx` — root client component driving screen state
- `src/components/screens/` — one file per step in the flow (`HomeScreen`, `LevelScreen`, `TypeScreen`, `BudgetScreen`, `SearchScreen`, `ResultsScreen`, `DetailScreen`, `ChatScreen`, `GameScreen`, `ShopScreen`), plus `shared.tsx` for common UI bits
- `src/components/BottomNav.tsx` — persistent bottom navigation
- `src/lib/gear-data.ts` — static equipment/gear dataset
- `src/lib/game-render.ts` — canvas geometry constants + all pure drawing functions for the Shootout mini-game (goalie, shooter, skaters, celebrations) — no React, no state
- `src/lib/game-teams.ts` — static team/player roster data for the Shootout mini-game, same shape as `gear-data.ts`
- `src/lib/game-economy.ts` — pure functions for OVR speed multiplier, goal currency reward, and shop unlock cost
- `src/lib/game-storage.ts` — Shootout wallet persistence (`localStorage`), the only file that touches browser storage
- `src/lib/game-play.ts` — Shootout on-ice skater positioning and pass/interception legality
- `src/types/fitgear.ts` — shared domain types (`Screen`, `Equipment`, `ResultEntry`, `ChatMessage`, `GameTeam`, `GameWallet`, etc.) — extend here rather than redefining types locally in a screen

### Conventions

- Screens are named `<Name>Screen.tsx` and live only under `src/components/screens/`; navigation between them is driven by the `Screen` union type in `src/types/fitgear.ts`, not routing — this is a single-page app shell, not multi-route
- Add new equipment/gear data to `src/lib/gear-data.ts` rather than inlining it in components

### Code Quality

- Build only what was asked. No extra features, config options, or "while I'm in here" fixes — flag unrelated issues instead of fixing them.
- No speculative abstractions. Don't extract a helper, hook, or shared component until the same logic is duplicated 3+ times.
- Prefer editing an existing file/component over creating a new one; prefer deleting unused code over commenting it out.
- Keep functions single-purpose and under ~40 lines; split anything longer.
- No comments that restate what the code does. Only comment a non-obvious *why* (a workaround, a hidden constraint).
- No error handling, try/catch, or fallback branches for states TypeScript's strict mode already rules out.
- Don't add a new dependency unless the task requires it and it's not already in `package.json`.
- Match existing patterns in `src/components/screens/` and `src/lib/` rather than introducing a new one for the same problem.
- If a request implies more work than stated (new screens, new data fields, new deps), stop and confirm scope before building it.
