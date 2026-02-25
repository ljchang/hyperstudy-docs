---
sidebar_position: 1
title: Devices Overview
---

# Devices Overview

HyperStudy supports integration with specialized hardware devices to enhance research capabilities. These devices enable features like TTL pulse triggers for external equipment synchronization, GigE Vision cameras for high-quality video capture, and connections to neural recording systems through the Bridge application.

## Ecosystem Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HyperStudy Web Application                         │
│                              (hyperstudy.io)                                 │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    │ WebSocket (port 9000)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HyperStudy Bridge                                  │
│                    (Desktop app running locally)                             │
│                                                                              │
│  ┌───────────┐  ┌────────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐ │
│  │TTL Module │  │Kernel Mod. │  │Pupil Mod. │  │LSL Module│  │EyeLink M.│ │
│  └─────┬─────┘  └─────┬──────┘  └─────┬─────┘  └────┬─────┘  └────┬─────┘ │
└────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────┘
         │              │              │              │              │
         ▼              ▼              ▼              ▼              ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  ┌─────────┐
  │ HyperStudy │  │  Kernel    │  │ Pupil Labs │  │ LSL-based │  │ EyeLink │
  │    TTL     │  │  Flow2     │  │   Neon     │  │  Devices  │  │1000 Plus│
  └────────────┘  └────────────┘  └────────────┘  └───────────┘  └─────────┘
```

## Available Devices

### HyperStudy Bridge

The central hub for connecting research hardware to HyperStudy experiments. The Bridge is a desktop application that runs on your local machine and provides a WebSocket interface between the web application and your research devices.

**Key Features:**
- Multi-device support (TTL, Kernel Flow2, Pupil Labs, LSL, EyeLink)
- Sub-millisecond latency for time-critical operations
- Automatic reconnection and error recovery
- Real-time status monitoring

[View HyperStudy Bridge Documentation →](/devices/hyperstudy-bridge)

---

### HyperStudy TTL

An RP2040-based TTL pulse generator for sending precisely-timed electrical signals to external equipment. Uses optocoupler isolation to protect both the computer and connected devices.

**Key Features:**
- Sub-millisecond latency via USB serial
- Electrical isolation via HCPL-2211 optocoupler
- PlatformIO-based firmware
- Integrates seamlessly with HyperStudy Bridge

[View HyperStudy TTL Documentation →](/devices/hyperstudy-ttl)

---

### GigE Virtual Camera

A native macOS application that creates virtual cameras from GigE Vision industrial cameras, making them available to any macOS application including HyperStudy experiments.

**Key Features:**
- Works with any GigE Vision compliant camera
- Appears as standard camera in all macOS apps
- macOS System Extension architecture
- Signed and notarized for security

[View GigE Virtual Camera Documentation →](/devices/hyperstudy-gige)

---

### EyeLink 1000 Plus

A high-speed video-based eye tracker from SR Research, connected via Ethernet through the HyperStudy Bridge. Requires the SR Research EyeLink Developers Kit installed on the Bridge machine.

**Key Features:**
- Up to 2000 Hz gaze tracking
- Real-time gaze streaming and EDF recording
- Calibration driven from the HyperStudy frontend
- Runtime SDK detection — no special build required

[View EyeLink 1000 Plus Documentation →](/devices/eyelink)

---

## Typical Setup

### For Neural Recording Experiments

1. Install the [HyperStudy Bridge](/devices/hyperstudy-bridge) on the computer running your acquisition software
2. Connect your devices (Kernel Flow2, TTL, etc.) through the Bridge interface
3. Enable device integration in your experiment's Metadata settings
4. Participants connect to the Bridge during experiment setup

### For TTL Trigger Experiments

1. Build or obtain a [HyperStudy TTL](/devices/hyperstudy-ttl) device
2. Flash the firmware using PlatformIO
3. Install the [HyperStudy Bridge](/devices/hyperstudy-bridge) and configure TTL connection
4. Use the TriggerComponent in your experiment to send pulses

### For Eye Tracking Experiments (EyeLink)

1. Install the [EyeLink Developers Kit](/devices/eyelink#installing-the-eyelink-developers-kit) from SR Research
2. Configure the Display PC's Ethernet to `100.1.1.2/24` to reach the EyeLink Host PC
3. Install and launch the [HyperStudy Bridge](/devices/hyperstudy-bridge)
4. Connect to the EyeLink, run calibration, and start recording
5. Send event markers from HyperStudy for synchronization with the EDF file

### For GigE Camera Experiments

1. Install the [GigE Virtual Camera](/devices/hyperstudy-gige) application
2. Approve the system extension when prompted
3. Connect to your GigE Vision camera through the app
4. Select "GigE Virtual Camera" as your camera source in HyperStudy

## Support

For device-specific issues:
- Check the troubleshooting section in each device's documentation
- Review the GitHub issues for each repository
- For HyperStudy integration questions, see the [Kernel Integration Guide](/experimenters/experiment-design/kernel-integration)
