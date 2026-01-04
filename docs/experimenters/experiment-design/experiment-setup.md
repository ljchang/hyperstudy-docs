---
title: Experiment Setup Phase
sidebar_position: 10
---

# Experiment Setup Phase

The experiment setup phase is a critical stage where participant devices are configured and media is prepared for smooth playback. This guide explains what happens during setup and how to configure it for your experiment.

## Overview

The setup phase occurs after participants leave the waiting room (or immediately for single-participant experiments) and before the main experiment begins. It ensures:

- **Device readiness**: Camera and microphone are working
- **Media availability**: All videos and images are preloaded
- **Connection stability**: LiveKit and sync sockets are established
- **Special hardware**: USB triggers or Kernel integration configured

**Duration:** Typically 10-60 seconds depending on media size and connection speed.

---

## Setup Sequence

The setup process follows a two-phase architecture:

### Phase 1: Backend Setup

**What Happens:**
- Experiment data loaded from database
- Participant session verified
- Room configuration prepared
- Video URLs transformed to signed URLs
- Requirements calculated (sync needed? devices needed?)

**Experimenter Control:**
- Automatic - no configuration needed
- Backend determines requirements based on:
  - Number of participants
  - Presence of ShowVideo components
  - Video chat configuration
  - Special hardware settings

**Technical Details:**
- Backend emits `backend-setup-complete` event
- Includes experiment data and requirement flags
- Frontend waits for this signal before proceeding

---

### Phase 2: Frontend Setup (Participant Side)

**What Happens:**
The frontend performs several setup tasks in sequence:

```
┌───────────────────────────────────────────────────────────┐
│                  FRONTEND SETUP SEQUENCE                  │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Step 1: Video URL Signing                               │
│  └─ Transform internal video URLs to signed URLs         │
│                                                           │
│  Step 2: Media Preloading ⭐ CRITICAL                     │
│  ├─ Extract all video/image URLs from experiment         │
│  ├─ Preload images first (faster)                        │
│  ├─ Preload videos in batches of 2                       │
│  ├─ Display progress bar to participant                  │
│  └─ Wait for all media ready                             │
│                                                           │
│  Step 3: Global Components Registration                  │
│  └─ Register video chat, text chat, rating overlays      │
│                                                           │
│  Step 4: Device Setup (if required)                      │
│  ├─ Request camera/microphone permissions                │
│  ├─ Enumerate available devices                          │
│  ├─ Participant selects devices                          │
│  ├─ Test audio levels                                    │
│  ├─ Show video preview                                   │
│  └─ Wait for participant to click "Continue"             │
│                                                           │
│  Step 5: LiveKit Connection (if video chat enabled)      │
│  ├─ Connect to LiveKit room                              │
│  ├─ Publish audio/video tracks                           │
│  ├─ Configure media settings from experiment config      │
│  └─ Wait for connection established                      │
│                                                           │
│  Step 6: Sync Socket Connection (if required)            │
│  ├─ Create video synchronization socket                  │
│  └─ Register for time updates (viewers only)             │
│                                                           │
│  Step 7: Special Hardware (if enabled)                   │
│  ├─ USB trigger device setup                             │
│  └─ Kernel integration connection                        │
│                                                           │
│  Step 8: Signal Ready                                    │
│  └─ Participant marked ready, experiment begins          │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## Media Preloading

Media preloading is **critical for smooth experiment execution**. All videos and images are loaded into browser cache before the experiment starts.

### Why Media is Preloaded

**Without Preloading:**
- ❌ Videos show "grey box" on first play
- ❌ Images flash blank before appearing
- ❌ Race conditions between sync socket and video load
- ❌ Delayed playback start
- ❌ Buffering during experiment

**With Preloading:**
- ✅ Instant video playback start
- ✅ Smooth image display
- ✅ No loading delays during experiment
- ✅ Better synchronization across participants
- ✅ Professional participant experience

### What Gets Preloaded

**All Media in Experiment:**
- Every video referenced in `showvideo` components
- Every image referenced in `showimage` components
- Role-specific media for participant's assigned role
- Media in all states, not just upcoming ones

**Preloading Applies to ALL Participants:**
- Host participants (who control playback)
- Viewer participants (who follow host)
- Single-participant experiments
- Multi-participant experiments

### Preloading Process

#### 1. Extract Media URLs

The system scans all experiment states and identifies:
- `showvideo` components with `videoUrl` property
- `showimage` components with `imageUrl` property
- Role-specific configurations

**Example:**
```javascript
// State 1: Welcome video
{
  type: "showvideo",
  config: {
    videoUrl: "experiment-intro.mp4"
  }
}

// State 2: Stimulus image
{
  type: "showimage",
  config: {
    imageUrl: "stimulus-1.jpg"
  }
}
```

#### 2. Transform Video URLs (Internal Videos Only)

Internal videos (uploaded to HyperStudy) use signed URLs:
- Base URL extracted: `experiment-intro.mp4`
- Signed URL fetched from backend: `experiment-intro.mp4?signature=xyz123...`
- Signed URL valid for duration of experiment
- External videos (full URLs) used as-is

:::tip Video Format Compatibility
**Signed URLs work best with MP4 files**. MOV files may fail to seek in Firefox when served via signed URLs, especially for experiments using sparse rating or timestamp-based features. See [Media Management - Video Format Recommendations](../../media-management.md#video-format-recommendations) for details.
:::

#### 3. Preload Images

**Process:**
- All images preloaded in parallel
- Creates `Image` objects in browser
- Sets `src` to trigger loading
- Waits for `load` event
- Stores in cache for instant display

**Speed:** Typically 1-5 seconds for 5-10 images

**Example Log:**
```
[MediaPreloader] Found 8 images to preload
[ImageCache] Preloaded: stimulus-1.jpg
[ImageCache] Preloaded: stimulus-2.jpg
...
[MediaPreloader] Images complete: 8/8 loaded
```

#### 4. Preload Videos

**Process:**
- Videos preloaded in **batches of 2** (parallel loading)
- Creates hidden `<video>` elements
- Sets `preload="auto"` attribute
- Waits for `canplaythrough` event (or metadata for short videos)
- Stores references for instant playback

**Speed:** Varies by video size and connection
- Small video (< 10MB): 5-15 seconds
- Medium video (10-50MB): 15-45 seconds
- Large video (> 50MB): 45-120 seconds

**Timeout:** 30 seconds per video
- If timeout reached, marks as "partial load"
- Experiment continues (video will buffer during playback if needed)

**Example Log:**
```
[MediaPreloader] Found 3 videos to preload
[MediaPreloader] Starting preload: experiment-intro.mp4
[MediaPreloader] Metadata loaded: experiment-intro.mp4, duration: 45s
[MediaPreloader] Video ready: experiment-intro.mp4
[MediaPreloader] Starting preload: stimulus-video-1.mp4
...
[MediaPreloader] Videos complete: 3/3 loaded
```

#### 5. Progress Display

**What Participants See:**
```
Loading Experiment Media...
───────────────────────────────
[████████████████░░░░] 82%

Loading videos: 2/3 complete
```

**Progress Calculation:**
- Images: Count-based (5 of 8 loaded = 62.5%)
- Videos: Buffer-based (percent buffered per video)
- Overall: Weighted average

### Configuration Options

**Automatic Configuration:**
- Media preloading happens automatically
- No experimenter configuration required
- Cannot be disabled (critical for experience)

**Performance Optimization:**
- **Use compressed videos**: H.264, reasonable bitrate
- **Optimize image sizes**: 1920x1080 max resolution
- **Consider video length**: Shorter videos load faster
- **Test with slow connection**: Use browser throttling

### Troubleshooting Media Loading

| Issue | Cause | Solution |
|-------|-------|----------|
| Slow preloading | Large media files | Compress videos, reduce image sizes |
| Timeout errors | Network instability | Check participant connection speed |
| Grey boxes during experiment | Preload failed | Check browser console for errors |
| Some media not preloaded | Incorrect URLs | Verify all media URLs are valid |
| Browser crash during preload | Too many/large videos | Reduce video count or size |

**Developer Tools:**
```javascript
// Check preload status in browser console
window.mediaPreloader.getStats()
// Returns:
// {
//   videos: { total: 3, urls: [...], partialLoads: [] },
//   images: { total: 8, cached: 8, errors: 0 },
//   progress: { "video1.mp4": 100, "video2.mp4": 87 }
// }
```

---

## Device Setup

Device setup appears when experiments require participant camera and/or microphone.

### When Device Setup Appears

**Device setup is shown if:**
- ✅ Video chat component is enabled, OR
- ✅ Audio recording component is used, OR
- ✅ Experimenter explicitly requires devices

**Device setup is skipped if:**
- ❌ No video chat component
- ❌ No audio/video recording
- ❌ Single-participant with no recording
- ❌ `skipDeviceSetup` flag set (development only)

### Device Setup Process

#### Step 1: Request Permissions

**What Happens:**
- Browser displays permission prompt
- Requests camera access (if video needed)
- Requests microphone access (if audio needed)

**What Participants See:**
```
─────────────────────────────────────
  hyperstudy.io wants to:

  • Use your camera
  • Use your microphone

  [Block]  [Allow]
─────────────────────────────────────
```

**If Permissions Denied:**
- Setup cannot proceed
- Error message displayed
- Instructions to enable in browser settings
- Link to troubleshooting guide

#### Step 2: Enumerate Devices

**What Happens:**
- System lists all available devices
- Groups by type: camera, microphone, speakers
- Detects previously selected devices (if any)
- Pre-selects defaults

**Device Types:**
- **Video Input**: Cameras (webcam, external camera)
- **Audio Input**: Microphones (built-in, headset, USB)
- **Audio Output**: Speakers/headphones

#### Step 3: Device Selection

**What Participants See:**

```
┌────────────────────────────────────────────┐
│         Setup Your Devices                 │
├────────────────────────────────────────────┤
│                                            │
│  Camera                                    │
│  ┌──────────────────────────────────────┐ │
│  │ FaceTime HD Camera (Built-in)      ▼ │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │   [Video Preview Window]           │   │
│  │                                    │   │
│  │      [Your face appears here]      │   │
│  │                                    │   │
│  └────────────────────────────────────┘   │
│                                            │
│  Microphone                                │
│  ┌──────────────────────────────────────┐ │
│  │ External Microphone               ▼ │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Audio Level: ████████░░░░ 67%            │
│                                            │
│  Speakers                                  │
│  ┌──────────────────────────────────────┐ │
│  │ MacBook Pro Speakers              ▼ │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [Test Audio]  [Continue]  [Skip]         │
│                                            │
└────────────────────────────────────────────┘
```

**Interactive Elements:**
- **Dropdown menus**: Select different devices
- **Video preview**: Live camera feed
- **Audio level meter**: Real-time input visualization
- **Test audio button**: Play test tone through speakers

#### Step 4: Device Testing

**Video Testing:**
- Preview window shows live camera feed
- Participant can verify:
  - Camera is working
  - Framing is correct
  - Lighting is adequate
  - Background is appropriate

**Audio Input Testing:**
- Participant speaks into microphone
- Level meter responds to voice
- Visual feedback (green = good, red = too loud)
- Helps detect:
  - Microphone is connected
  - Input level is appropriate
  - No echo or feedback

**Audio Output Testing:**
- "Test Audio" button plays tone
- Participant verifies they can hear
- Confirms correct speaker device selected

#### Step 5: Confirmation

**Participant Actions:**
- Reviews all device selections
- Clicks "Continue" when ready
- OR clicks "Skip" (if allowed)

**What Happens Next:**
- Selected devices saved to session
- Media tracks created
- LiveKit connection established (if applicable)
- Experiment proceeds to next setup step

### Device Setup Configuration

**Automatic Configuration:**
```javascript
// Device requirements determined automatically based on:
const requiresDevices =
  hasVideoChatComponent ||
  hasAudioRecordingComponent ||
  hasVideoRecordingComponent;
```

**Manual Configuration (Advanced):**
```javascript
// In ExperimentRunner component
<ExperimentRunner
  experimentId={experimentId}
  roomId={roomId}
  skipDeviceSetup={false}  // Force show or hide
/>
```

**Recommended Settings by Experiment Type:**

| Experiment Type | Video | Audio | Speakers |
|----------------|-------|-------|----------|
| Solo survey | ❌ | ❌ | ❌ |
| Video chat | ✅ | ✅ | ✅ |
| Audio recording | ❌ | ✅ | ❌ |
| Synchronized viewing | ❌ | ❌ | ✅ |
| Full interaction | ✅ | ✅ | ✅ |

### Best Practices

**Participant Preparation:**
- Send device setup guide before experiment
- Recommend using Device Tester: [hyperstudy.io/devicetester](https://hyperstudy.io/devicetester)
- Suggest specific browsers (Chrome recommended)
- Advise testing connection beforehand

**Experiment Design:**
- Allow extra time for device setup (2-3 minutes)
- Include device check in pilot testing
- Have backup plan for device failures
- Provide tech support contact

**Common Issues:**
- **No devices detected**: Check physical connections, try different browser
- **Permission denied**: Guide to browser settings reset
- **Poor video quality**: Lighting, camera position, bandwidth
- **Echo in audio**: Use headphones, adjust volume

---

## LiveKit Connection

For experiments with video chat, LiveKit handles real-time audio/video communication.

### Connection Process

**Sequence:**
1. Device setup completes (devices selected)
2. LiveKit connection initiated
3. Room joined with participant token
4. Audio/video tracks published
5. Media settings applied from experiment config
6. Connection confirmed

**What Participants See:**
```
Connecting to video chat...
[Loading spinner]
```

**Duration:** 2-5 seconds typically

### Media Configuration

**Experiment-Level Settings:**
Navigate to **Global Components** → **Video Chat**:
- **Initial Audio Muted**: Start with mic off
- **Initial Video Off**: Start with camera off
- **Recording Enabled**: Record video chat
- **Layout**: Grid, spotlight, sidebar

**Settings Applied After Device Setup:**
Even though device setup enables audio/video for testing, LiveKit respects the experiment configuration:
```javascript
// After device setup, if experiment config says muted:
livekitService.setMicrophoneEnabled(false);
livekitService.setCameraEnabled(false);
```

### Connection States

| State | Description | Participant Action |
|-------|-------------|-------------------|
| `connecting` | Establishing connection | Wait |
| `connected` | Joined room successfully | Ready for experiment |
| `reconnecting` | Connection lost, retrying | Wait for reconnect |
| `disconnected` | Connection failed | Contact support |

**Error Handling:**
- Automatic reconnection attempts (up to 3 tries)
- Grace period for temporary disconnections
- Fallback to room rejoin if needed

---

## Special Hardware Setup

### USB Trigger Setup

For experiments using hardware triggers (e.g., button boxes, EEG markers):

**Setup Process:**
1. Request USB device access
2. Detect connected trigger device
3. Test trigger functionality
4. Configure trigger mapping

**Configuration:**
- Define trigger codes in experiment designer
- Map hardware buttons to experiment events
- Test trigger latency

**Documentation:** See [Trigger Component Guide](./components/trigger.md)

### Kernel Integration Setup

For experiments integrating with computational notebooks:

**Setup Process:**
1. Detect Kernel connection availability
2. Establish WebSocket connection
3. Verify kernel responsiveness
4. Initialize experiment variables

**Configuration:**
Navigate to **Experiment Settings** → **Kernel Integration**:
- Enable kernel integration
- Set kernel URL
- Configure variable sync

**Documentation:** See [Kernel Integration Guide](./kernel-integration.md)

---

## Setup Completion

### Ready Signal

When all setup steps complete:
1. Frontend emits `exp:participant-ready` event
2. Backend marks participant as ready
3. For multi-participant experiments:
   - Waits for all participants ready
   - Begins experiment when all ready
4. For single-participant experiments:
   - Begins immediately

**What Participants See:**
```
Setup Complete!
Starting experiment...
```

**Transition:** Smooth fade to first experiment state

---

## Monitoring Setup Progress

### For Experimenters

**Real-time Dashboard:**
View setup progress for all participants:
- Who is in setup phase
- Which step they're on
- How long they've been in setup
- Any errors encountered

**Setup Metrics:**
- Average setup time
- Common failure points
- Device compatibility stats

### For Developers

**Browser Console Logs:**
```
[ExperimentRunner] Phase 2: Backend setup complete
[MediaPreloader] Found 3 videos and 8 images
[MediaPreloader] Images complete: 8/8
[MediaPreloader] Videos complete: 3/3
[DeviceManager] Devices enumerated: 2 cameras, 3 microphones
[LiveKitService] Connected to room: room_xyz123
[ExperimentRunner] Setup complete, signaling ready
```

**Performance Tracking:**
```javascript
// Setup duration tracked automatically
performanceTracking.endDeviceSetup();
// Data sent to analytics
```

---

## Troubleshooting Setup Issues

### Setup Takes Too Long

**Problem:** Participants wait 2+ minutes in setup

**Diagnosis:**
1. Check media file sizes
2. Test network speed
3. Review browser console logs
4. Check device enumeration time

**Solutions:**
- Compress video files
- Reduce number of videos
- Use faster video codec (H.264)
- Optimize image sizes
- Recommend better internet connection

### Device Setup Fails

**Problem:** Camera or microphone doesn't work

**Common Causes:**
- Permissions denied
- Device in use by another app
- Browser not supported
- Driver issues
- Physical connection problems

**Solutions:**
1. Guide participant to grant permissions
2. Close other apps using devices
3. Try different browser (Chrome recommended)
4. Restart browser
5. Check device connections

### LiveKit Connection Fails

**Problem:** Cannot connect to video chat

**Diagnosis:**
- Check browser console for errors
- Verify LiveKit credentials
- Test network connectivity
- Check firewall/proxy settings

**Solutions:**
- Retry connection
- Refresh page
- Disable VPN
- Check network ports not blocked
- Contact administrator

### Media Preloading Stalls

**Problem:** Progress bar stuck at certain percentage

**Diagnosis:**
```javascript
// Check which media is stuck
window.mediaPreloader.getStats();
```

**Solutions:**
- Verify media URL is accessible
- Check CORS headers for external media
- Test direct media URL in browser
- Reduce timeout threshold (30s default)
- Skip problematic media if non-critical

---

## Performance Optimization

### Reducing Setup Time

**Media Optimization:**
- Compress videos to reasonable quality
- Use appropriate resolutions (720p-1080p)
- Consider shorter video clips
- Lazy-load non-critical media

**Device Setup:**
- Skip if not required
- Use minimal mode for simple experiments
- Pre-select default devices

**Connection:**
- Use CDN for media delivery
- Optimize server response times
- Reduce LiveKit connection latency

### Setup Time Benchmarks

| Experiment Type | Expected Setup Time |
|----------------|---------------------|
| Text-only survey | 2-5 seconds |
| With images (5-10) | 5-15 seconds |
| With short video (< 50MB) | 15-30 seconds |
| With long videos (> 50MB) | 30-90 seconds |
| With video chat | +5-10 seconds |
| With all features | 60-120 seconds |

**Recommendation:** Keep setup under 60 seconds for best experience.

---

## Disconnect Timeout Configuration

The disconnect timeout feature allows you to configure what happens when a participant loses connection during a multi-person experiment.

### Overview

**What it does:**
- Automatically pauses the experiment when a participant disconnects
- Shows a countdown timer to all participants
- Waits for the disconnected participant to rejoin
- Resumes the experiment if they return
- Automatically completes the experiment if the timeout expires

**When to use:**
- **Multi-person experiments**: Essential for coordinated tasks
- **Time-sensitive studies**: When you can't wait indefinitely
- **Synchronous tasks**: When all participants must be present

**When NOT to use:**
- **Single-participant experiments**: Unnecessary (participants can rejoin anytime)
- **Asynchronous tasks**: When participants work independently
- **Long experiments**: When occasional disconnects shouldn't end the session

### Configuration

:::note
This feature is **disabled by default** and must be explicitly enabled per experiment.
:::

**To enable disconnect timeout:**

1. Navigate to your experiment's Firebase document
2. Add the `disconnectTimeout` configuration:

```json
{
  "disconnectTimeout": {
    "enabled": true,
    "durationMs": 60000,
    "action": "complete"
  }
}
```

**Configuration Options:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable/disable the disconnect timeout feature |
| `durationMs` | number | `60000` | Timeout duration in milliseconds (60s = 1 minute) |
| `action` | string | `"complete"` | What to do when timeout expires (currently only "complete" supported) |

**Recommended timeout values:**

| Scenario | Recommended Timeout | Reason |
|----------|-------------------|---------|
| Quick tasks (< 5 min) | 30-60 seconds | Short tolerance for disruptions |
| Medium tasks (5-20 min) | 60-120 seconds | Balance patience and experiment flow |
| Long tasks (> 20 min) | 120-300 seconds | More tolerance for connection issues |
| Critical synchronous moments | 30 seconds | Need immediate presence |

### Participant Experience

When a participant disconnects, here's what all participants see:

```
┌─────────────────────────────────────────┐
│         ⏸️ Experiment Paused             │
│                                         │
│  A participant disconnected. Waiting    │
│  60s for reconnection...                │
│                                         │
│          ┌─────────┐                    │
│          │   45s   │  ← Countdown timer │
│          └─────────┘                    │
│                                         │
│  Waiting for participant to rejoin     │
│                                         │
│  Participants:                          │
│  ┌─────────────┐  ┌─────────────┐     │
│  │  Host    ✓  │  │ Viewer   ✗  │     │
│  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────┘
```

**Features:**
- ⏸️ Full-screen pause overlay
- ⏱️ Live countdown timer showing remaining time
- 👥 Participant status (connected ✓ / disconnected ✗)
- 🔒 Prevents any interaction during pause

### Rejoin Process

**If participant reconnects before timeout:**
1. Participant navigates back to experiment
2. System detects active session
3. **Skips device setup** (if already completed)
4. Sends participant to current experiment state
5. Resumes state timer with remaining time
6. Experiment continues normally

**What's preserved on rejoin:**
- ✅ Current experiment state
- ✅ All variables and randomization
- ✅ Participant role
- ✅ Completed components
- ✅ Timer remaining time

**What's NOT preserved:**
- ❌ Device setup (automatically skipped)
- ❌ Video chat connection (auto-reconnects)
- ❌ Local component state (reinitialized)

### Timeout Expiry Behavior

**If participant does NOT rejoin in time:**

1. Countdown reaches zero
2. Experiment is **completed** for all participants
3. **Post-experiment questionnaires** still shown (if enabled)
4. Completion status recorded as `DISCONNECT_TIMEOUT`
5. All data collected up to that point is saved

:::warning
When timeout expires, the experiment **cannot be resumed**. All participants must complete any post-experiment questionnaires and will see the completion screen.
:::

### Single-Participant Experiments

For single-participant experiments, disconnect timeout is **automatically disabled** regardless of configuration:

- No pause when participant disconnects
- Participant can rejoin at any time
- No timeout countdown
- Experiment continues indefinitely until completed

**Reason:** There are no other participants waiting, so disconnects don't affect coordination.

### Best Practices

**✅ DO:**
- Test disconnect behavior before running live sessions
- Set timeout duration based on experiment length
- Warn participants about the timeout in instructions
- Have a reconnection protocol in participant instructions
- Monitor disconnect frequency to identify connection issues

**❌ DON'T:**
- Set timeout too short (< 30s) - participants may panic
- Set timeout too long (> 5min) - other participants will leave
- Enable for asynchronous tasks where pausing isn't necessary
- Forget to test with actual network disconnections

### Testing Disconnect Timeout

**To test the feature:**

1. **Setup:** Create a test experiment with 2 participants
2. **Enable:** Configure `disconnectTimeout.enabled = true`
3. **Start:** Have both participants enter the experiment
4. **Disconnect:** Close browser tab for one participant
5. **Verify:** Other participant sees pause overlay with countdown
6. **Rejoin:** Disconnected participant returns to experiment
7. **Verify:** Experiment resumes, timer continues with remaining time

**Alternative test:** Let timeout expire to verify completion behavior.

### Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Pause overlay not showing | Feature not enabled | Check `disconnectTimeout.enabled = true` |
| | Single participant | Feature doesn't apply to 1-person experiments |
| | Experiment not started | Pause only works during active experiment |
| Participant can't rejoin | Session expired | Check session status in Firebase |
| | Room no longer exists | Timeout may have expired |
| Timer doesn't resume | Timer config missing | Verify state has timer configured |
| Experiment completes immediately | Timeout set to 0 | Check `durationMs` value |

### Data Collection

**Completion outcomes recorded:**

| Outcome | Meaning | Questionnaires |
|---------|---------|---------------|
| `SUCCESS` | Normal completion | Yes |
| `DISCONNECT_TIMEOUT` | Participant didn't rejoin | Yes |
| `TIMEOUT` | Waiting room timeout | No |
| `TECHNICAL` | Technical failure | No |
| `NO_CONSENT` | Declined consent | No |

**Check completion outcome in Firebase:**
```javascript
// participant_sessions collection
{
  "status": "completed",
  "completionOutcome": "DISCONNECT_TIMEOUT",
  "completedTime": "2025-10-31T12:34:56Z"
}
```

This allows you to identify which sessions ended due to disconnections vs. normal completion.

### Future Enhancements

Planned improvements for this feature:

- **Admin UI**: Visual configuration in experiment settings
- **Custom actions**: Options like `pause_indefinitely` or `skip_questionnaire`
- **Grace periods**: Short delay before showing pause overlay
- **Notifications**: Email/Slack alerts when timeout expires
- **Analytics**: Dashboard showing disconnect patterns

**See also:**
- [Disconnect Timeout Technical Documentation](../../developers/disconnect-timeout.md)
- [Participant Rejoin Flow](./participant-flow.md#reconnecting-after-disconnect)

---

## Next Steps

- [Participant Flow Guide](./participant-flow.md) - Complete participant journey
- [Experiment States](./experiment-states.md) - Design your experiment
- [Video Synchronization](../../developers/video-synchronization.md) - Technical details
- [Device Testing Guide](../../participants/device-testing.md) - Participant instructions
