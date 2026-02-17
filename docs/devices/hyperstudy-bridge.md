---
sidebar_position: 2
title: HyperStudy Bridge
---

# HyperStudy Bridge

A unified, high-performance desktop application for bridging HyperStudy web experiments with research hardware devices.

## Overview

HyperStudy Bridge provides a reliable, low-latency communication layer between the HyperStudy web application and various research devices. Built with Tauri and Rust for maximum performance and minimal resource usage, it serves as the central hub for all device integrations.

The Bridge runs locally on your research computer and creates a WebSocket server that the HyperStudy web application connects to, enabling real-time communication with connected hardware.

## Features

- **High Performance**: Sub-millisecond latency for time-critical operations
- **Multi-Device Support**: Simultaneous connection to multiple device types
- **Auto-Reconnection**: Resilient connection management with automatic recovery
- **Real-Time Monitoring**: Live status dashboard for all connected devices
- **Secure**: Local-only connections with sandboxed architecture
- **Cross-Platform**: macOS (primary), with Windows and Linux support planned

## Supported Devices

| Device | Type | Connection | Status |
|--------|------|------------|--------|
| [HyperStudy TTL](/devices/hyperstudy-ttl) | TTL Pulse Generator | USB Serial | Supported |
| Kernel Flow2 | fNIRS | TCP Socket | Supported |
| Pupil Labs Neon | Eye Tracker | WebSocket | Supported |
| Lab Streaming Layer | Various | LSL Protocol | Supported |

## Installation

### macOS

1. **Download the DMG**
   - Visit the [GitHub Releases page](https://github.com/ljchang/hyperstudy-bridge/releases/latest)
   - Download the appropriate `.dmg` for your Mac:
     - **Apple Silicon (M1/M2/M3)**: `HyperStudy-Bridge_x.x.x_aarch64.dmg`
     - **Intel**: `HyperStudy-Bridge_x.x.x_x64.dmg`

2. **Install the Application**
   - Open the downloaded DMG file
   - Drag HyperStudy Bridge to your Applications folder
   - Eject the DMG

3. **First Launch**
   - Open HyperStudy Bridge from your Applications folder
   - If macOS shows a security warning, right-click the app and select "Open"
   - The app is signed and notarized by Apple for security

4. **Grant Permissions** (if prompted)
   - **Serial Port Access**: Required for TTL device communication
   - **Network Access**: Required for device connections

### Windows (Coming Soon)

Windows installer will be available in future releases.

### Linux (Coming Soon)

Linux AppImage will be available in future releases.

## Configuration

### Bridge Settings

Settings are stored in:
- **macOS**: `~/Library/Application Support/hyperstudy-bridge/`
- **Windows**: `%APPDATA%\hyperstudy-bridge\`
- **Linux**: `~/.config/hyperstudy-bridge/`

Example configuration:

```json
{
  "bridge": {
    "port": 9000,
    "autoConnect": true
  },
  "devices": {
    "ttl": {
      "port": "/dev/tty.usbmodem1234",
      "baudRate": 115200
    },
    "kernel": {
      "ip": "192.168.1.100",
      "port": 6767
    }
  }
}
```

### Device Configuration

Each device type has its own configuration panel in the Bridge GUI:

**TTL Device:**
- Serial port selection (auto-detected by USB VID/PID)
- Baud rate (default: 115200)
- Pulse duration (default: 10ms, range 1–10000ms)
- Connection timeout settings

**Kernel Flow2:**
- IP address of Kernel acquisition computer
- Port (default: 6767)
- Event categories to forward

**Pupil Labs Neon:**
- Connection URL
- Gaze data streaming options

**LSL Streams:**
- Stream name patterns to discover
- Outlet configuration

## Usage

### Basic Workflow

1. **Launch the Bridge** before starting your experiment
2. **Configure Devices** using the GUI interface
3. **Connect Devices** by clicking "Connect All" or individual device buttons
4. **Verify Status** - all required devices should show green status
5. **Start Experiment** - the Bridge handles all communication automatically

### Finding Your Bridge IP Address

Participants need the Bridge's IP address to connect during experiments:

1. The Bridge displays its IP address and port in the status bar
2. Alternatively, find your IP:
   - **macOS**: Open Terminal and run `ifconfig | grep "inet "`
   - **Windows**: Open Command Prompt and run `ipconfig`
   - **Linux**: Run `ip addr` or `hostname -I`

### WebSocket Protocol

The Bridge exposes a WebSocket server on port 9000 (configurable). Connect using:

```javascript
const ws = new WebSocket('ws://192.168.1.100:9000');
```

**Message Format:**

```javascript
// Send command to device
{
  "type": "command",
  "device": "ttl",
  "action": "send",
  "payload": { "command": "PULSE" }
}

// Receive data from device
{
  "type": "data",
  "device": "kernel",
  "payload": { /* device-specific data */ },
  "timestamp": 1634567890123
}
```

## Architecture

```
┌─────────────────┐     WebSocket      ┌──────────────┐
│   HyperStudy    │◄──────:9000───────►│    Bridge    │
│   Web App       │                     │   Server     │
└─────────────────┘                     └──────┬───────┘
                                               │
                         ┌─────────────────────┼─────────────────────┐
                         │                     │                     │
                   ┌─────▼─────┐         ┌────▼────┐         ┌─────▼─────┐
                   │    TTL    │         │ Kernel  │         │  Pupil    │
                   │  Serial   │         │   TCP   │         │    WS     │
                   └─────┬─────┘         └────┬────┘         └─────┬─────┘
                         │                     │                     │
                   ┌─────▼─────┐         ┌────▼────┐         ┌─────▼─────┐
                   │ TTL Device│         │ Flow2   │         │   Neon    │
                   └───────────┘         └─────────┘         └───────────┘
```

## Performance

| Metric | Target | Typical |
|--------|--------|---------|
| TTL Latency | &lt;1ms | 0.5ms |
| Message Throughput | &gt;1000/sec | 1500/sec |
| Memory Usage | &lt;100MB | 45MB |
| CPU Usage (idle) | &lt;5% | 2% |
| Startup Time | &lt;2sec | 1.2sec |

## Troubleshooting

### Connection Issues

**Cannot connect from HyperStudy:**
- Verify the Bridge is running and shows "Server running on port 9000"
- Check that both devices are on the same network
- Ensure firewall allows connections on port 9000
- Try using the Bridge computer's IP address directly

**Port already in use:**
```bash
# Find process using port 9000
lsof -i :9000

# Kill process if needed (use with caution)
kill -9 <PID>
```

### Device Issues

**Serial port access denied (macOS/Linux):**
```bash
# Add user to dialout group (Linux)
sudo usermod -a -G dialout $USER

# Check port permissions (macOS)
ls -la /dev/tty.*
```

**Device not detected:**
1. Verify device is powered on and connected
2. Check device appears in system (System Information on macOS)
3. Try unplugging and reconnecting the device
4. Restart the Bridge application

### Logging

View Bridge logs for debugging:
- **macOS**: `~/Library/Logs/hyperstudy-bridge/`
- Check the Bridge GUI's log panel for real-time output

## Development

For developers who want to build from source:

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Node.js](https://nodejs.org/) (v18+)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Building

```bash
# Clone the repository
git clone https://github.com/ljchang/hyperstudy-bridge.git
cd hyperstudy-bridge

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Resources

- **GitHub Repository**: [ljchang/hyperstudy-bridge](https://github.com/ljchang/hyperstudy-bridge)
- **API Documentation**: See repository `/docs/api/` folder
- **Related**: [Kernel Integration Guide](/experimenters/experiment-design/kernel-integration)

---

## Release Notes

<!-- RELEASE_NOTES_START -->

### v0.8.21

**Released:** 2026-02-17

## What's Changed

### Improvements
- TTL module now sends `PULSE <duration_ms>` format to support configurable pulse duration on firmware v1.4.0+
- Configurable `pulse_duration_ms` setting (default 10ms, range 1–10000ms)
- Serial buffer drain on TTL connect for cleaner handshake

### Documentation
- Updated TTL protocol docs, API documentation, and CLAUDE.md for firmware v1.4.0 compatibility

### Compatibility
- Requires TTL firmware v1.4.0+ (bridge now sends duration parameter with every PULSE command)

---


### v0.8.20

**Released:** 2026-02-15

## What's Changed

### New Features
- **Unified FRENZ Connect button** — Single "Connect" button now orchestrates the full FRENZ flow: starts the Python bridge, waits for streaming state with a progress bar, then connects LSL streams. "Disconnect" tears down both LSL and the bridge process. No more separate "Start Bridge" / "Stop Bridge" buttons.

### Technical
- Backend: `"frenz"` recognized in WebSocket device validation; early-return handlers for Connect, Disconnect, and Status actions route through `FrenzLslManager`
- Frontend: orchestrated multi-step connect with indeterminate progress bar and phase text during bridge startup (30s–3min)

---


### v0.8.19

**Released:** 2026-02-15

## What's Changed

### Improvements
- Forward Neon event response data (recording_id, timestamp) to HyperStudy instead of discarding it
- Normalize device IDs to lowercase to prevent silent lookup failures from case mismatches

### Bug Fixes
- Fix flaky memory leak integration tests by measuring process RSS instead of system-wide memory

### Technical
- Change `Device::send_event` return type to `Result<serde_json::Value, DeviceError>` for richer response data
- Upgrade Neon event logging from debug to info level with recording_id

---


### v0.8.18

**Released:** 2026-02-15

## Bug Fixes

- **Pupil Labs Neon**: Fix "Failed to parse event response" error when sending events without an active recording. The `recording_id` field in the Neon API response is now handled as optional, allowing test events and annotations to succeed regardless of recording state.

---


### v0.8.17

**Released:** 2026-02-15

## What's Changed

### Bug Fixes
- **Fixed Pupil Labs Neon connection failure** — two issues resolved:
  1. Made `PhoneInfo.port` optional (`#[serde(default)]`) since the Neon REST API doesn't include it in the Phone status response
  2. Added mDNS hostname pre-resolution for `.local` addresses — the reqwest/hyper HTTP client can't resolve mDNS names on macOS, so we now resolve via `tokio::net::lookup_host` (which uses the system's mDNSResponder) before making HTTP requests

---


### v0.8.16

**Released:** 2026-02-15

## What's Changed

### Bug Fixes
- Fixed Pupil Labs Neon connection failure caused by missing `port` field in the device's Phone status response. The field is now optional via `#[serde(default)]`, matching the real Neon REST API behavior.

---


### v0.8.15

**Released:** 2026-02-14

## 🎉 HyperStudy Bridge v0.8.15

^[[1m# Changelog for v0.8.15^[[0m

**Changes since v0.8.14**

## 🐛 Bug Fixes
- Rewrite Pupil Labs Neon integration to use real REST API (2132975)

## 🔨 Maintenance
- Bump version to 0.8.15 (5b242ab)

## 📊 Statistics
- **Commits**: 2
- **Contributors**: 1
- **Files changed**:  17 files changed, 1116 insertions(+), 1204 deletions(-)

---

**Full Changelog**: https://github.com/ljchang/hyperstudy-bridge/compare/v0.8.14...v0.8.15

---

## 📦 Installation

### macOS
- **Apple Silicon (M1/M2/M3)**: Download `HyperStudy-Bridge-v0.8.15-aarch64-apple-darwin.dmg`
- **Intel Macs**: Download `HyperStudy-Bridge-v0.8.15-x86_64-apple-darwin.dmg`

Open the DMG and drag HyperStudy Bridge to your Applications folder.

All macOS builds are signed and notarized by Apple.

### Windows
- Download `HyperStudy-Bridge-v0.8.15-x86_64-windows.msi`

> **Note**: Windows may show a SmartScreen warning on first run.
> Click "More info" → "Run anyway" to proceed.

### Linux
- Download `HyperStudy-Bridge-v0.8.15-x86_64-linux.AppImage`

Make executable and run:
\`\`\`bash
chmod +x HyperStudy-Bridge-*.AppImage
./HyperStudy-Bridge-*.AppImage
\`\`\`

---


### v0.8.14

**Released:** 2026-02-14

## 🎉 HyperStudy Bridge v0.8.14

^[[1m# Changelog for v0.8.14^[[0m

**Changes since v0.8.13**

## ✨ Features
- Add PyApp-based FRENZ Python bridge with process lifecycle management (3b1d2b7)

## 🔨 Maintenance
- Bump version to 0.8.14 (e1d3d41)
- Fix formatting across Rust and frontend code to pass CI checks (4191b2a)

## 📝 Other Changes
- Fix Kernel event delivery reliability with TCP keepalive and send retry (8446bba)

## 📊 Statistics
- **Commits**: 4
- **Contributors**: 1
- **Files changed**:  64 files changed, 7959 insertions(+), 2953 deletions(-)

---

**Full Changelog**: https://github.com/ljchang/hyperstudy-bridge/compare/v0.8.13...v0.8.14

---

## 📦 Installation

### macOS
- **Apple Silicon (M1/M2/M3)**: Download `HyperStudy-Bridge-v0.8.14-aarch64-apple-darwin.dmg`
- **Intel Macs**: Download `HyperStudy-Bridge-v0.8.14-x86_64-apple-darwin.dmg`

Open the DMG and drag HyperStudy Bridge to your Applications folder.

All macOS builds are signed and notarized by Apple.

### Windows
- Download `HyperStudy-Bridge-v0.8.14-x86_64-windows.msi`

> **Note**: Windows may show a SmartScreen warning on first run.
> Click "More info" → "Run anyway" to proceed.

### Linux
- Download `HyperStudy-Bridge-v0.8.14-x86_64-linux.AppImage`

Make executable and run:
\`\`\`bash
chmod +x HyperStudy-Bridge-*.AppImage
./HyperStudy-Bridge-*.AppImage
\`\`\`

---

_Release notes are automatically synced from GitHub releases._
<!-- RELEASE_NOTES_END -->
