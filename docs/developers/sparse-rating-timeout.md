# Sparse Rating Timeout Architecture

## Overview

The sparse rating system uses a **server-authoritative timeout** approach, similar to timed state transitions. The server is the source of truth for when timeouts expire, while clients provide smooth countdown UI feedback.

## Design Principles

1. **Server is Authoritative** - Server decides when timeout expires and triggers resume
2. **Client Displays Countdown** - Smooth local animation without network overhead
3. **Client Auto-Submit is Fast Path** - If user completes early, rating is submitted immediately
4. **Server Timeout is Failsafe** - If client fails or hangs, server ensures completion
5. **Single Source of Truth** - One configuration location per video/state

## Architecture

### Server-Side (`sparseRatingSyncHandler.js`)

When a pause is initiated:
1. Get video-specific `responseTimeLimit` from pause schedule
2. Start `setTimeout` for that duration
3. Store timeout reference in room state
4. When timeout fires:
   - Auto-mark all non-responded participants as completed (with null ratings)
   - Trigger resume flow (same as if all participants responded)
   - Send `exp:sparse-rating-resume` event to all clients
5. If all participants respond early, clear the timeout

### Client-Side (`SparseRatingComponent.svelte`)

When a pause event is received:
1. Display modal with rating component
2. Run local countdown timer for smooth UI
3. If countdown reaches 0: call `handleRatingComplete({})` (auto-submit null response)
4. If user completes early: call `handleRatingComplete(data)` (submit actual response)
5. Listen for `exp:sparse-rating-resume` event from server
6. Server resume event closes modal regardless of client state

## Configuration

### Single Source: Per-Video/State Configuration

Timeout is configured **only** in the per-state configuration:

```javascript
globalComponents: {
  sparserating: {
    enabled: true,
    config: {
      enabledStates: ['state1', 'state2'],
      stateConfigurations: {
        'state1': {
          responseTimeLimit: 15000,  // ← ONLY place to configure timeout
          ratingComponent: {
            type: 'vasrating',
            config: { /* ... */ }
          },
          // ... other video-specific settings
        },
        'state2': {
          responseTimeLimit: 30000,  // Different timeout for different video
          ratingComponent: {
            type: 'multiplechoice',
            config: { /* ... */ }
          }
        }
      }
    }
  }
}
```

**Important:**
- Each enabled state **must** have a `responseTimeLimit` configured
- Different videos can have different timeout values
- No global fallback - configuration must be explicit

## Timeout Flow

### Single-Participant Experiments

1. Host triggers pause at scheduled time
2. Server starts timeout (e.g., 15 seconds)
3. Client displays modal and countdown
4. **Fast path**: User completes before timeout
   - Client submits rating immediately
   - Server receives response, clears timeout
   - Server sends resume event, client closes modal
5. **Failsafe path**: Timeout expires
   - Server auto-marks participant as completed (null rating)
   - Server sends resume event, client closes modal
   - Video resumes automatically

### Multi-Participant Experiments

1. Host triggers pause at scheduled time
2. Server starts timeout (e.g., 15 seconds)
3. All clients display modal and countdown
4. **Fast path**: All participants complete before timeout
   - Each client submits rating when done
   - Server receives all responses, clears timeout
   - Server sends resume event to all clients
   - All videos resume in sync
5. **Partial completion**: Some respond, some timeout
   - Responding clients submit ratings
   - Server waits for timeout to expire
   - Server auto-marks non-responded participants as completed (null ratings)
   - Server sends resume event to all clients
   - All videos resume in sync
6. **Failsafe path**: No one responds (all clients hang)
   - Server timeout expires
   - Server auto-marks all participants as completed (null ratings)
   - Server sends resume event to all clients
   - All videos resume in sync

## Benefits

### Reliability
- **No hung states**: Server guarantees completion even if clients fail
- **Multi-participant safe**: One client failure doesn't block others
- **Network resilient**: Client disconnection doesn't prevent resume

### Performance
- **Smooth countdown**: Client-side timer provides responsive UI
- **Minimal network traffic**: Only submit/resume events, no polling
- **Fast path optimization**: Early completions don't wait for timeout

### Maintainability
- **Single config location**: No confusion about timeout values
- **Clear authority model**: Server decides timing, client displays UI
- **Follows existing patterns**: Same approach as timed state transitions
- **Easy debugging**: Server logs show exact timeout events

## Implementation Details

### Room State Structure

```javascript
this.roomStates.set(roomId, {
  config: sparseRatingConfig,
  pauseSchedule,
  currentVideoId: null,
  currentStateId: null,
  currentPauseIndex: -1,
  participantResponses: new Map(),
  pauseStartTime: null,
  isPaused: false,
  pauseTimeout: null,  // ← Server timeout reference
  requiresSync
});
```

### Timeout Handler

```javascript
const timeoutHandler = () => {
  // Auto-complete all non-responded participants
  for (const [participantId, response] of state.participantResponses.entries()) {
    if (!response.completed) {
      response.completed = true;
      response.responseTime = Date.now() - state.pauseStartTime;
      response.data = null; // Null rating for timeout
    }
  }

  // Trigger resume flow
  const resumeInfo = this.getResumeInfo(roomId);
  this.experimentStateServer.handleSparseRatingTimeout(roomId, resumeInfo);
};

state.pauseTimeout = setTimeout(timeoutHandler, responseTimeLimit);
```

### Cleanup

Timeout must be cleared in multiple scenarios:
1. **Early completion**: All participants respond before timeout
2. **Manual resume**: Resume triggered by other means
3. **Room cleanup**: Experiment ends or room is destroyed
4. **Video change**: New video starts before timeout expires

## Troubleshooting

### Modal doesn't close after countdown

**Symptom**: Modal stays visible, countdown shows 0:00

**Diagnosis**:
1. Check server logs for timeout firing
2. Check client logs for `exp:sparse-rating-resume` event
3. Verify `responseTimeLimit` is configured in state config

**Common causes**:
- Server timeout not implemented (pre-fix)
- Client not listening for resume event
- Network disconnection between client and server

### Different participants see different countdown times

**Symptom**: Participants have different countdown durations

**Diagnosis**:
1. Check experiment config for `responseTimeLimit` value
2. Verify all clients receive same pause event data

**Common causes**:
- Clients joined at different times (normal - countdown is relative)
- Different state configurations (check `stateConfigurations` keys)

### Resume happens before countdown reaches zero

**Symptom**: Modal closes early, video resumes before expected

**Diagnosis**:
1. Check if `waitForAllParticipants: false` is configured
2. Check if other participants completed early

**Expected behavior**:
- If `waitForAllParticipants: false`, each participant resumes independently
- If `waitForAllParticipants: true` (default), all wait for timeout or completion

## Related Documentation

- [Video Synchronization](./video-synchronization.md) - How video sync works with sparse rating
- [Experiment State Management](./experiment-state-management.md) - Overall state transition system
- [Sparse Rating Configuration](../experimenters/sparse-rating.md) - Experimenter guide to configuring sparse rating

## Version History

- **v0.4.2** (2025-01-20): Initial implementation of server-authoritative timeout
