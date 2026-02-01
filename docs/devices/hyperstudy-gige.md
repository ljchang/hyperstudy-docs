---
sidebar_position: 4
title: GigE Virtual Camera
---

# GigE Virtual Camera

A native macOS application that creates virtual cameras from GigE Vision industrial cameras, making them available to any macOS application including HyperStudy experiments.

## Overview

The GigE Virtual Camera application bridges the gap between professional GigE Vision cameras and consumer applications. It creates a virtual camera device that appears as a standard webcam in any macOS application, allowing you to use high-quality industrial cameras in video conferencing, recording software, and HyperStudy experiments.

## Features

- **System Extension Architecture**: Implements a proper CMIO System Extension for virtual camera functionality
- **Native macOS Integration**: Appears as a standard camera in all macOS apps
- **Universal GigE Support**: Works with any GigE Vision compliant camera via Aravis library
- **Real-time Preview**: Built-in preview with camera status and controls
- **Professional Features**: Designed for industrial and professional camera integration
- **Notarized & Signed**: Properly signed with Developer ID for secure distribution

## System Requirements

- **Operating System**: macOS 12.3 (Monterey) or later
- **Processor**: ARM64 (Apple Silicon) Mac
- **Network**: GigE Vision compliant camera on the same network
- **Permissions**: System Extension approval (first launch only)

## Installation

### Download

**[Download the latest release →](https://github.com/ljchang/hyperstudy-gige/releases/latest)**

### Step-by-Step Installation

1. **Download the DMG**
   - Go to the [Releases page](https://github.com/ljchang/hyperstudy-gige/releases)
   - Download the latest `GigEVirtualCamera-vX.X.X.dmg` file
   - The app is fully signed and notarized by Apple

2. **Install the Application**
   - Double-click the downloaded DMG file
   - Drag `GigEVirtualCamera.app` to your `Applications` folder
   - Eject the DMG

3. **First Launch**
   - Open GigEVirtualCamera from your Applications folder
   - If you see a warning about an unidentified developer (rare with notarization), right-click and select "Open"

4. **Grant System Extension Permission**

   When you first launch the app, macOS will display a notification:

   > **"System Extension Blocked"**
   > A program tried to load new system extension(s) signed by "Luke Chang"

   **To approve:**
   - Click the notification, or go to **System Settings** → **Privacy & Security**
   - Scroll to the **Security** section
   - Find the message about blocked system software from "Luke Chang"
   - Click **"Allow"**
   - Enter your administrator password if prompted
   - **Restart the app** after approving

5. **Grant Camera Permissions**
   - Go to **System Settings** → **Privacy & Security** → **Camera**
   - Find **GigEVirtualCamera** in the list
   - Toggle it **ON**

6. **Verify Installation**
   ```bash
   systemextensionsctl list
   ```
   You should see `com.lukechang.GigEVirtualCamera.Extension` listed.

## Usage

### Connecting to a Camera

1. **Launch GigEVirtualCamera**
2. **Select Camera**: Your GigE Vision cameras on the network appear in the dropdown menu
3. **Click Connect**: The app establishes connection and starts streaming
4. **Verify Preview**: The preview window shows the live camera feed

### Using Test Camera

For testing without physical hardware:
1. Select **"Test Camera (Aravis Simulator)"** from the dropdown
2. Click **Connect**
3. A simulated feed will appear

### Using in Other Applications

The virtual camera appears as **"GigE Virtual Camera"** in all macOS applications:

**HyperStudy Experiments:**
1. In HyperStudy's device setup, select camera source
2. Choose **"GigE Virtual Camera"**
3. Your GigE camera feed is now available to the experiment

**Zoom / Microsoft Teams / Google Meet:**
1. Open video settings in your conferencing app
2. Select **"GigE Virtual Camera"** as your camera
3. Your GigE feed becomes your video source

**QuickTime Player:**
1. File → New Movie Recording
2. Click dropdown arrow next to record button
3. Select **"GigE Virtual Camera"**

**OBS Studio:**
1. Add a new Video Capture Device source
2. Select **"GigE Virtual Camera"**

## Network Requirements

### Camera Network Setup

1. **Same Network**: Camera must be on the same network as your Mac
2. **Wired Connection**: Use Ethernet for best performance (required for GigE bandwidth)
3. **IP Configuration**: Use DHCP or configure static IP on camera

### Firewall Settings

GigE Vision uses UDP port 3956. Ensure your firewall allows:
- **System Settings** → **Network** → **Firewall** → **Options**
- Add GigEVirtualCamera to allowed applications

### Testing Camera Detection

```bash
# Install Aravis tools
brew install aravis

# List detected cameras
arv-camera-test-0.8
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ GigE Camera (Network)                                                   │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Aravis Library (C++)                                                    │
│ ├─ Camera Discovery                                                     │
│ ├─ Frame Acquisition                                                    │
│ └─ GigE Vision Protocol Handling                                        │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ AravisBridge (Objective-C++)                                            │
│ └─ C++ to Swift Bridge                                                  │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Main App (GigECameraApp)                                                │
│ ├─ SwiftUI Interface                                                    │
│ ├─ Camera Management                                                    │
│ ├─ Preview Display                                                      │
│ └─ Frame Sender                                                         │
└────────────┬────────────────────────────────────────────────────────────┘
             │ (XPC / CMIO Sink)
             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ System Extension (GigEVirtualCameraExtension)                           │
│ ├─ CMIO Extension Provider                                              │
│ ├─ Virtual Camera Device                                                │
│ └─ Frame Stream Management                                              │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ macOS Camera System                                                     │
│ └─ Available to all apps (HyperStudy, Zoom, QuickTime, etc.)            │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Technologies

- **CMIO (Core Media I/O)**: macOS camera extension framework
- **System Extensions**: Apple's modern privileged extension architecture
- **Aravis**: Open-source GigE Vision camera library
- **SwiftUI**: Native macOS user interface
- **XPC**: Secure inter-process communication

## Troubleshooting

### System Extension Issues

**Extension not loading:**
```bash
# Check extension status
systemextensionsctl list

# View extension logs
log stream --predicate 'subsystem == "com.lukechang.GigEVirtualCamera"'
```

**"System Extension Blocked" persists:**
1. Go to System Settings → Privacy & Security
2. Scroll down to Security section
3. Click "Allow" next to the blocked extension message
4. Restart your Mac if the option doesn't appear

### Camera Not Detected

1. **Verify Physical Connection**
   - Camera is powered on
   - Ethernet cable is connected
   - Camera and Mac are on same network

2. **Test with Aravis Tools**
   ```bash
   brew install aravis
   arv-camera-test-0.8
   ```

3. **Check Network Configuration**
   - Verify IP addresses are in same subnet
   - Try pinging the camera's IP address
   - Check firewall settings

### Virtual Camera Not Appearing

1. **Check Permissions**
   - System Settings → Privacy & Security → Camera
   - Ensure GigEVirtualCamera is enabled

2. **Verify Extension is Active**
   ```bash
   systemextensionsctl list
   system_profiler SPCameraDataType
   ```

3. **Restart the App**
   - Quit GigEVirtualCamera completely
   - Relaunch from Applications

4. **Restart Your Mac**
   - Sometimes required after first extension approval

### Performance Issues

**Low frame rate:**
- Ensure Gigabit Ethernet connection
- Connect camera directly to Mac (avoid switches if possible)
- Check network utilization in Activity Monitor
- Try lowering camera resolution

**Dropped frames:**
- Use wired connection (not WiFi)
- Close other bandwidth-intensive applications
- Check camera's internal buffer settings

## Development

For developers who want to build from source:

### Prerequisites

- macOS 12.3+ (Apple Silicon recommended)
- Xcode 15.0+
- Homebrew

### Building

```bash
# Clone the repository
git clone https://github.com/ljchang/hyperstudy-gige.git
cd hyperstudy-gige

# Install dependencies
brew install aravis

# Open in Xcode
open GigEVirtualCamera.xcodeproj

# Build and run (Cmd+R)
```

For detailed build instructions including code signing for distribution, see [BUILDING.md](https://github.com/ljchang/hyperstudy-gige/blob/main/BUILDING.md).

## Resources

- **GitHub Repository**: [ljchang/hyperstudy-gige](https://github.com/ljchang/hyperstudy-gige)
- **Build Instructions**: [BUILDING.md](https://github.com/ljchang/hyperstudy-gige/blob/main/BUILDING.md)
- **Contributing Guide**: [CONTRIBUTING.md](https://github.com/ljchang/hyperstudy-gige/blob/main/CONTRIBUTING.md)
- **Aravis Project**: [github.com/AravisProject/aravis](https://github.com/AravisProject/aravis)
- **Apple CMIO Documentation**: [Creating a Camera Extension](https://developer.apple.com/documentation/coremediaio/creating_a_camera_extension_with_core_media_i_o)

---

## Release Notes

<!-- RELEASE_NOTES_START -->
_Release notes are automatically synced from GitHub releases._
<!-- RELEASE_NOTES_END -->
