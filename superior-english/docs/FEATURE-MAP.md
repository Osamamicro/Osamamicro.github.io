# Feature map (clean-room)

Built from **public** information only: the competitor's marketing pages and store listings,
Pearson's published test format, scoring guide and question weighting. Nothing was decompiled,
scraped or copied (see ADR-002). Status is for Superior English v0.1.

| Capability seen publicly | Superior English v0.1 | Next |
| --- | --- | --- |
| Practice for every PTE Academic task type (22) | ✅ All 22 + PTE Core's Write Email (23 renderers) | More items per type |
| PTE Core support | ✅ Core blueprint, Core-only items, Write Email | Core weighting when published |
| AI scoring — speaking (pronunciation, fluency, content) | ⚠️ Web: speech recognition + trait estimates. Mobile (Expo Go): record + self-review | Native recogniser / server STT (ADR-004, ADR-008) |
| AI scoring — writing (grammar, spelling, form, content) | ✅ On-device trait estimates with explanations | LLM rubric scoring (ADR-008) |
| Objective scoring (reading/listening) | ✅ Exact PTE rules incl. negative marking & pair scoring | — |
| Full mock tests with score report | ✅ Full / mini / section mocks, official item ranges & timing, skill report | Downloadable PDF report |
| Vocab book | ✅ ~220 words, SM-2 spaced repetition, TTS pronunciation | Personal word lists from mistakes |
| Shadowing practice | ⚠️ Replay prompt + record + compare | Sentence-by-sentence shadowing mode |
| AI study plan | ✅ Daily plan from weighting × gap to target × time | Weekly plan, reminders |
| Score report analysis | ✅ Per-skill estimates vs DHA/custom targets, per-task stats | Upload official score report |
| Study guides per question type | ✅ Strategy guide + template + common mistakes for all types | Video lessons / courses |
| Web + mobile apps, synced records | ⚠️ Same app on web/iOS/Android; data is per device | Accounts + cloud sync (ADR-006) |
| Teacher mode | ❌ | Classes, assignments, marking queue |
| Weekly "prediction" files | ❌ Deliberately excluded: they rely on recalled live exam content | — |
| Other exams (IELTS, TOEFL, Duolingo), MOOCs, study materials | ❌ | Data-driven exam specs make this additive |
