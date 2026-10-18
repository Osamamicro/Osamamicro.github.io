# Engineering council: open decisions

Author: council-engineering. Inputs: docs/DECISIONS.md, FEATURE-MAP.md, ROADMAP.md, src/services/*.ts, use-speech-capture.ts, record-panel.tsx (re-read after an on-disk change; the bug in D5.1 is still present), app.json, package.json, and Expo's docs for `experiments.baseUrl` and `web.output`.

| Decision | Vote | Confidence |
| --- | --- | --- |
| D1 Native speech scoring | (b) server STT behind the API now; dev build later | medium-high |
| D2 Accounts and sync | (a) next milestone, scoped to anonymous auth and score sync | medium |
| D3 Scoring-service stack | (b) Supabase Edge Functions | medium |
| D4 Web deployment | GitHub Pages as a project site from its own repo, SPA, `baseUrl` set | medium |
| D5 Top risks | See the three below | medium-high |

---

## D1. Native speech scoring: (b) server STT first

**Recommendation.** Send the recording the app already makes to a server STT endpoint, and score the returned transcript on every platform. Keep the browser recogniser only for live captions on web. Defer (a), the dev build with an on-device recogniser, until a real need appears (offline practice, live captions on phones).

**Confidence.** Medium-high.

**Why.**
1. Expo Go keeps working. expo-audio already records the file, so the phone only uploads it. No native module and no dev build, so the owner's emulator flow after `git pull` is unchanged. A dev build would need an Android SDK or an EAS cloud build on Windows and would replace Expo Go.
2. One code path for all platforms. Chrome's recogniser and Android's recogniser produce different transcripts, so scores would differ by device. A single server transcript keeps `src/core/scoring` honest across platforms.

**Biggest risk.** Learner audio leaves the device. This raises privacy questions (Saudi PDPL, including cross-border transfer if the STT provider is abroad) and a per-minute cost. **Mitigation:** explicit consent before the first upload, delete audio after transcription, keep only transcript and scores, and apply a per-user daily cap.

---

## D2. Accounts and sync: (a) next milestone, scoped

**Recommendation.** Add Supabase anonymous sign-in now, then sync attempts, SRS state and mocks. Item count is the wrong trigger: it measures content, while data loss and cost depend on users. Teacher mode is a separate product and should not gate sync.

**Confidence.** Medium.

**Why.**
1. The AI scoring endpoint (D3) needs an identity for rate limits and cost control. Without one, any leaked URL can run up model bills. Anonymous Supabase users provide that identity without a sign-up screen.
2. Local-only data is fragile. `src/services/app-state.ts` silently drops attempts beyond 2,000 and mocks beyond 50, and a lost phone loses everything. Records already carry collision-safe IDs (`uid()`), so merging across devices is straightforward.

**Biggest risk.** Sync conflicts and leaking audio. **Mitigation:** sync scores and attempt rows only, never audio. Use append-only rows keyed by `uid()`, and enable Row Level Security on every table from day one.

---

## D3. Scoring-service stack: (b) Supabase Edge Functions

**Recommendation.** Build the scoring API as Supabase Edge Functions in TypeScript.

**Confidence.** Medium.

**Why.**
1. The rubric exists once. The scorers and types are TypeScript in `src/core`, and an Edge Function can import them directly. ASP.NET would mean re-implementing `src/core/scoring` in C# and keeping two copies in step.
2. Same platform and auth. Supabase already handles auth and the database for D2, so the function verifies the same session JWT and keeps its secrets in Supabase function secrets.

**Secrets and fallback.** Model and STT keys live only in Supabase function secrets. Never put them in `EXPO_PUBLIC_*` variables, because those are compiled into the client bundle. The app holds only `EXPO_PUBLIC_SCORING_API_URL` and the publishable key. If the URL is unset, the device is offline, the call times out (about 8 s), or it returns non-2xx, score on-device (ADR-003), keep the "AI ESTIMATE" label, and note that on-device scoring was used.

**Biggest risk.** Function duration limits and vendor lock-in for long speech audio. **Mitigation:** check the plan's duration limit before committing to STT inside the function, and hide the endpoint behind one adapter that returns the existing `ScoreResult` shape. The ASP.NET option remains the runner-up if the owner wants to own the server in C#.

---

## D4. Web deployment: GitHub Pages as a project site, from its own repo

**Recommendation.** Keep GitHub Pages, but publish `qimma` from its own repository with a GitHub Actions workflow, so the app lives at `osamamicro.github.io/qimma/`. Do not commit the build into the `Osamamicro.github.io` repo.

**Confidence.** Medium.

**Why.**
1. The project is currently an untracked folder inside the personal-site repo, whose root holds `.nojekyll`, `index.html` and `404.html`. `dist/` is gitignored, so there is no clean way to publish the build from there. A separate repo keeps the personal site untouched.
2. Vercel, Netlify and EAS Hosting would work, but they move the app off the URL the owner wants. EAS Hosting is the runner-up if per-route HTML without the 404 workaround matters more.

**Changes to `app.json`.**
- Add `"experiments": { "baseUrl": "/qimma", ... }`. Without it, the export references root-relative `/_expo/` assets, which 404 under a subpath and leave a blank page. It affects only the web export.
- Keep `"web.output": "single"`. Copy `index.html` to `404.html` in the build so deep links and refreshes work. Do not switch to `"static"` yet: it is untested with the `expo-sqlite` localStorage install and the native-only modules.
- If legacy branch-deploy is used instead of the Actions artifact, add `.nojekyll`, because Jekyll drops `_expo/`.

**Biggest risk.** A wrong `baseUrl` gives a silently blank page. **Mitigation:** a CI smoke test that loads the built page in a headless browser and fails on any 404 for a script or stylesheet.

---

## D5. Top three technical risks in the current code

**1. Mock speaking on phones is silently unscored.** `src/features/practice/shared/record-panel.tsx` line 55 reads `if (r.transcript === null && mode === 'practice')`. In mock mode on Expo Go the transcript is null, so the panel completes without a self-rating. `noTranscript` in `src/core/scoring/speaking.ts` then marks every trait unscored (max 0), and `recordAttempt` in `app-state.ts` drops max-0 attempts. As far as this code shows, the speaking section of a mock adds nothing and the learner is never asked to rate. **Fix:** show the self-rating step in mock mode too (it follows the recording, so timing is unaffected), and add a Vitest case for a null transcript without `selfRating`.

**2. Web speech errors are swallowed and restart in a loop.** `src/services/speech-recognition.web.ts` sets `rec.onerror = () => undefined`, and `onend` restarts whenever `active` is true. Fatal errors (`not-allowed`, `service-not-allowed`, `network` when offline, `audio-capture`) are followed by `end`, so the recogniser keeps restarting. A network failure ends with an empty transcript, so the learner sees "(nothing recognised)" and a 0 with no explanation. **Fix:** record the error in `onerror`, stop restarting on fatal codes, cap restarts (for example 5 in 10 s), and return the error in `RecognitionResult` so `record-panel.tsx` can say the recogniser is unavailable. Not run in a browser, so confidence is medium.

**3. Learner history is rewritten whole and fails silently.** `src/services/storage.ts` `write()` swallows quota errors and keeps only the in-memory value, so a full store loses data on reload with no message. `app-state.ts` re-serialises up to 2,000 attempts and 50 full mock records (with `ScoreResult` feedback) on every save, and drops the oldest silently. There is no schema version under the `se:` prefix, so a future shape change has no migration path. **Fix:** surface a "storage full" banner when a write fails, move attempts and mocks to `expo-sqlite` (already a dependency) as append-only rows, and add a schema version key.

**Also noticed (not in the top three).**
- `package.json` `emulator:android` runs `scripts/emulator.mjs`, which does not exist (`scripts/` is empty). The owner's emulator flow fails on the first run. Fix: restore the script or point it at `expo start --android`.
- `"lint": "expo lint"` has no ESLint config in the repo, so it will prompt for setup. Fix: run the setup once and commit the config.
- `README.md` is still the create-expo-app template and mentions `npm run reset-project`, which does not exist.
- `app.json` has no `experiments.baseUrl` (see D4).
