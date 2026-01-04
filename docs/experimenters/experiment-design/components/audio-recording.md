---
title: Audio Recording Component
sidebar_position: 11
---

import StorybookEmbed from '@site/src/components/StorybookEmbed';

# Audio Recording Component (Experiment State)

The Audio Recording component enables participants to record audio responses directly within experiments. This component provides a simple, accessible interface for capturing voice responses, thoughts, or verbal reactions to experimental stimuli.

## Interactive Demo

<StorybookEmbed story="experiment-audiorecording--default" showControls height="500px" />

## Overview

Audio recording is useful for:

- **Qualitative responses**: Capturing detailed thoughts and reactions
- **Think-aloud protocols**: Recording participant reasoning processes
- **Verbal assessments**: Collecting spoken evaluations or descriptions
- **Accessibility**: Supporting participants who prefer verbal over written responses
- **Rich data collection**: Capturing tone, emotion, and nuanced responses

## Configuration Options

### Basic Settings

- **Prompt Text**: Instructions shown to participants
- **Display Text**: Additional context or information displayed
- **Output Variable**: Variable name to store recording metadata
- **Max Recording Time**: Maximum duration in seconds (0 = unlimited)
- **Audio Format**: Recording format (webm, mp4, wav)

### Interface Options

- **Show Countdown**: Display countdown timer before recording starts
- **Show Waveform**: Visual feedback showing audio levels during recording
- **Allow Review**: Let participants listen to their recording before submitting
- **Enable Device Setup**: Show microphone testing and selection interface

### Advanced Settings

- **Auto-submit**: Automatically proceed after recording completion
- **Required Recording**: Whether participants must record to continue
- **Retry Attempts**: Number of times participants can re-record
- **Quality Settings**: Audio bitrate and sample rate configuration

## Configuration Examples

### Basic Voice Response

```json
{
  "prompt": "Please describe your reaction to what you just saw",
  "displayText": "Take your time and speak clearly",
  "maxRecordingTime": 60,
  "audioFormat": "webm",
  "showWaveform": true,
  "allowReview": true,
  "outputVariable": "reaction_audio"
}
```

### Think-Aloud Protocol

```json
{
  "prompt": "Think out loud as you work through this problem",
  "displayText": "Say whatever comes to mind - there are no wrong answers",
  "maxRecordingTime": 300,
  "showCountdown": false,
  "enableDeviceSetup": true,
  "outputVariable": "think_aloud_recording"
}
```

### Quick Impression Capture

```json
{
  "prompt": "Give your first impression in a few words",
  "maxRecordingTime": 15,
  "showWaveform": false,
  "allowReview": false,
  "autoSubmit": true,
  "outputVariable": "first_impression"
}
```

### Detailed Interview Response

```json
{
  "prompt": "Please answer the following question in detail:",
  "displayText": "Question: How did the interaction between the characters make you feel?",
  "maxRecordingTime": 120,
  "showCountdown": true,
  "allowReview": true,
  "enableDeviceSetup": true,
  "retryAttempts": 3,
  "outputVariable": "interview_response"
}
```

## Setting Up Audio Recording

### 1. Add to Experiment State

1. Select the state where you want audio recording
2. In the Properties panel, set "Focus Component" to "Audio Recording"
3. Configure the component properties
4. Set up data collection variables

### 2. Configure Recording Settings

**Basic Configuration:**
1. Set clear prompt text explaining what participants should record
2. Choose appropriate maximum recording time
3. Select audio format based on your needs
4. Configure output variable name

**Interface Options:**
1. Enable waveform display for visual feedback
2. Allow review if participants need to check their recordings
3. Enable device setup for participants with microphone issues
4. Set countdown if you want preparation time

### 3. Test Audio Setup

1. Use preview mode to test recording functionality
2. Verify audio quality and clarity
3. Test on different browsers and devices
4. Check data collection and storage

## Technical Requirements

### Browser Support

- **Chrome/Edge**: Full support with webm format
- **Firefox**: Good support, may prefer different formats
- **Safari**: Limited format support, test thoroughly
- **Mobile browsers**: Variable support, test on target devices

### Permissions

- **Microphone Access**: Participants must grant microphone permissions
- **HTTPS Required**: Recording only works on secure connections
- **Storage Permissions**: Temporary storage needed for recording buffer

### Audio Formats

- **WebM**: Best compression, good browser support
- **MP4**: Broader compatibility, larger file sizes
- **WAV**: Highest quality, largest files

## Data Collection

### Recorded Information

For each audio recording, the system captures:

- **Audio File**: The actual recording (stored in cloud storage)
- **Duration**: Length of the recording in seconds
- **File Size**: Size of the audio file
- **Recording Metadata**: Start time, end time, format information
- **Device Information**: Microphone details (if available)

### Data Format

```json
{
  "type": "audio_recording",
  "timestamp": "2024-01-15T14:30:25.123Z",
  "duration": 45.6,
  "fileSize": 234567,
  "format": "webm",
  "filename": "recording_participant123_state5.webm",
  "storageUrl": "gs://project-storage/recordings/...",
  "deviceInfo": {
    "microphoneLabel": "Built-in Microphone",
    "sampleRate": 48000
  },
  "participantId": "participant_123",
  "sessionId": "session_456",
  "stateId": "interview_response"
}
```

### Storage and Access

- **Cloud Storage**: Audio files stored securely in cloud storage
- **Access Control**: Only authorized researchers can access recordings
- **Retention Policies**: Configure how long recordings are kept
- **Download Options**: Bulk download for analysis

## Analysis Considerations

### Transcription

- **Automatic Transcription**: Consider third-party services for transcription
- **Manual Transcription**: Plan resources for manual transcription if needed
- **Quality Factors**: Audio quality affects transcription accuracy

### Qualitative Analysis

- **Coding Schemes**: Develop systematic approaches to analyze content
- **Multiple Coders**: Use multiple researchers for reliability
- **Software Tools**: Consider qualitative analysis software (NVivo, Atlas.ti)
- **Temporal Analysis**: Analyze timing and patterns in responses

### Quantitative Measures

- **Response Times**: Time from prompt to recording start
- **Recording Duration**: Length of responses
- **Audio Features**: Pitch, volume, speech rate (requires specialized tools)
- **Response Completeness**: Whether participants provided full responses

## Best Practices

### Experiment Design

1. **Clear Instructions**: Provide specific guidance on what to record
2. **Practice Rounds**: Let participants practice before main experiment
3. **Time Limits**: Set reasonable but sufficient time limits
4. **Privacy Considerations**: Inform participants about recording and storage

### Technical Setup

1. **Test Environment**: Verify recording works in your experimental setup
2. **Backup Plans**: Have alternatives if recording fails
3. **Quality Checks**: Monitor audio quality during data collection
4. **Storage Management**: Plan for storage space requirements

### Participant Experience

1. **Comfort Level**: Ensure participants are comfortable being recorded
2. **Technical Support**: Provide help for microphone setup issues
3. **Clear Feedback**: Show recording status clearly
4. **Error Handling**: Gracefully handle technical problems

## Troubleshooting

### Common Issues

**No Microphone Access**
- Check browser permissions in settings
- Ensure HTTPS connection
- Try different browsers or devices
- Guide participants through permission granting

**Poor Audio Quality**
- Check microphone settings
- Reduce background noise
- Adjust recording quality settings
- Consider external microphones for better quality

**Recording Not Starting**
- Verify microphone permissions
- Check for browser compatibility issues
- Clear browser cache and cookies
- Test with different audio devices

**Large File Sizes**
- Adjust audio quality settings
- Use more efficient audio formats
- Consider compression options
- Monitor storage usage

### Browser-Specific Issues

**Chrome/Edge:**
- Usually most reliable
- Good webm support
- Clear permission dialogs

**Firefox:**
- May prefer different audio formats
- Check add-on interference
- Verify permission settings

**Safari:**
- Limited audio format support
- May require mp4 format
- Test thoroughly on iOS devices

## Integration with Other Components

### Video Components

Combine with video for reaction capture:
- Show video, then prompt for audio response
- Record commentary during video playback
- Capture immediate reactions after video ends

### Text Components

Use together for mixed-method data:
- Present written questions, collect audio answers
- Show text stimuli, record verbal reactions
- Combine written and spoken instructions

### Multiple Choice

Follow up quantitative with qualitative:
- Multiple choice for quick assessment
- Audio recording for detailed explanation
- Compare quantitative patterns with qualitative insights

## Related Documentation

- [Text Input Component](./text.md)
- [Multiple Choice Component](./multiple-choice.md)
- [Video Component](./video.md)
- [Data Management](../../data-management.md)
- [Experiment States](../experiment-states.md)