@AGENTS.md

# Superior English — project notes for Claude

- Read `docs/team/BRIEF.md` before changing code. Contracts: `src/core/content/types.ts`
  (items and responses) and `src/features/practice/types.ts` (renderers).
- Keep `src/core` free of React Native imports. Every scoring or plan change needs a Vitest test.
- All content is original (ADR-002). Never paste questions from other prep platforms or
  "real exam" recall.
- Exam facts (weights, blueprint ranges, timings, DHA targets) live in `src/core/exams/`.
  Update them there, never in screens.
- Before committing, run `npm run check`. For UI changes, also run `npm run build:web`.
- Large features follow the team workflow in `docs/TEAM.md`: the orchestrator plans, Haiku
  implementers build in files they own, and the council weighs in on open decisions.
