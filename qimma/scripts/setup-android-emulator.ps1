<#
.SYNOPSIS
    One-time Android emulator setup for Qimma (Windows).
.DESCRIPTION
    Checks Java 17+, the Android SDK command-line tools and hardware virtualisation, then
    installs platform-tools, the emulator, Android 36 and a Google APIs system image with
    sdkmanager, and creates the Qimma_Pixel virtual device with avdmanager.
    Safe to run again: installed packages and an existing AVD are skipped.
.PARAMETER Help
    Show the help and exit.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\setup-android-emulator.ps1
#>
[CmdletBinding()]
param(
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

$AvdName = 'Qimma_Pixel'
$ApiLevel = 36

function Write-Info {
    param([string]$Message)
    Write-Host "[info] $Message" -ForegroundColor Cyan
}

function Write-Ok {
    param([string]$Message)
    Write-Host "[ ok ] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[warn] $Message" -ForegroundColor Yellow
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[fail] $Message" -ForegroundColor Red
}

function Write-Step {
    param([string]$Title)
    Write-Host ''
    Write-Host "== $Title ==" -ForegroundColor White
}

# Runs a native tool or .bat and returns its exit code and output. Tools such as java and
# sdkmanager write normal messages to stderr, which must not stop the script, so the
# preference is relaxed for the duration of the call.
function Invoke-Native {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [string[]]$Arguments = @(),
        [string[]]$InputLines = @()
    )
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        if ($InputLines.Count -gt 0) {
            $output = $InputLines | & $FilePath @Arguments 2>&1
        } else {
            $output = & $FilePath @Arguments 2>&1
        }
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previous
    }
    return [pscustomobject]@{
        Code   = $code
        Output = @($output | ForEach-Object { "$_" })
    }
}

# Same as Invoke-Native, but the output goes straight to the console so long downloads show progress.
function Invoke-Streamed {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [string[]]$Arguments = @()
    )
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & $FilePath @Arguments
        return $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previous
    }
}

function Get-JavaMajor {
    $java = 'java'
    if ($env:JAVA_HOME) {
        $candidate = Join-Path $env:JAVA_HOME 'bin\java.exe'
        if (Test-Path -LiteralPath $candidate) { $java = $candidate }
    }
    if (-not (Get-Command -Name $java -ErrorAction SilentlyContinue)) { return $null }
    $result = Invoke-Native -FilePath $java -Arguments @('-version')
    $text = $result.Output -join "`n"
    if ($text -match 'version "1\.(\d+)') { return [int]$Matches[1] }
    if ($text -match 'version "(\d+)') { return [int]$Matches[1] }
    return $null
}

function Find-Sdk {
    $candidates = @($env:ANDROID_HOME, $env:ANDROID_SDK_ROOT)
    if ($env:LOCALAPPDATA) { $candidates += (Join-Path $env:LOCALAPPDATA 'Android\Sdk') }
    foreach ($dir in $candidates) {
        if ($dir -and (Test-Path -LiteralPath $dir -PathType Container)) { return $dir }
    }
    return $null
}

function Test-HypervisorRunning {
    try {
        return [bool](Get-CimInstance -ClassName Win32_ComputerSystem).HypervisorPresent
    } catch {
        return $false
    }
}

function Show-StudioHelp {
    Write-Host ''
    Write-Host 'Install Android Studio from https://developer.android.com/studio and open it once.'
    Write-Host 'It installs the Android SDK. Then add the command-line tools:'
    Write-Host '  Android Studio > File > Settings > Languages & Frameworks > Android SDK'
    Write-Host '  > SDK Tools tab > tick "Android SDK Command-line Tools (latest)" > Apply.'
    Write-Host ''
    Write-Host 'Or download "Command line tools only" from https://developer.android.com/studio#command-tools'
    Write-Host 'and unzip it so that the folder is:  <SDK>\cmdline-tools\latest\bin\sdkmanager.bat'
    Write-Host ''
    Write-Host 'Then run this script again.'
}

if ($Help) {
    Write-Host @"
Usage: powershell -ExecutionPolicy Bypass -File scripts\setup-android-emulator.ps1 [-Help]

One-time Android emulator setup for Qimma (Windows).

It needs Android Studio (or the Android command-line tools) and Java 17 or newer.
It installs platform-tools, the emulator, Android $ApiLevel and a Google APIs system image
(about 1.5 GB the first time), then creates the AVD "$AvdName".

It looks for the SDK in: ANDROID_HOME, ANDROID_SDK_ROOT, %LOCALAPPDATA%\Android\Sdk.

Afterwards, start the emulator and the app with:  npm run emulator:android
"@
    exit 0
}

$abi = 'x86_64'
if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { $abi = 'arm64-v8a' }

Write-Host 'Qimma: Android emulator setup (Windows)' -ForegroundColor White

# ---- 1. Java 17+ -------------------------------------------------------------
Write-Step 'Java'
$javaMajor = Get-JavaMajor
if ($null -eq $javaMajor -or $javaMajor -lt 17) {
    $found = 'none'
    if ($null -ne $javaMajor) { $found = "$javaMajor" }
    Write-Fail "Java 17 or newer is needed (found: $found)."
    Write-Host 'Install a JDK 17+ (for example Temurin 17 from https://adoptium.net), or use the JDK'
    Write-Host 'that comes with Android Studio: set JAVA_HOME to "C:\Program Files\Android\Android Studio\jbr".'
    Write-Host 'Then run this script again.'
    exit 1
}
Write-Ok "Java $javaMajor"

# ---- 2. Android SDK ------------------------------------------------------------
Write-Step 'Android SDK'
$sdk = Find-Sdk
if (-not $sdk) {
    Write-Fail 'Android SDK not found (checked ANDROID_HOME, ANDROID_SDK_ROOT and %LOCALAPPDATA%\Android\Sdk).'
    Show-StudioHelp
    exit 1
}
Write-Ok "SDK: $sdk"

# ---- 3. Command-line tools -------------------------------------------------------
Write-Step 'Command-line tools'
$toolsBin = Join-Path $sdk 'cmdline-tools\latest\bin'
$sdkManager = Join-Path $toolsBin 'sdkmanager.bat'
$avdManager = Join-Path $toolsBin 'avdmanager.bat'
if (-not ((Test-Path -LiteralPath $sdkManager) -and (Test-Path -LiteralPath $avdManager))) {
    Write-Fail "Command-line tools are missing (expected $toolsBin)."
    Show-StudioHelp
    exit 1
}
Write-Ok 'sdkmanager and avdmanager found'

# ---- 4. Licences and packages -----------------------------------------------------
Write-Step 'Licences and packages'
Write-Info 'Accepting SDK licences (already accepted ones are skipped).'
$yes = @(1..50 | ForEach-Object { 'y' })
$null = Invoke-Native -FilePath $sdkManager -Arguments @("--sdk_root=$sdk", '--licenses') -InputLines $yes

$sysImage = "system-images;android-$ApiLevel;google_apis;$abi"
$packages = @('platform-tools', 'emulator', "platforms;android-$ApiLevel", $sysImage)
Write-Info "Installing $($packages -join ', ')."
Write-Info 'The system image is about 1.5 GB the first time. Packages already installed are skipped.'
$installCode = Invoke-Streamed -FilePath $sdkManager -Arguments (@("--sdk_root=$sdk", '--install') + $packages)
if ($installCode -ne 0) {
    Write-Fail "sdkmanager failed (exit code $installCode). Read the messages above, then run this script again."
    exit 1
}
Write-Ok 'SDK packages are installed'

$emulator = Join-Path $sdk 'emulator\emulator.exe'
$adb = Join-Path $sdk 'platform-tools\adb.exe'
if (-not ((Test-Path -LiteralPath $emulator) -and (Test-Path -LiteralPath $adb))) {
    Write-Fail "The emulator or adb did not install correctly (expected $emulator)."
    exit 1
}

# ---- 5. Virtual device --------------------------------------------------------------
Write-Step 'Virtual device'
$avdList = (Invoke-Native -FilePath $emulator -Arguments @('-list-avds')).Output | ForEach-Object { $_.Trim() }
if ($avdList -contains $AvdName) {
    Write-Ok "AVD $AvdName already exists; leaving it as it is."
} else {
    $created = $false
    foreach ($device in @('pixel_8', 'pixel_7', 'pixel')) {
        Write-Info "Creating AVD $AvdName (device $device, $sysImage)"
        $result = Invoke-Native -FilePath $avdManager -Arguments @('create', 'avd', '-n', $AvdName, '-k', $sysImage, '-d', $device) -InputLines @('no')
        if ($result.Code -eq 0) {
            Write-Ok "Created AVD $AvdName (device $device)"
            $created = $true
            break
        }
        Write-Warn "Device $device is not available here; trying the next one."
    }
    if (-not $created) {
        Write-Fail "Could not create the AVD. In Android Studio: Device Manager > Create device, and name it $AvdName."
        exit 1
    }
}

# ---- 6. Hardware virtualisation ------------------------------------------------------
Write-Step 'Hardware virtualisation'
if (Test-HypervisorRunning) {
    Write-Ok 'The Windows hypervisor is running, so the emulator can use hardware acceleration.'
} else {
    Write-Warn 'The Windows hypervisor is not running. Turn on "Windows Hypervisor Platform" in'
    Write-Host '  Settings > Optional features > More Windows features (or "Turn Windows features on or off"),'
    Write-Host '  reboot, then run this script again. Without it the emulator is very slow or will not start.'
    Write-Host '  Intel HAXM is deprecated; see docs/EMULATOR.md for the options.'
}

# ---- 7. Done ------------------------------------------------------------------------------
Write-Step 'Done'
Write-Ok 'Setup complete.'
Write-Info 'Next step: npm run emulator:android'
exit 0
