---
title: Scanner Pulse Recorder
sidebar_position: 12
---

# Scanner Pulse Recorder Component

The Scanner Pulse Recorder is a specialized global component designed for **fMRI hyperscanning experiments**. It continuously records scanner TR (repetition time) pulses throughout an experiment, enabling precise synchronization between brain imaging data and experimental paradigms.

## Key Features

- Continuous recording of scanner TR pulses (keyboard triggers)
- Automatic detection of TriggerComponent transitions
- Pre-trigger and post-trigger pulse tracking
- Configurable trigger key (default: '5' from Current Designs interface)
- Invisible operation (no visual UI to distract participants)
- Precise timestamps for each pulse

## When to Use

Use the Scanner Pulse Recorder when you need to:

- Synchronize fMRI brain data with experimental timing
- Track the number of TR volumes before and after experiment start
- Record continuous scanner pulses in hyperscanning setups
- Align multi-participant fMRI data with experimental paradigms

## Hardware Requirements

### Typical fMRI Setup

1. **Scanner**: Siemens 3T Prisma (or similar) configured to send TTL trigger at each TR
2. **Interface**: Current Designs 932 (or fORP) converts TTL signals to keyboard presses
3. **Trigger Key**: Usually '5' key (configurable)

The scanner sends a pulse at every TR (volume acquisition), and the interface converts these to keyboard events that HyperStudy can capture.

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Trigger Key** | Keyboard key to listen for | `5` |
| **Record Post-Trigger** | Continue recording after TriggerComponent completes | `true` |

### Configuration Example

```json
{
  "globalComponents": {
    "scanner-pulse-recorder": {
      "type": "scannerpulserecorder",
      "enabled": true,
      "config": {
        "triggerKey": "5",
        "recordPostTrigger": true
      }
    }
  }
}
```

## How It Works

### Experiment Flow

1. **Experiment starts** - Scanner Pulse Recorder begins listening for trigger key
2. **Scanner starts** - Pulses begin arriving (recorded as `pre_trigger` phase)
3. **TriggerComponent completes** - Component detects this transition automatically
4. **Experiment continues** - Pulses recorded as `post_trigger` phase (if enabled)
5. **Experiment ends** - Recording stops

### Automatic Trigger Detection

The component automatically detects when a TriggerComponent completes by monitoring state transitions. This works regardless of where the TriggerComponent is positioned in your experiment sequence.

For example, if your experiment has:
- State 0: Instructions
- State 1: TriggerComponent (waiting for scanner)
- State 2: Video stimulus

The Scanner Pulse Recorder will correctly identify the transition from State 1 to State 2 as the trigger completion point.

## Data Collection

### Event Structure

Each pulse is recorded with the following data:

| Field | Type | Description |
|-------|------|-------------|
| `eventType` | string | `'scanner_pulse'` |
| `pulseNumber` | number | Sequential count (1, 2, 3...) |
| `experimentPhase` | string | `'pre_trigger'`, `'post_trigger'`, or `'complete'` |
| `timeSinceFirstPulse` | number | Milliseconds since first pulse detected |
| `timeSinceTrigger` | number | Milliseconds since TriggerComponent completed (null if pre-trigger) |
| `preTriggerPulseCount` | number | Total pulses before TriggerComponent completed |
| `stateIndex` | number | Current experiment state index |
| `timestamp` | string | ISO timestamp of the pulse |

### Example Data

```json
{
  "eventType": "scanner_pulse",
  "category": "scanner",
  "componentId": "scanner-pulse-recorder",
  "componentType": "scannerpulserecorder",
  "data": {
    "key": "5",
    "pulseNumber": 15,
    "experimentPhase": "post_trigger",
    "timeSinceFirstPulse": 28000,
    "timeSinceTrigger": 5000,
    "preTriggerPulseCount": 10,
    "stateIndex": 2
  },
  "metadata": {
    "participantId": "participant-123",
    "roomId": "room-456",
    "experimentId": "fmri-study-1",
    "stateId": "video-stimulus"
  },
  "timestamp": "2024-01-15T10:30:15.000Z"
}
```

### Phase Definitions

| Phase | Description |
|-------|-------------|
| `pre_trigger` | Pulses received while TriggerComponent is active (waiting for scanner) |
| `post_trigger` | Pulses received after TriggerComponent completes |
| `complete` | Pulses received after experiment marked complete |

## Use Cases

### Hyperscanning fMRI Synchronization

In a two-participant fMRI hyperscanning study:

1. Both participants are in separate scanners
2. Each participant's computer has a Scanner Pulse Recorder
3. Experiment waits for both participants' scanners to trigger
4. Each recorder tracks its own scanner's pulses independently
5. Post-hoc analysis aligns brain data using pulse counts

### Single-Participant fMRI

For single-participant studies:

1. Record pre-trigger pulses to know scanner warm-up time
2. Use pulse count to align brain volumes with experimental events
3. Export data for integration with neuroimaging analysis pipelines

## Integration with TriggerComponent

The Scanner Pulse Recorder is designed to work alongside the [Trigger Component](./trigger.md). A typical fMRI experiment setup:

1. **TriggerComponent** (focus component): Waits for initial scanner trigger to start experiment
2. **Scanner Pulse Recorder** (global component): Continuously records all pulses

Both components listen for the same key ('5'), but serve different purposes:
- TriggerComponent advances the experiment state
- Scanner Pulse Recorder records timing data

### Time-locking External Equipment

The TriggerComponent supports **Send TTL on Receive** - when the scanner trigger is received, it can automatically send a TTL pulse to external psychophysiology equipment (EDA, ECG, eye tracker, etc.). This time-locks all equipment with a single trigger:

```json
{
  "states": [
    {
      "id": "wait-for-scanner",
      "focusComponent": {
        "type": "trigger",
        "config": {
          "mode": "receive",
          "expectedKey": "5",
          "sendTTLOnReceive": true
        }
      }
    }
  ],
  "globalComponents": {
    "scanner-pulse-recorder": {
      "type": "scannerpulserecorder",
      "enabled": true,
      "config": {
        "triggerKey": "5"
      }
    }
  }
}
```

This configuration will:
1. Wait for scanner '5' trigger
2. Send TTL to external equipment via HyperStudy Bridge
3. Record all TR pulses throughout the experiment

## Best Practices

### Experiment Design

1. **Use with TriggerComponent**: Place a TriggerComponent as the first state for synchronized start
2. **Enable recordPostTrigger**: Usually keep this enabled for complete TR tracking
3. **Test before scanning**: Verify pulse detection works with your hardware setup

### Data Analysis

1. **Pre-trigger count**: Use `preTriggerPulseCount` to calculate scanner-to-experiment delay
2. **Volume alignment**: Each pulse corresponds to one TR (brain volume)
3. **Multi-participant alignment**: Compare `timeSinceFirstPulse` across participants

### Hardware Setup

1. **Verify trigger key**: Confirm your interface sends '5' (or configure accordingly)
2. **Test connection**: Use a text editor to verify key presses are received
3. **Check for latency**: Ensure no significant delay between scanner and computer

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No pulses recorded | Verify trigger key matches interface output; check cable connections |
| Wrong trigger key | Update `triggerKey` in config to match your interface |
| Missing pre-trigger pulses | Ensure Scanner Pulse Recorder is enabled before TriggerComponent |
| Pulses stop after trigger | Check that `recordPostTrigger` is `true` |

## Related Components

- **TriggerComponent**: For experiment state synchronization
- **Continuous Rating**: For real-time subjective ratings during scanning
- **Video Component**: For synchronized stimulus presentation
