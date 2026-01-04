---
title: Experiment Tracking
sidebar_position: 6
---

# Experiment Tracking

Experiment Tracking provides real-time monitoring of active experiment sessions, allowing you to observe participant progress and intervene when necessary. This is essential for running multi-participant studies where you need visibility into what's happening across all sessions.

## Overview

With Experiment Tracking, you can:

- **Monitor all active sessions** in real-time
- **See participant status** (connected, disconnected, completed)
- **Identify stuck sessions** that may need intervention
- **Control experiments** by advancing, resetting, or ending sessions
- **Track progress** through experiment states

## Accessing Experiment Tracking

1. Log in to HyperStudy as an experimenter
2. Navigate to the **Experimenter Dashboard**
3. Click on the **"Tracking"** tab in the navigation

You'll see a table of all your active experiment sessions.

## Understanding the Session Table

The tracking table displays the following information for each active session:

| Column | Description |
|--------|-------------|
| **Status** | Session state badge (Active, Waiting, Stuck, Completed, Abandoned) |
| **Experiment** | Name of the experiment being run |
| **Room ID** | Unique identifier for the session (truncated for display) |
| **Participants** | Visual pills showing each participant with role and status |
| **Current State** | Which state in the experiment sequence (e.g., "Intro (1/5)") |
| **Component** | Type of component currently displayed |
| **Time in State** | How long participants have been in the current state |

### Status Badges

| Badge | Meaning |
|-------|---------|
| **Active** | Session is running normally |
| **Waiting** | Waiting for participants to join or ready up |
| **Stuck** | Participants have been in the same state for over 10 minutes |
| **Completed** | Experiment finished successfully |
| **Abandoned** | Session was ended or participants disconnected |

### Participant Pills

Each participant is shown as a colored pill with:

- **Role Badge**: H (Host), V (Viewer), or P (Participant)
- **Color Coding**: Different colors for different roles
- **Status Indicator**: Shows if participant is active, completed, or disconnected

Example: `[H] Alice` `[V] Bob` shows Host Alice and Viewer Bob.

## Filtering and Sorting

### Search

Use the search box to filter sessions by experiment name.

### Sorting

Click on column headers to sort the table. By default, sessions are sorted by **Time in State** (descending) to surface potentially stuck sessions at the top.

### Auto-Refresh

Toggle the **Auto-Refresh** switch to enable or disable real-time updates:
- **ON**: Sessions update automatically every few seconds
- **OFF**: Data only updates when you click Refresh

## Session Controls

Each session row has action buttons for intervention:

### Advance

Moves all participants to the next state in the experiment.

**When to use:**
- A participant is stuck and can't proceed
- You need to skip a state during testing
- Technical issues prevent normal progression

**Note:** Use sparingly - advancing bypasses normal experiment flow.

### Reset

Returns the session to the first state of the experiment.

**When to use:**
- You need to restart the experiment
- Something went wrong early and you want a fresh start
- Testing different paths through the experiment

**Warning:** This clears current progress - a confirmation dialog will appear.

### End

Terminates the experiment and shows participants the completion screen.

**When to use:**
- You need to stop a session immediately
- Technical issues make continuation impossible
- Participants need to exit early

**Danger:** This action cannot be undone - a confirmation dialog will appear.

## Identifying and Handling Issues

### Stuck Sessions

Sessions are marked as **Stuck** when participants have been in the same state for more than 10 minutes. This could indicate:

- A participant stepped away
- Technical difficulties
- Confusion about what to do next
- A bug in the experiment

**Actions to take:**
1. Check if the component requires specific input
2. Try the **Advance** button to move to the next state
3. If the issue persists, consider **End**ing the session

### Disconnected Participants

If a participant's pill shows "disconnected" status:

1. Wait a moment - they may reconnect automatically
2. Check if other participants can continue
3. If the session is stuck, use **Advance** or **End**

### Abandoned Sessions

Sessions become "Abandoned" when:
- All participants disconnect
- The session times out
- An admin ended the session

Abandoned sessions automatically hide from the tracking view but data is preserved.

## Multi-Participant Session Monitoring

For experiments with multiple participants:

### Viewing All Participants

The Participants column shows all participants in the session with their:
- Assigned role (Host, Viewer, etc.)
- Connection status
- Individual completion state

### Waiting for Participants

When not all expected participants have joined:
- Status shows as "Waiting"
- Participant count shows current/expected (e.g., "2/3")
- The experiment won't start until all participants are ready

### Synchronized Progress

In multi-participant experiments:
- All participants are shown in the same current state
- Time in state reflects when the group entered the state
- Advancing moves all participants together

## Best Practices

1. **Monitor actively during data collection**: Keep the Tracking tab open during live sessions

2. **Enable auto-refresh**: Real-time updates help you catch issues quickly

3. **Sort by time in state**: Surfaces potentially problematic sessions at the top

4. **Intervene sparingly**: Only use controls when necessary - let experiments run naturally when possible

5. **Document interventions**: Note when and why you intervened for your records

6. **Test intervention flows**: Practice using Advance/Reset/End during pilot testing

## Access Control

- **Experimenters** see only sessions for experiments they own or have access to
- **Admins** can see all sessions across all experiments
- Only users with appropriate permissions can use session controls

## Technical Notes

### Real-Time Updates

Experiment Tracking uses Server-Sent Events (SSE) for real-time updates. If your connection drops:
- An error message will appear briefly
- The system automatically reconnects
- Manual refresh is available as a fallback

### Session Data Persistence

- Active session data is shown in real-time
- Completed/abandoned sessions hide from tracking view
- All session data remains available in the Data tab for analysis

### Cross-Pod Compatibility

In distributed deployments, tracking works across all server instances:
- Sessions are visible regardless of which server handles them
- Controls work for any session (may have slight delay for cross-server actions)

## Troubleshooting

### Sessions Not Appearing

- Verify the experiment is running (not in draft mode)
- Check that participants have connected
- Ensure you have permission to view the experiment
- Try manual refresh

### Controls Not Working

- Check your internet connection
- Verify you have permission to control sessions
- Try refreshing the page
- For stale sessions, the system will attempt automatic cleanup

### Real-Time Updates Stopped

- Check the Auto-Refresh toggle is ON
- Look for connection error messages
- Try toggling Auto-Refresh off and on
- Refresh the page if issues persist

## Next Steps

- [Data Management](./data-management.md) - Access and analyze your experiment data
- [Experiment Design](./experiment-design/overview.md) - Create and modify experiments
- [Collaboration](./collaboration.md) - Share experiments with team members
