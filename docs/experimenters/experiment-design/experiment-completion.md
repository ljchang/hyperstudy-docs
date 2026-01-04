---
title: Experiment Completion
sidebar_position: 11
---

# Experiment Completion

The completion phase is the final stage of the participant experience. This guide explains how experiments end, how to configure completion screens, and how to handle different completion scenarios.

## Overview

When participants reach the end of an experiment, the system handles:
- **Session finalization**: Mark participant as complete
- **Completion screen**: Thank you message display
- **Data finalization**: Ensure all data is recorded
- **Redirect handling**: Send to Prolific or custom URL (if configured)
- **Compensation tracking**: Record completion for payment

**Duration:** Typically 5-10 seconds (configurable)

---

## Completion Flow

```
┌──────────────────────────────────────────────────────────┐
│                   COMPLETION SEQUENCE                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. Final State Completed                               │
│     └─ Last experimental state reaches end              │
│                                                          │
│  2. Session Finalized                                   │
│     ├─ Mark participant session as "completed"          │
│     ├─ Record completion timestamp                      │
│     └─ Finalize data recording                          │
│                                                          │
│  3. Completion Determined                               │
│     ├─ Check completion type (normal, timeout, error)   │
│     └─ Determine outcome code                           │
│                                                          │
│  4. Completion Screen Displayed                         │
│     ├─ Show thank you message                           │
│     ├─ Display completion code (if Prolific)            │
│     └─ Start countdown timer                            │
│                                                          │
│  5. Redirect (if configured)                            │
│     ├─ Wait for countdown                               │
│     ├─ Construct redirect URL                           │
│     └─ Automatic redirect to Prolific or custom URL     │
│                                                          │
│  6. Cleanup                                             │
│     ├─ Close WebSocket connections                      │
│     ├─ Stop media streams                               │
│     └─ Clear local state                                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Completion Outcomes

### Normal Completion (SUCCESS)

**When It Occurs:**
- Participant completes all experimental states
- Reaches final state successfully
- No errors or timeouts

**What Participants See:**
```
┌────────────────────────────────────────┐
│   Thank You for Participating!         │
│                                        │
│   You have successfully completed     │
│   the study.                           │
│                                        │
│   Completion Code: A1B2C3D4            │
│                                        │
│   Redirecting in 5 seconds...          │
│                                        │
│   [Return to Prolific]                 │
└────────────────────────────────────────┘
```

**Data Recorded:**
- `experiment.completed` event
- Session status: `completed`
- Completion timestamp
- Final state data
- Total experiment duration

**Prolific Integration:**
- **Outcome Code**: `SUCCESS`
- **Payment**: Full compensation
- **Redirect**: `https://app.prolific.co/submissions/complete?cc=XXXXXX`

**Best For:**
- All standard experiments
- Data collection studies
- Survey experiments

---

### Early Exit

**When It Occurs:**
- Participant closes browser mid-experiment
- Navigates away from experiment
- Connection lost permanently
- Explicit exit button clicked

**What Happens:**
- Session marked as `incomplete`
- Partial data preserved
- No completion code generated
- No redirect

**Data Recorded:**
- `experiment.exited` event (if detected)
- Session status: `incomplete`
- Exit timestamp
- Last completed state
- Partial duration

**Prolific Integration:**
- **Outcome Code**: None (no completion)
- **Payment**: No compensation
- **Status**: Participant can be replaced

**Handling:**
```javascript
// Early exit detected
window.addEventListener('beforeunload', () => {
  // Record partial completion
  recordEvent({
    eventType: 'experiment.exited',
    state: currentState,
    reason: 'browser_close'
  });
});
```

---

### Timeout Completion

**When It Occurs:**
- Participant inactive for too long
- Maximum session duration exceeded
- Waiting room timeout
- State timeout (if configured)

**What Participants See:**
```
┌────────────────────────────────────────┐
│   Session Timeout                      │
│                                        │
│   Your session has timed out due to   │
│   inactivity.                          │
│                                        │
│   Partial compensation may apply.     │
│                                        │
│   Completion Code: T1M2E3O4            │
│                                        │
│   Redirecting in 5 seconds...          │
└────────────────────────────────────────┘
```

**Data Recorded:**
- `experiment.timeout` event
- Session status: `timeout`
- Timeout timestamp
- Last active state
- Reason for timeout

**Prolific Integration:**
- **Outcome Code**: `TIMEOUT`
- **Payment**: Partial compensation (if configured)
- **Redirect**: Custom Prolific return code for timeout

**Configuration:**
Set timeout duration in experiment settings:
- Default: No timeout (unlimited)
- Recommended: 2-3x expected duration
- Minimum: 1.5x expected duration

---

### Technical Issue Completion

**When It Occurs:**
- System error during experiment
- Server connection lost
- Critical component failure
- Data recording failure

**What Participants See:**
```
┌────────────────────────────────────────┐
│   Technical Issue                      │
│                                        │
│   We encountered a technical problem. │
│   This was not your fault.             │
│                                        │
│   You will receive full compensation. │
│                                        │
│   Completion Code: E1R2R3O4            │
│                                        │
│   Please return to Prolific.           │
└────────────────────────────────────────┘
```

**Data Recorded:**
- `experiment.error` event
- Session status: `technical_issue`
- Error details
- Error timestamp
- Affected component

**Prolific Integration:**
- **Outcome Code**: `TECHNICAL`
- **Payment**: Full compensation (good faith)
- **Redirect**: Standard completion URL
- **Note**: Participant can be replaced

**Handling:**
```javascript
// Technical issue detected
try {
  // Experiment code
} catch (error) {
  logger.error('Critical error:', error);
  completeExperiment({
    outcome: 'TECHNICAL',
    error: error.message
  });
}
```

---

## Configuring Completion Screens

### Basic Configuration

Navigate to **Experiment Settings** → **Completion**:

**Thank You Message:**
```markdown
# Thank You!

You have completed our study on decision-making.

Your responses will help us understand how people
make choices under uncertainty.

We appreciate your time and thoughtful participation!
```

**Completion Screen Duration:**
- Default: 5 seconds
- Range: 0-60 seconds
- 0 seconds: Instant redirect (not recommended)
- 5-10 seconds: Standard (recommended)
- 10+ seconds: For debriefing information

**Custom Messages by Outcome:**
```javascript
{
  "completion": {
    "success": {
      "title": "Thank You!",
      "message": "You have completed the study successfully.",
      "duration": 5000
    },
    "timeout": {
      "title": "Session Timeout",
      "message": "Your session timed out due to inactivity.",
      "duration": 10000
    },
    "technical": {
      "title": "Technical Issue",
      "message": "We encountered a problem. You will receive full payment.",
      "duration": 10000
    }
  }
}
```

### Advanced Configuration

**Conditional Completion Messages:**
Display different messages based on:
- Participant performance
- Experiment condition
- Completion time
- Response patterns

**Example:**
```javascript
// In final state, determine message
const performance = calculatePerformance(responses);

if (performance > 0.8) {
  showCompletionMessage('excellent');
} else if (performance > 0.5) {
  showCompletionMessage('good');
} else {
  showCompletionMessage('standard');
}
```

**Debriefing Information:**
Include detailed debriefing in completion screen:
- Study purpose revelation
- Hypothesis explanation
- How data will be used
- Contact for questions
- Links to related research

**Example:**
```markdown
# Study Complete - Debriefing

## Purpose
This study investigated how people evaluate social interactions
through synchronized video viewing.

## Hypothesis
We hypothesized that shared viewing would increase social bonding
compared to independent viewing.

## What We Measured
- Your ratings of the videos
- Your conversation patterns
- Your facial expressions during viewing

## Your Data
All data is anonymous and will be aggregated with other participants.
Results will be published in academic journals.

## Questions?
Contact: researcher@university.edu

## Learn More
Visit our lab website: www.researchlab.edu
```

---

## Prolific Integration

### Setting Up Prolific Completion

#### 1. Configure Prolific Study

In your Prolific study settings:
- **Completion URL**: `https://hyperstudy.io/experiment?id=EXPERIMENT_ID`
- **Completion Code**: Auto-generated by HyperStudy
- **Timeout Return**: Configure timeout behavior
- **Error Return**: Configure error handling

#### 2. Configure HyperStudy Experiment

Navigate to **Recruitment** → **Prolific Settings**:

**Enable Prolific Integration:**
- ✅ Prolific recruitment enabled
- Study ID: `your-prolific-study-id`
- Completion redirect: Automatic
- Completion screen duration: 5 seconds

#### 3. Test Completion Flow

**Preview Mode:**
1. Use Prolific preview link
2. Complete experiment
3. Verify completion code appears
4. Check redirect works
5. Confirm code is accepted by Prolific

**Test Scenarios:**
- Normal completion
- Timeout scenario
- Error scenario
- Early exit (no code)

### Completion Code Generation

**How It Works:**
1. Participant completes experiment
2. Backend generates unique completion code
3. Code format: Alphanumeric, 8-10 characters
4. Code linked to participant session
5. Code sent to frontend
6. Frontend displays code to participant
7. Redirect URL includes code as parameter

**Code Structure:**
```
Format: ABC123XY4Z
├─ A-Z: Random letters
├─ 0-9: Random numbers
└─ Length: 8-10 characters

Example codes:
- K7M2P9Q1X3
- Z9F4T8H2N6
- A1B2C3D4E5
```

**Verification:**
- Each code is unique per session
- Stored in database for verification
- Prolific validates code with database
- Multiple uses prevented

### Redirect URLs

**Success Completion:**
```
https://app.prolific.co/submissions/complete?cc=ABC123XY4Z
```

**Timeout Completion:**
```
https://app.prolific.co/submissions/complete?cc=TIMEOUT123
```

**Technical Issue:**
```
https://app.prolific.co/submissions/complete?cc=ERROR123XY
```

**Early Exit (No Code):**
No redirect occurs; participant remains on error page.

### Handling Prolific Completion Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No completion code | Prolific not enabled | Enable in experiment settings |
| Code not accepted | Wrong study ID | Verify study ID matches |
| Redirect fails | Network error | Retry manually, provide code |
| Duplicate completion | Participant retries | Check session status first |
| Code lost | Browser closed | Contact researcher with session ID |

---

## Custom Redirect URLs

### Non-Prolific Experiments

For experiments not using Prolific, you can configure custom redirect URLs.

**Configuration:**
```javascript
{
  "completion": {
    "redirectUrl": "https://your-lab-website.edu/thank-you",
    "redirectDelay": 5000,  // 5 seconds
    "openInNewTab": false   // Same tab redirect
  }
}
```

**URL Parameters:**
Append participant data to redirect:
```javascript
const redirectUrl = `${baseUrl}?` +
  `participantId=${participantId}&` +
  `experimentId=${experimentId}&` +
  `completed=${timestamp}`;
```

**Example Redirect:**
```
https://your-lab.edu/thank-you?
  participantId=abc123&
  experimentId=exp456&
  completed=1703001234567
```

### Conditional Redirects

Redirect to different URLs based on outcomes:

**Configuration:**
```javascript
{
  "completion": {
    "redirects": {
      "success": "https://lab.edu/success",
      "timeout": "https://lab.edu/timeout",
      "technical": "https://lab.edu/error"
    }
  }
}
```

**Use Cases:**
- Different landing pages per outcome
- Compensation portals
- Follow-up survey links
- Lab website sections

---

## Data Finalization

### What Happens During Finalization

**Data Recording:**
1. Final state data saved
2. Completion event recorded
3. Session status updated
4. Timestamps finalized
5. Metadata added

**Event Structure:**
```javascript
{
  eventType: 'experiment.completed',
  category: 'experiment',
  experimentId: 'exp_123',
  sessionId: 'room_456',
  participantId: 'part_789',
  timestamp: '2024-01-15T10:30:45.123Z',
  data: {
    outcome: 'SUCCESS',
    totalDuration: 1234567,  // milliseconds
    statesCompleted: 15,
    completionCode: 'ABC123XY4Z'
  }
}
```

**Session Update:**
```javascript
{
  status: 'completed',
  completedAt: '2024-01-15T10:30:45.123Z',
  outcome: 'SUCCESS',
  duration: 1234567,
  completionCode: 'ABC123XY4Z',
  redirectUrl: 'https://app.prolific.co/...'
}
```

### Ensuring Data Integrity

**Before Completion:**
- Verify all critical events recorded
- Check for data gaps
- Validate response completeness
- Confirm timestamps are sequential

**During Completion:**
- Batch write remaining data
- Wait for confirmation
- Retry on failure
- Log any issues

**After Completion:**
- Session locked from further updates
- Data available in dashboard
- Export/download enabled
- Analysis can begin

---

## Completion Screen Examples

### Simple Thank You

```markdown
# Thank You!

You have completed the study.

Your participation is greatly appreciated.

[Redirecting automatically...]
```

### With Compensation Info

```markdown
# Study Complete!

Thank you for your time and thoughtful responses.

## Compensation
You will receive $5.00 credited to your Prolific account
within 24 hours.

## Questions?
Contact us at: study@university.edu

Returning to Prolific in 10 seconds...
```

### With Debriefing

```markdown
# Study Complete - Debriefing

## Purpose
This study examined how people perceive emotional expressions
in video conversations.

## What We Measured
- Your ratings of emotions
- Your response times
- Your attention patterns

## Results
We will email you a summary of our findings when the study
concludes in 3 months.

## Thank You
Your contribution advances our understanding of social perception.

[Return to Prolific]
```

### With Performance Feedback

```markdown
# Excellent Work!

You answered 92% of questions correctly!

## Your Performance
- Accuracy: 92%
- Average Response Time: 2.3 seconds
- States Completed: 15/15

You performed better than 75% of participants.

## Next Steps
Based on your performance, you're invited to participate
in our follow-up study for an additional $10.

Check your email for the invitation link.

Thank you for your participation!
```

---

## Troubleshooting Completion Issues

### Completion Screen Doesn't Appear

**Problem:** Experiment ends but no completion screen shown

**Diagnosis:**
1. Check browser console for errors
2. Verify final state configuration
3. Check completion event fired
4. Review session status

**Solutions:**
- Ensure final state has completion flag
- Check experiment state machine
- Verify completion component loaded
- Review frontend routing

### Redirect Fails

**Problem:** Countdown completes but no redirect

**Diagnosis:**
```javascript
// Check redirect URL
console.log('Redirect URL:', redirectUrl);

// Check browser blocking
// Look for popup blocker warnings
```

**Solutions:**
- Verify URL is valid and accessible
- Check browser popup blocker
- Test in incognito mode
- Use `window.location.href` instead of `window.open`

### Duplicate Completions

**Problem:** Participant completes multiple times

**Diagnosis:**
- Check session status before allowing completion
- Review participant session history
- Check for page refreshes during completion

**Solutions:**
```javascript
// Prevent duplicate completions
if (session.status === 'completed') {
  // Already completed, show message
  return showAlreadyCompleted();
}

// Proceed with completion
completeExperiment();
```

### Missing Completion Code

**Problem:** Prolific participant doesn't receive code

**Diagnosis:**
1. Check Prolific integration enabled
2. Verify backend API call succeeded
3. Review completion code generation logs
4. Check network requests in browser

**Solutions:**
- Enable Prolific integration in settings
- Verify API endpoint is accessible
- Check authentication token valid
- Test completion code generation manually

---

## Best Practices

### Timing

**Completion Screen Duration:**
- ✅ 5 seconds: Standard, works well
- ✅ 10 seconds: Good for debriefing
- ⚠️ 3 seconds: Too short for reading
- ❌ 0 seconds: Instant redirect (disorienting)

**Countdown Display:**
- Show remaining seconds
- Provide manual "Continue Now" button
- Allow participant to read at own pace

### Messaging

**Clear Communication:**
- Confirm completion explicitly
- Thank participants sincerely
- Explain next steps clearly
- Provide contact information

**Appropriate Tone:**
- Professional but friendly
- Appreciative of time/effort
- Respectful of participation
- Encouraging for future studies

### Testing

**Always Test:**
- Every completion path (success, timeout, error)
- With and without Prolific integration
- Redirect functionality
- Code generation
- Mobile devices
- Different browsers

---

## Next Steps

- [Participant Flow Guide](./participant-flow.md) - Complete participant journey
- [Prolific Integration](../recruitment/prolific-integration.md) - Detailed Prolific setup
- [Data Management](../data-management.md) - Accessing completion data
- [Experiment States](./experiment-states.md) - Configuring final states
