# Testing Qimma on your PC

This guide gets the app running on an Android emulator (Windows, macOS or Linux), on an iOS
Simulator (macOS), on your own phone with Expo Go, or in a web browser. Windows comes first
because that is the main setup for this project.

The app is an Expo SDK 58 project. It works in **Expo Go** and has no custom native modules,
so you do not need Xcode or Android Studio to build it. Android Studio is only needed for the
emulator and its SDK.

---

## 1. Prerequisites

| What | Why | Windows | macOS | Linux |
|---|---|---|---|---|
| **Node.js 22 LTS** (20 is the minimum) | Runs Expo and the launcher | [nodejs.org](https://nodejs.org) LTS installer | same | your package manager or nvm |
| **Git** | Gets the code | [git-scm.com](https://git-scm.com) | `xcode-select --install` | your package manager |
| **Android Studio** | Android SDK, emulator and AVD manager | [developer.android.com/studio](https://developer.android.com/studio) | same | same |
| **Hardware virtualisation** | Makes the emulator usable (see below) | Windows Hypervisor Platform (WHPX) | built in | KVM |
| **Disk space** | SDK, emulator and a system image | about 10 GB free | about 10 GB free | about 10 GB free |
| **RAM** | Emulator plus Android Studio | 16 GB recommended, 8 GB minimum | 16 GB recommended | 16 GB recommended |

Install Android Studio with the **Standard** setup. On its first start it downloads the Android
SDK. You do not need to create a virtual device by hand: the setup script does that.

### Hardware acceleration

The emulator is very slow without hardware acceleration.

- **Windows (recommended): Windows Hypervisor Platform (WHPX).**
  Open *Turn Windows features on or off*, tick **Windows Hypervisor Platform**, then restart.
  Works on Intel and AMD processors.
- **Windows (alternative): Android Emulator Hypervisor Driver (AEHD).** Use it only if WHPX does
  not work. In Android Studio open *SDK Manager > SDK Tools*, tick
  **Android Emulator hypervisor driver**, apply, then follow its installer.
- **Intel HAXM is deprecated.** Do not install it on a new machine.
- **macOS:** Apple Silicon and Intel Macs both use Hypervisor.framework, which is built in.
- **Linux:** needs KVM. Check with `ls -l /dev/kvm`. If you are not allowed to use it, run
  `sudo usermod -aG kvm $USER`, then log out and back in.

---

## 2. Windows (main setup)

Open **PowerShell** (Start, type "PowerShell"). Run the commands in the project folder.

### 2.1 Get the code and install packages (once)

```powershell
git clone https://github.com/Osamamicro/Osamamicro.github.io.git
cd Osamamicro.github.io\qimma
npm install
```

### 2.2 One-time emulator setup (once)

```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-android-emulator.ps1
```

The script:

1. checks **Java 17+** (Android Studio's own Java works: set `JAVA_HOME` to
   `C:\Program Files\Android\Android Studio\jbr`);
2. finds the Android SDK (`ANDROID_HOME`, `ANDROID_SDK_ROOT`, or `%LOCALAPPDATA%\Android\Sdk`);
3. checks the **command-line tools**. If they are missing, it tells you exactly what to tick in
   Android Studio and stops;
4. installs `platform-tools`, `emulator`, `platforms;android-36` and a Google APIs system image
   (about 1.5 GB), and accepts the licences;
5. creates the virtual device **Qimma_Pixel**.

It is safe to run again. Packages that are already installed are skipped.

To see the options: `powershell -ExecutionPolicy Bypass -File scripts\setup-android-emulator.ps1 -Help`

### 2.3 Start the emulator and the app (every day)

```powershell
npm run emulator:android
```

This starts the emulator if it is not running, waits for Android to boot (up to 3 minutes),
then runs `npx expo start --android`. On the first run Expo installs **Expo Go** on the emulator
and opens it. Leave the terminal open; press **Ctrl+C** to stop Metro.

Options:

| Command | What it does |
|---|---|
| `npm run emulator:android -- --no-start` | Only boots the emulator |
| `npm run emulator:android -- --cold` | Cold boot, ignoring the saved snapshot (use it when the emulator misbehaves) |
| `npm run emulator:android -- --avd Other_Name` | Uses a different virtual device |
| `npm run emulator:android -- --help` | Lists the options and exit codes |

The emulator keeps running after you press Ctrl+C. Close its window, or run
`%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe emu kill`.

### 2.4 Microphone in the emulator

Speaking tasks record your answer so you can play it back. Let the emulator use your PC's
microphone:

1. In the emulator, open **Extended controls** (the `...` button in the side bar).
2. Choose **Microphone**.
3. Turn on **Virtual microphone uses host audio input**.

When the app first records, allow the microphone when Android asks.

Note: in Expo Go there is no automatic speech recognition yet. The app scores speaking tasks
from your self-review, comparing your recording with the model answer. Automatic speech scoring
on the emulator and phone needs a development build (see `docs/ROADMAP.md`). In the web app,
browser speech recognition is used where it is available (section 6).

---

## 3. macOS

### 3.1 Android (emulator)

```bash
git clone https://github.com/Osamamicro/Osamamicro.github.io.git
cd Osamamicro.github.io/qimma
npm install
bash scripts/setup-android-emulator.sh   # once
npm run emulator:android                 # every day
```

Apple Silicon Macs get an `arm64-v8a` system image. Intel Macs get `x86_64`. The script detects this.

### 3.2 iOS Simulator

1. Install **Xcode** from the App Store, open it once, and accept the licence
   (`sudo xcodebuild -license accept`).
2. In the project folder run:

```bash
npm run ios
```

The first time, Expo installs Expo Go in the Simulator for you. Press `i` in the Expo terminal to
open the Simulator if it is not already open.

---

## 4. Linux

```bash
git clone https://github.com/Osamamicro/Osamamicro.github.io.git
cd Osamamicro.github.io/qimma
npm install
bash scripts/setup-android-emulator.sh   # once
npm run emulator:android                 # every day
```

Make sure KVM works (`ls -l /dev/kvm` shows a file you can write to). See section 1.

---

## 5. Your own phone with Expo Go

You can test on a real phone without the emulator. It is the closest match to how learners use
the app, and the real microphone and speaker are used for listening and recording tasks.

1. Install **Expo Go** from the Play Store (Android) or the App Store (iPhone).
2. Put the phone and the PC on the **same Wi-Fi network**.
3. In the project folder run:

```powershell
npx expo start
```

4. Scan the QR code with the phone: the camera app on iPhone, or the **Scan QR code** option in
   Expo Go on Android.

If the QR code does not connect (common on school or office networks, or when Windows Firewall
blocks it), use a tunnel:

```powershell
npx expo start --tunnel
```

Expo may ask you to install `@expo/ngrok` the first time. Answer yes.

Keep Expo Go up to date. If Expo Go says the project needs a newer version, update Expo Go
from the store and scan the code again.

---

## 6. Web app (browser)

```powershell
npm run web
```

Open the address Expo prints (usually `http://localhost:8081`).

Use **Chrome or Edge** for speaking tasks. The web app uses the browser's speech recognition
(the Web Speech API) to transcribe your answer and score it automatically. Chrome, Edge and Safari
support it; Firefox does not, so on Firefox speaking tasks fall back to your self-review.
Allow the microphone when the browser asks.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Android SDK not found` | Android Studio has not installed the SDK yet, or it is in an unusual folder | Open Android Studio once. Or set `ANDROID_HOME` to the SDK folder (for example `C:\Users\you\AppData\Local\Android\Sdk`) and open a new terminal. |
| `adb` not found, or `Emulator not found` | The SDK packages are missing | Run the setup script again. Or add `%LOCALAPPDATA%\Android\Sdk\platform-tools` to `PATH` and tick *Android Emulator* in SDK Manager. |
| `Command-line tools are missing` | Android Studio did not install the command-line tools | In Android Studio: Settings > Languages & Frameworks > Android SDK > SDK Tools > tick **Android SDK Command-line Tools (latest)** > Apply. Then run the script again. |
| `Java 17 or newer is needed` | Java 8 or 11 is first on `PATH` | Set `JAVA_HOME` to Android Studio's JBR (`C:\Program Files\Android\Android Studio\jbr`) or install JDK 17. |
| Emulator very slow, or `HAXM` / `WHPX` / `accel` errors | Hardware acceleration is off or the wrong driver is in use | Turn on **Windows Hypervisor Platform** and restart (section 1). Do not use HAXM. Check the log printed by the launcher. |
| `Waiting for Android to boot` for minutes, then "did not finish booting" | First boot is slow, or the emulator is stuck | Try `npm run emulator:android -- --cold`. If it still fails, open Device Manager in Android Studio, edit Qimma_Pixel, raise **RAM** to 4096 MB and set **Graphics** to *Software - GLES 2.0*. |
| Emulator stops at once | Missing or broken system image, or a driver problem | Read the log: `%TEMP%\qimma-emulator.log` (Windows) or `/tmp/qimma-emulator.log` (macOS and Linux). |
| `Expo Go` version mismatch, or "Project is incompatible with this version of Expo Go" | Expo Go on the emulator is older than SDK 58 | On the emulator, long-press Expo Go, choose **Uninstall**, then run `npx expo start --android` again. It reinstalls the current version. |
| `Port 8081 is already in use` | Another Metro or Expo server is running | Close the other terminal, or run `npx expo start --android --port 8090`. |
| Phone or browser cannot connect to the dev server | Windows Firewall blocks Node.js on the private network | Allow **Node.js** when Windows asks, for private networks. Or use `npx expo start --tunnel` (section 5). |
| Expo says it cannot find an emulator device | The emulator booted but adb does not see it yet | Run `npm run emulator:android` again. If the emulator window is open, wait for the home screen first. |
| Playing back a speaking answer is silent | Virtual microphone is off | Extended controls > Microphone > *Virtual microphone uses host audio input* (section 2.4). |
| Speaking tasks ask you to self-rate, not a transcript | Expo Go has no speech recognition (expected) | Normal on the emulator and phone. Use the web app in Chrome or Edge for automatic speech scoring (section 6). |
| Setup script says `execution of scripts is disabled` | PowerShell policy blocks scripts | Always start it with `powershell -ExecutionPolicy Bypass -File scripts\setup-android-emulator.ps1` as shown above. |

### Exit codes of `npm run emulator:android`

| Code | Meaning |
|---|---|
| 0 | Done: Expo exited cleanly, or `--no-start` booted the emulator |
| 1 | Setup problem: Node older than 20, SDK / emulator / adb / AVD not found, bad option |
| 2 | The emulator did not finish booting within 3 minutes, or it stopped (see the log) |
| 3 | Expo exited with an error |

---

## 8. Quick reference

| Task | Windows (PowerShell) | macOS / Linux |
|---|---|---|
| One-time setup | `powershell -ExecutionPolicy Bypass -File scripts\setup-android-emulator.ps1` | `bash scripts/setup-android-emulator.sh` |
| Emulator + app | `npm run emulator:android` | `npm run emulator:android` |
| Emulator only | `npm run emulator:android -- --no-start` | same |
| iOS Simulator | not available | `npm run ios` |
| Real phone | `npx expo start` (or `--tunnel`) | same |
| Browser | `npm run web` | same |
