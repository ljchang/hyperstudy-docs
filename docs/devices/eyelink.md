---
sidebar_position: 5
title: EyeLink 1000 Plus
---

# EyeLink 1000 Plus

Integration guide for using the SR Research EyeLink 1000 Plus eye tracker with HyperStudy experiments through the [HyperStudy Bridge](/devices/hyperstudy-bridge).

## Overview

The EyeLink 1000 Plus is a high-speed video-based eye tracker manufactured by [SR Research](https://www.sr-research.com/). It connects to HyperStudy via the Bridge application, which communicates with the tracker through SR Research's `eyelink_core` C library. The Bridge loads this library at runtime, so the EyeLink SDK must be installed on the machine running the Bridge — but the Bridge application itself installs and runs without the SDK present.

### Signal Flow

```
HyperStudy Web App → HyperStudy Bridge → eyelink_core SDK → EyeLink Host PC → EyeLink Tracker
```

## Features

- **High-Speed Gaze Tracking**: Up to 2000 Hz sampling rate (model-dependent)
- **Real-Time Gaze Streaming**: Live gaze position, pupil size, and angular resolution forwarded to HyperStudy
- **EDF Recording**: Full-fidelity data recording on the EyeLink Host PC
- **Event Markers**: Timestamped messages written to the EDF file for synchronization
- **Calibration**: Full calibration/validation loop driven from the HyperStudy frontend
- **Runtime SDK Detection**: Bridge auto-detects the SDK — no special build or feature flags needed

## Prerequisites

### Hardware

- EyeLink 1000 Plus eye tracker (or compatible EyeLink model)
- EyeLink Host PC (the dedicated computer that comes with the tracker)
- Ethernet connection between the Host PC and the Display PC (the machine running HyperStudy Bridge)
- The Display PC's Ethernet interface configured to the EyeLink subnet (typically `100.1.1.2`, subnet `255.255.255.0`)

### Software

- **HyperStudy Bridge** v0.8.22 or later
- **EyeLink Developers Kit** (see installation instructions below)

## Installing the EyeLink Developers Kit

The EyeLink Developers Kit provides the `eyelink_core` runtime library that the Bridge needs to communicate with the tracker. It is proprietary software from SR Research and **cannot be bundled** with the Bridge — you must install it separately.

:::warning
The EyeLink Developers Kit requires a free SR Research support account. You will need to register before downloading.
:::

### Step 1: Create an SR Research Support Account

1. Go to [www.sr-research.com/support](https://www.sr-research.com/support)
2. Click **Register** and create a free account
3. Verify your email address

### Step 2: Download the Developers Kit

1. Log in to the SR Research support portal
2. Navigate to **Downloads** → **EyeLink Developers Kit**
3. Download the installer for your operating system:
   - **macOS**: `EyeLink_Developers_Kit_macOS_<version>.dmg`
   - **Windows**: `EyeLink_Developers_Kit_Windows_<version>.exe`
   - **Linux**: `eyelink-display-software_<version>.deb` (Ubuntu/Debian)

### Step 3: Install

#### macOS

1. Open the downloaded `.dmg` file
2. Run the installer package (`.pkg`)
3. Follow the installation prompts — the default location installs the framework to `/Library/Frameworks/eyelink_core.framework/`
4. No reboot required

To verify the installation:
```bash
# Check that the framework exists
ls /Library/Frameworks/eyelink_core.framework/eyelink_core
```

#### Windows

1. Run the downloaded `.exe` installer
2. Follow the installation wizard with default settings
3. The SDK installs to `C:\Program Files\SR Research\EyeLink\` by default
4. The installer adds the library directory to the system PATH

To verify:
```powershell
# Check that the DLL exists
dir "C:\Program Files\SR Research\EyeLink\Libs\x64\eyelink_core.dll"
```

#### Linux (Ubuntu/Debian)

1. Install the package:
```bash
sudo dpkg -i eyelink-display-software_<version>.deb
sudo apt-get install -f  # Fix any dependency issues
```
2. The shared library installs to `/usr/lib/`

To verify:
```bash
# Check that the shared library exists
ldconfig -p | grep eyelink_core
```

### What If the SDK Is Not Installed?

The Bridge application starts and runs normally without the SDK. All non-EyeLink devices (TTL, Kernel, Pupil, LSL) work as usual. If you attempt an EyeLink operation without the SDK installed, the Bridge returns a clear error message:

> EyeLink SDK not found. Install the SR Research EyeLink Developers Kit from www.sr-research.com/support

## Configuration

### Network Setup

The EyeLink Host PC and Display PC communicate over a dedicated Ethernet connection:

| Setting | Host PC (EyeLink default) | Display PC (your machine) |
|---------|---------------------------|---------------------------|
| IP Address | `100.1.1.1` | `100.1.1.2` |
| Subnet Mask | `255.255.255.0` | `255.255.255.0` |

Configure the Display PC's Ethernet adapter to use `100.1.1.2` with subnet `255.255.255.0`. This is typically a dedicated Ethernet port — your regular network/WiFi connection remains unchanged.

### Bridge Configuration

In the HyperStudy Bridge GUI, click the gear icon on the EyeLink device card to configure:

| Setting | Default | Description |
|---------|---------|-------------|
| **IP Address** | `100.1.1.1` | IP address of the EyeLink Host PC |
| **Sample Rate** | 1000 Hz | Gaze data sampling rate (250, 500, 1000, or 2000 Hz) |
| **Display Width** | 1920 px | Participant display width in pixels |
| **Display Height** | 1080 px | Participant display height in pixels |

The display dimensions are sent to the tracker so gaze coordinates are reported in the correct pixel space.

## Usage

### Basic Workflow

1. **Power on** the EyeLink tracker and Host PC
2. **Verify network** — ensure the Display PC can reach the Host PC:
   ```bash
   ping 100.1.1.1
   ```
3. **Launch HyperStudy Bridge** on the Display PC
4. **Connect** to the EyeLink via the Bridge GUI or WebSocket command
5. **Calibrate** using the Bridge's calibration interface
6. **Start recording** to begin writing data to the EDF file
7. **Run your experiment** — send event markers from HyperStudy for synchronization
8. **Stop recording** and **disconnect** when finished
9. **Retrieve the EDF file** from the Host PC for analysis

### Calibration

Calibration is initiated from the Bridge and renders calibration targets in the HyperStudy frontend. During calibration:

- The tracker presents targets at known screen positions
- The participant fixates on each target
- Press **Accept** (Enter) to accept a calibration point
- Press **Cancel** (Escape) to abort calibration
- After calibration, the tracker automatically runs validation

### Event Markers

Send timestamped messages to the EDF file for synchronization with your experiment timeline:

```javascript
// From HyperStudy web app via WebSocket
{
  "type": "command",
  "device": "eyelink",
  "action": "send_eyelink_message",
  "payload": { "message": "TRIAL_START 1" }
}
```

These messages appear in the EDF file with the tracker's own timestamp, providing precise synchronization between your experiment events and the eye tracking data.

### WebSocket Commands

| Action | Description |
|--------|-------------|
| `connect_eyelink` | Connect to the tracker at the configured IP |
| `disconnect_eyelink` | Disconnect from the tracker |
| `start_eyelink_recording` | Start EDF recording (file + link samples/events) |
| `stop_eyelink_recording` | Stop EDF recording |
| `send_eyelink_message` | Write a timestamped marker to the EDF file |
| `calibrate_eyelink` | Start the calibration/validation loop |
| `calibrate_eyelink_key` | Send accept/cancel key during calibration |
| `connect_eyelink_gaze` | Start real-time gaze data streaming |
| `disconnect_eyelink_gaze` | Stop gaze data streaming |
| `eyelink_status` | Query current connection and recording status |

## Troubleshooting

### "EyeLink SDK not found"

The `eyelink_core` library is not installed or not in the expected location.

- **macOS**: Verify `/Library/Frameworks/eyelink_core.framework/eyelink_core` exists
- **Windows**: Verify `eyelink_core.dll` is in the system PATH or `C:\Program Files\SR Research\EyeLink\Libs\x64\`
- **Linux**: Run `ldconfig -p | grep eyelink_core` to check

If you just installed the SDK, try restarting the Bridge application.

### Connection Failed

- Verify the Host PC is powered on and the EyeLink software is running
- Check the Ethernet cable between Display PC and Host PC
- Confirm the Display PC's Ethernet interface is configured to `100.1.1.2/24`
- Try `ping 100.1.1.1` from the Display PC
- Ensure no firewall is blocking traffic on the `100.1.1.0/24` subnet

### Calibration Not Responding

- Make sure the participant's eye is visible in the camera view on the Host PC
- Check that the tracker is in "Record" or "Setup" mode on the Host PC
- Verify the display dimensions in Bridge config match the actual participant monitor

### Gaze Data Not Streaming

- Recording must be started before gaze streaming will produce data
- Check that `link_sample_data` is configured (the Bridge sets this automatically on connect)
- Verify the sample rate setting matches the tracker's capabilities

## Resources

- **SR Research Support**: [www.sr-research.com/support](https://www.sr-research.com/support) — SDK downloads, manuals, and forums
- **EyeLink Programmer's Guide**: Included with the EyeLink Developers Kit installation
- **HyperStudy Bridge**: [GitHub Repository](https://github.com/ljchang/hyperstudy-bridge)
