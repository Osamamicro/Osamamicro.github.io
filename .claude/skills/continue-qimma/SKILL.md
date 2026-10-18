---
name: continue-qimma
description: Resume development of the Qimma English-exam app after cloning. Use at the start of a new session, or when asked to "continue", "pick up where we left off", or "what's next" on Qimma.
---

# Continue Qimma

1. Read `qimma/HANDOFF.md` in full, then `qimma/docs/team/BRIEF.md` and `qimma/docs/DECISIONS.md`.
2. Check the branch and state: `git status`, `git log --oneline -5`, and whether PR #7 is
   merged (if it is, work from `main`). If the project has moved to its own repo, follow
   that repo's HANDOFF instead.
3. Set up and verify from `qimma/`:
   - `npm install`
   - `npx expo start --web --port 8099` for about 30 seconds, then stop it. This generates
     `.expo/types` for typed routes.
   - `npm run check`. Report the result: typecheck plus about 237 tests.
4. Tell the owner in a few lines what state you found and which backlog item (HANDOFF §6)
   you will take next. Ask only if a decision in HANDOFF §7 blocks that item.
5. Work the item with the team workflow (`qimma/docs/TEAM.md`):
   - Plan as orchestrator and write contracts and reference code yourself.
   - Delegate file-owned pieces to `implementer` or `content-author` agents (Haiku) in parallel.
   - Convene `council-pedagogy` and `council-engineering` on open decisions and record ADRs.
6. Verify (`npm run check`, `npm run build:web`, screenshots at 390px and 1280px), commit,
   push, and update the PR and `HANDOFF.md` §2 and §6 so the next session starts accurately.
