# Architecture

```
┌────────────── src/app (Expo Router screens) ──────────────┐
│ Today · Practice · Mock · Vocab · Progress · Settings      │
└───────┬───────────────────────────┬────────────────────────┘
        │                           │
┌───────▼──────── features ───────┐ │  services
│ practice/renderers  (23 tasks)  │ │  app-state.ts  reactive stores (localStorage)
│ practice/shared     RecordPanel │ │  tts.ts        expo-speech prompts
│   AudioPrompt, ScoreCard, inputs│ │  speech-recognition(.web).ts
│ practice-player · mock-runner   │ │
└───────┬─────────────────────────┘ │
        │ scoreItem(item, response) │
┌───────▼──────────── src/core (pure TypeScript, Vitest) ────────────┐
│ exams/   TaskTypeSpec, ExamSpec (blueprint ranges, official weights),│
│          ScoreTarget (DHA 2025 presets)                             │
│ content/ Item schema, validation, audio scripts                     │
│ scoring/ objective rules · writing traits · speaking traits         │
│ progress/ weighted 10–90 estimates · srs/ SM-2 · mock/ · plan/       │
└───────▲────────────────────────────────────────────────────────────┘
        │
  src/content (original items, vocab, guides)
```

## Key ideas

- **Data-driven exams.** A task type is a spec (timing, traits, weights, response kind) plus
  a renderer. An exam is a list of sections, blueprint ranges and weights. To add IELTS, write
  new specs, items and renderers. The player, mocks, estimates and plans work unchanged.
- **Renderer contract** (`src/features/practice/types.ts`). A renderer only collects an answer
  (`onSubmit`, `onDraft`) and shows correctness when it is given a `result`. Scoring and
  storage stay outside it, so the same renderer serves practice and mock modes.
- **Pure core.** Everything that decides a score or a plan lives in `src/core`, with no React
  Native imports. It runs in Vitest and offline on every platform.
- **Local-first.** `createStore(key, fallback)` wraps localStorage with
  `useSyncExternalStore`. On native, `expo-sqlite` installs a synchronous localStorage, so the
  same code runs everywhere.
- **Audio.** Prompts are text-to-speech by default, and an item's `audio` field overrides it
  with a recorded file. Speaking answers are recorded with `expo-audio`. On the web, the
  browser's speech recognizer runs alongside the recording to produce the transcript.
- **Platform files.** `*.web.tsx` / `*.web.ts` hold web-specific code: the top navigation bar
  and the Web Speech API.
