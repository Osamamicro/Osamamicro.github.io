# Team brief — read this before you touch code

You are part of the Superior English build team. The **orchestrator** (lead) plans, assigns
file ownership, reviews and integrates. **Implementers** (Haiku) do the building. The
**council** reviews decisions. This brief is the contract everyone works to.

## Product

Superior English is a cross-platform (web, iOS, Android) English exam trainer. v1 covers
**PTE Academic** and **PTE Core**: all 23 task types, instant scored feedback, mock tests,
a vocabulary book with spaced repetition, study plans and progress estimates. Later: IELTS,
TOEFL, Duolingo, courses (MOOC-style) and study materials.

It is a **clean-room** product. Never copy questions, text, audio, images, UI copy or branding
from APEUni or any other prep platform, and never use "real exam" memory dumps. Every
question you write must be original. Do not name competitors in the app.

## Stack and layout (app root: `superior-english/`)

- Expo SDK 58, React Native 0.88, React 19, Expo Router (routes in `src/app/`), TypeScript strict.
- `src/core/` — pure TypeScript domain (no React Native imports): exam specs, content types,
  scoring, SRS, mock assembly, study plans. Unit-tested with Vitest.
- `src/content/` — the original question bank, vocab and guides.
- `src/features/practice/` — task renderers (`speaking/`, `writing/`, `reading/`, `listening/`)
  plus `shared/` components and `practice-player.tsx`.
- `src/services/` — storage (`app-state.ts`), text-to-speech (`tts.ts`), speech recognition.
- `src/components/ui/` — UI kit: `Screen`, `Card`, `Row`, `Chip`, `Button`, `Text`,
  `ProgressBar`, `SectionTitle`, `Stat`. Theme tokens in `src/theme/index.ts` (`useColors()`).
- Import with the `@/` alias (`@/core`, `@/content`, `@/components/ui`, …).

## Contracts you build against

- **Item schema**: `src/core/content/types.ts`. Gap text uses `{{1}}`, `{{2}}` … placeholders.
  Highlight Incorrect Words uses inline `[shown|spoken]` marks.
- **Validation**: `src/core/content/validate.ts` (word-count ranges, option counts, etc.).
  The test `src/core/__tests__/content-bank.test.ts` runs it over the whole bank.
- **Task specs**: `src/core/exams/pte.ts` (`TASK_TYPES`: timings, traits, instructions).
- **Renderer contract**: `src/features/practice/types.ts` — `RendererProps<T>`:
  `item`, `mode` ('practice' | 'mock'), `onSubmit(response)` (call once), `onDraft(response)`
  (call on every change), `result` (set after submission in practice mode → show right/wrong).
  Reference renderers: `speaking/read-aloud.tsx` (speech) and `reading/reading-mcsa.tsx` (objective).
- **Shared components** (`src/features/practice/shared`): `RecordPanel`, `AudioPrompt`,
  `Passage`, `ChoiceList`, `WritingBox`, `SubmitBar`, `ScoreCard`, `useCountdown`, `formatClock`.
- **Scoring**: `scoreItem(item, response)` in `src/core/scoring/index.ts`. Renderers do not score.

## Rules

1. **Only edit the files you own** (listed in your assignment). If you need a change elsewhere,
   write it in your final report instead. Never edit `package.json`, never install packages,
   never run `git commit`/`git push`, never start dev servers (`expo start`).
2. Before finishing, run from `superior-english/`:
   - `npx tsc --noEmit 2>&1 | grep -E '<your paths>'` → must print nothing for your files.
   - `npx vitest run` → your tests and the content-bank test must pass for your files.
   Other team members edit in parallel; if an error is clearly in a file you do not own, ignore it.
3. Style: match the existing code (2-space indent, single quotes, kebab-case file names,
   inline styles or theme tokens, `gap` over margins, `selectable` on important text,
   `fontVariant: ['tabular-nums']` on counters). Use `process.env.EXPO_OS` rather than `Platform.OS`.
   Use `expo-audio` (never `expo-av`). No `img`/`div`; React Native components only.
4. Accessibility: buttons have labels, choices use `accessibilityRole`/`accessibilityState`.
5. English: clear, natural, varied topics (science, society, business, health, environment,
   history, technology, arts, everyday life in Canada for PTE Core). Use British or American
   spelling consistently within an item.
6. Final report (your last message): files changed, item/feature counts, anything you could not
   finish, and any change you need from another owner. Keep it under 200 words.
