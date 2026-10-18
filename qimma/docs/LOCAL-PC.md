# Continue Qimma on the owner's Windows PC

Target folder: `C:\Users\GACA-IT\Desktop\GACA Projects\repos\qimma`

## Status at handoff (2026-10-18, cloud session)

- PR #7 (draft) is still open and not merged. Branch: `claude/english-learning-platform-12dh5f`.
- The baseline was checked again in a Linux container. `npm install` worked, typed routes were
  generated, and `npm run check` passed: tsc clean, 237/237 tests.
- No app code changed. Backlog item 1 cannot run in the cloud: there is no KVM for the emulator
  and no PowerShell. It now needs this PC. Items 2 and 3 have not started.

## 1. Get the code (PowerShell)

If `repos\qimma` does not exist yet:

```powershell
cd "C:\Users\GACA-IT\Desktop\GACA Projects\repos"
git clone https://github.com/Osamamicro/Osamamicro.github.io.git qimma
cd qimma
git checkout claude/english-learning-platform-12dh5f
cd qimma            # the app is in the qimma\ subfolder of the repo
```

If it already exists, run `git fetch origin`, `git checkout claude/english-learning-platform-12dh5f`
and `git pull`, then `cd qimma`.

Run every npm command in the app folder `repos\qimma\qimma`, which contains `package.json`.

## 2. Baseline (about 5 minutes)

```powershell
npm install
npx expo start --web --port 8099   # wait for "Waiting on http://localhost:8099", then Ctrl+C
npm run check                      # expect a clean typecheck and 237 passing tests
```

## 3. Backlog item 1: emulator (only this PC can do it)

You need Android Studio (Standard setup), **Windows Hypervisor Platform** turned on (admin
rights and a reboot), and about 10 GB of free disk.

```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-android-emulator.ps1
npm run emulator:android
```

Then, on the emulator:

1. Open Extended controls (`...`) > Microphone and turn on **Virtual microphone uses host audio input**.
2. Go to Practice > Repeat Sentence and open an item. The audio should play.
3. Record an answer and play it back.

*Done when* the app opens in Expo Go, Repeat Sentence plays its audio, and the microphone
records. Afterwards, update HANDOFF §2 (remove "Not verified yet") and add anything new to the
troubleshooting table in `docs/EMULATOR.md`.

### Check these first

These came from reading the scripts. **None of them has been confirmed on Windows yet.**

| # | Risk | What you would see | Likely fix |
| --- | --- | --- | --- |
| 1 | A fresh Android Studio install sets neither `JAVA_HOME` nor `PATH` for Java | Setup stops at "Java 17 or newer is needed" | Quick: `$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'`, then run again. Lasting: make `Get-JavaMajor` in `setup-android-emulator.ps1` detect that folder and set `$env:JAVA_HOME` for the session, because `sdkmanager.bat` needs it too |
| 2 | The command-line tools are in `cmdline-tools\<version>\bin`, not `latest` | "Command-line tools are missing" | Fall back to the newest `cmdline-tools\*\bin\sdkmanager.bat` |
| 3 | The emulator's host-microphone toggle resets on every boot | Recordings are silent after a restart | Check whether `emulator -help-all` lists `-allow-host-audio`. If it does, add it to the args in `bootEmulator` (`scripts/emulator.mjs`) |
| 4 | Command-line AVDs default to `hw.keyboard=no` | You cannot type essays with the PC keyboard | Set `hw.keyboard=yes` in `%USERPROFILE%\.android\avd\Qimma_Pixel.avd\config.ini`, and make the setup script write it |
| 5 | A detached `emulator.exe` opens a blank console window | An extra empty window appears | Add `windowsHide: true` to the `spawn` options in `bootEmulator` |
| 6 | The first `adb devices` call can hang while adb starts its server | The launcher waits a long time on its first run | Run `adb start-server` once with `stdio: 'ignore'` before polling |
| 7 | Expo uses a different SDK than the launcher found | Expo cannot find the device | Pass `env: { ...process.env, ANDROID_HOME: sdk }` to the Expo child in `startExpo` |

**Corporate PC notes:**

- Turning on Windows Hypervisor Platform needs admin rights.
- If Group Policy blocks `-ExecutionPolicy Bypass`, ask IT, or follow the manual steps in
  `docs/EMULATOR.md`.
- Behind a corporate proxy, set `HTTPS_PROXY` for npm. For sdkmanager, pass
  `--proxy=http --proxy_host=<host> --proxy_port=<port>`.
- If OneDrive syncs the Desktop, or the space in "GACA Projects" breaks a tool, move the
  repo to a short path such as `C:\dev\qimma`. A synced Desktop can make `npm install` fail
  with `EPERM`.

## 4. Backlog item 2: progress export/import (ADR-006), proposed design (not started)

- **Pure core** (new `src/core/backup/`):
  - Constants and shape: `BACKUP_VERSION = 1` and
    `{ app: 'qimma', version, exportedAt, data: { settings, attempts, vocab, bookmarks, mocks } }`.
  - `createBackup(data, now)` builds the file.
  - `parseBackup(text)` returns `{ ok: true, data }` or `{ ok: false, error }`. It rejects
    corrupt JSON, other apps and newer versions, migrates older versions, and drops malformed
    entries.
  - Types: move the `Settings`, `Attempt` and `MockRecord` interfaces from
    `src/services/app-state.ts` into core and re-export them from app-state. Core must not
    import from services.
- **Test**: a Vitest round trip, where `parseBackup(JSON.stringify(createBackup(x)))` equals
  `x`, plus cases for a wrong version, a wrong app and corrupt JSON.
- **Storage-full warning**: `write()` in `src/services/storage.ts` currently swallows
  `setItem` errors without a trace. Expose a storage-status store. Settings then shows "Storage
  is full: export a backup", and import reports a failed write. Optionally show the backup
  size.
- **UI** (`src/app/settings.tsx`):
  - *Export progress*: on the web, download a Blob as `qimma-backup-YYYY-MM-DD.json`. On
    native, use `Share.share` from react-native, which needs no new native module and keeps
    Expo Go working.
  - *Import progress*: a paste box that works everywhere, plus a web file input in a
    `.web.tsx` file. Confirm before overwriting.
  - Read the SDK 58 docs before adding `expo-document-picker` or `expo-sharing`.
- *Done when* the round-trip test passes and the feature works on the web and in the emulator.

## 5. Backlog item 3: AI scoring, writing first (ADR-008). The owner decides first

- **Before any deploy**, the owner provides:
  - the Supabase project (ref/URL);
  - an Anthropic API key, set only as a function secret
    (`npx supabase secrets set ANTHROPIC_API_KEY=...`). It never goes in `EXPO_PUBLIC_*`.
- **Function**: `supabase/functions/score-writing/index.ts` (TypeScript). It takes
  `{ item, response }`, returns the existing `ScoreResult`, and uses a pinned Claude model id.
  Load the `claude-api` skill before writing the model call.
- **App**:
  - It calls the function only when `EXPO_PUBLIC_SCORING_API_URL` is set.
  - On a timeout, when offline, or on a non-2xx reply, it falls back to the on-device
    `scoreItem` and shows a note. Write a test for the fallback.
- **Release gate**: a calibration script run on at least 100 human-rated responses.
- **Local tooling**: the Supabase CLI (`npx supabase`). `supabase functions serve` needs Docker,
  which may not be allowed on a corporate PC. In that case, test against a deployed staging
  function.

## 6. Kickoff prompt for Claude Code on this PC

> Continue Qimma on my Windows PC. Read `qimma/HANDOFF.md` and `qimma/docs/LOCAL-PC.md`.
> Run the baseline (npm install, expo start --web once, npm run check) and report the result.
> Then do backlog item 1 with me: run the setup script and the emulator launcher, and fix
> what breaks in `scripts/` and `docs/EMULATOR.md`, starting with the list in LOCAL-PC.md §3.
> Then build item 2 (export/import) from the design in §4. Ask me for the Supabase project
> and API key before item 3.
