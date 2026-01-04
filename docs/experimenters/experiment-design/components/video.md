---
title: Synchronized Video Component
sidebar_position: 3
---

# Synchronized Video Component

The Synchronized Video component allows you to present video content precisely synchronized across all participants. It's one of the core features of the HyperStudy platform, enabling experiments where participants view the same media with millisecond-level synchronization.


## Usage Scenarios

- Showing stimulus videos to multiple participants simultaneously
- Social viewing experiments where participant reactions are recorded
- Media co-consumption studies
- Measuring physiological responses to synchronized video content

## Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `videoSource` | URL or file ID of the video to display | *(required)* |
| `autoPlay` | Automatically start video when component loads (host only)* | `false` |
| `showControls` | Display video playback controls | `true` |
| `showTimecode` | Display current time position | `false` |
| `syncAccuracy` | Target synchronization accuracy in milliseconds | `50` |
| `hostControlOnly` | Only allow the host role to control playback | `true` |
| `allowSkipping` | Allow seeking through the video | `true` |
| `startTime` | Initial playback position in seconds | `0` |
| `endTime` | If set, video will automatically proceed to next state at this time | *(optional)* |
| `width` | Width of the video player (px or %) | `100%` |
| `height` | Height of the video player (px or %) | `auto` |
| `skipOnComplete` | Automatically advance to next state when video completes | `false` |

## Autoplay Browser Policies

**Important:** Modern browsers have strict autoplay policies. Videos with sound may not autoplay automatically, especially:
- On the first visit to your experiment
- Without prior user interaction
- In certain browsers (Firefox, Safari)

If autoplay is blocked, the host participant will need to manually click the play button to start the video. This is a browser security feature and cannot be bypassed without compromising experiment integrity.

## Host Controls

When `hostControlOnly` is enabled (default), only the participant assigned to the "host" role can control video playback. All other participants will be synchronized to the host's playback position. Host controls include:

- Play/pause
- Seeking to specific positions
- Adjusting playback rate
- Emergency resynchronization

## Synchronization Technology

The component uses a sophisticated synchronization system:

- **Kalman Filter**: Predicts host position accounting for network latency
- **PID Controller**: Adjusts playback rates to maintain synchronization
- **Server-mediated Time**: Shares a common time reference across all clients
- **Adaptive Buffering**: Handles client buffering events intelligently

## Adding a Synchronized Video

1. In the Experiment Designer, select the state where you want to add the video
2. Set the focus component to "Synchronized Video"
3. Configure the video options:
   - Select a video from the media library or provide a URL
   - Set playback options
   - Configure synchronization parameters
4. Save your changes


## Video Sources

All videos must be uploaded to HyperStudy's media library. This ensures:

### Platform-Hosted Videos

- **HLS Streaming**: Automatic adaptive bitrate streaming for all connection speeds
- **Security**: Protected by signed URLs (not publicly accessible)
- **Performance**: Precached + HLS for instant playback without buffering
- **Synchronization**: Optimized for precise multi-participant sync
- **Privacy**: URLs expire after 3 hours, preventing unauthorized access
- **Format Compatibility**: Automatic transcoding eliminates browser issues

### HLS Adaptive Streaming

When you upload a video, it's automatically transcoded to HLS format with multiple quality levels:

| Resolution | Bitrate | Best For |
|------------|---------|----------|
| 360p | 800 kbps | Slow connections |
| 480p | 1,400 kbps | Mobile networks |
| 720p | 2,800 kbps | Standard broadband |
| 1080p | 5,000 kbps | Fast connections |

The player automatically selects the best quality based on each participant's connection speed, ensuring smooth playback without buffering - even in multi-participant synchronized experiments.

## Video File Requirements

:::info Automatic Format Conversion
With HLS transcoding, browser compatibility issues are handled automatically. All uploaded videos are converted to H.264 with yuv420p chroma subsampling, ensuring universal browser support including Firefox. You can upload any supported format (MP4, MOV, WebM, AVI, MKV, M4V).
:::

### Recommended Format (Best Compatibility)

**MP4 with specific encoding:**
- **Video codec**: H.264 (x264)
- **Audio codec**: AAC
- **Chroma subsampling**: yuv420p (Firefox requires this)
- **Container optimization**: faststart flag enabled
- **Resolution**: 720p or 1080p recommended (higher resolutions increase bandwidth)
- **Duration**: Videos under 20 minutes perform best
- **File size**: Keep under 200MB when possible for faster precaching
- **Hosting**: Use the built-in media library for best performance and security

**Alternative format:**
- **WebM** (VP8/VP9 video, Vorbis/Opus audio) - Full browser support

### Problematic Formats ⚠️

The following formats **may cause Firefox playback failures**, especially when:
- Using **Sparse Rating component** (pause/resume at timestamps)
- **Jumping to specific timestamps** (startTime/endTime state parameters)
- **Segmenting videos** across multiple states

**Formats to avoid:**
- ❌ **MOV** (QuickTime) - Firefox often fails with "corrupt file" error due to chroma subsampling incompatibility
- ❌ **AVI** - No browser support
- ⚠️ **MKV** - Very limited browser support
- ⚠️ **M4V** - May have same issues as MOV

**What happens with incompatible formats:**
- Video may play initially but crash when seeking/pausing
- State transitions may fail with decode errors
- Sparse rating pause/resume may cause video to freeze
- Works fine in Chrome/Safari but fails in Firefox

**Solution:**
Convert problematic formats to MP4 using FFmpeg:
```bash
ffmpeg -i input.mov -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 \
       -c:a aac -b:a 128k -movflags +faststart output.mp4
```

For detailed information about format compatibility issues and conversion, see the [Media Management](../../media-management.md#video-format-recommendations) guide.

## Advanced Features

### Automatic Media Precaching

The platform automatically precaches videos before the experiment starts to ensure optimal performance:

**How It Works:**
1. Videos are identified during experiment initialization
2. All participants preload videos before entering video states
3. Playback starts instantly without buffering delays
4. Browser caching optimized for efficient re-use

**Benefits:**
- **Instant Playback**: No loading delays when video state begins
- **Perfect Synchronization**: All participants start from fully loaded state
- **Consistent Timing**: Eliminates network-dependent loading variability
- **Improved UX**: Smooth, professional experiment experience

**What Gets Precached:**
- All videos used in Video components throughout the experiment
- Both platform-hosted and external videos (when possible)
- Images used in Image components

**Best Practice**: Upload videos to the platform's media library for optimal precaching support. External videos may have variable precaching success depending on CORS policies and hosting configuration.

### Synchronization Quality Indicator

Enable the `showSyncIndicator` option to display a small indicator showing current synchronization quality. Colors represent:

- **Green**: Excellent synchronization (within 50ms)
- **Yellow**: Acceptable synchronization (50-200ms)
- **Red**: Poor synchronization (>200ms)

### Variable Capture

Set the `capturePositionToVariable` option to store the current playback position to a specified variable at regular intervals or when playback stops.

### Time-based Events

Use the `timeEvents` array to trigger events or set variables at specific timestamps during playback:

```json
"timeEvents": [
  {
    "time": 45.5,
    "action": "setVariable",
    "variable": "exposureComplete",
    "value": true
  },
  {
    "time": 120,
    "action": "showOverlay",
    "content": "Pay attention to the next section"
  }
]
```

## Best Practices

1. **Upload to Platform**: All videos should be uploaded to the media library for HLS streaming, security, and optimal performance
2. **Wait for HLS**: Check the "HLS" status column in Video Manager - videos show "✓ Ready" when transcoding is complete
3. **Test Across Devices**: Video performance can vary - test on comparable devices to what participants will use
4. **Keep Videos Reasonable**: Very long videos (>1 hour) may take longer to transcode
5. **Monitor HLS Status**: In the Video Manager, verify videos show "Ready" status before using in experiments
6. **Test Multi-Participant**: For synchronized experiments, test with actual network conditions participants will experience
7. **Check Quality Levels**: Higher source resolution means more quality options for adaptive streaming

## Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| HLS status shows "Processing" | Video is being transcoded | Wait 2-5 minutes for transcoding to complete |
| HLS status shows "Failed" | Transcoding error | Original video still works; try re-uploading |
| Video won't synchronize | Network latency variation | HLS adaptive streaming should help; check connection |
| Frequent quality switching | Unstable connection | Expected behavior - HLS adapts to bandwidth |
| Lower quality than expected | Slow connection detected | HLS auto-selects best quality for smooth playback |
| Audio/video out of sync | Processing limitations | Close other applications; HLS helps with this |
| Seek controls don't work | `allowSkipping` disabled | Enable this setting if seeking is required |
| Video slow to start | Precaching not complete | Ensure experiment waits for media preload |
| Firefox playback issues | Using pre-HLS video | Wait for HLS transcoding or re-upload video |

## Related Documentation

- [Media Management Guide](../../media-management.md) - Learn about HLS streaming, video security, and precaching
- [Image Component](./image.md) - Display images in your experiments (also supports precaching)
- [Video Chat Component](./videochat.md) - Real-time video communication between participants