# Kernel Flow2 Integration

## Overview

HyperStudy supports integration with Kernel Flow2 neural recording devices, enabling synchronized collection of brain activity data alongside behavioral experiments. This integration uses the HyperStudy Bridge desktop application to send event triggers and markers to the Flow2 acquisition system, ensuring precise temporal alignment between experimental events and neural recordings.

> **Simplified Setup**: Kernel integration is now easier than ever with the HyperStudy Bridge desktop app! Simply download the bridge, enable Kernel integration in your experiment settings, and participants just need to enter their bridge's IP address. All events are automatically forwarded - no complex configuration required.

## Key Features

- **Desktop Bridge Application**: Easy-to-use Tauri desktop app with GUI for managing device connections
- **Multi-Device Support**: Supports Kernel Flow2, TTL devices, Pupil Labs, BioPac, and LSL streams through a single bridge
- **Local Network Communication**: Connects directly to research devices on the participant's local network
- **Automatic Event Synchronization**: All experiment events, triggers, and responses are automatically forwarded to connected devices
- **Simple Setup**: Just enter the bridge's IP address - no complex configuration needed
- **Flexible Connection**: Choose whether device connection is optional or required for participants
- **Multi-Subject Support**: Each participant connects to their own local bridge in multi-participant experiments
- **Non-Blocking Design**: Device connection issues won't interrupt normal data collection

## Setting Up Kernel Integration

### Prerequisites: Installing the HyperStudy Bridge

Before using Kernel Flow2 integration, the **HyperStudy Bridge** desktop application must be installed on the computer running the Kernel Flow2 acquisition software. This bridge enables communication between HyperStudy and research devices including Kernel Flow2, TTL devices, Pupil Labs, BioPac, and LSL streams.

#### Installation Steps

1. **Download the HyperStudy Bridge**
   - Visit the [HyperStudy Bridge GitHub releases page](https://github.com/ljchang/hyperstudy-bridge/releases)
   - Download the appropriate installer for your operating system:
     - **Windows**: `HyperStudy-Bridge_x.x.x_x64_en-US.msi`
     - **macOS**: `HyperStudy-Bridge_x.x.x_x64.dmg`
     - **Linux**: `hyperstudy-bridge_x.x.x_amd64.deb` or `hyperstudy-bridge_x.x.x_amd64.AppImage`

2. **Install the Application**
   - **Windows**: Run the `.msi` installer and follow the setup wizard
   - **macOS**: Open the `.dmg` file and drag the app to Applications folder
   - **Linux**: Install the `.deb` package or run the AppImage directly

3. **Launch the Bridge**
   - Open the HyperStudy Bridge application from your applications menu
   - The bridge provides a GUI interface for configuring device connections
   - Default port: 9000 (configurable in the app settings)

4. **Configure Device Connections**
   - Use the bridge's GUI to set up connections to your research devices
   - For Kernel Flow2: Configure the connection to your Flow2 acquisition system
   - The bridge will show connection status and device information
   - Ensure Windows Firewall or macOS Security allows connections on port 9000

5. **Verify Installation**
   - The bridge should show "Server running on port 9000" in the status area
   - Keep the bridge running during experiments
   - The bridge will forward events from HyperStudy to connected research devices

> **Important**: The HyperStudy Bridge must be running on the same computer as your research device acquisition software (e.g., Kernel Flow2) for events to be properly recorded.

### For Experimenters

1. **Enable Kernel Integration**
   - In the Experiment Designer, go to the **Metadata** tab
   - Find the **Kernel Flow2 Integration** section
   - Check **Enable Kernel Flow2 Integration**

2. **Configure Settings**
   - **Make connection optional**: If checked, participants can skip Kernel setup if the device is unavailable
   - All event types are automatically forwarded - no selection needed!

3. **Save Your Experiment**
   - The Kernel configuration will be saved with your experiment
   - Participants will be prompted to connect during experiment setup

### For Participants

When joining an experiment with Kernel integration enabled:

1. **Device Setup Flow**
   - After configuring camera/microphone (if needed)
   - Before USB trigger setup (if needed)
   - The Kernel Flow2 setup screen will appear

![Kernel Flow2 Setup Screen](/img/kernel-flow2-setup.png)

2. **Connect to HyperStudy Bridge**
   - Enter the IP address of the computer running the HyperStudy Bridge (e.g., `192.168.1.100:9000`)
   - The bridge computer must be on the same local network as your computer

3. **Finding the IP Address**
   The setup screen includes built-in instructions:
   - **Windows**: Open Command Prompt and type `ipconfig`
   - **Mac/Linux**: Open Terminal and type `ifconfig` or `ip addr`
   - Look for the IPv4 address of the computer running the HyperStudy Bridge
   - You can also check the bridge application itself, which displays the current IP address and port

4. **Test Connection**
   - Click **Test Connection** to verify communication with the HyperStudy Bridge
   - If successful, the connection will be established automatically
   - If the connection is optional and unavailable, click **Skip** to proceed without device integration

## Event Forwarding

### Automatic Event Forwarding

All experiment events are automatically forwarded to connected research devices (including Kernel Flow2) - no configuration needed! This includes:

| Event Type | Kernel Event Name | Description |
|------------|------------------|-------------|
| `experiment.start` | `start_experiment` | Marks the beginning of the experiment |
| `experiment.end` | `end_experiment` | Marks the end of the experiment |
| `state.transition` | `event_state_transition` | Fired when moving between experiment states |
| `trigger` | `event_trigger` | Manual or automatic triggers from TriggerComponent |
| `marker` | `event_marker` | Custom markers sent by components |
| `component.response` | `event_response` | Participant responses from rating scales, choices, etc. |
| `media.*` | `event_media_*` | Media playback events (play, pause, ended) |

### Event Data Structure

Each event sent to Kernel includes:

```json
{
  "id": 123,
  "timestamp": 1699564234567890,  // Microseconds
  "event": "event_response",
  "value": {
    "participantId": "user123",
    "sessionId": "session456",
    "stateId": "state1",
    "componentId": "rating1",
    "response": 7,
    "category": "component"
  }
}
```

### Timing Precision

- Events are sent immediately when they occur
- Timestamps use the backend's synchronized clock for consistency across participants
- Microsecond precision ensures accurate alignment with neural data
- Network latency is typically < 5ms on local networks

## Technical Details

### Network Requirements

- The HyperStudy Bridge must be running on the research device acquisition computer
- Bridge computer and participant's browser must be on the same network
- Port 9000 must be accessible (default HyperStudy Bridge port, configurable)
- WebSocket connection is established for low-latency communication
- No internet connection required between participant and research devices

### Error Handling

- Connection failures don't interrupt the experiment
- Events are queued during temporary disconnections
- Automatic reconnection attempts with exponential backoff
- All device connection errors are logged but don't affect normal data collection

### Data Storage

- Events are stored directly in the connected research device datasets (e.g., Flow2 for Kernel)
- HyperStudy continues normal data collection to Firebase
- Provides redundancy and allows for offline analysis
- Can correlate behavioral and device data post-hoc

## Use Cases

### Single-Subject Experiments
- Participant runs experiment on the same computer as the HyperStudy Bridge
- Use `localhost:9000` or `127.0.0.1:9000` as the IP address
- Minimal latency for precise timing

### Multi-Subject Experiments
- Each participant connects to their own HyperStudy Bridge (and associated research devices)
- Synchronized timestamps ensure temporal alignment across subjects
- Central coordination through HyperStudy server
- Supports hyperscanning paradigms

### Example Configurations

**Cognitive Task with Neural Recording**
- Optional: No (require device connection)
- Use case: ERP studies, cognitive neuroscience with Kernel Flow2
- All events automatically forwarded

**Social Interaction Study**
- Optional: Yes (some participants may not have research devices)
- Use case: Hyperscanning during social tasks
- All events automatically forwarded for participants with connected devices

**Multi-Modal Recording**
- Optional: No (require device connection)
- Use case: Combining neural (Kernel), eye-tracking (Pupil), and physiological (BioPac) data
- Single bridge supports multiple device types simultaneously

**Pilot Testing**
- Optional: Yes
- Use case: Testing paradigm before full device recording
- Full event stream available when devices are connected

## Troubleshooting

### Connection Issues

**Cannot connect to HyperStudy Bridge:**
- Verify the HyperStudy Bridge application is running and shows "Server running on port 9000"
- Verify both devices are on the same network
- Check Windows Firewall or macOS Security settings allow connections on port 9000
- Ensure research device acquisition software is running (if applicable)
- Try using the computer's local IP instead of hostname
- Check that the bridge's GUI shows the correct network interface

**Connection test fails:**
- Confirm the HyperStudy Bridge application is running and listening on port 9000
- Confirm the IP address and port are correct (check the bridge application display)
- Check if port 9000 is blocked by firewall or antivirus software
- Restart both the research device acquisition software and the bridge application
- Try disabling VPN if connected
- Verify the bridge shows connected devices in its GUI

**Bridge application won't start:**
- Check if another application is using port 9000
- Review the bridge application logs for error messages (available in the GUI)
- Try restarting the bridge application
- Check system requirements and permissions
- Try running the bridge as administrator (Windows) or with elevated permissions

### Event Forwarding Issues

**Events not appearing in device data:**
- Check browser console for error messages
- Ensure connection remains active during experiment
- Review bridge application logs in the GUI
- Verify research device acquisition software is running
- Check that the bridge shows active device connections

**Timing misalignment:**
- Verify all computers use NTP time synchronization
- Check network latency with ping test
- Consider using wired connection instead of WiFi
- Review timestamp precision in exported data
- Use the bridge's built-in timing diagnostics (if available)

**Device-specific issues:**
- **Kernel Flow2**: Ensure Kernel Tasks SDK is properly configured
- **TTL devices**: Verify TTL port settings and hardware connections
- **Pupil Labs**: Check Pupil Capture/Service is running and accessible
- **BioPac**: Ensure proper hardware setup and software configuration
- **LSL**: Verify LSL streams are available and discoverable

## Best Practices

1. **Test Before Experiments**
   - Always test HyperStudy Bridge connection during pilot sessions
   - Verify event forwarding with sample data for all connected devices
   - Check timing precision meets requirements
   - Test the bridge GUI functionality and device connections

2. **Network Setup**
   - Use wired Ethernet when possible for stability
   - Dedicated network for experiment devices
   - Document IP addresses and port configurations for each setup
   - Ensure consistent network setup across sessions

3. **Participant Instructions**
   - Provide clear instructions for finding the bridge IP address
   - Include screenshots of both the setup process and bridge application
   - Have backup plan if device connections are unavailable
   - Train participants on the bridge application interface if they need to interact with it

4. **Data Validation**
   - Verify events in both HyperStudy and research device datasets
   - Cross-reference timestamps for alignment across all connected devices
   - Regular backups of all data sources
   - Use the bridge's data validation tools (if available)

## API Reference

For developers interested in the technical implementation:

- Frontend Service: `/frontend/src/lib/kernel/kernelFlow2Service.js`
- State Management: `/frontend/src/lib/kernel/kernelSetupStore.svelte.js`
- Setup Component: `/frontend/src/components/shared/KernelFlow2Setup.svelte`
- Event Forwarding: Integrated in `/frontend/src/lib/services/dataServiceV2.js`

The integration communicates with the HyperStudy Bridge via WebSocket on port 9000. The bridge handles the specific device protocols:
- **Kernel Flow2**: Uses the [Kernel Tasks SDK](https://docs.kernel.com/docs/kernel-tasks-sdk) specification
- **TTL devices**: Direct hardware communication
- **Pupil Labs**: Network API integration
- **BioPac**: AcqKnowledge integration
- **LSL**: Lab Streaming Layer protocol

For bridge development and device integration details, see the [HyperStudy Bridge repository](https://github.com/ljchang/hyperstudy-bridge).