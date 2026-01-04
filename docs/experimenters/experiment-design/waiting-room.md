---
id: waiting-room
title: Waiting Room System
sidebar_label: Waiting Room
---

# Waiting Room System

The HyperStudy waiting room system automatically matches participants and assigns them to experiment sessions. This guide explains how the waiting room works and how to configure it for your experiments.

## Overview

The waiting room is a virtual space where participants wait to be matched with others for multi-participant experiments. When enough participants are present, the system automatically:

1. Matches participants based on your experiment requirements
2. Assigns participants to available roles (if configured)
3. Creates a new experiment room
4. Notifies all matched participants to join

### Purpose and Benefits

- **Automatic Matching**: No need to manually coordinate participant scheduling
- **Role-Based Assignment**: Automatically assigns participants to different experimental roles
- **Real-time Updates**: Participants see live status of waiting and matching progress
- **Seamless Integration**: Works with both direct recruitment and Prolific integration
- **Connection Resilience**: Handles temporary disconnections gracefully

## Prerequisites for Entering Waiting Room

**IMPORTANT:** Participants must complete **both** consent and instructions before they can enter the waiting room. The waiting room is not the first stage participants encounter.

### Required Completion Steps

```
Lobby → Consent → Instructions → [WAITING ROOM] → Setup → Experiment
                                  ↑ You are here
```

**Entry Requirements:**
- ✅ **Consent form completed** (required gate #1)
- ✅ **All instruction pages viewed** (required gate #2)
- ✅ **Comprehension checks passed** (if enabled and required)
- ✅ Participant authenticated
- ✅ Experiment is active

**Cannot Enter If:**
- ❌ Consent not provided
- ❌ Instructions not completed
- ❌ Comprehension checks failed (max attempts exceeded)
- ❌ Experiment is inactive or full
- ❌ Participant already in a session

**Why These Prerequisites Matter:**
1. **Ethical Compliance**: Consent must be obtained before any experiment activity
2. **Informed Participation**: Instructions ensure participants know what to expect
3. **Data Quality**: Comprehension ensures participants understand tasks
4. **Fair Matching**: All participants enter with same preparation level
5. **Reduced Dropouts**: Well-prepared participants less likely to exit

:::tip Participant Flow
The waiting room is the **fourth stage** in the participant journey. For a complete overview, see the [Participant Flow Guide](./participant-flow.md).
:::

## How Participants Enter Waiting Rooms

Participants enter the waiting room **only after completing consent and instructions**. The entry path depends on how they accessed the experiment:

### 1. Direct Experiment Links

**Flow:**
1. Participant clicks experiment URL
2. Authenticates (if needed)
3. **Completes consent form**
4. **Completes all instruction pages**
5. **Passes comprehension checks** (if required)
6. Enters waiting room automatically

**For Multi-Participant Experiments:**
- Placed in waiting room queue
- Waits for matching

**For Single-Participant Experiments:**
- Waiting room bypassed
- Proceeds directly to setup

### 2. From the Participant Dashboard

**Flow:**
1. Participant logs into dashboard
2. Views available experiments
3. Clicks "Join" on experiment
4. **Completes consent form** (if not already done)
5. **Completes instructions** (if not already done)
6. Enters waiting room

### 3. Through Prolific Integration

**Flow:**
1. Participant clicks Prolific study link
2. Automatically authenticated with Prolific ID
3. **Completes consent form** (no bypassing)
4. **Completes instructions** (no bypassing)
5. Enters waiting room for matching

**Note:** Prolific participants complete same prerequisites as all others.

### 4. Private Enrollment

Experimenters can manually assign specific participants, but prerequisites still apply:
- Consent still required
- Instructions still required
- Can skip waiting room (direct to experiment session)

## Automatic Participant Matching

The matching algorithm works as follows:

### Matching Process

1. **Participant Joins**: When a participant enters the waiting room, their presence is registered
2. **Threshold Check**: The system continuously monitors if enough participants are waiting
3. **Match Creation**: Once the required number is reached, participants are matched together
4. **Room Assignment**: A new experiment room is created and participants are notified
5. **Auto-Join Countdown**: Participants have 10 seconds to prepare before automatically joining

### Matching Strategies

Currently, the system supports:

- **First-Come-First-Served** (Default): Participants are matched in the order they join
- **Role-Based Matching**: Ensures the correct distribution of roles when experiments require specific participant counts per role

## Role-Based Assignment

When your experiment defines multiple roles, the waiting room automatically assigns participants to roles.

### How Role Assignment Works

1. **Role Pool Creation**: The system creates a pool of available roles based on your configuration
2. **Random Distribution**: Participants are randomly assigned roles from the pool
3. **Count Enforcement**: The system ensures each role has the correct number of participants
4. **Assignment Notification**: Participants receive their role assignment with the room notification

### Example Role Configuration

If your experiment has:

- Role A: 2 participants
- Role B: 1 participant

The waiting room will:

1. Wait for 3 participants total
2. Randomly assign 2 to Role A and 1 to Role B
3. Create the room with these assignments

## Waiting Room Customization

### Visual Customization

The waiting room uses a full-screen loading animation that can be customized through the experiment's global components:

```javascript
// In experiment configuration
config: {
  message: "Waiting for other participants...",
  readyMessage: "Participants found! Starting experiment..."
}
```

### Participant Information Display

The waiting room shows:

- Current waiting time
- Number of participants waiting
- Number of participants needed
- Progress toward matching

### Timeout Configuration

Configure how long participants wait before timing out:

- Default: No timeout (participants can wait indefinitely)
- Can be configured per experiment in recruitment settings

## Real-time Status Updates

The waiting room provides live updates through WebSocket connections:

### For Participants

- **Waiting Count**: See how many others are waiting
- **Match Progress**: Visual indication of progress toward required participant count
- **Connection Status**: Immediate feedback if connection is lost
- **Assignment Notification**: Instant notification when matched with others

### For Experimenters

- **Monitoring Dashboard**: View all active waiting rooms
- **Participant Details**: See who is waiting and for how long
- **Manual Intervention**: Ability to manually create matches if needed

## Handling Timeouts and Disconnections

### Temporary Disconnections

- **Grace Period**: Brief disconnections (< 30 seconds) don't remove participants
- **Automatic Reconnection**: Participants automatically rejoin their waiting position
- **State Preservation**: Waiting time and position are maintained

### Permanent Disconnections

- **Removal from Queue**: Participants who disconnect for extended periods are removed
- **Notification**: Other waiting participants see updated counts
- **Re-matching**: System continues matching with remaining participants

### Browser/Tab Closing

- **Immediate Detection**: System detects when participants close their browser
- **Queue Update**: Waiting counts update in real-time for others
- **Clean Removal**: No "ghost" participants in the waiting room

## Integration with Prolific

The waiting room seamlessly integrates with Prolific recruitment:

### Automatic Authentication

- Prolific participants are automatically authenticated using their Prolific ID
- No additional login required
- Participant metadata (Prolific ID) is preserved for data analysis

### Study Completion Handling

- Successful matches trigger Prolific completion URLs
- Failed matches or timeouts redirect to appropriate Prolific return codes
- Automatic bonus payment calculations based on participation

### Special Considerations

- **Preview Mode**: Prolific preview participants can view but not join waiting rooms
- **Return Codes**: Proper handling of all Prolific return scenarios
- **Data Tracking**: Prolific IDs are linked to experimental data

## Experimenter Controls

### Recruitment Settings

Configure waiting room behavior in the Experiment Designer:

1. **Required Participants**: Set the total number needed
2. **Matching Strategy**: Choose how participants are matched
3. **Role Distribution**: Define roles and counts
4. **Timeout Settings**: Configure maximum wait times

## Best Practices

### Minimizing Wait Times

1. **Schedule Sessions**: Communicate specific times for participants to join
2. **Batch Recruitment**: Send invitations to groups simultaneously
3. **Set Reasonable Requirements**: Lower participant counts reduce wait times
4. **Use Recruitment Windows**: Define specific time periods for data collection

### Communication Strategies

1. **Clear Instructions**: Explain the waiting process in recruitment materials
2. **Time Estimates**: Provide realistic expectations for wait times
3. **Progress Indicators**: Enable visual feedback in the waiting room
4. **Alternative Contact**: Provide support contact for issues

### Technical Optimization

1. **Stable Internet**: Recommend participants use reliable connections
2. **Modern Browsers**: Specify supported browsers in requirements
3. **Device Testing**: Include pre-experiment device checks
4. **Fallback Options**: Plan for cases where matching fails

## Troubleshooting

### Common Issues and Solutions

#### Participants Stuck in Waiting Room

**Symptoms**: Participants report waiting for extended periods without matching

**Solutions**:

1. Check experiment configuration for correct participant requirements
2. Verify enough participants are available for matching
3. Review role counts to ensure they sum to total required
4. Check for browser compatibility issues

#### Mismatched Role Assignments

**Symptoms**: Participants receive wrong roles or role distribution is incorrect

**Solutions**:

1. Verify role configuration in experiment settings
2. Check that role counts match total participant requirements
3. Review assignment logs for errors
4. Consider manually reassigning roles if needed

#### Connection Issues

**Symptoms**: Participants frequently disconnect or can't maintain connection

**Solutions**:

1. Recommend participants check internet stability
2. Suggest using ethernet instead of WiFi if possible
3. Have participants disable VPNs or proxies
4. Check server logs for WebSocket errors

#### Matching Never Occurs

**Symptoms**: Enough participants present but matching doesn't trigger

**Solutions**:

1. Verify waiting room service is running
2. Check experiment status is "active"
3. Review server logs for matching errors
4. Manually trigger matching if necessary

### Debugging Tools

1. **Server Logs**: Check `/backend/logs` for detailed waiting room events
2. **Browser Console**: Have participants check for JavaScript errors
3. **Network Tab**: Verify WebSocket connections are established
4. **Admin Dashboard**: Use monitoring tools to view real-time status

## Screenshots

### Participant Waiting Room View

{/* Screenshot: Participant Waiting Room will be added here */}

_The waiting room interface showing progress indicators and status information_

### Experimenter Monitoring View

{/* Screenshot: Experimenter Monitoring will be added here */}

_Dashboard for monitoring active waiting rooms and participant queues_

### Configuration Options

{/* Screenshot: Waiting Room Configuration will be added here */}

_Settings panel for configuring waiting room behavior and matching rules_

## Technical Details

### Architecture

The waiting room system consists of:

- **Frontend Component**: `WaitingRoom.svelte` handles UI and participant experience
- **Backend Manager**: `waitingRoomManager.js` manages matching logic and state
- **API Routes**: `waitingRoomRoutes.js` provides REST endpoints for monitoring
- **WebSocket Namespace**: Real-time communication on `/waiting` namespace

### State Management

- **In-Memory Storage**: Fast access to waiting participant data
- **Firestore Backup**: Persistent storage for audit and recovery
- **Socket Tracking**: Real-time connection status for each participant

### Security

- **Authentication Required**: All participants must be logged in
- **Token Verification**: WebSocket connections validate Firebase tokens
- **Role Isolation**: Participants can only see aggregate waiting data
- **Admin Access**: Full monitoring requires admin privileges
