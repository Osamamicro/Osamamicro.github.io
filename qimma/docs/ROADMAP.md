# Roadmap

**v0.1 (this release)** — all PTE Academic + Core task types, original starter bank, on-device
scoring, mocks with official structure, vocab SRS, DHA-aware study plan, web + Android emulator.

**v0.2 — better scoring**
- AI scoring service (ADR-008): STT for speaking on phones, Claude rubric scoring for writing
  and open speaking tasks, same `ScoreResult` shape, opt-in via `EXPO_PUBLIC_SCORING_API_URL`.
- Development build with an on-device speech recogniser for iOS/Android.

**v0.3 — content at scale**
- 1,000+ reviewed original items (team content agents + human editor workflow and a review
  checklist), recorded human audio for listening, image-based Describe Image items.
- Shadowing mode, mistake notebook, personal vocab from errors.

**v0.4 — accounts & teachers**
- Supabase auth + sync (attempts, SRS, mocks), teacher mode (classes, assignments, marking).

**Later** — IELTS, TOEFL iBT, Duolingo English Test as new `ExamSpec`s + renderers; MOOC-style
courses (lessons, quizzes, certificates) and downloadable study materials.
