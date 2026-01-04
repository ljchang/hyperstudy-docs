---
title: Video Chat Component
sidebar_position: 6
---

# Video Chat Component

The Video Chat component provides real-time audio and video communication between participants in an experiment. As a global component, it can persist across multiple states, enabling continuous interaction throughout the experiment.


## Key Features

- Real-time audio/video communication
- Configurable layout options (grid, spotlight, etc.)
- Audio and video controls for participants
- Role-based permissions
- Screen sharing capabilities
- Optional recording functionality
- Adaptive quality based on network conditions
- Device selection for camera and microphone

## When to Use

Use the Video Chat component when you need to:

- Enable face-to-face interaction between participants
- Capture verbal and non-verbal responses
- Facilitate discussions or interviews
- Allow experimenter observation or participation
- Record participant reactions to stimuli
- Create social presence in remote experiments

## Configuration

### Basic Settings


| Setting | Description | Default |
|---------|-------------|---------|
| **Enable Audio** | Allow audio communication | `true` |
| **Enable Video** | Allow video communication | `true` |
| **Initial Audio State** | Start with microphones on/off | `Muted` |
| **Initial Video State** | Start with cameras on/off | `On` |
| **Show Controls** | Display audio/video toggle buttons | `true` |
| **Allow Screen Sharing** | Enable screen sharing functionality | `false` |
| **Default Layout** | How participants are displayed | `Grid` |
| **Width** | Component width (px or %) | `100%` |
| **Height** | Component height (px or %) | `300px` |
| **Position** | Component placement | `Top-right` |

### Layout Options

| Layout | Description | Best For |
|--------|-------------|----------|
| **Grid** | Equal-sized tiles for all participants | Small groups (2-4 people) |
| **Spotlight** | One large view with smaller thumbnails | Presenter-focused sessions |
| **Active Speaker** | Automatically highlights current speaker | Discussion-based activities |
| **Gallery** | Horizontally scrolling row of participants | Larger groups |
| **Custom** | Define your own layout rules | Special requirements |

### Permissions Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Audio Control** | Who can toggle their audio | `All participants` |
| **Video Control** | Who can toggle their video | `All participants` |
| **Layout Control** | Who can change the layout | `Host only` |
| **Recording Control** | Who can start/stop recordings | `Host only` |
| **Participant Removal** | Who can remove participants | `Host only` |

### Advanced Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Quality Settings** | Video quality presets | `Balanced` |
| **Bandwidth Limit** | Maximum bandwidth usage | `Automatic` |
| **Background Blur** | Enable background blurring | `false` |
| **Noise Suppression** | Reduce background noise | `Standard` |
| **Echo Cancellation** | Prevent audio echo | `Enabled` |
| **Show Names** | Display participant names | `true` |
| **Show Mute Indicators** | Visual indicators for mute status | `true` |

## Role-Based Configuration

You can configure different settings for different participant roles:

| Role Feature | Description |
|--------------|-------------|
| **Visibility** | Which roles can see the video chat |
| **Permissions** | What actions each role can perform |
| **Layout Control** | Which roles can change layout |
| **Recording Rights** | Which roles can record sessions |

For example, you might configure:
- Observers can see but not be seen
- Experimenters can manage recordings
- Specific participants have different default views

## Technical Implementation

### LiveKit Integration

The Video Chat component uses LiveKit for WebRTC communication:

- **Adaptive Bitrate**: Automatically adjusts quality based on network
- **Connection Management**: Handles networking, ICE, and TURN servers
- **Track Publishing**: Efficiently manages audio/video streams
- **Selective Subscription**: Only receives necessary video tracks

### Synchronization Features

The component includes synchronization capabilities:

- **Time Synchronization**: Aligns timestamps across participants
- **State Synchronization**: Maintains consistent audio/video states
- **Layout Synchronization**: Optionally keeps layouts consistent

### Performance Considerations

Video chat is resource-intensive and depends on:

- **CPU Usage**: Video encoding/decoding requires processing power
- **Network Bandwidth**: Higher quality requires more bandwidth
- **Memory Usage**: Multiple participants increase memory needs

The component automatically adapts to available resources.

## Implementation Examples

### Basic Discussion Setup

```
Configuration:
- Default Layout: Grid
- Initial Audio State: Unmuted
- Initial Video State: On
- Show Controls: true
- Position: Top-right
- Height: 30% of window
```

### Experimenter-Participant Interview

```
Configuration:
- Default Layout: Spotlight
- Auto-Spotlight Role: Experimenter
- Participant Permissions: Toggle own audio/video only
- Experimenter Permissions: Full control
- Recording: Enabled, controlled by Experimenter
```

### Reaction Observation

```
Configuration:
- Default Layout: Grid
- Initial Audio State: Muted (for participants)
- Initial Video State: On
- Recording: Automatic
- Position: Side panel
- Show stimulus in main area
```

## Best Practices

### Technical Setup

1. **Connection Testing**: Have participants test their connection before starting
2. **Device Setup**: Guide participants to select appropriate cameras and microphones
3. **Background Considerations**: Advise on appropriate lighting and backgrounds
4. **Bandwidth Management**: Adjust quality settings based on expected connections

### Experimental Design

1. **Appropriate Timing**: Consider when video chat should be visible/hidden
2. **Clear Instructions**: Explain when participants should use audio/video
3. **Privacy Considerations**: Inform participants about recording
4. **Backup Plans**: Have alternative communication methods ready

### User Experience

1. **Positioning**: Place video chat where it doesn't obscure focus components
2. **Size Considerations**: Balance size for visibility vs. screen space
3. **Control Accessibility**: Ensure controls are easy to understand and use
4. **Mobile Compatibility**: Test layout on smaller screens

## Troubleshooting

### Common Issues

| Issue | Potential Solutions |
|-------|---------------------|
| Camera not working | Check browser permissions; try a different camera |
| Audio problems | Verify microphone selection; check system audio settings |
| Poor video quality | Check network connection; reduce quality settings |
| Participants can't see each other | Verify network connectivity; check TURN server configuration |
| Excessive CPU usage | Reduce video quality; limit number of visible participants |

### Technical Diagnostics

The component includes diagnostic tools:

- **Connection Status Indicator**: Shows network quality
- **Bandwidth Usage Display**: Shows data consumption
- **Error Logging**: Captures issues in console logs
- **Media Device Testing**: Verifies camera and microphone

## Data Collection

The Video Chat component can collect:

- **Participation Metrics**: Speaking time, camera-on time
- **Interaction Patterns**: Turn-taking, interruptions
- **Technical Metrics**: Connection quality, bandwidth usage
- **Full Recordings**: Complete audio/video for later analysis

## Privacy and Ethical Considerations

When using Video Chat:

1. **Informed Consent**: Ensure participants know when they're on camera
2. **Recording Disclosure**: Clearly indicate when sessions are recorded
3. **Data Storage**: Secure all video recordings appropriately
4. **Data Minimization**: Only record what's necessary for research
5. **Participant Control**: Give participants control over their audio/video

## Integration with Other Components

The Video Chat component works well with:

- **Text Chat**: As an alternative/supplementary communication channel
- **Shared Media**: For discussing viewed content
- **Collaborative Tasks**: For communication during joint activities
- **Rating Components**: For evaluating interactions

## Alternatives to Consider

- **Text Chat Component**: Lower bandwidth, more anonymous
- **Audio-Only Communication**: Less intrusive, lower resource usage
- **Pre-recorded Instructions**: For one-way communication needs