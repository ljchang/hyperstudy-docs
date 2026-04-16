---
title: Trigger Component
sidebar_position: 11
---

import ComponentPlayground from '@site/src/components/ComponentPlayground';

# Trigger Component

The Trigger component enables hardware synchronization for experiments, particularly useful for neuroimaging studies (fMRI, EEG) and psychophysiology research. It can either send triggers to external equipment or wait to receive triggers from external devices like MRI scanners.

## Interactive Demo

<ComponentPlayground
  story="experiment-trigger--default"
  height="400px"
  argTypes={{
    'config.mode': { control: 'select', options: ['send', 'receive', 'receiveAndSend'], defaultValue: 'send', description: 'Mode of operation' },
    'config.triggerType': { control: 'select', options: ['keyboard', 'ttl'], defaultValue: 'keyboard', description: 'Type of trigger to send (send mode)' },
    'config.triggerKey': { control: 'text', defaultValue: 't', description: 'Key to send (send mode)' },
    'config.expectedKey': { control: 'text', defaultValue: '5', description: 'Key to wait for (receive mode)' },
    'config.instructions': { control: 'text', multiline: true, defaultValue: 'Press the key below to send a trigger.', description: 'Instructions to display' },
    'config.showInstructions': { control: 'boolean', defaultValue: true, description: 'Show instructions' },
    'config.sendTTLOnReceive': { control: 'boolean', defaultValue: false, description: 'Send TTL when trigger is received' },
    'config.backgroundColor': { control: 'color', defaultValue: '#1c1c1c', description: 'Background color' },
    'config.textColor': { control: 'color', defaultValue: '#ffffff', description: 'Text color' },
  }}
  presets={[
    { name: 'Scanner receive', args: { 'config.mode': 'receive', 'config.expectedKey': '5', 'config.instructions': 'Waiting for scanner trigger...' } },
    { name: 'Keyboard send', args: { 'config.mode': 'send', 'config.triggerKey': 't', 'config.instructions': 'Press the key below to send a trigger.' } },
    { name: 'fMRI + TTL', args: { 'config.mode': 'receive', 'config.expectedKey': '5', 'config.sendTTLOnReceive': true, 'config.instructions': 'Waiting for scanner trigger (TTL output enabled)...' } },
  ]}
/>

![HyperStudy TTL device in 3D-printed enclosure with BNC connector](/img/experimenters/ttl-device.jpg)

*The HyperStudy TTL device delivers electrically isolated sub-millisecond TTL pulses via BNC output, powered by an Adafruit Feather RP2040 with a custom FeatherWing PCB.*

![HyperStudy TTL FeatherWing PCB with Adafruit Feather RP2040 and optoisolator](/img/experimenters/ttl-device-board.jpg)

## Key Features

- **Send Mode**: Send keyboard or TTL triggers to external equipment
- **Receive Mode**: Wait for triggers from external devices (e.g., MRI scanner)
- **TTL Output on Receive**: Send TTL to external equipment when receiving a trigger
- **Synchronized Broadcast**: Coordinate triggers across multiple participants
- **HyperStudy Bridge Integration**: USB TTL output via bridge application

## When to Use

Use the Trigger component when you need to:

- Synchronize experiment start with MRI scanner
- Send TTL pulses to psychophysiology equipment (EDA, ECG, eye tracker)
- Coordinate experiment timing across multiple participants
- Time-lock multiple pieces of equipment together

## Modes of Operation

### Send Mode

In send mode, the component sends a trigger when activated:

- **Keyboard**: Participant presses a key to send trigger
- **TTL**: Automatically sends TTL pulse via HyperStudy Bridge

### Receive Mode

In receive mode, the component waits for an external trigger:

- Listens for a specific keyboard key (e.g., '5' from MRI scanner)
- Optionally sends TTL to external equipment when trigger is received
- Can coordinate with other participants via synchronized broadcast

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Mode** | `send` or `receive` | `send` |
| **Trigger Type** | `keyboard` or `ttl` (send mode only) | `keyboard` |
| **Trigger Key** | Key to send (send mode, keyboard) | `t` |
| **Expected Key** | Key to wait for (receive mode) | `5` |
| **Show Instructions** | Display instructions to participant | `true` |
| **Instructions** | Custom instruction text | *(auto-generated)* |

### TTL Output on Receive

| Setting | Description | Default |
|---------|-------------|---------|
| **Send TTL on Receive** | Send TTL pulse when trigger is received | `false` |

When enabled, receiving a trigger (e.g., '5' from MRI scanner) will automatically send a TTL pulse via the HyperStudy Bridge. This is useful for time-locking external psychophysiology equipment with the scanner trigger.

### Synchronized Broadcast (Multi-participant)

| Setting | Description | Default |
|---------|-------------|---------|
| **Enable Synchronized Broadcast** | Wait for all participants before proceeding | `false` |
| **Broadcast Roles** | Which roles to include (empty = all) | `[]` |

### Appearance

| Setting | Description | Default |
|---------|-------------|---------|
| **Background Color** | Component background | `#1c1c1c` |
| **Text Color** | Text color | `#ffffff` |

## Use Cases

### fMRI Experiment Start

Wait for scanner trigger to start experiment:

```
Mode: receive
Expected Key: 5
Instructions: "Waiting for scanner..."
```

### fMRI with Psychophysiology Time-locking

Wait for scanner and simultaneously trigger external equipment:

```
Mode: receive
Expected Key: 5
Send TTL on Receive: true
Instructions: "Waiting for scanner..."
```

When the scanner sends '5', the component will:
1. Log the received trigger
2. Send TTL pulse to external equipment via HyperStudy Bridge
3. Complete and advance to next state

### Multi-participant Synchronization

Coordinate experiment start across participants:

```
Mode: receive
Expected Key: 5
Enable Synchronized Broadcast: true
Broadcast Roles: [] (all roles)
```

All participants must receive their scanner trigger before any proceed.

### Manual TTL Send

Send TTL pulse on participant action:

```
Mode: send
Trigger Type: ttl
Instructions: "Preparing to send trigger..."
```

## Hardware Requirements

### For TTL Output

1. **HyperStudy Bridge**: Desktop application for USB communication
2. **TTL Device**: RP2040-based device (e.g., Adafruit) connected via USB
3. **Connection**: TTL device connected to external equipment

### For Scanner Input

1. **Scanner Interface**: Current Designs 932 or similar fORP device
2. **Configuration**: Interface set to output '5' key on trigger
3. **Connection**: Interface connected to participant computer via USB

## Data Collection

### Events Recorded

| Event | Description |
|-------|-------------|
| `trigger` (sent) | Trigger was sent (keyboard or TTL) |
| `trigger` (received) | Trigger was received from external device |
| `trigger` (sent, TTL on receive) | TTL sent in response to received trigger |

### Example Event Data

```json
{
  "eventType": "trigger",
  "category": "component",
  "componentId": "scanner-trigger",
  "data": {
    "action": "received",
    "triggerType": "keyboard",
    "triggerValue": "5"
  },
  "metadata": {
    "participantId": "participant-123",
    "roomId": "room-456",
    "stateId": "wait-for-scanner"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Integration with Scanner Pulse Recorder

For fMRI experiments, use the Trigger component together with the [Scanner Pulse Recorder](./scanner-pulse-recorder.md):

1. **TriggerComponent** (focus component): Waits for initial scanner trigger
2. **Scanner Pulse Recorder** (global component): Counts all TR pulses

This combination provides:
- Synchronized experiment start
- Pre-trigger pulse count (scanner warm-up time)
- Post-trigger pulse tracking (for brain data alignment)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Trigger not detected | Verify expected key matches interface output |
| TTL not sending | Check HyperStudy Bridge connection and device |
| Synchronized broadcast timeout | Ensure all participants' scanners are ready |
| Bridge disconnected error | Restart HyperStudy Bridge application |

## Best Practices

1. **Test before scanning**: Verify trigger detection with your specific hardware
2. **Use receive mode for fMRI**: Let the scanner control experiment timing
3. **Enable TTL on receive**: Time-lock all equipment with a single trigger
4. **Combine with Scanner Pulse Recorder**: Track all TR pulses for data alignment
5. **Clear instructions**: Help participants understand what's happening

## Related Components

- [Scanner Pulse Recorder](./scanner-pulse-recorder.md) - Continuous TR pulse recording
- [Video Component](./video.md) - Synchronized stimulus presentation
