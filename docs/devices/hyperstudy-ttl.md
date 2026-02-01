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
- **Configurable**: 10ms pulse duration (modifiable in firmware)

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
- **Pulse Output**: GPIO Pin 5 (active HIGH)
- **Pulse Duration**: 10ms (configurable)
- **USB Identification**: VID `0x239A`, PID `0x80F1`
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
| `PULSE` | `OK:Pulse sent` | Triggers a 10ms TTL pulse on GPIO 5 |
| `TEST` | `OK:Test successful` | Validates the serial connection |
| `VERSION` | `OK:Version 1.0.2` | Returns firmware version |

### Response Format

All responses follow the pattern `OK:<message>` or `ERROR:<message>` for easy parsing by the HyperStudy Bridge.

## Wiring Diagrams

### Basic Wiring (Without Optocoupler)

For testing or when isolation is not required:

```
Adafruit Feather RP2040
        │
        │ GPIO 5
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
GPIO 5 ──────┤ 1 (Anode)    8 (Vcc2) ├──── +5V (external)
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
| Pulse Duration | 10ms |
| Rise Time | <1μs |
| Fall Time | <1μs |
| Command Latency | <1ms |
| Minimum Inter-Pulse Interval | 20ms |

### Pin Mapping

| Function | GPIO | Notes |
|----------|------|-------|
| TTL Output | 5 | 3.3V logic level |
| Status LED | Built-in | Flashes on pulse |
| USB | Native | 115200 baud |

## Resources

- **GitHub Repository**: [ljchang/hyperstudy-ttl](https://github.com/ljchang/hyperstudy-ttl)
- **Installation Guide**: [INSTALLATION.md](https://github.com/ljchang/hyperstudy-ttl/blob/main/INSTALLATION.md)
- **Optocoupler Wiring**: [OPTOCOUPLER_WIRING.md](https://github.com/ljchang/hyperstudy-ttl/blob/main/OPTOCOUPLER_WIRING.md)
- **Related**: [HyperStudy Bridge](/devices/hyperstudy-bridge), [Kernel Integration](/experimenters/experiment-design/kernel-integration)

---

## Release Notes

<!-- RELEASE_NOTES_START -->
_Release notes are automatically synced from GitHub releases._
<!-- RELEASE_NOTES_END -->
