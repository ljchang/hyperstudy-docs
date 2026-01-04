---
title: Participant Flow & Experience
sidebar_position: 1
---

# Participant Flow & Experience

Understanding the complete participant journey through your experiment is essential for designing effective studies. This guide explains each stage participants experience, from initial access through experiment completion.

## Overview

Every HyperStudy experiment follows a structured flow designed to ensure ethical compliance, proper setup, and smooth execution:

```
┌─────────────────────────────────────────────────────────────────┐
│                     PARTICIPANT JOURNEY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Lobby              →  Initial landing & authentication      │
│                                                                 │
│  2. Consent Form       →  Required ethical approval             │
│                           (Completion required to proceed)      │
│                                                                 │
│  3. Instructions       →  Study procedures & training           │
│                           (Comprehension checks optional)       │
│                           (Completion required to proceed)      │
│                                                                 │
│  4. Waiting Room       →  Participant matching & assignment     │
│                           (For multi-participant experiments)   │
│                                                                 │
│  5. Experiment Setup   →  Device testing & media preloading     │
│                           (Camera, microphone, media cache)     │
│                                                                 │
│  6. Experiment         →  Main experimental states              │
│                           (Tasks, stimuli, responses)           │
│                                                                 │
│  7. Questionnaire      →  Post-experiment survey (optional)     │
│                           (Demographics, feedback, measures)    │
│                                                                 │
│  8. Completion         →  Thank you & redirect                  │
│                           (Prolific completion if applicable)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Pre-Experiment Stages

### Stage 1: Lobby

The **lobby** is the initial landing point when participants access your experiment link.

**What Happens:**
- Participant authentication via Firebase
- Prolific integration authentication (if applicable)
- Experiment availability check
- Initial loading screen
- Session creation in database

**What Participants See:**
- Loading animation
- "Joining experiment..." message
- Authentication prompts (if not logged in)

**Configuration:**
- No experimenter configuration needed
- Automatic for all experiments
- Handles authentication errors gracefully

**Technical Details:**
- Creates participant session record
- Validates experiment is active and available
- Checks enrollment limits
- Establishes WebSocket connection

---

### Stage 2: Consent Form

The **consent form** is the first required gate. Participants cannot proceed without providing informed consent.

**What Happens:**
- Consent form content is displayed
- Participant reviews study information
- Agreement is recorded with timestamp
- Non-consent prevents experiment entry

**What Participants See:**
- Full consent document with study details
- Scrollable content area
- "I Agree" and "I Do Not Agree" buttons
- Print/download option (if enabled)

**Completion Requirement:**
- ✅ **Must complete to reach waiting room**
- Declining consent ends participation
- Agreement is timestamped and recorded

**Configuration:**
Navigate to **Experiment Designer** → **Consent** tab:
- Enable/disable consent requirement
- Enter consent text (supports Markdown)
- Configure scroll requirement
- Set minimum read time (optional)
- Enable print option

**Best Practices:**
- Use clear, plain language (8th-grade reading level)
- Include all IRB-required elements
- Test consent form for readability
- Keep consent concise but complete
- Ensure mobile-friendly formatting

**Related Documentation:**
- [Consent Forms Guide](./consent-forms.md) - Detailed consent configuration

---

### Stage 3: Instructions

The **instructions** stage presents study procedures and can include comprehension checks to ensure understanding.

**What Happens:**
- Instruction pages displayed sequentially
- Comprehension questions test understanding (optional)
- Participants must pass checks to proceed (if required)
- Multiple attempts allowed (configurable)
- Completion recorded with timestamps

**What Participants See:**
- Instruction content with rich formatting
- Images, videos, or examples (optional)
- "Check Your Understanding" quiz (if enabled)
- Score and feedback on comprehension checks
- Progress through instruction pages

**Completion Requirement:**
- ✅ **Must complete to reach waiting room**
- All instruction pages must be viewed
- Comprehension checks must be passed (if required)
- Failing max attempts blocks progression

**Configuration:**
Navigate to **Experiment Designer** → **Instructions** tab:
- Add multiple instruction pages
- Use rich text editor for formatting
- Embed media (images, videos)
- Enable comprehension checks per page
- Set passing score and max attempts
- Configure question types and validation

**Comprehension Check Types:**
1. **Multiple Choice** - Single correct answer selection
2. **True/False** - Binary questions
3. **Short Text** - Keyword or phrase validation
4. **Numeric** - Number with tolerance/range validation

**Best Practices:**
- Break complex instructions into multiple pages
- Use examples and visual aids
- Test critical concepts with comprehension checks
- Allow 2-3 attempts for learning
- Set realistic passing scores (70-80%)
- Provide helpful feedback on incorrect answers

**Technical Details:**
- Comprehension attempts recorded as events
- Session flagged if participant fails all attempts
- `instructions.comprehension_passed` event on success
- `instructions.comprehension_failed` event on failure

**Related Documentation:**
- [Experiment Instructions Guide](./experiment-instructions.md) - Detailed instruction configuration
- [Comprehension Checks](../../developers/comprehension-checks.md) - Technical documentation

---

### Stage 4: Waiting Room

The **waiting room** is where participants are matched with others for multi-participant experiments.

**What Happens:**
- Participant enters queue
- System monitors for sufficient participants
- Automatic matching when threshold reached
- Role assignment (if roles configured)
- Room creation and notification

**What Participants See:**
- "Waiting for other participants..." message
- Number of participants waiting
- Number needed for match
- Progress indicator
- Automatic transition when matched

**Entry Requirements:**
- ✅ Consent form must be completed
- ✅ Instructions must be completed
- ✅ Comprehension checks must be passed (if required)

**Configuration:**
Navigate to **Experiment Designer** → **Recruitment** tab:
- Set required participant count
- Configure role distribution
- Set matching strategy
- Configure timeout settings (optional)

**For Single-Participant Experiments:**
- Waiting room is bypassed automatically
- Participant proceeds directly to setup

**For Multi-Participant Experiments:**
- Waits until required count reached
- Assigns roles randomly or by rule
- Creates shared experiment room
- 10-second countdown before auto-join

**Best Practices:**
- Communicate expected wait times to participants
- Schedule sessions for simultaneous arrival
- Use recruitment windows to batch participants
- Test matching with multiple browsers
- Plan for participants who disconnect

**Related Documentation:**
- [Waiting Room System](./waiting-room.md) - Detailed waiting room documentation
- [Roles Configuration](./roles.md) - Setting up participant roles

---

## Experiment Setup Phase

After leaving the waiting room (or for single-participant experiments), participants enter the **setup phase** where their devices are configured and media is preloaded.

**What Happens:**
- Device permissions requested
- Camera and microphone tested
- Media (videos/images) preloaded
- LiveKit connection established (if video chat enabled)
- Special hardware setup (if required)

**What Participants See:**
- Device setup screen with camera/microphone selection
- Video preview and audio level meters
- Media preloading progress bar
- "Loading..." messages during setup
- Setup completion confirmation

**Setup Sequence:**

```
1. Backend Setup
   ├── Experiment data loaded
   ├── Participant session verified
   └── Room configuration prepared

2. Frontend Setup (Participant Device)
   ├── Video URL signing (internal videos)
   ├── 📥 Media Preloading ⭐
   │   ├── Extract all video/image URLs
   │   ├── Preload images first
   │   ├── Preload videos (batches of 2)
   │   └── Progress tracking
   │
   ├── 🎥 Device Setup (if required)
   │   ├── Request camera/microphone permissions
   │   ├── Enumerate available devices
   │   ├── Device selection
   │   ├── Audio level testing
   │   └── Video preview
   │
   ├── 📞 LiveKit Connection (if video chat)
   │   ├── Connect to LiveKit room
   │   ├── Publish audio/video tracks
   │   └── Configure media settings
   │
   └── 🔌 Special Hardware (if enabled)
       ├── USB trigger setup
       └── Kernel integration setup

3. Signal Ready
   └── Participant marked ready, experiment begins
```

### Media Preloading

**Why All Media is Preloaded:**
- Prevents "grey box" loading during experiment
- Ensures smooth video playback start
- Eliminates race conditions
- Applies to ALL participants (host and viewers)

**What Gets Preloaded:**
- All videos referenced in experiment states
- All images referenced in experiment states
- Role-specific media for assigned role

**Process:**
1. Extract video/image URLs from all states
2. Transform internal video URLs to signed URLs
3. Preload images (faster, done first)
4. Preload videos in batches of 2
5. Display progress bar to participant
6. Complete when all media ready

**Configuration:**
- Automatic for all experiments with media
- No experimenter configuration needed
- Cannot be disabled (critical for smooth playback)

:::warning Video Format Recommendation
**Use MP4 format for best results**. MOV files may fail to preload or seek properly in Firefox when served via signed URLs. This is especially critical for experiments using sparse rating or timestamp-based features. See [Media Management](../../media-management.md#video-format-recommendations) for details.
:::

### Device Setup

**When Device Setup Appears:**
- Video chat component is enabled, OR
- Experiment requires camera/microphone

**Device Setup Process:**
1. Browser requests permissions
2. Participant grants camera/microphone access
3. Available devices enumerated
4. Participant selects camera
5. Participant selects microphone
6. Participant selects speakers/headphones
7. Audio level meter shows input
8. Video preview shows camera
9. Participant clicks "Continue" when ready

**Skipping Device Setup:**
You can skip device setup in certain scenarios:
- Testing in development mode
- Single-participant experiments without media recording
- When devices are not required

To skip: Pass `skipDeviceSetup={true}` prop to ExperimentRunner (developer setting).

**Troubleshooting:**
- **Permissions denied**: Participant must manually enable in browser settings
- **No devices found**: Check physical connections, browser compatibility
- **Audio not working**: Check browser permissions, system volume
- **Video not showing**: Check camera is not in use by another app

**Related Documentation:**
- [Experiment Setup Guide](./experiment-setup.md) - Detailed setup documentation

---

## Experiment Execution

Once setup is complete, participants enter the main experiment.

**What Happens:**
- Experiment states execute in sequence
- Focus components display tasks/stimuli
- Global components persist across states
- Data recorded in real-time
- State transitions based on rules

**State Types:**

### Focus Components (State-Specific)
The main content for each state:
- **Show Text** - Instructions, information
- **Show Image** - Static images
- **Show Video** - Video playback (synchronized for multi-participant)
- **Multiple Choice** - Question with options
- **VAS Rating** - Visual analog scale
- **Continuous Rating** - Time-series rating during media
- **Sparse Rating** - Intermittent rating prompts
- **Text Input** - Free-text responses
- **Audio Recording** - Record participant audio
- **Ranking** - Order items by preference
- **Code Component** - Custom JavaScript
- **Trigger Component** - Hardware integration

### Global Components (Persistent)
Elements that can appear across multiple states:
- **Video Chat** - Real-time audio/video communication
- **Text Chat** - Text messaging between participants
- **Continuous Rating Overlay** - Ongoing rating during other content
- **Sparse Rating Overlay** - Timed rating prompts

**Participant Experience:**
- Smooth transitions between states
- Clear instructions for each task
- Progress indication (optional)
- Responsive interactions
- Automatic or manual advancement

**Data Collection:**
All participant actions are automatically recorded:
- State transitions (onset/offset)
- Component interactions
- Response data
- Timing information
- Video/audio recordings (if enabled)

**Related Documentation:**
- [Experiment States](./experiment-states.md) - State configuration
- [Components Guide](./components/index.md) - All available components
- [Global States](./global-states.md) - Persistent components

---

## Post-Experiment Questionnaire

After completing the main experiment, participants can be presented with an optional **post-experiment questionnaire**.

**What Happens:**
- Questionnaire appears after final experiment state
- Multi-page survey with various question types
- Responses auto-saved as participants answer
- Progress tracked across pages
- Completion required before experiment ends (if enabled)

**What Participants See:**
- Clean questionnaire interface
- Progress dots showing current page
- Back/Next navigation between pages
- Question validation and error messages
- Completion confirmation

**When It Appears:**
- After all experiment states complete
- Before the completion/redirect screen
- Only if questionnaire is enabled
- Automatically skipped if not configured

**Question Types Available:**
1. **Text Input** - Short or long text responses
2. **Multiple Choice** - Single or multiple selections
3. **Likert Scale** - Agreement rating scales (2-15 points)
4. **VAS Rating** - Visual analog scale slider
5. **Ranking** - Drag-and-drop item ordering
6. **Rapid Rate** - Multi-dimensional slider ratings
7. **Audio Recording** - Participant audio responses

**Configuration:**
Navigate to **Experiment Designer** → **Questionnaire** tab:
- Enable/disable post-experiment questionnaire
- Add multiple pages for organization
- Configure questions with drag-and-drop reordering
- Set required vs. optional questions
- Customize validation and display options
- Allow/prevent back navigation

**Best Practices:**
- Keep questionnaires concise (5-10 minutes maximum)
- Group related questions on same page
- Use appropriate question types for data needed
- Mark only essential questions as required
- Test questionnaire flow before launching
- Consider participant fatigue after main experiment

**Data Collection:**
All questionnaire responses are automatically recorded:
- Individual question responses with timestamps
- Page navigation events
- Response times per question
- Completion status and duration
- Stored separately from main experiment data

**Related Documentation:**
- [Post-Experiment Questionnaires](./post-experiment-questionnaires.md) - Comprehensive questionnaire guide

---

## Completion Phase

When the experiment ends, participants enter the **completion phase**.

**What Happens:**
- Final state marked complete
- Completion screen displayed
- Prolific completion code generated (if applicable)
- Redirect URL constructed
- Countdown timer starts
- Automatic redirect after delay
- Session status updated to "completed"

**What Participants See:**
- "Thank you for participating!" message
- Study completion confirmation
- Completion code (Prolific studies)
- Countdown timer (e.g., "Redirecting in 5 seconds...")
- Automatic redirect or "Return to Prolific" link

**Completion Outcomes:**

### Normal Completion
- All states completed successfully
- Participant reached final state
- **Prolific**: `SUCCESS` status, full payment
- **Direct**: Thank you message, custom redirect

### Early Exit
- Participant closes browser mid-experiment
- Session marked as "incomplete"
- **Prolific**: No completion code, no payment
- **Direct**: No completion recorded

### Timeout
- Participant inactive for too long
- Session automatically ended
- **Prolific**: `TIMEOUT` status, partial payment (if configured)
- **Direct**: Timeout message displayed

### Technical Issues
- Connection lost permanently
- System error during experiment
- **Prolific**: `TECHNICAL` status, full payment (good faith)
- **Direct**: Error message, support contact

**Configuration:**
Navigate to **Experiment Designer** → **Recruitment** → **Prolific Settings**:
- Completion redirect URL
- Completion screen duration (default 5 seconds)
- Custom thank you message
- Completion codes for different outcomes

**Prolific Integration:**
For experiments recruited via Prolific:
1. Backend generates completion code
2. Redirect URL constructed: `https://app.prolific.co/submissions/complete?cc=XXXXXX`
3. Countdown displayed to participant
4. Automatic redirect after duration
5. Prolific records completion

**Best Practices:**
- Set completion screen duration to 5-10 seconds
- Provide clear completion confirmation
- Include debriefing information if required
- Test Prolific redirect before launching
- Monitor completion rates in dashboard

**Related Documentation:**
- [Experiment Completion Guide](./experiment-completion.md) - Detailed completion documentation
- [Prolific Integration](../recruitment/prolific-integration.md) - Prolific-specific settings

---

## Troubleshooting Common Flow Issues

### Participants Stuck at Consent
**Problem:** Cannot proceed after agreeing to consent

**Solutions:**
1. Check consent is properly saved in designer
2. Verify consent is enabled in experiment settings
3. Check browser console for errors
4. Ensure participant has stable internet connection

### Comprehension Check Failures
**Problem:** Participants repeatedly fail comprehension checks

**Solutions:**
1. Review questions for clarity
2. Lower passing score threshold
3. Increase max attempts allowed
4. Add explanations to instruction content
5. Consider if questions are too difficult

### Waiting Room Never Advances
**Problem:** Participants wait indefinitely for match

**Solutions:**
1. Verify required participant count is correct
2. Check sufficient participants are available
3. Test role configuration adds up correctly
4. Check server logs for matching errors
5. Manually trigger match if needed (admin)

### Device Setup Issues
**Problem:** Camera or microphone not working

**Solutions:**
1. Check browser permissions granted
2. Try different browser (Chrome recommended)
3. Ensure device not in use by another app
4. Check physical device connections
5. Use Device Tester before experiment: [hyperstudy.io/devicetester](https://hyperstudy.io/devicetester)

### Media Not Loading
**Problem:** Videos show grey box or images don't appear

**Solutions:**
1. Verify media files uploaded correctly
2. Check video URLs are correct
3. Allow sufficient preloading time
4. Test media playback in browser
5. Check file formats are supported

### Prolific Redirect Fails
**Problem:** Participants not redirected to Prolific

**Solutions:**
1. Verify Prolific study ID is correct
2. Check completion URL configured
3. Test redirect in preview mode
4. Ensure participant was authenticated via Prolific
5. Check completion code is generated

---

## Summary Checklist

Before launching your experiment, verify each stage:

- [ ] **Lobby**: Experiment is active and accessible
- [ ] **Consent**: Form is complete with all IRB requirements
- [ ] **Instructions**: Clear, tested with comprehension checks (if used)
- [ ] **Waiting Room**: Participant counts and roles configured correctly
- [ ] **Setup**: Device requirements specified, media uploaded
- [ ] **Experiment**: All states tested, data recording verified
- [ ] **Questionnaire**: Post-experiment questionnaire configured (if using)
- [ ] **Completion**: Thank you message written, redirect configured

---

## Next Steps

Now that you understand the participant flow:

- [Consent Forms](./consent-forms.md) - Configure ethical consent
- [Experiment Instructions](./experiment-instructions.md) - Create effective instructions
- [Waiting Room](./waiting-room.md) - Configure participant matching
- [Experiment Setup](./experiment-setup.md) - Technical setup details
- [Experiment States](./experiment-states.md) - Design your experiment
- [Post-Experiment Questionnaires](./post-experiment-questionnaires.md) - Collect additional data
- [Experiment Completion](./experiment-completion.md) - Configure completion flow
