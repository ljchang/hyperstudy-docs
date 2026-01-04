# Universal Reconnection System Implementation

## Overview

This document describes the implementation of a universal reconnection system that works for both HyperStudy platform participants and Prolific participants. The system allows participants to automatically reconnect to experiments after disconnections, with a unified user experience across all participant types.

## Problem Statement

Previously, the reconnection flow only worked for HyperStudy platform participants:
- Regular participants could see a reconnection banner in their dashboard
- Prolific participants had no way to reconnect after disconnection
- One-time Prolific access tokens prevented participants from re-entering via the original link
- Timeout scenarios forced experiment termination even when participants wanted to continue

## Solution Architecture

### Key Design Decisions

1. **Universal Reconnection Overlay**: Single component that handles reconnection for all participant types
2. **Auto-Redirect from Dashboard**: Dashboard automatically redirects to experiment route when active session detected
3. **Session-Based Authentication**: Prolific participants can reuse existing sessions without token validation
4. **Multiple Return Paths**: Support both Prolific link clicks AND direct URL navigation
5. **Abandoned State Tracking**: New completion reason for participants who choose to leave

### Components

#### Frontend Components

1. **ReconnectionOverlay.svelte** (`/frontend/src/components/experiment/ReconnectionOverlay.svelte`)
   - Full-screen modal overlay with countdown timer
   - 5-second auto-reconnect countdown (configurable)
   - "Reconnect Now" and "Leave Experiment" buttons
   - Handles different room states: active, paused, ended, timed_out
   - Accessible UI matching ExperimentPauseOverlay style

2. **Experiment Route Updates** (`/frontend/src/routes/experiment.svelte`)
   - Detects active sessions on mount
   - Shows ReconnectionOverlay when participant has active session but isn't connected
   - Handles reconnect action: re-initializes socket and loads experiment
   - Handles leave/abandon action: marks session as abandoned
   - Works for both regular and Prolific participants

3. **Participant Dashboard Updates** (`/frontend/src/routes/participant.svelte`)
   - Removed active session banner UI
   - Added auto-redirect logic: detects active session → redirects to `/experiment?roomId=X&experimentId=Y`
   - Simplified codebase (removed ~100 lines of banner code and CSS)

4. **Prolific Gateway Updates** (`/frontend/src/routes/prolific-gateway.svelte`)
   - Checks for existing Firebase authentication before token validation
   - Checks for active sessions for the experiment
   - Redirects to experiment route if active session exists
   - Supports returning via Prolific link even after initial authentication

5. **Session Service Updates** (`/frontend/src/lib/services/participantSessionService.js`)
   - Added "ABANDONED" as valid completion outcome
   - Used when participant chooses to leave during reconnection

#### Backend Components

1. **ExperimentStateServer Updates** (`/backend/src/experiment/experimentStateServer.js`)

   **New Socket Events:**
   - `check-room-status`: Returns current room status (active/ended/paused/timed_out)
   - `abandon-experiment`: Handles participant abandoning experiment during reconnection

   **New Handler Functions:**
   - `handleCheckRoomStatus()`: Checks if room exists in memory or Firebase
   - `handleAbandonExperiment()`: Marks participant as abandoned, ends multi-participant experiments

   **Updated Functions:**
   - `endExperiment()`: Now stores completion reason in Firebase (`completionReason` field)
   - Participations updated with `completionOutcome` field

2. **Prolific Routes Updates** (`/backend/src/routes/prolificRoutes.js`)

   **verify-access Endpoint Updates:**
   - Checks if participant already has Firebase account (UID: `prolific_{PID}`)
   - Checks if participant has active session for the experiment
   - If active session exists: bypasses token validation, creates fresh custom token
   - Returns `isReconnection: true` flag for reconnection scenarios
   - Otherwise: continues with normal token validation and usage tracking

3. **Prolific Service Updates** (`/backend/src/services/prolificService.js`)
   - Added ABANDONED completion code to study creation
   - Maps ABANDONED outcome to Prolific completion code
   - Uses MANUALLY_REVIEW action for abandoned completions

## User Flows

### Regular Participant Reconnection Flow

1. Participant gets disconnected (network issue, browser closed, etc.)
2. Participant navigates to `/participant` dashboard
3. Dashboard detects active session → auto-redirects to `/experiment?roomId=X&experimentId=Y`
4. Experiment route detects active session + not connected → shows ReconnectionOverlay
5. ReconnectionOverlay shows 5-second countdown with reconnect/leave options
6. Options:
   - **Wait 5 seconds**: Auto-reconnects to experiment
   - **Click "Reconnect Now"**: Immediately reconnects
   - **Click "Leave Experiment"**: Marks session as ABANDONED, returns to dashboard

### Prolific Participant Reconnection Flow (via Prolific Link)

1. Participant gets disconnected
2. Participant clicks original Prolific study link
3. Backend `/api/prolific/gateway/:experimentId` receives request
4. Gateway validates token, creates access token
5. Frontend prolific-gateway route checks for existing Firebase auth
6. Detects active session for experiment → redirects to `/experiment?roomId=X`
7. Reconnection Overlay handles reconnection (same as regular participant)

### Prolific Participant Reconnection Flow (via Browser History)

1. Participant gets disconnected
2. Participant uses browser history/bookmarks to navigate back
3. URL is `/experiment?roomId=X&experimentId=Y` (saved in browser)
4. Experiment route detects Firebase auth + active session
5. ReconnectionOverlay shows reconnection options
6. Participant reconnects or leaves

### Abandonment Flow (Prolific)

1. Participant chooses "Leave Experiment" on ReconnectionOverlay
2. Frontend marks session as `completed` with outcome `ABANDONED`
3. Frontend shows ProlificCompletion component
4. Backend endExperiment called with reason `ABANDONED`
5. Participant sees completion code (ABANDONED code)
6. Auto-redirects to Prolific with completion code after 5 seconds

## Data Model Changes

### Firebase Collections

#### participant_sessions

Added fields:
- `completionOutcome`: String - Completion reason (SUCCESS, TIMEOUT, TECHNICAL, NO_CONSENT, DISCONNECT_TIMEOUT, ABANDONED)

#### rooms

Added fields:
- `completionReason`: String - Why experiment ended (SUCCESS, DISCONNECT_TIMEOUT, ABANDONED, etc.)

#### participations

Added fields:
- `status`: Added "abandoned" as valid status
- `abandonedAt`: Timestamp - When participant abandoned
- `completionOutcome`: String - Matches session completion outcome

### Prolific Integration

#### prolific_access_tokens

Behavior change:
- Tokens can be "reused" if participant has active session
- `used: true` still set on first authentication
- Reconnection bypasses token usage check

#### Prolific Study Completion Codes

Added new completion code type:
- `ABANDONED`: Used when participant chose to leave experiment
- Action: `MANUALLY_REVIEW`

## Configuration

### Disconnect & Reconnection Settings (Configurable in UI)

Experimenters can configure disconnect and reconnection timing in the Experiment Designer > Metadata tab under "Disconnect & Reconnection Settings".

**Disconnect & reconnection behavior is always enabled** for all experiments (single and multi-participant). When a participant disconnects, the experiment pauses and shows other participants (if any) a countdown timer.

**Two Configurable Timing Parameters:**

1. **Disconnect Timeout (seconds)**
   - Range: 10-∞ seconds
   - Default: 60 seconds
   - What it does: How long to wait for a disconnected participant before ending the experiment
   - Applies to: All experiments

2. **Auto-Reconnect Delay (seconds)**
   - Range: 1-60 seconds
   - Default: 5 seconds
   - What it does: Countdown before automatically reconnecting when a participant returns
   - Applies to: All experiments (shown in reconnection overlay)

Data structure in Firebase:
```javascript
experiment: {
  disconnectTimeout: {
    durationMs: 60000,              // 60 seconds - timeout before ending
    autoReconnectDelay: 5000        // 5 seconds - countdown before auto-reconnect
  }
}
```

**Migration:**
All experiments are migrated to have this structure. Run the migration script to ensure consistency:
```bash
node backend/scripts/migrate-disconnect-reconnection-settings.js
```

The migration:
- Removes the `enabled` flag (no longer used)
- Removes `sessionExpiryMs` (not implemented)
- Adds default values for `durationMs` (60000) and `autoReconnectDelay` (5000) if missing
- After migration, code assumes these fields always exist (no fallbacks needed)

**Behavior for all experiments:**
- Participant disconnects → Experiment pauses immediately
- Other participants (if any) see ExperimentPauseOverlay with countdown
- Disconnected participant returns → Sees ReconnectionOverlay with auto-reconnect countdown
- After auto-reconnect delay → Experiment resumes automatically
- If timeout expires before reconnect → Experiment ends with `DISCONNECT_TIMEOUT` reason

## Implementation Summary

### Files Modified

**Frontend:**
- `/frontend/src/components/experiment/ReconnectionOverlay.svelte` (NEW)
- `/frontend/src/components/experiment/ExperimentRunner.svelte`
- `/frontend/src/components/admin/experiment/ExperimentMetadata.svelte` (NEW: Configuration UI)
- `/frontend/src/routes/experiment.svelte`
- `/frontend/src/routes/participant.svelte`
- `/frontend/src/routes/prolific-gateway.svelte`
- `/frontend/src/lib/services/participantSessionService.js`

**Backend:**
- `/backend/src/experiment/experimentStateServer.js`
- `/backend/src/routes/prolificRoutes.js`
- `/backend/src/services/prolificService.js`

### Key Metrics

- **Lines Added**: ~600
- **Lines Removed**: ~150 (dashboard banner, unused handlers)
- **Net Change**: +450 lines
- **New Components**: 1 (ReconnectionOverlay)
- **New UI Sections**: 1 (Reconnection Settings in Metadata tab)
- **New Socket Events**: 2 (check-room-status, abandon-experiment)
- **New Completion Reasons**: 1 (ABANDONED)
- **New Configuration Options**: 2 (autoReconnectDelay, sessionExpiryMs)

## Future Enhancements

1. **Session Expiry Enforcement**: Implement automatic session expiry after configured duration
2. **Reconnection Analytics**: Track reconnection success rates, timing, and abandonment reasons
3. **Progressive Timeout**: Increase timeout duration for repeated disconnections within same session
4. **Offline Detection**: Detect offline state vs connection issues, show appropriate messaging
5. **Connection Quality Indicator**: Show real-time connection quality during experiment
6. **Custom Messaging**: Allow experimenters to customize reconnection overlay messages
7. **Backend Room Status Check**: Implement the TODO for checking actual room status from backend

---

**Date**: 2025-01-04
**Status**: ✅ Implementation Complete (including UI configuration)
**Version**: 1.1.0
