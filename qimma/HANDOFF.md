# Qimma — handoff for the next Claude Code session

Read this first. It gives you everything you need to continue after cloning, without the
original conversation.

## 1. What Qimma is

**Qimma** (قمّة, Arabic for *summit*) is an original English exam trainer for **web, Android
and iOS** from one Expo codebase. The owner is Osama, a .NET team lead in Riyadh who works on
Windows. His goal: help himself and others reach **Superior** English — the top level in the
Australian Home Affairs scale, R69 L70 S88 W85 on PTE Academic.

- **v0.1 (done):** PTE Academic and PTE Core.
- **Later:** other exams (IELTS, TOEFL, Duolingo), MOOC-style courses and study materials.

## 2. Where things stand (v0.1 complete)

| Area | State |
| --- | --- |
| Code | Branch `claude/english-learning-platform-12dh5f`. Draft PR #7 into `main` of `Osamamicro/Osamamicro.github.io`. The app lives in `qimma/`. |
| Task types | All 22 PTE Academic types + PTE Core *Write Email*. One renderer per type in `src/features/practice/{speaking,writing,reading,listening}`. |
| Content | 238 original items, 220 vocabulary entries, a strategy guide per task type (`src/content/`). |
| Scoring | Exact PTE rules for objective tasks. Trait-level heuristic estimates for speaking and writing, with a 25% on-topic floor (`src/core/scoring`). |
| Official data | Pearson weighting (Aug 2025), DHA 2025 targets and test-structure ranges, all in `src/core/exams/`. |
| Features | Practice player, full/mini/section mocks + report, vocab SRS (SM-2), daily plan, progress, settings. |
| Quality | `tsc` clean, Vitest 237/237, web export OK, 8 Playwright end-to-end flows pass at a 390px viewport. |
| Emulator | `scripts/setup-android-emulator.{ps1,sh}` (one-time setup) + `npm run emulator:android`. |

**Not verified yet:** a real Android emulator boot, the PowerShell script on Windows, and
microphone/text-to-speech behaviour on a device. The original sandbox had no KVM and no `pwsh`.

## 3. First 10 minutes

```bash
git clone https://github.com/Osamamicro/Osamamicro.github.io.git
cd Osamamicro.github.io
git checkout claude/english-learning-platform-12dh5f   # skip if PR #7 is already merged into main
cd qimma
npm install
npx expo start --web --port 8099   # once, then Ctrl+C: generates .expo/types for typed routes
npm run check                      # typecheck + 237 tests; must be green before you change anything
npm run web                        # Chrome/Edge (speech scoring needs the Web Speech API)
npm run emulator:android           # after the one-time setup script; see docs/EMULATOR.md
```

If the project has moved to its own repository (see §7), the app sits at that repo's root
instead of `qimma/`.

## 4. Read these next (in order)

1. `docs/team/BRIEF.md` — the contracts and rules every contributor follows.
2. `docs/ARCHITECTURE.md` — layers, the renderer contract, data flow.
3. `docs/DECISIONS.md` — ADR-001…011 and the council outcomes. Do not re-open settled decisions
   without new information.
4. `docs/SCORING.md`, `docs/FEATURE-MAP.md`, `docs/ROADMAP.md`, `docs/EMULATOR.md`.

Key contracts:

- `src/core/content/types.ts` — items, responses and `ScoreResult`.
- `src/features/practice/types.ts` — `RendererProps`.
- `src/core/exams/pte.ts` — task specs, weights and blueprints.

## 5. How work is done here

- **Team model.** Agents are defined in `.claude/agents/` at the repo root (see `docs/TEAM.md`):
  - You act as the **orchestrator**. You plan, write contracts and reference code, review and
    integrate.
  - **Implementer** and **content-author** agents run on Haiku and work in parallel, each on
    files nobody else owns.
  - **council-pedagogy** and **council-engineering** answer open decisions. Record the outcome
    as an ADR.
- **Skills** are in `.claude/skills/`: expo-router, expo-native-ui, vercel-react-native-skills,
  web-design-guidelines and webapp-testing. They were found with the `find-skills` workflow.
  Look for more with `npx skills find <topic>`, and check the source and install count before
  adding anything.
- **Expo SDK 58.** Read `AGENTS.md` and fetch the versioned docs before touching Expo APIs.
  Install packages with `npx expo install`.
- **Before every commit:** run `npm run check`. For UI changes, also run `npm run build:web` and
  take a screenshot at 390px and 1280px widths.
- **Commit and push to the working branch,** then keep the PR description current.

### Non-negotiables

- **Clean room (ADR-002).** Every question, text, audio file and UI string is original. Never copy
  from other prep platforms, and never use "real exam" recall or "prediction" files. Do not name
  competitors in the app.
- **Pearson disclaimer.** Keep the "not affiliated with Pearson; PTE is a trademark of Pearson"
  notice. Never present estimates as official scores.
- **`src/core` stays pure TypeScript** (no React Native imports). Every scoring or plan change
  ships with a Vitest test.
- **Exam facts live only in `src/core/exams/`:** weights, ranges, timings and targets.

## 6. Backlog (v0.2), in priority order

Each item lists *done when*.

1. **Verify on the owner's PC.** Run the Windows setup script and `npm run emulator:android`. Fix
   what breaks: SDK paths, AVD flags, the Expo Go version. *Done when* the app opens in the
   emulator, a Repeat Sentence item plays audio, and the microphone records.
2. **Progress export/import (ADR-006).** Add a JSON export/import of settings, attempts, SRS and
   mocks in Settings, with a schema `version` field and a storage-full warning. *Done when* a
   round-trip test passes and the UI works on web and in the emulator.
3. **AI scoring service, writing first (ADR-008).** A Supabase Edge Function (TypeScript) that
   takes `{ item, response }` and returns `ScoreResult`, grading against the trait rubric with
   a pinned Claude model. Keys live only in function secrets, never in `EXPO_PUBLIC_*`. The app
   calls it only when `EXPO_PUBLIC_SCORING_API_URL` is set. Fall back to on-device scoring on
   timeout, offline or a non-2xx reply. Load the `claude-api` skill before writing the model
   call. *Done when* SWT, essay, SST and email use it end-to-end, the fallback is tested, and
   there is a calibration script for at least 100 human-rated responses.
4. **Speech-to-text for phones (ADR-004).** Upload a recording to the same service, transcribe it
   transiently (never store audio), then score with the existing speaking scorers. Keep fluency
   and pronunciation hidden on phones until they are calibrated.
5. **Image-based Describe Image items (ADR-011).** Add figure-and-direction key points: a figure
   only counts when it appears with the right trend word in the same sentence.
6. **Summarize Group Discussion note grid (ADR-011).** One note column per speaker during the
   audio, and speaker-tagged key points.
7. **Content to 1,000 items,** using content-author agents plus a human review checklist. Add
   recorded audio for listening (the `audio` field overrides text-to-speech).
8. **Tooling.** ESLint config for `expo lint`; a CI workflow (GitHub Actions) running
   `npm run check` on PRs.
9. **Later:** accounts and sync (Supabase anonymous auth), teacher mode, then IELTS, TOEFL and
   DET as new `ExamSpec`s.

## 7. Decisions waiting on the owner

- **Hosting.** Recommended: move `qimma/` to its own repo (`Osamamicro/qimma`), as was done with
  the triathlon prototype, and deploy with GitHub Actions to Pages. Set
  `experiments.baseUrl: "/qimma"` and add an SPA `404.html`. The alternative is switching this
  user-site repo's Pages source to Actions.
- **Merging PR #7.**
- **AI services.** Supabase project and Anthropic API key for the scoring service (v0.2 item 3).

## 8. Gotchas

- Typed routes only exist after `expo start` has generated `.expo/types`. Without them, `tsc`
  does not check `router.push` paths.
- Expo Go must match SDK 58. If the emulator has an old Expo Go, `npx expo start --android`
  offers to reinstall it.
- Web speech recognition: Chrome and Edge only, and it needs https or localhost. A fatal error
  falls back to self-review, by design.
- The `expo-sqlite/localStorage/install` polyfill does nothing on the web (the browser's
  `localStorage` is used). Storage keys use the `qimma:` prefix.
- `RecordPanel` asks for a self-rating whenever there is no transcript, mock mode included, so
  answers are never stored unscored.
- PTE Core weights are **approximate** (`weightsSource: 'approximate'`) until Pearson publishes
  official figures.

## 9. Kickoff prompt for a new session

> You are continuing the Qimma project. Read `qimma/HANDOFF.md`, then `docs/team/BRIEF.md` and
> `docs/DECISIONS.md`. Run the "First 10 minutes" commands and report the results. Then take
> backlog item 1 (or the next unfinished one). Use the team workflow in `docs/TEAM.md`: plan as
> orchestrator, delegate file-owned pieces to Haiku implementers, and verify with
> `npm run check`, a web build and screenshots. Then commit, push and update the PR.

You can also run the project skill **`/continue-qimma`**, which does the same.
