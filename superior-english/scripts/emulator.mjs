#!/usr/bin/env node
/**
 * Superior English: boot an Android emulator, then start Expo for Android on it.
 *
 *   npm run emulator:android                    boot the AVD if needed, then expo start --android
 *   npm run emulator:android -- --no-start      only boot the emulator
 *   npm run emulator:android -- --cold          cold boot (ignore the saved snapshot)
 *   npm run emulator:android -- --avd <name>    use a specific AVD
 *
 * Node 20+, no dependencies. Works on Windows, macOS and Linux.
 * Output is ASCII only so it renders in Windows PowerShell 5.1.
 */
import { execFile, spawn, spawnSync } from 'node:child_process';
import { openSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXIT = { OK: 0, SETUP: 1, BOOT: 2, EXPO: 3 };
const DEFAULT_AVD = 'SuperiorEnglish_Pixel';
const BOOT_TIMEOUT_MS = 180_000;
const IS_WINDOWS = process.platform === 'win32';
const EXE = IS_WINDOWS ? '.exe' : '';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SETUP_WIN = 'powershell -ExecutionPolicy Bypass -File scripts\\setup-android-emulator.ps1';
const SETUP_NIX = 'bash scripts/setup-android-emulator.sh';

const colour = !process.env.NO_COLOR && process.stdout.isTTY;
const paint = (code, text) => (colour ? `\x1b[${code}m${text}\x1b[0m` : text);
const info = (m) => console.log(`${paint('36', '[info]')} ${m}`);
const ok = (m) => console.log(`${paint('32', '[ ok ]')} ${m}`);
const warn = (m) => console.log(`${paint('33', '[warn]')} ${m}`);
const fail = (m) => console.error(`${paint('31', '[fail]')} ${m}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class UsageError extends Error {}

function printHelp() {
  console.log(`Usage: npm run emulator:android -- [options]

Boots the Superior English Android emulator, then starts Expo for Android.
Expo Go is installed on the emulator automatically the first time.

Options:
  --avd <name>   AVD to start (default: ${DEFAULT_AVD}, otherwise the first AVD found)
  --no-start     only boot the emulator; do not start Expo
  --cold         cold boot: ignore the saved snapshot (adds -no-snapshot-load)
  --help         show this help

Exit codes:
  0  done (Expo exited cleanly, or --no-start booted the emulator)
  1  setup problem: Node older than 20, Android SDK / emulator / adb / AVD missing, bad option
  2  the emulator did not finish booting within ${BOOT_TIMEOUT_MS / 1000} seconds (see the log path shown)
  3  Expo exited with an error

First time on this PC? Run the one-time setup for your system:
  Windows (PowerShell):  ${SETUP_WIN}
  macOS / Linux:         ${SETUP_NIX}`);
}

function parseArgs(argv) {
  const opts = { help: false, noStart: false, cold: false, avd: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--no-start') opts.noStart = true;
    else if (arg === '--cold') opts.cold = true;
    else if (arg === '--avd' || arg.startsWith('--avd=')) {
      const value = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[++i];
      if (!value || value.startsWith('--')) throw new UsageError('--avd needs an AVD name, for example: --avd SuperiorEnglish_Pixel');
      opts.avd = value;
    } else {
      throw new UsageError(`Unknown option "${arg}".`);
    }
  }
  return opts;
}

const isDir = (p) => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
};

const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

function defaultSdkDir() {
  if (IS_WINDOWS) {
    return path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'Android', 'Sdk');
  }
  if (process.platform === 'darwin') return path.join(os.homedir(), 'Library', 'Android', 'sdk');
  return path.join(os.homedir(), 'Android', 'Sdk');
}

/** Returns the first SDK folder that exists, plus a list of what was checked for the error message. */
function findSdk() {
  const tried = [];
  const candidates = [
    ['ANDROID_HOME', process.env.ANDROID_HOME],
    ['ANDROID_SDK_ROOT', process.env.ANDROID_SDK_ROOT],
    ['default location', defaultSdkDir()],
  ];
  for (const [label, dir] of candidates) {
    if (!dir) {
      tried.push(`${label}: not set`);
      continue;
    }
    if (isDir(dir)) return { dir, tried };
    tried.push(`${label}: ${dir} (folder not found)`);
  }
  return { dir: null, tried };
}

function explainSetup() {
  console.error(`
Run the one-time setup for your system, then try again:
  Windows (PowerShell):  ${SETUP_WIN}
  macOS / Linux:         ${SETUP_NIX}`);
}

function explainNoSdk(tried) {
  fail('Android SDK not found.');
  console.error('Looked in:');
  for (const line of tried) console.error(`  - ${line}`);
  console.error(`
Install Android Studio (https://developer.android.com/studio), open it once so it
installs the Android SDK, then run the one-time setup for your system:

  Windows (PowerShell):  ${SETUP_WIN}
  macOS / Linux:         ${SETUP_NIX}

Then run this again: npm run emulator:android`);
}

/** Lists AVD names from `emulator -list-avds`, ignoring the INFO/WARNING lines the tool can print. */
function listAvds(emulatorBin) {
  const result = spawnSync(emulatorBin, ['-list-avds'], { encoding: 'utf8', timeout: 30_000 });
  if (result.error) throw result.error;
  return (result.stdout || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^(INFO|WARNING|emulator:)/i.test(line));
}

/** Runs a command and resolves to its stdout, or null when it fails or times out. */
function run(file, args, timeout = 15_000) {
  return new Promise((resolve) => {
    execFile(file, args, { timeout, encoding: 'utf8' }, (error, stdout) => resolve(error ? null : stdout));
  });
}

async function onlineDevices(adb) {
  const out = await run(adb, ['devices']);
  if (!out) return [];
  return out
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim().split(/\s+/))
    .filter((parts) => parts.length >= 2)
    .map(([serial, state]) => ({ serial, state }));
}

/** Starts the AVD detached (so this terminal stays free for Expo) and waits until Android has booted. */
async function bootEmulator(emulatorBin, adb, avd, cold) {
  const logPath = path.join(os.tmpdir(), 'superior-english-emulator.log');
  const log = openSync(logPath, 'w');
  const args = ['-avd', avd, '-netdelay', 'none', '-netspeed', 'full'];
  if (cold) args.push('-no-snapshot-load');

  let spawnError = null;
  let exitCode = null;
  const child = spawn(emulatorBin, args, { detached: true, stdio: ['ignore', log, log] });
  child.on('error', (error) => {
    spawnError = error;
  });
  child.on('exit', (code) => {
    exitCode = code ?? -1;
  });
  child.unref();

  info(`Starting "${avd}"${cold ? ' (cold boot)' : ''}. Emulator log: ${logPath}`);
  const deadline = Date.now() + BOOT_TIMEOUT_MS;
  process.stdout.write('Waiting for Android to boot');
  while (Date.now() < deadline) {
    if (spawnError || exitCode !== null) {
      process.stdout.write('\n');
      fail(`The emulator stopped before it finished booting${spawnError ? `: ${spawnError.message}` : ` (exit code ${exitCode})`}.`);
      console.error(`See the log: ${logPath}`);
      return null;
    }
    // Returns as soon as a device is attached; otherwise gives up after 3 seconds and we poll again.
    await run(adb, ['wait-for-device'], 3_000);
    const emu = (await onlineDevices(adb)).find((d) => d.serial.startsWith('emulator-') && d.state === 'device');
    if (emu) {
      const boot = await run(adb, ['-s', emu.serial, 'shell', 'getprop', 'sys.boot_completed']);
      if (boot !== null && boot.trim() === '1') {
        process.stdout.write('\n');
        return emu.serial;
      }
    }
    process.stdout.write('.');
    await sleep(2000);
  }
  process.stdout.write('\n');
  fail(`The emulator did not finish booting within ${BOOT_TIMEOUT_MS / 1000} seconds.`);
  console.error(`Try --cold, check the log (${logPath}), and see docs/EMULATOR.md (troubleshooting).`);
  return null;
}

/** Runs `npx expo start --android` in the project with the terminal attached, so Expo Go opens automatically. */
function startExpo() {
  return new Promise((resolve) => {
    info('Starting Expo for Android (npx expo start --android). Press Ctrl+C to stop.');
    const child = spawn(IS_WINDOWS ? 'npx.cmd' : 'npx', ['expo', 'start', '--android'], {
      cwd: ROOT,
      stdio: 'inherit',
      shell: IS_WINDOWS,
    });
    child.on('error', (error) => {
      fail(`Could not start npx: ${error.message}`);
      resolve(EXIT.EXPO);
    });
    child.on('exit', (code, signal) => resolve(signal ? EXIT.EXPO : (code ?? EXIT.EXPO)));
  });
}

async function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (error) {
    if (!(error instanceof UsageError)) throw error;
    fail(error.message);
    console.error('Run "npm run emulator:android -- --help" to see the options.');
    return EXIT.SETUP;
  }
  if (opts.help) {
    printHelp();
    return EXIT.OK;
  }

  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (nodeMajor < 20) {
    fail(`Node ${process.versions.node} is too old. This needs Node 20 or newer (Node 22 LTS recommended).`);
    return EXIT.SETUP;
  }

  const { dir: sdk, tried } = findSdk();
  if (!sdk) {
    explainNoSdk(tried);
    return EXIT.SETUP;
  }
  ok(`Android SDK: ${sdk}`);

  const emulatorBin = path.join(sdk, 'emulator', `emulator${EXE}`);
  const adb = path.join(sdk, 'platform-tools', `adb${EXE}`);
  for (const [name, file] of [
    ['Emulator', emulatorBin],
    ['adb (platform-tools)', adb],
  ]) {
    if (!isFile(file)) {
      fail(`${name} not found at ${file}.`);
      explainSetup();
      return EXIT.SETUP;
    }
  }

  let avds;
  try {
    avds = listAvds(emulatorBin);
  } catch (error) {
    fail(`Could not run the emulator (${error.message}).`);
    explainSetup();
    return EXIT.SETUP;
  }
  if (avds.length === 0) {
    fail('No Android virtual device (AVD) found.');
    explainSetup();
    return EXIT.SETUP;
  }

  let avd;
  if (opts.avd) {
    if (!avds.includes(opts.avd)) {
      fail(`AVD "${opts.avd}" not found. Available: ${avds.join(', ')}`);
      return EXIT.SETUP;
    }
    avd = opts.avd;
  } else {
    avd = avds.includes(DEFAULT_AVD) ? DEFAULT_AVD : avds[0];
  }
  ok(`AVD: ${avd}`);

  let serial = (await onlineDevices(adb)).find((d) => d.state === 'device')?.serial;
  if (serial) {
    ok(`A device is already online (${serial}); not starting another emulator.`);
    if (opts.cold) warn('--cold is ignored because a device is already running. Close it first to cold boot.');
  } else {
    serial = await bootEmulator(emulatorBin, adb, avd, opts.cold);
    if (!serial) return EXIT.BOOT;
    ok(`Emulator ready: ${serial}`);
  }

  if (opts.noStart) {
    ok('Done. Start the app with: npx expo start --android');
    return EXIT.OK;
  }
  const code = await startExpo();
  return code === 0 ? EXIT.OK : EXIT.EXPO;
}

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    fail(`Unexpected error: ${error?.stack ?? error}`);
    process.exitCode = EXIT.SETUP;
  },
);
