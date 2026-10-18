#!/usr/bin/env bash
# Qimma: one-time Android emulator setup for macOS and Linux.
#
# Installs platform-tools, the emulator, Android 36 and a Google APIs system image with
# sdkmanager, then creates the Qimma_Pixel virtual device with avdmanager.
# Safe to run again: installed packages and an existing AVD are skipped.
#
#   bash scripts/setup-android-emulator.sh          run the setup
#   bash scripts/setup-android-emulator.sh --help   show help

set -euo pipefail

AVD_NAME="Qimma_Pixel"
API_LEVEL=36

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  C_RED=$'\033[31m'; C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_CYAN=$'\033[36m'; C_BOLD=$'\033[1m'; C_RESET=$'\033[0m'
else
  C_RED=''; C_GREEN=''; C_YELLOW=''; C_CYAN=''; C_BOLD=''; C_RESET=''
fi

info() { printf '%s[info]%s %s\n' "$C_CYAN" "$C_RESET" "$*"; }
ok()   { printf '%s[ ok ]%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn() { printf '%s[warn]%s %s\n' "$C_YELLOW" "$C_RESET" "$*"; }
fail() { printf '%s[fail]%s %s\n' "$C_RED" "$C_RESET" "$*" >&2; }
step() { printf '\n%s== %s ==%s\n' "$C_BOLD" "$*" "$C_RESET"; }

usage() {
  cat <<EOF
Usage: bash scripts/setup-android-emulator.sh [--help]

One-time setup of the Android emulator for Qimma (macOS and Linux).

It needs Android Studio (or the Android command-line tools) and Java 17 or newer.
It installs platform-tools, the emulator, Android ${API_LEVEL} and a Google APIs system
image (about 1.5 GB the first time), then creates the AVD "${AVD_NAME}".

Looks for the SDK in: \$ANDROID_HOME, \$ANDROID_SDK_ROOT, ~/Library/Android/sdk (macOS),
~/Android/Sdk (Linux).

Afterwards, start the emulator and the app with:  npm run emulator:android
EOF
}

case "${1:-}" in
  -h|--help) usage; exit 0 ;;
  "") ;;
  *) fail "Unknown option: $1"; usage >&2; exit 1 ;;
esac

OS="$(uname -s)"
case "$(uname -m)" in
  arm64|aarch64) ABI="arm64-v8a" ;;
  x86_64|amd64)  ABI="x86_64" ;;
  *) fail "Unsupported CPU architecture: $(uname -m)"; exit 1 ;;
esac

print_studio_help() {
  cat >&2 <<EOF

Install Android Studio from https://developer.android.com/studio and open it once.
It installs the Android SDK. Then add the command-line tools:
  Android Studio > Settings (Preferences on macOS) > Languages & Frameworks > Android SDK
  > SDK Tools tab > tick "Android SDK Command-line Tools (latest)" > Apply.

Or download "Command line tools only" from https://developer.android.com/studio#command-tools
and unzip it so that the folder is:  <SDK>/cmdline-tools/latest/bin/sdkmanager

Then run this script again.
EOF
}

# ---- 1. Android SDK --------------------------------------------------------
step "Android SDK"
SDK=""
for candidate in "${ANDROID_HOME:-}" "${ANDROID_SDK_ROOT:-}" "$HOME/Library/Android/sdk" "$HOME/Android/Sdk"; do
  if [ -n "$candidate" ] && [ -d "$candidate" ]; then
    SDK="$candidate"
    break
  fi
done
if [ -z "$SDK" ]; then
  fail "Android SDK not found (checked ANDROID_HOME, ANDROID_SDK_ROOT, ~/Library/Android/sdk, ~/Android/Sdk)."
  print_studio_help
  exit 1
fi
ok "SDK: $SDK"

# ---- 2. Java 17+ -------------------------------------------------------------
step "Java"
java_major() {
  # Read all of java's output and match the version line: JAVA_TOOL_OPTIONS can add
  # a "Picked up ..." line before it.
  local bin="java" out re_old='version "1\.([0-9]+)' re_new='version "([0-9]+)'
  if [ -n "${JAVA_HOME:-}" ] && [ -x "${JAVA_HOME}/bin/java" ]; then bin="${JAVA_HOME}/bin/java"; fi
  command -v "$bin" >/dev/null 2>&1 || return 1
  out="$("$bin" -version 2>&1 || true)"
  if [[ $out =~ $re_old ]]; then
    printf '%s' "${BASH_REMATCH[1]}"
  elif [[ $out =~ $re_new ]]; then
    printf '%s' "${BASH_REMATCH[1]}"
  else
    return 1
  fi
}
JAVA_MAJOR="$(java_major || true)"
if [ -z "$JAVA_MAJOR" ] || [ "$JAVA_MAJOR" -lt 17 ]; then
  fail "Java 17 or newer is needed (found: ${JAVA_MAJOR:-none})."
  cat >&2 <<EOF
Either install a JDK 17+ (for example Temurin 17 from https://adoptium.net), or use the
JDK that comes with Android Studio and point JAVA_HOME at it:
  macOS:  /Applications/Android Studio.app/Contents/jbr/Contents/Home
  Linux:  the "jbr" folder inside your Android Studio installation
Then run this script again.
EOF
  exit 1
fi
ok "Java $JAVA_MAJOR"

# ---- 3. Command-line tools ---------------------------------------------------
step "Command-line tools"
SDKMANAGER="$SDK/cmdline-tools/latest/bin/sdkmanager"
AVDMANAGER="$SDK/cmdline-tools/latest/bin/avdmanager"
if [ ! -x "$SDKMANAGER" ] || [ ! -x "$AVDMANAGER" ]; then
  fail "Command-line tools are missing (expected $SDK/cmdline-tools/latest/bin)."
  print_studio_help
  exit 1
fi
ok "sdkmanager and avdmanager found"

# ---- 4. Licences and packages -----------------------------------------------
step "Licences and packages"
info "Accepting SDK licences (already accepted ones are skipped)."
set +o pipefail
yes | "$SDKMANAGER" --sdk_root="$SDK" --licenses >/dev/null 2>&1 || true
set -o pipefail

SYSIMG="system-images;android-${API_LEVEL};google_apis;${ABI}"
info "Installing platform-tools, emulator, platforms;android-${API_LEVEL} and ${SYSIMG}."
info "The system image is about 1.5 GB the first time. Packages already installed are skipped."
"$SDKMANAGER" --sdk_root="$SDK" --install "platform-tools" "emulator" "platforms;android-${API_LEVEL}" "$SYSIMG"
ok "SDK packages are installed"

if [ ! -x "$SDK/emulator/emulator" ] || [ ! -x "$SDK/platform-tools/adb" ]; then
  fail "The emulator or adb did not install correctly. Run the script again, or use the SDK Manager in Android Studio."
  exit 1
fi

# ---- 5. Virtual device ---------------------------------------------------------
step "Virtual device"
EMULATOR="$SDK/emulator/emulator"
AVD_LIST="$("$EMULATOR" -list-avds 2>/dev/null || true)"
case $'\n'"$AVD_LIST"$'\n' in
  *$'\n'"$AVD_NAME"$'\n'*)
    ok "AVD $AVD_NAME already exists; leaving it as it is."
    ;;
  *)
    created=""
    for device in pixel_8 pixel_7 pixel; do
      info "Creating AVD $AVD_NAME (device $device, $SYSIMG)"
      if "$AVDMANAGER" create avd -n "$AVD_NAME" -k "$SYSIMG" -d "$device" <<<"no" >/dev/null 2>&1; then
        ok "Created AVD $AVD_NAME (device $device)"
        created="yes"
        break
      fi
      warn "Device $device is not available here; trying the next one."
    done
    if [ -z "$created" ]; then
      fail "Could not create the AVD. Create one in Android Studio: Device Manager > Create device, then name it $AVD_NAME."
      exit 1
    fi
    ;;
esac

# ---- 6. Hardware acceleration hint --------------------------------------------
step "Hardware acceleration"
if [ "$OS" = "Darwin" ]; then
  ok "macOS uses Hypervisor.framework, which is built in. Nothing to enable."
elif [ -w /dev/kvm ]; then
  ok "KVM is available (/dev/kvm)."
elif [ -e /dev/kvm ]; then
  warn "/dev/kvm exists but this user cannot use it. Run: sudo usermod -aG kvm \"\$USER\", then log out and back in."
else
  warn "KVM is not available, so the emulator will be very slow. Enable virtualisation in the BIOS and install the KVM kernel module (see docs/EMULATOR.md)."
fi

step "Done"
ok "Setup complete."
info "Next step: npm run emulator:android"
