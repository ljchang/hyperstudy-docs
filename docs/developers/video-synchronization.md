---
title: Video Synchronization
sidebar_position: 5
---

# Video Synchronization Architecture

This document explains the video synchronization system in HyperStudy, including the recent improvements that optimize socket connections and media preloading.

## Overview

HyperStudy uses a sophisticated video synchronization system to ensure that multiple participants view video content at precisely the same time. The system employs:

- **Conditional sync socket creation** - Only creates sync connections when actually needed
- **Kalman filter-based prediction** - Predicts optimal playback position
- **PID controller** - Adjusts playback rate for smooth synchronization
- **Comprehensive media preloading** - Ensures videos are ready before playback begins
- **Role-based architecture** - Host controls playback, viewers follow

## When Video Synchronization is Required

Video synchronization is **conditionally enabled** based on two criteria:

1. **Multi-participant experiments** (`participantCount > 1`)
2. **Presence of ShowVideo components** in experiment states

### Backend Detection

The backend determines if sync is required when all participants have joined:

```javascript
// From backend/src/experiment/experimentStateServer.js
const requiresSync = room.experimentData?.states?.some(s =>
  s.focusComponent?.type?.toLowerCase() === 'showvideo'
) && room.expectedCount > 1;
```

This information is sent to the frontend via the `backend-experiment-setup-complete` event:

```javascript
this.io.of('/experiment').to(`room:${roomId}`).emit('backend-experiment-setup-complete', {
  experimentData: room.experimentData,
  requiresSync  // Boolean flag indicating if sync socket is needed
});
```

### Frontend Detection

The frontend also has a helper function for UI components to check if sync is required:

```javascript
// From frontend/src/lib/media/deviceManager.svelte.js
export function experimentRequiresSync(experiment, participantCount) {
  // Single participant never needs sync
  if (!experiment || participantCount <= 1) {
    return false;
  }

  // Check if any state has a showVideo component
  return experiment.states?.some(state => {
    const type = state.focusComponent?.type?.toLowerCase();
    return type === 'showvideo';
  });
}
```

## Architecture Components

### 1. Sync Socket Connection

The sync socket is a separate Socket.IO namespace (`/sync`) dedicated to high-frequency synchronization updates.

#### Conditional Connection

The sync socket is **only created when needed** to optimize resource usage:

```javascript
// From frontend/src/components/experiment/ExperimentRunner.svelte
if (requiresSync) {
  logger.info("Adding sync socket setup to parallel tasks");
  setupTasks.push(
    connectSyncSocketWithRoom(roomId).then(socket => {
      syncSocket = socket;
      logger.info("✅ Sync socket connected and ready");
    })
  );
} else {
  logger.info("ℹ️ Sync socket not required for this experiment");
  syncSocket = null;
}
```

#### Room-Based Routing

The sync socket includes the `roomId` in its connection query to ensure proper pod routing in horizontally scaled deployments:

```javascript
// From frontend/src/lib/network/socketClient.js
export async function connectSyncSocketWithRoom(roomId) {
  // Create new sync socket with roomId in query for pod routing
  syncSocket = io(`${backendUrl}/sync`, {
    reconnection: true,
    reconnectionAttempts: 15,
    // ... other options
    forceNew: true, // Force new connection for pod routing
    multiplex: false, // Don't multiplex - need separate connection
    query: {
      roomId: roomId // CRITICAL: Include roomId for pod routing
    }
  });

  syncSocket.connect();
  return syncSocket;
}
```

### 2. ShowVideoComponent

The `ShowVideoComponent` is the main component responsible for synchronized video playback.

#### Sync Socket Prop

The component receives the sync socket as a prop from ExperimentRunner:

```svelte
<!-- From frontend/src/components/experiment/ShowVideoComponent.svelte -->
<script>
  const {
    config = {},
    oncomplete = () => {},
    onresponse = () => {},
    onready = () => {},
    syncSocket = null  // Sync socket passed from ExperimentRunner (null for single-participant)
  } = $props();
</script>
```

#### Single vs Multi-Participant Behavior

**Single Participant** (`syncSocket === null`):
- No synchronization needed
- Video plays normally with browser controls
- No network overhead from sync updates

**Multi-Participant** (`syncSocket !== null`):
- Host controls playback
- Viewers synchronize to host's position
- High-frequency time updates via sync socket

### 3. Role-Based Synchronization

#### Host Role

The host participant (determined by `config.hostRole`) controls video playback:

```javascript
function isParticipantHost() {
  const role = ($participantRole || "").toLowerCase();
  const hostRole = (config.hostRole || "host").toLowerCase();
  return role === hostRole;
}
```

**Host Responsibilities:**
- Controls play/pause/seek operations
- Broadcasts time updates every 100ms
- Sends initial state to newly joined viewers
- Has browser controls enabled

**Host Events Emitted:**
- `exp:time-update` - Current position and state (100ms interval)
- `exp:playback-command` - Play/pause commands
- `exp:seek-command` - Seek operations
- `exp:initial-state` - Full state snapshot for new viewers

#### Viewer Role

Viewers follow the host's playback state:

**Viewer Responsibilities:**
- Listen for host commands
- Calculate synchronization drift
- Adjust playback rate to maintain sync
- Report sync metrics to server

**Viewer Events Listened To:**
- `exp:initial-state` - Receive initial video state
- `exp:time-update` - Track host's current position
- `exp:playback-command` - Execute play/pause
- `exp:seek-command` - Jump to new position

**Viewer Events Emitted:**
- `exp:request-initial-state` - Request state on join
- `exp:ping-request` - Measure network latency
- `exp:sync-metrics` - Report drift and performance

### 4. Synchronization Engine

The sync engine uses a Kalman filter and PID controller for smooth, accurate synchronization.

#### Initialization

Viewers initialize the sync engine when the component mounts:

```javascript
// Initialize sync engine for viewers only
syncEngine = initExperimentSyncEngine({
  isHost: false,
  videoElement,
  roomId: $roomStore.id,
  onSync: (syncData) => {
    Object.assign(syncState, syncData);
  },
  onError: (error) => {
    logger.error("Sync engine error:", error);
  }
});

// CRITICAL: Start sync checking interval for viewers
syncInterval = setInterval(checkSync, 100);
```

**Important:** The sync check interval must be started for viewers to calculate drift and adjust playback. Without this interval, viewers will not synchronize properly.

#### Configuration Parameters

```javascript
// From frontend/src/lib/media/experimentSyncEngine.js
const config = {
  // Synchronization thresholds
  seekThreshold: 0.6,         // When to seek vs. adjust rate (seconds)
  seekCooldown: 2500,         // Minimum time between seeks (ms)
  minPlaybackRate: 0.95,      // Minimum allowed playback rate
  maxPlaybackRate: 1.05,      // Maximum allowed playback rate
  maxRateChange: 0.01,        // Maximum rate change per calculation

  // Kalman filter parameters
  processNoise: {
    position: 0.008,          // Process noise for position
    velocity: 0.008,          // Process noise for velocity
    acceleration: 0.01        // Process noise for acceleration
  },
  measurementNoise: 0.15,     // Measurement noise

  // PID controller gains
  pid: {
    proportional: 0.45,       // Proportional gain
    integral: 0.1,            // Integral gain
    derivative: 0.02          // Derivative gain
  }
};
```

#### Sync Algorithm

The viewer continuously checks sync and adjusts playback:

```javascript
function checkSync() {
  const currentTime = videoElement.currentTime;
  const { hostTime, drift, playbackRate } = syncEngine.calculateSync();

  // Large drift requires seeking
  if (Math.abs(drift) > syncEngine.seekThreshold &&
      Date.now() - lastSeekTime > syncEngine.seekCooldown) {
    lastSeekTime = Date.now();
    videoElement.currentTime = hostTime;
    reportSyncMetrics();
  }
  // Small drift adjusts playback rate
  else if (!syncState.hostPaused) {
    videoElement.playbackRate = playbackRate;
  }
}
```

## Media Preloading

A critical improvement is **comprehensive media preloading** that happens for **all participants** before the experiment starts.

### Preloading Architecture

#### When Preloading Occurs

Preloading happens in the `handleBackendSetupComplete` phase, **before** any other frontend setup:

```javascript
// From frontend/src/components/experiment/ExperimentRunner.svelte
async function handleBackendSetupComplete(event) {
  const { experimentData, requiresSync } = event.detail;

  // CRITICAL: Preload all media for ALL participants before anything else!
  logger.info("📥 Starting media preload for all participants");
  await preloadExperimentMedia(experimentData);
  logger.info("✅ Media preload complete");

  // Then setup LiveKit, sync socket, etc.
  // ...
}
```

#### What Gets Preloaded

The system preloads:
- **Images** from ShowImage components
- **Videos** from ShowVideo components
- **Role-specific media** from component roleConfigs

```javascript
async function preloadExperimentMedia(experimentData) {
  const imageUrls = [];
  const videoUrls = [];

  // Process each state in the experiment
  experimentData.states.forEach((state) => {
    const componentType = state.focusComponent?.type?.toLowerCase();
    const config = state.focusComponent?.config || {};

    // Extract image URLs
    if (componentType === "showimage" && config.imageUrl) {
      const processedUrl = processImageUrl(config.imageUrl);
      if (processedUrl) imageUrls.push(processedUrl);
    }

    // Extract video URLs
    if (componentType === "showvideo" && config.videoUrl) {
      videoUrls.push(config.videoUrl);
    }

    // Also check role-specific configurations
    if (state.focusComponent.roleConfigs) {
      Object.values(state.focusComponent.roleConfigs).forEach((roleConfig) => {
        if (roleConfig?.imageUrl) {
          const processedUrl = processImageUrl(roleConfig.imageUrl);
          if (processedUrl) imageUrls.push(processedUrl);
        }
        if (roleConfig?.videoUrl) {
          videoUrls.push(roleConfig.videoUrl);
        }
      });
    }
  });

  // Preload all unique URLs
  const uniqueImageUrls = [...new Set(imageUrls)];
  const uniqueVideoUrls = [...new Set(videoUrls)];

  if (uniqueImageUrls.length > 0) {
    await preloadImages(uniqueImageUrls);
  }

  if (uniqueVideoUrls.length > 0) {
    for (const url of uniqueVideoUrls) {
      await mediaPreloader.preloadVideo(url, { quickLoad: true });
    }
  }
}
```

### Why Preload All Participants?

Even though viewers don't have browser controls, **all participants benefit from preloading**:

1. **Eliminates race conditions** - Video is ready before sync socket sends initial state
2. **Reduces loading delays** - No waiting for video metadata when state changes
3. **Improves initial sync** - Viewers can seek immediately when receiving host position
4. **Prevents grey video boxes** - Video element renders properly from the start

## Event Flow and Timing

### Initialization Sequence

```
1. Backend Setup (All Participants Join)
   ↓
2. Backend sends: backend-experiment-setup-complete
   - Includes: experimentData, requiresSync flag
   ↓
3. Frontend Setup (Parallel)
   - Preload ALL media (images + videos) for ALL participants
   - Initialize LiveKit (if needed)
   - Connect sync socket (if requiresSync === true)
   ↓
4. ShowVideoComponent Mounts
   - Receives syncSocket prop (null or socket instance)
   - Sets up role-based event listeners
   - If multi-participant: joins sync room
   ↓
5. Video Playback Begins
   - Host: controls enabled, broadcasts state
   - Viewers: controls disabled, follow host
```

### Sync Event Loop (Multi-Participant)

```
Host:
  100ms interval → exp:time-update → Server → Viewers

Viewer:
  Receives exp:time-update
    ↓
  syncEngine.updateHostPosition()
    ↓
  checkSync() calculates drift
    ↓
  Adjust playback rate OR seek
    ↓
  Report metrics (1s interval)
```

## Loading State Management

The video component carefully manages loading states to prevent visual glitches:

```svelte
<script>
  let videoLoading = $state(true);
  let videoReady = $state(false);

  // Event handlers
  videoElement.addEventListener('loadedmetadata', () => {
    videoLoading = false;
    handleVideoLoaded(); // Apply start time, etc.

    // Host sends initial state when metadata is ready
    if (syncSocket && isParticipantHost()) {
      sendInitialState();
    }
  });

  videoElement.addEventListener('canplaythrough', () => {
    videoReady = true;
  });
</script>

<!-- Only show loading if video is truly loading -->
{#if videoLoading && !videoReady && (!videoElement || videoElement.readyState < 2)}
  <div class="video-loading-state">
    <div class="loading-spinner"></div>
    <p>Loading video...</p>
  </div>
{/if}

<!-- Hide video while loading to prevent grey box -->
<video
  bind:this={videoElement}
  class:video-hidden={videoLoading && !videoReady}
>
```

## Video Autoplay Behavior

### Autoplay Implementation

The system uses a single, streamlined autoplay function that works for both preloaded and non-preloaded videos:

```javascript
function attemptAutoplay() {
  // Only hosts need autoplay (viewers follow host commands)
  if (!isParticipantHost() || !videoElement || config.autoPlay === false) {
    return;
  }

  // Only try if video is paused and has enough data
  if (!videoElement.paused || videoElement.readyState < 3) {
    return;
  }

  videoElement.play().catch(e => {
    logger.warn("Autoplay was blocked by browser:", e);
    // This is expected behavior in some browsers - user must click play
  });
}
```

**Key Principles:**
- **No browser-specific hacks** - Maintains experiment timing integrity
- **Single autoplay path** - Eliminates race conditions
- **Respects browser policies** - Some browsers may block autoplay
- **Host-only** - Viewers don't need autoplay as they follow host commands

## Configuration

### Component Configuration

Configure the ShowVideo component in the experiment designer:

```javascript
{
  type: "ShowVideo",
  config: {
    videoUrl: "https://example.com/video.mp4",
    hostRole: "host",           // Which role controls playback
    controls: true,             // Show controls (host only)
    autoPlay: true,            // Auto-play when loaded (host only)
    startTime: 0,              // Start position (seconds)
    endTime: 0,                // End position (0 = play to end)
    videoSize: 50,             // Size (% of container)
    horizontalPosition: "center", // left, center, right
    verticalPosition: "center"    // upper, center, lower
  }
}
```

### Role-Specific Configurations

Different roles can see different videos:

```javascript
{
  type: "ShowVideo",
  config: {
    hostRole: "host"
  },
  roleConfigs: {
    host: {
      videoUrl: "https://example.com/host-view.mp4",
      controls: true
    },
    viewer: {
      videoUrl: "https://example.com/viewer-perspective.mp4",
      controls: false
    }
  }
}
```

## Performance Considerations

### Network Efficiency

1. **Conditional socket creation** - Only creates sync socket when multi-participant + video
2. **High-frequency updates** - 100ms broadcast interval balances precision and bandwidth
3. **Adaptive metrics** - Viewers report metrics every 1s, not every sync check

### Synchronization Precision

1. **Kalman filtering** - Predicts optimal position based on network conditions
2. **Network latency compensation** - Measures and adjusts for round-trip time
3. **Smooth rate adjustments** - PID controller prevents jarring speed changes
4. **Seek thresholds** - Only seeks when drift exceeds 600ms

### Resource Management

1. **Socket cleanup** - Properly disconnects sync socket on component destroy
2. **Event listener management** - Selective listener registration based on role
3. **Memory efficiency** - No sync engine for host, only for viewers

## Troubleshooting

### Common Issues

#### Viewers Not Syncing

**Symptoms:** Viewer video doesn't follow host position, drift shows 0.000s

**Possible Causes:**
1. Sync socket not connected
2. Event listeners not registered
3. Video not preloaded
4. **checkSync interval not started** (critical bug fixed in Dec 2024)

**Debug Steps:**
```javascript
// Check sync socket connection
console.log('Sync socket:', syncSocket?.connected);

// Check sync engine
console.log('Sync engine:', syncEngine);

// Check video ready state
console.log('Video readyState:', videoElement?.readyState);

// Verify checkSync is running (should see periodic logs)
// Look for "Sync check:" logs in console
```

**Solution:** Ensure `syncInterval = setInterval(checkSync, 100)` is called for viewers after sync engine initialization.

#### Video Not Loading

**Symptoms:** Grey box or loading spinner persists

**Possible Causes:**
1. Video URL inaccessible
2. CORS issues
3. Preloading failed

**Debug Steps:**
```javascript
// Check preload stats
const stats = mediaPreloader.getStats();
console.log('Preload stats:', stats);

// Check video element
console.log('Video src:', videoElement?.src);
console.log('Video error:', videoElement?.error);
```

#### Sync Drift Too Large

**Symptoms:** Viewer video constantly seeking or out of sync

**Possible Causes:**
1. High network latency
2. Video buffering issues
3. Sync parameters need tuning

**Debug Steps:**
```javascript
// Check sync metrics
console.log('Drift:', syncState.drift);
console.log('Network latency:', syncState.networkLatency);
console.log('Playback rate:', syncState.playbackRate);
```

### Debug Mode

Enable debug overlay in ShowVideo component configuration:

```javascript
{
  config: {
    showDebug: true
  }
}
```

This displays:
- Current role (Host/Viewer)
- Sync status
- Drift measurement
- Host vs viewer time

## Code Examples

### Using ShowVideoComponent

```svelte
<!-- In ExperimentRunner.svelte -->
<script>
  let syncSocket = $state(null);

  // After backend setup complete
  if (requiresSync) {
    syncSocket = await connectSyncSocketWithRoom(roomId);
  }
</script>

<!-- Render video component with sync socket prop -->
<ShowVideoComponent
  id={focusComponent.id}
  config={focusComponent.config}
  syncSocket={syncSocket}
  oncomplete={handleComplete}
/>
```

### Manual Sync Socket Connection

```javascript
import { connectSyncSocketWithRoom } from '$lib/network/socketClient.js';

// Connect sync socket for a specific room
try {
  const socket = await connectSyncSocketWithRoom(roomId);
  console.log('Sync socket connected:', socket.id);
} catch (error) {
  console.error('Failed to connect sync socket:', error);
}
```

### Checking Sync Requirements

```javascript
import { experimentRequiresSync } from '$lib/media/deviceManager.svelte.js';

// Determine if sync is needed
const needsSync = experimentRequiresSync(experimentData, participantCount);

if (needsSync) {
  console.log('This experiment requires video synchronization');
} else {
  console.log('No video sync needed');
}
```

## Recent Updates

### December 2024 Fixes

- **Fixed critical viewer sync bug** - Added missing `setInterval(checkSync, 100)` for viewers
- **Streamlined autoplay logic** - Single function for both preloaded and non-preloaded videos
- **Removed browser-specific hacks** - No more Firefox workarounds or delays
- **Fixed video end transitions** - Properly triggers state transitions on video completion
- **Improved sync indicator** - No longer auto-hides, shows throughout experiment

## HLS Adaptive Streaming Integration

As of December 2024, all uploaded videos are automatically transcoded to HLS (HTTP Live Streaming) format. This significantly improves synchronization reliability.

### HLS Benefits for Synchronization

| Aspect | Progressive Download | HLS Streaming |
|--------|---------------------|---------------|
| Buffering events | Frequent, unpredictable | Rare, handled gracefully |
| Sync recovery | May require large seek | Quick quality adaptation |
| Bandwidth variation | Causes stalls | Quality switches smoothly |
| Initial sync | Delayed by buffering | Near-instant with preload |

### How HLS Works with Sync

1. **Manifest Preloading**: HLS manifest is fetched during media preload phase
2. **Segment-Based Seeking**: Seeks go to segment boundaries, then fine-tune
3. **Quality Adaptation**: Bitrate changes don't interrupt sync
4. **Same Video API**: HLS.js provides standard HTML5 video element API

### Implementation Details

HLS integration is transparent to the sync engine:

```javascript
// HLS.js attaches to standard video element
const hls = new Hls();
hls.loadSource(hlsUrl);
hls.attachMedia(videoElement);

// Sync engine uses the same API
videoElement.currentTime = hostTime;  // Works with HLS
videoElement.playbackRate = 1.02;     // Works with HLS
```

### Files Involved

- `frontend/src/lib/media/hlsPlayer.js` - HLS.js wrapper and initialization
- `frontend/src/components/experiment/ShowVideoComponent.svelte` - HLS detection and player setup
- `frontend/src/lib/media/mediaPreloader.js` - HLS manifest preloading

### HLS Status in Firestore

Videos track transcoding status:

```javascript
{
  url: "s3://bucket/videos/123.mp4",           // Original
  hlsUrl: "https://cdn/videos/123/master.m3u8", // HLS playlist
  hlsStatus: "ready",                           // pending | processing | ready | failed
  hlsResolutions: ["360p", "480p", "720p"]      // Available qualities
}
```

### Fallback Behavior

If HLS is unavailable (failed transcoding or pre-HLS video), the system falls back to progressive download:

```javascript
function getVideoSource(videoData) {
  if (videoData.hlsUrl && videoData.hlsStatus === 'ready') {
    return videoData.hlsUrl;  // Use HLS
  }
  return videoData.url;       // Fallback to progressive
}
```

## Future Improvements

Potential enhancements to the synchronization system:

1. **Adaptive sync parameters** - Automatically adjust based on network conditions
2. **Sub-second precision** - Reduce drift threshold for even tighter sync
3. **Bandwidth optimization** - Compress time update payloads
4. **Quality of Service monitoring** - Track and report sync health metrics

## Related Documentation

- [Architecture Overview](./architecture/overview.md)
- [Horizontal Scaling](./architecture/horizontal-scaling.md)
- [Socket.IO Architecture](/Users/lukechang/Github/hyperstudy/frontend/src/lib/network/socketClient.js) (inline comments)
