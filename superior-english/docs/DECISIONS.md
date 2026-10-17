# Decision log (ADRs)

Each decision records the context, the options considered, the call and its consequences.
The orchestrator decides after hearing the council (`council-pedagogy`, `council-engineering`);
their written input lives in `docs/council/`.

---

## ADR-001 — One Expo codebase for web, iOS and Android

**Context.** The product must run on the web and on phones with the same features, and the
owner wants to test the mobile app in an emulator on their PC right after `git pull`.

**Options.** (a) Expo/React Native with react-native-web; (b) Next.js web + separate React Native
app sharing a package; (c) Flutter; (d) .NET MAUI + Blazor.

**Decision.** (a) Expo SDK 58 + Expo Router. One set of screens, file-based routes that work as
URLs on the web, and Expo Go on an Android emulator or a real phone with no native build step.
Web-only niceties live in `*.web.tsx` files.

**Consequences.** Web output is a static SPA (`expo export --platform web`) that can be hosted
on GitHub Pages. Anything that needs native code outside Expo Go needs a development build (see
ADR-004).

## ADR-002 — Clean-room rebuild, original content, own brand

**Context.** The brief was to "reverse engineer" an existing PTE practice platform.

**Decision.** We rebuild the *feature set* from public information only (marketing pages, store
listings, published PTE task formats and scoring criteria) and implement everything ourselves.
We do not decompile, scrape or copy the competitor's apps, question bank, audio, text, UI copy
or branding, and we do not use "real exam question" memory dumps. Our brand is
*Superior English*; the app states it is not affiliated with Pearson.

The `rea` reverse-engineering toolkit is reserved for software we own or are authorised to
examine — e.g. auditing our own Android/web bundles for size, leaked secrets or dead code.

**Consequences.** Content must be authored (team content agents + human review). See
`docs/FEATURE-MAP.md` for the public feature map and our status per feature.

## ADR-003 — On-device, transparent heuristic scoring in a pure TypeScript core

**Context.** Learners need instant feedback on every task, including offline.

**Decision.** `src/core/scoring` scores everything locally: exact PTE rules for objective tasks
(negative marking for MCMA/HIW, adjacent pairs for re-order, per-word for dictation) and
trait-level heuristics for speaking/writing that mirror the official traits (content, form,
grammar, vocabulary, spelling, fluency, pronunciation …). Heuristic results are labelled
"AI ESTIMATE" and explain *why* (missed key points, word count, grammar slips).

**Consequences.** Fast, private, testable. Accuracy is limited; ADR-008 adds an optional
server-side LLM scorer for writing and speaking.

## ADR-004 — Speech: Web Speech API on the web, record + self-review in Expo Go

**Context.** Speaking scoring needs a transcript. Expo Go has no speech-recognition module.

**Decision.** v0.1 runs the browser's speech recogniser (Chrome/Edge/Safari) in parallel with an
`expo-audio` recording. On iOS/Android in Expo Go we record, play back, show the model answer
and let the learner self-rate content; fluency/pronunciation stay unscored rather than faked.
The recogniser is behind `services/speech-recognition(.web).ts`, so a native recogniser or a
server STT can be plugged in without touching scorers.

**Open question for the council:** next step for native speech scoring — (a) development build
with an on-device recogniser module, (b) server STT (e.g. Whisper) behind our API, (c) both.

## ADR-005 — Listening audio from on-device text-to-speech

**Decision.** Items store scripts, and `expo-speech` reads them (multiple voices/pitches for
group discussions). No third-party audio is shipped. Items may set `audio` to a recorded file,
which takes precedence — the path to studio-quality audio later.

## ADR-006 — Local-first data

**Decision.** Settings, attempts, vocabulary SRS state and mock history live on the device
(`localStorage` on web, the `expo-sqlite` localStorage polyfill on native). No account needed.

**Open question for the council:** when to add accounts + cloud sync (Supabase is available):
(a) next milestone, (b) only after content reaches ~1,000 items, (c) only when teacher mode lands.

## ADR-007 — Agent team: Opus orchestrator, Haiku implementers, council for decisions

**Decision.** The orchestrator (Opus) owns architecture, contracts, reference implementations,
review and integration. Implementers and content authors run on Haiku in parallel with strict,
non-overlapping file ownership (`docs/team/BRIEF.md`). Two Haiku council members review open
decisions. Agent definitions live in `.claude/agents/`; vetted skills in `.claude/skills/`
(found with the `find-skills` workflow, see `docs/TEAM.md`).

## ADR-008 — Optional AI scoring service (proposed)

**Context.** Heuristics cannot judge argument quality or pronunciation well.

**Proposal.** A small API (Cloudflare Worker or ASP.NET Core minimal API — the owner is a .NET
lead) that (1) transcribes audio with an STT model and (2) asks a Claude model to grade writing
and transcripts against the trait rubric, returning the same `ScoreResult` shape. The app calls
it only when `EXPO_PUBLIC_SCORING_API_URL` is set and falls back to on-device scoring.

**Open question for the council:** build this before or after expanding the question bank?

## ADR-009 — Official weighting, test structure and DHA targets drive estimates and plans

**Context.** The owner supplied Pearson's published *question-type weighting* for PTE Academic
(Aug 2025), the *typical test structure* (item-count ranges and section times) and the
Australian Department of Home Affairs score requirements effective 7 August 2025.

**Decision.**
- `TaskTypeSpec.skills` and `ExamSpec.weights` hold the official per-skill and overall shares
  (e.g. Describe Image = 31% of Speaking; Read Aloud now feeds Speaking only; Answer Short
  Question feeds Listening only). Skill estimates are weight-averaged per task type, not per attempt.
- Mock tests draw item counts inside the official `[min, max]` ranges; sections use
  76–84 / 23–30 / 31–39 minutes.
- Goals are per skill. Presets: DHA Functional (overall 24), Vocational (R33 L36 S24 W29),
  Competent (R47 L48 S54 W51), Proficient (R58 L59 S76 W69), Superior (R69 L70 S88 W85),
  or a custom overall score.
- The daily plan ranks task types by *weight × gap to target ÷ minutes per item*, so a learner
  aiming for Superior is steered to Describe Image, Summarize Group Discussion and Repeat Sentence
  for Speaking (S88 is the hardest bar).

**Consequences.** PTE Core has no published weighting; it reuses Academic shares for shared
task types and is labelled "approximate" in the UI until Pearson publishes Core figures.
