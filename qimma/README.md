# Qimma

**Qimma** (قمّة, Arabic for *summit*) helps learners reach the top band (the *Superior*
level) in English exams. It is an original, cross-platform exam trainer that runs on
**web, Android and iOS** from one Expo codebase. v0.1 targets **PTE Academic** and
**PTE Core**. Later releases will add more exams (IELTS, TOEFL, Duolingo), MOOC-style
courses and study materials.

> **Continuing development?** Start with [HANDOFF.md](HANDOFF.md).

- **All task types.** It covers all 22 PTE Academic task types and PTE Core's *Write Email*.
  Each one has a strategy guide, a template and common mistakes to avoid.
- **Instant scoring.** Objective tasks are scored with the exact PTE rules: negative marking,
  adjacent-pair scoring and per-word dictation scoring. Speaking and writing get trait-level
  estimates (content, form, grammar, vocabulary, spelling, fluency, pronunciation) that
  explain how to improve.
- **Mock tests.** Full, mini and section mocks use Pearson's typical test structure (item
  ranges and section times). Each mock ends with a skill report.
- **Goals and study plan.** Goals can be the Australian Home Affairs levels in force from
  7 Aug 2025 (*Superior*: R69 L70 S88 W85) or a custom score. The daily plan ranks tasks by
  Pearson's published question weighting, your gap to target, and the time each task takes.
- **Vocabulary book.** About 220 entries, reviewed with SM-2 spaced repetition and
  text-to-speech pronunciation.
- **No copied content.** It is a clean-room product (see `docs/DECISIONS.md` ADR-002). Every
  question is original, and listening audio is generated on the device.

> Qimma is an independent study tool and is not affiliated with or endorsed by
> Pearson. PTE is a trademark of Pearson.

## Quick start

Requirements: Node 22+ and npm.

```bash
cd qimma
npm install
npm run web            # web app at http://localhost:8081 (use Chrome/Edge for speech scoring)
```

### Test the mobile app in an emulator on your PC

```bash
# one time: install Android Studio, then create the emulator
powershell -ExecutionPolicy Bypass -File scripts/setup-android-emulator.ps1   # Windows
bash scripts/setup-android-emulator.sh                                        # macOS / Linux

# every day: boot the emulator and open the app in Expo Go
npm run emulator:android
```

Full guide, including iOS Simulator, a physical phone and troubleshooting: [docs/EMULATOR.md](docs/EMULATOR.md).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run web` / `android` / `ios` | Start the dev server for a platform |
| `npm run emulator:android` | Boot the Android emulator (if needed) and open the app |
| `npm run check` | Typecheck + unit tests (run before every commit) |
| `npm test` | Vitest: scoring, SRS, mocks, plans, content-bank validation |
| `npm run build:web` | Static web build in `dist/` |

## Project map

```
src/app/            routes (Expo Router): tabs Today · Practice · Mock · Vocab · Progress
src/core/           pure TS domain: exams, weights, targets, scoring, SRS, mocks, plans
src/content/        original question bank, vocabulary, strategy guides
src/features/       practice renderers per task type, mock runner, vocab review
src/services/       storage, text-to-speech, speech recognition
docs/               decisions (ADRs), architecture, scoring, roadmap, team, emulator
```

Read next: [Architecture](docs/ARCHITECTURE.md) · [Scoring](docs/SCORING.md) ·
[Decisions](docs/DECISIONS.md) · [Feature map](docs/FEATURE-MAP.md) · [Roadmap](docs/ROADMAP.md) ·
[Team & agents](docs/TEAM.md)
