---
sidebar_position: 3
title: HyperStudy TTL
---

# HyperStudy TTL

An RP2040-based TTL pulse generator for HyperStudy experiments with electrical isolation via optocoupler.

## Overview

The HyperStudy TTL device generates precisely-timed TTL (Transistor-Transistor Logic) pulses that can trigger external equipment such as MRI scanners, EEG amplifiers, or other research hardware. It connects to HyperStudy experiments through the [HyperStudy Bridge](/devices/hyperstudy-bridge).

### Signal Flow

```
HyperStudy TriggerComponent → HyperStudy Bridge → RP2040 Firmware → TTL Output
```

## Features

- **Fast & Reliable**: Sub-millisecond latency via USB serial communication
- **Electrical Isolation**: HCPL-2211 optocoupler protects both devices
- **Bridge Compatible**: Response format matches HyperStudy Bridge parser expectations
- **Easy Setup**: PlatformIO-based firmware with comprehensive documentation
- **Configurable**: Pulse duration adjustable at runtime (default 10ms) via serial command or Bridge settings

## Hardware Requirements

### Components

| Component | Part Number | Purpose |
|-----------|-------------|---------|
| Microcontroller | Adafruit Feather RP2040 | Main controller |
| Optocoupler | HCPL-2211 | Electrical isolation |
| Resistors | Various (see wiring) | Current limiting |
| Enclosure | Optional | Protection |

### Specifications

- **Communication**: USB serial, 115200 baud
- **Pulse Output**: GPIO Pin 6 / D4 (active HIGH)
- **Pulse Duration**: Configurable (default 10ms, range 1–10000ms)
- **USB Identification**: VID `0x239A`, PID `0x80F1`
- **Unique Serial Number**: Auto-generated from RP2040 flash chip ID
- **Firmware Version**: 1.4.0+
- **Input Voltage**: 5V (USB powered)
- **Output Voltage**: 3.3V or 5V (depending on optocoupler configuration)

## Firmware Installation

### Using PlatformIO (Recommended)

1. **Install PlatformIO**
   ```bash
   pip install platformio
   ```

2. **Clone the Repository**
   ```bash
   git clone https://github.com/ljchang/hyperstudy-ttl.git
   cd hyperstudy-ttl
   ```

3. **Upload Firmware**
   ```bash
   cd firmware
   pio run --target upload
   ```

4. **Verify Installation**
   ```bash
   pio device monitor
   ```
   Type `TEST` and press Enter. You should see `OK:Test successful`.

### Alternative: Arduino IDE

Alternative firmwares are provided in `/examples` for reference, but PlatformIO is recommended for production use.

## Serial Commands

The firmware accepts case-insensitive serial commands via USB:

| Command | Response | Description |
|---------|----------|-------------|
| `PULSE` | `OK:Pulse sent` | Triggers a TTL pulse using the default duration (10ms) |
| `PULSE <ms>` | `OK:Pulse sent` | Triggers a TTL pulse with the specified duration (1–10000ms) |
| `SETDURATION <ms>` | `OK:Duration set to <ms>ms` | Sets the default pulse duration (persists until reboot) |
| `TIMING` | `OK:Timing us:<N>,dur:<ms>` | Reports last pulse's serial-to-GPIO latency in microseconds |
| `SERIAL` | `OK:Serial <hex>` | Returns the board's unique serial number (from flash chip ID) |
| `TEST` | `OK:Test successful` | Validates the serial connection |
| `VERSION` | `OK:Version 1.4.0` | Returns firmware version |
| `LONGPULSE` | `OK:Long pulse sent` | Triggers a 3-second pulse for testing/visibility |

### Response Format

All responses follow the pattern `OK:<message>` or `ERROR:<message>` for easy parsing by the HyperStudy Bridge.

### Pulse Duration Configuration

Pulse duration can be configured in three ways:

1. **Per-pulse override**: `PULSE 5` sends a 5ms pulse without changing the default
2. **Set default**: `SETDURATION 20` changes the default to 20ms (until device reboot)
3. **Via HyperStudy Bridge**: Configure `pulse_duration_ms` in TTL device settings — the Bridge sends the duration with each PULSE command automatically

## Wiring Diagrams

### Basic Wiring (Without Optocoupler)

For testing or when isolation is not required:

```
Adafruit Feather RP2040
        │
        │ GPIO 6
        ▼
    ┌───────┐
    │  100Ω │  (current limiting resistor)
    └───┬───┘
        │
        ▼
   TTL Output → External Device
        │
        ▼
       GND
```

### Isolated Wiring (With Optocoupler)

Recommended for production use to protect both the computer and connected equipment:

```
                    HCPL-2211
              ┌─────────────────┐
              │                 │
GPIO 6 ──────┤ 1 (Anode)    8 (Vcc2) ├──── +5V (external)
              │    LED          │
GND ─────┬───┤ 2 (Cathode)  7 (Vo1) ├──── TTL Output
         │   │                 │
         │   │    ─┬─          │
         │   │   /│\          │
         │   │  ──┴──          │
         │   │                 │
         │   │ 3 (NC)     6 (Vo2) ├──── (not used)
         │   │                 │
         └───┤ 4 (GND)    5 (GND2) ├──── GND (external)
              │                 │
              └─────────────────┘

Component Values:
- R1 (GPIO to Anode): 330Ω (limits LED current to ~5mA)
- R2 (Pullup on Vo1): 4.7kΩ (optional, for faster rise time)
```

### Detailed Optocoupler Wiring

For step-by-step assembly instructions with photos, see [OPTOCOUPLER_WIRING.md](https://github.com/ljchang/hyperstudy-ttl/blob/main/OPTOCOUPLER_WIRING.md) in the repository.

**Key Points:**
- The optocoupler provides galvanic isolation between the RP2040 and external equipment
- External equipment can use a different ground reference
- Maximum isolation voltage: 3750V RMS (HCPL-2211 specification)

## Usage with HyperStudy

### Setup

1. **Connect the TTL Device** to a USB port on the Bridge computer
2. **Open HyperStudy Bridge** and configure the TTL device:
   - Port will be auto-detected by VID/PID
   - Verify connection status shows green
3. **Enable Kernel Integration** in your experiment (Metadata tab)
4. **Add TriggerComponent** to your experiment states

### TriggerComponent Configuration

In the Experiment Designer, add a TriggerComponent to send TTL pulses:

```json
{
  "type": "trigger",
  "config": {
    "triggerType": "ttl",
    "label": "Trial Start"
  }
}
```

### Device Discovery

The Bridge automatically detects HyperStudy TTL devices by their USB VID/PID. You can also manually find the port:

```bash
# macOS
ls /dev/tty.usbmodem*

# Linux
ls /dev/ttyACM*

# Or use the discovery script
python3 testing/find_ttl_port.py
```

## Troubleshooting

### Device Not Detected

1. **Check USB Connection**
   - Try a different USB cable (some are power-only)
   - Try a different USB port
   - Avoid USB hubs if possible

2. **Verify Device is Recognized**
   ```bash
   # macOS
   system_profiler SPUSBDataType | grep -A5 "RP2040"

   # Linux
   lsusb | grep 239a
   ```

3. **Check Permissions (Linux)**
   ```bash
   sudo usermod -a -G dialout $USER
   # Log out and back in for changes to take effect
   ```

### No Response to Commands

1. **Check Baud Rate** - must be 115200
2. **Verify Line Endings** - use `\n` or `\r\n`
3. **Try the TEST command** first to validate connection

### Pulse Not Triggering External Device

1. **Verify Wiring** - check optocoupler connections
2. **Check Voltage Levels** - ensure external device expects 3.3V or 5V
3. **Measure Output** - use oscilloscope or multimeter to verify pulse
4. **Check Polarity** - some devices expect active-LOW signals

### Firmware Issues

1. **Re-flash Firmware**
   ```bash
   cd firmware
   pio run --target upload --upload-port /dev/tty.usbmodem*
   ```

2. **Enter Bootloader Mode**
   - Hold BOOTSEL button while connecting USB
   - Device appears as USB mass storage
   - Drag `.uf2` file to device

## Technical Reference

### Timing Specifications

| Parameter | Value |
|-----------|-------|
| Pulse Duration | 10ms default (configurable 1–10000ms) |
| Rise Time | &lt;1μs |
| Fall Time | &lt;1μs |
| On-Device Latency | Typically &lt;100μs (serial-available to GPIO toggle) |
| End-to-End Command Latency | &lt;1ms (Bridge to GPIO output) |
| Optocoupler Propagation | ~150–300ns |
| Minimum Inter-Pulse Interval | Pulse duration + ~1ms |

### Pin Mapping

| Function | GPIO | Notes |
|----------|------|-------|
| TTL Output | 6 (D4) | 3.3V logic level |
| Status LED | Built-in | Flashes on pulse |
| USB | Native | 115200 baud |

## Latency Measurement

### Understanding the Latency Chain

When a TTL pulse is triggered from a HyperStudy experiment, the signal passes through several stages:

```
HyperStudy Web App
       │
       │  ① WebSocket message (~0.1–0.5ms)
       ▼
HyperStudy Bridge
       │
       │  ② USB serial write + bus transfer (~125μs–1ms)
       ▼
RP2040 Firmware
       │
       │  ③ Serial parse → GPIO toggle (<100μs, measured by TIMING command)
       ▼
HCPL-2211 Optocoupler
       │
       │  ④ Optical propagation (~150–300ns, negligible)
       ▼
TTL Output
```

| Stage | What's Measured | Typical Latency |
|-------|----------------|-----------------|
| ① Bridge latency | WebSocket receive → serial write | 0.1–0.5ms |
| ② USB bus latency | Serial write → device receives | 125μs–1ms |
| ③ On-device latency | Serial available → GPIO toggle | &lt;100μs |
| ④ Optocoupler propagation | LED on → output transition | ~200ns |

**Total end-to-end latency** (① through ④) is typically **&lt;1ms**.

### Querying On-Device Timing

After sending a `PULSE` command, you can query the on-device measured latency with the `TIMING` command:

```
> PULSE
OK:Pulse sent
> TIMING
OK:Timing us:42,dur:10
```

This reports:
- `us:42` — 42 microseconds from serial data available to GPIO going HIGH
- `dur:10` — the pulse duration was 10ms

The Bridge also logs its own internal latency (stage ①) for each command.

### Interpreting Results

- **&lt;1ms total**: Expected performance with firmware v1.4.0+
- **1–2ms total**: Acceptable; may indicate USB hub or system load issues
- **&gt;2ms total**: Investigate — check for USB hubs, high CPU load, or other serial port consumers

## Resources

- **GitHub Repository**: [ljchang/hyperstudy-ttl](https://github.com/ljchang/hyperstudy-ttl)
- **Installation Guide**: [INSTALLATION.md](https://github.com/ljchang/hyperstudy-ttl/blob/main/INSTALLATION.md)
- **Optocoupler Wiring**: [OPTOCOUPLER_WIRING.md](https://github.com/ljchang/hyperstudy-ttl/blob/main/OPTOCOUPLER_WIRING.md)
- **Related**: [HyperStudy Bridge](/devices/hyperstudy-bridge), [Kernel Integration](/experimenters/experiment-design/kernel-integration)

---

## Release Notes

<!-- RELEASE_NOTES_START -->

### v1.4.0

**Released:** 2026-02-17

## What's Changed

### New Features
- **Configurable pulse duration**: `PULSE <ms>` for per-pulse override, `SETDURATION <ms>` to change the default (range 1–10000ms)
- **On-device timing measurement**: `TIMING` command reports serial-to-GPIO latency in microseconds
- **Unique board serial numbers**: Each device auto-generates a unique USB serial descriptor from its RP2040 flash chip ID
- **SERIAL command**: Query the board's unique identifier at runtime

### Performance
- **Removed `delay(1)` polling bottleneck**: Tight polling loop reduces on-device latency from up to 1ms to typically <100μs
- GPIO toggle happens immediately on command receipt — duration parsing occurs *after* the pin goes HIGH

### Compatibility
- Requires HyperStudy Bridge v0.8.21+ (bridge now sends `PULSE <duration>` format)
- Fully backward-compatible serial protocol (`OK:`/`ERROR:` response format unchanged)

---

_Release notes are automatically synced from GitHub releases._
<!-- RELEASE_NOTES_END -->
