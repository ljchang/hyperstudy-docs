---
title: Post-Experiment Questionnaires
sidebar_position: 9
---

# Post-Experiment Questionnaires

Post-experiment questionnaires allow you to collect additional data from participants after they complete your experiment. This powerful feature supports demographics collection, feedback gathering, manipulation checks, and validated psychometric measures.

## Overview

The questionnaire system provides a flexible, multi-page survey interface that appears after participants complete all experiment states and before the final completion screen.

**Key Features:**
- Multiple pages for organized question groups
- Seven question types (text, multiple choice, Likert, VAS, ranking, rapid rate, audio)
- Drag-and-drop question reordering
- Required vs. optional questions
- Auto-save responses as participants answer
- Back navigation control
- Rich configuration options per question type

**When to Use Questionnaires:**
- ✅ Collect demographic information
- ✅ Gather post-experiment feedback
- ✅ Administer manipulation checks
- ✅ Measure individual differences (personality, attitudes)
- ✅ Assess participant experience
- ✅ Collect qualitative data
- ❌ Time-sensitive measurements during experiment (use components instead)

---

## Accessing the Questionnaire Editor

Navigate to your experiment in the **Experiment Designer**:

1. Click on the **Questionnaire** tab in the top navigation
2. Enable the questionnaire with the toggle switch
3. Configure general settings (required, back navigation)
4. Add pages and questions

---

## General Settings

### Enable Questionnaire
Toggle to show/hide the questionnaire in your experiment.

**Enabled:**
- Questionnaire appears after experiment completion
- Participants must complete before final redirect
- Data collected and stored

**Disabled:**
- Questionnaire skipped entirely
- Participants proceed directly to completion screen

### Require Completion
Determines whether participants must finish the questionnaire.

**Required (Default):**
- Participants cannot proceed without completing all required questions
- "Next" and "Complete" buttons disabled until page is valid
- Provides complete data for all participants

**Not Required:**
- Participants can skip pages or questions
- Useful for optional feedback
- May result in incomplete data

### Allow Back Navigation
Controls whether participants can navigate to previous pages.

**Allowed (Default):**
- Participants can use "← Back" button
- Can review and change previous answers
- Better user experience

**Not Allowed:**
- Back button is hidden
- Prevents answer revision
- Use for time-sensitive measures or when order matters

---

## Pages

Questionnaires are organized into **pages** that group related questions together.

### Creating Pages

1. Click **+ Add Page** button
2. Enter page title (e.g., "Demographics", "Feedback", "Personality Measures")
3. Optionally add page description using Markdown
4. Add questions to the page

### Page Organization

**Best Practices:**
- 3-7 questions per page (avoid overwhelming participants)
- Group related questions on same page
- Place demographics at beginning or end
- Order pages logically (e.g., demographics → experience → feedback)

### Reordering Pages

Use drag-and-drop to reorder pages:
1. Click and hold the page drag handle (⋮⋮)
2. Drag to new position
3. Release to drop

### Page Content (Markdown Support)

Add instructional text at the top of each page using Markdown:

```markdown
## About You

Please answer the following demographic questions.
This information helps us understand our participant pool.

**All responses are confidential.**
```

Markdown features supported:
- Headers (`#`, `##`, `###`)
- **Bold** and *italic* text
- Lists (bulleted and numbered)
- Links `[text](url)`
- Line breaks

---

## Question Types

### 1. Text Input

Free-text responses from participants.

**Subtypes:**
- **Short Text**: Single line (e.g., age, occupation)
- **Long Text**: Multi-line textarea (e.g., feedback, explanations)

**Configuration:**
- **Question Text**: The prompt participants see
- **Placeholder**: Hint text in empty field (optional)
- **Min Length**: Minimum character count (optional)
- **Max Length**: Maximum character count (optional)
- **Required**: Whether response is mandatory

**Example Use Cases:**
- Age: "What is your age in years?"
- Occupation: "What is your current occupation?"
- Feedback: "Please describe your experience with the task."
- Open-ended: "What strategies did you use during the experiment?"

**Best Practices:**
- Use short text for brief responses (name, age, single words)
- Use long text for detailed feedback
- Set max length to prevent overly long responses
- Provide clear placeholder examples
- Only require text input when necessary

---

### 2. Multiple Choice

Select one or more options from a list.

**Modes:**
- **Single Selection**: Radio buttons, one answer only
- **Multiple Selection**: Checkboxes, choose any number

**Configuration:**
- **Question Text**: The prompt
- **Options**: List of choices (add/remove/reorder with drag-drop)
- **Allow Multiple**: Enable checkbox mode
- **Randomize Options**: Present choices in random order (reduces order bias)
- **Required**: Whether selection is mandatory

**Example Use Cases:**

*Single Selection:*
```
Question: "What is your gender?"
Options:
- Male
- Female
- Non-binary
- Prefer not to say
```

*Multiple Selection:*
```
Question: "Which of the following apply to you? (Select all that apply)"
Options:
- Currently employed
- Full-time student
- Part-time student
- Retired
- Stay-at-home parent
```

**Best Practices:**
- Keep option text concise
- Include "Other" or "Prefer not to say" when appropriate
- Use randomization to reduce order effects
- Limit to 8-10 options maximum
- Consider dropdowns for longer lists (use text input with validation)

**Adding/Editing Options:**
- Click "+ Add Option" to add new choice
- Click on option text to edit inline
- Click ✕ to remove an option
- Drag ⋮⋮ handle to reorder

---

### 3. Likert Scale

Agreement or rating scales with labeled endpoints.

**Configuration:**
- **Question Text**: The statement to rate
- **Scale Points**: Number of response options (2-15, typically 5 or 7)
- **Min Label**: Left anchor (e.g., "Strongly Disagree")
- **Max Label**: Right anchor (e.g., "Strongly Agree")
- **Required**: Whether rating is mandatory

**Common Scales:**

*5-Point Agreement:*
```
Question: "I found the task engaging"
Points: 5
Min: "Strongly Disagree"
Max: "Strongly Agree"
```

*7-Point Frequency:*
```
Question: "How often do you use social media?"
Points: 7
Min: "Never"
Max: "Always"
```

*10-Point Satisfaction:*
```
Question: "How satisfied were you with your experience?"
Points: 10
Min: "Not at all satisfied"
Max: "Extremely satisfied"
```

**Best Practices:**
- Use 5 or 7 points for most applications
- Ensure labels match the scale (agreement, frequency, satisfaction, etc.)
- Keep question statements clear and unambiguous
- Use consistent scale direction across questions
- Consider validated measures (SUS, NASA-TLX, etc.)

**Visual Presentation:**
Participants see circles that fill completely when selected, with the scale number and labels clearly displayed.

---

### 4. VAS Rating

Visual Analog Scale - continuous slider for precise ratings.

**Configuration:**
- **Question Text**: The dimension to rate
- **Min Value**: Numerical minimum (typically 0)
- **Max Value**: Numerical maximum (typically 100)
- **Min Label**: Left endpoint label
- **Max Label**: Right endpoint label
- **Step Size**: Increment between values (1 for integers, 0.1 for decimals)
- **Required**: Whether rating is mandatory

**Example Use Cases:**

*Affect Rating:*
```
Question: "How anxious do you feel right now?"
Min: 0, Max: 100
Min Label: "Not at all anxious"
Max Label: "Extremely anxious"
Step: 1
```

*Confidence:*
```
Question: "How confident are you in your previous answer?"
Min: 0, Max: 100
Min Label: "Not confident"
Max Label: "Very confident"
Step: 1
```

**Best Practices:**
- Use 0-100 scale for percentage-like interpretations
- Provide clear endpoint labels
- Set appropriate step size (1 for whole numbers, 0.1 for precision)
- VAS provides more granular data than Likert scales
- Good for continuous constructs (pain, emotion intensity, confidence)

---

### 5. Ranking

Order items by preference or importance using drag-and-drop.

**Configuration:**
- **Question Text**: Instructions for ranking
- **Items**: List of things to rank (add/remove/edit)
- **Required**: Whether ranking must be completed

**Example Use Cases:**

*Preference:*
```
Question: "Rank these activities from most to least enjoyable:"
Items:
- Reading
- Watching TV
- Exercise
- Socializing
- Gaming
```

*Importance:*
```
Question: "Rank these factors by importance in your decision:"
Items:
- Price
- Quality
- Brand reputation
- Customer reviews
- Availability
```

**Best Practices:**
- Limit to 5-8 items (too many becomes difficult)
- Ensure items are mutually exclusive
- Provide clear instructions on ordering (most important first, etc.)
- Label the top/bottom of the list
- Test drag-and-drop on both desktop and mobile

**Participant Experience:**
- Items appear in default order
- Drag items up/down to reorder
- Clear drag handles on each item
- Visual feedback during drag (highlighted drop zone)
- Works on touch devices

---

### 6. Rapid Rate

Multi-dimensional slider ratings - rate several dimensions simultaneously.

**Configuration:**
- **Prompt**: Overall instructions
- **Dimensions**: List of attributes to rate
  - **Label**: Dimension name (e.g., "Excitement")
  - **Min Label**: Left anchor (e.g., "Not exciting")
  - **Max Label**: Right anchor (e.g., "Very exciting")
  - **Initial Value**: Starting slider position (0-100)
  - **Enable None**: Allow "None" option per dimension
- **Sensitivity**: Slider movement speed (0.1-2.0)
- **Require Click to Activate**: Slider only works after clicking

**Example Use Cases:**

*Emotional Response:*
```
Prompt: "Rate your emotional response to the video:"
Dimensions:
- Happy (Not happy → Very happy)
- Sad (Not sad → Very sad)
- Angry (Not angry → Very angry)
- Anxious (Not anxious → Very anxious)
```

*Video Quality:*
```
Prompt: "Rate the following aspects of the video:"
Dimensions:
- Visual Quality (Poor → Excellent)
- Audio Quality (Poor → Excellent)
- Content Interest (Boring → Fascinating)
```

**Best Practices:**
- Limit to 4-8 dimensions (cognitive load)
- Use clear, distinct dimensions
- Enable "None" when dimension might not apply
- Use consistent anchor labels when possible
- Ideal for rating stimuli on multiple attributes

**Visual Presentation:**
Participants see vertical sliders for each dimension with clear labels and optional "None" buttons.

---

### 7. Audio Recording

Capture spoken responses from participants.

**Configuration:**
- **Question Text**: Recording prompt
- **Max Duration**: Maximum recording length in seconds (default: 60)
- **Min Duration**: Minimum recording length in seconds (default: 0)
- **Allow Review/Re-record**: Let participants listen and re-record (recommended)
- **Show Waveform**: Display visual feedback while recording

**Example Use Cases:**

*Qualitative Feedback:*
```
Question: "Please describe your strategy for completing the task."
Max Duration: 120 seconds
Allow Review: Yes
```

*Verbal Responses:*
```
Question: "Say the words you remember from the list."
Max Duration: 60 seconds
Allow Review: Yes
```

**Best Practices:**
- Always enable "Allow Review" unless methodology requires otherwise
- Set realistic maximum durations (60-120 seconds typical)
- Provide clear instructions on what to say
- Test audio recording in your environment
- Inform participants they'll be recorded in consent form
- Consider transcription requirements for analysis

**Participant Experience:**
- **With Review Enabled (Recommended):**
  1. Click "Start Recording"
  2. Record audio response
  3. Click "Stop Recording"
  4. Review audio with playback controls
  5. Choose "Record Again" or "Submit Recording"

- **Without Review:**
  1. Click "Start Recording"
  2. Record audio response
  3. Auto-submits when stopped

**Privacy Considerations:**
- Audio recordings are uploaded to server
- Stored with experiment data
- Ensure consent form addresses audio recording
- Follow institutional IRB requirements

---

## Question Configuration

### Drag-and-Drop Reordering

All questions within a page can be reordered using drag-and-drop:

1. Hover over question to reveal drag handle (⋮⋮)
2. Click and hold drag handle
3. Drag question to new position
4. Visual indicator shows drop zone
5. Release to drop in new position

This replaces the previous arrow button system with a more intuitive interface.

### Required vs. Optional

**Required Questions:**
- Marked with red asterisk (*)
- Must be answered to proceed
- "Next" button disabled until complete
- Validation message shown if skipped

**Optional Questions:**
- No asterisk
- Can be skipped
- Participants can proceed immediately
- Useful for additional feedback

**Setting Required:**
Check the "Required" box when editing question configuration.

### Editing Questions

1. Click "Edit" button on question card
2. Modify question text and configuration
3. Click "Save" or press Enter
4. Click "Cancel" to discard changes

### Deleting Questions

1. Click "×" button on question card
2. Confirm deletion (cannot be undone)
3. Question removed from page

---

## Data Collection & Export

### Auto-Save Behavior

Responses are automatically saved as participants answer each question:
- No manual save required
- Persists across page changes
- Recovers if browser refreshes (session-based)
- Final submission on questionnaire completion

### Event Recording

Each questionnaire interaction generates data events:

**Response Events:**
```json
{
  "eventType": "questionnaire.response",
  "category": "post_experiment",
  "value": {
    "questionId": "q1_age",
    "questionText": "What is your age?",
    "questionType": "text-short",
    "answer": "28",
    "pageIndex": 0,
    "pageTitle": "Demographics",
    "pageId": "page_1",
    "responseTime": 3245
  }
}
```

**Completion Event:**
```json
{
  "eventType": "questionnaire.completed",
  "category": "post_experiment",
  "value": {
    "totalPages": 3,
    "totalQuestions": 12,
    "totalResponseTime": 185000
  }
}
```

### Accessing Response Data

**Via API:**
Use the Data API to retrieve questionnaire responses:

```python
import requests

api_key = "your_api_key"
experiment_id = "your_experiment_id"

response = requests.get(
    f"https://hyperstudy.io/api/v3/data/events/experiment/{experiment_id}",
    headers={"X-API-Key": api_key},
    params={
        "category": "post_experiment",
        "limit": 1000
    }
)

data = response.json()
```

**Via Data Management Interface:**
1. Navigate to your experiment
2. Click "Data" tab
3. Filter by category: "post_experiment"
4. Export to CSV/JSON

**Data Structure:**
Each participant's responses stored separately with:
- Participant ID
- Question ID and text
- Response value
- Response timestamp
- Response time (milliseconds)
- Page context

---

## Common Use Cases

### Demographics Questionnaire

Collect basic participant information:

**Page 1: Demographics**
1. Age (Text - Short)
2. Gender (Multiple Choice - Single)
3. Education Level (Multiple Choice - Single)
4. Employment Status (Multiple Choice - Multiple)

Example configuration:
```
Question: "What is your age in years?"
Type: Short Text
Placeholder: "e.g., 25"
Required: Yes

Question: "What is your gender?"
Type: Multiple Choice (Single)
Options: Male, Female, Non-binary, Prefer not to say
Required: Yes

Question: "What is your highest level of education?"
Type: Multiple Choice (Single)
Options: High school, Some college, Bachelor's, Master's, Doctorate
Required: Yes
```

---

### Manipulation Check

Verify participants understood experimental manipulation:

**Page 1: Attention Check**
1. What color was the button? (Multiple Choice)
2. How many videos did you watch? (Text - Short, numeric)
3. What was the main character's name? (Text - Short)

Example:
```
Question: "In the video you watched, what color shirt was the person wearing?"
Type: Multiple Choice (Single)
Options: Red, Blue, Green, Yellow
Required: Yes
```

---

### Experience & Feedback

Gather subjective responses about experiment:

**Page 1: Your Experience**
1. Task difficulty (Likert Scale)
2. Engagement level (VAS Rating)
3. General feedback (Text - Long)

Example:
```
Question: "The task was difficult"
Type: Likert Scale
Points: 5
Min Label: "Strongly Disagree"
Max Label: "Strongly Agree"
Required: Yes

Question: "How engaged were you during the experiment?"
Type: VAS Rating
Min: 0, Max: 100
Min Label: "Not at all engaged"
Max Label: "Extremely engaged"
Required: Yes

Question: "Please share any additional feedback about your experience:"
Type: Long Text
Max Length: 1000
Required: No
```

---

### Validated Measures

Implement standardized questionnaires:

**System Usability Scale (SUS):**
```
Page: System Usability Scale

Questions (all Likert 5-point, Strongly Disagree to Strongly Agree):
1. I think that I would like to use this system frequently
2. I found the system unnecessarily complex
3. I thought the system was easy to use
4. I think that I would need technical support to use this system
5. I found the various functions in this system well integrated
...
```

**Big Five Personality (Short Form):**
```
Page: Personality Questions

Question: "I see myself as someone who..."
Subquestions (all Likert 5-point):
- ...is talkative (Extraversion)
- ...tends to find fault with others (Agreeableness-reversed)
- ...does a thorough job (Conscientiousness)
- ...is depressed, blue (Neuroticism)
- ...is original, comes up with new ideas (Openness)
...
```

**NASA-TLX (Workload):**
```
Page: Task Load

Questions (all VAS 0-100):
1. Mental Demand (Low → High)
2. Physical Demand (Low → High)
3. Temporal Demand (Low → High)
4. Performance (Perfect → Failure)
5. Effort (Low → High)
6. Frustration (Low → High)
```

---

## Best Practices

### Questionnaire Design

**Length:**
- ⏱️ Aim for 5-10 minutes completion time
- 📊 12-20 questions typical
- 🎯 Prioritize essential questions
- ⚠️ Consider participant fatigue after main experiment

**Organization:**
- 📑 Group related questions on same page
- 🔢 3-7 questions per page ideal
- ➡️ Logical flow (demographics → specific → general)
- 📝 Use page descriptions to provide context

**Question Writing:**
- ✍️ Clear, concise, unambiguous wording
- 🎯 One concept per question
- ❌ Avoid double-barreled questions
- 🔄 Reverse code some items (reduces response bias)
- 📏 Consistent scale direction

**Validation:**
- ✅ Required for essential data only
- ℹ️ Optional for nice-to-have information
- 🧪 Include attention checks for online data
- 🔍 Pilot test before full launch

### Accessibility

**Text:**
- Use clear, simple language (8th-grade level)
- Avoid jargon unless defined
- Short sentences and paragraphs
- High contrast text (automatic in HyperStudy)

**Navigation:**
- Keyboard navigation supported
- Screen reader compatible
- Clear error messages
- Progress indication

**Mobile:**
- All question types work on touch devices
- Responsive design automatic
- Test on mobile before launch

### Data Quality

**Attention Checks:**
```
Question: "To ensure you're paying attention, please select 'Agree' for this question"
Type: Likert Scale (5-point)
Required: Yes
```

**Comprehension Checks:**
```
Question: "In your own words, what was the main goal of this study?"
Type: Long Text
Required: Yes
```

**Timing Checks:**
- Flag unusually fast completions (< 2 seconds per question)
- Available in response time data
- Filter during analysis

### Ethical Considerations

**Privacy:**
- Only collect necessary demographic data
- Provide "Prefer not to say" options
- Store responses securely
- Follow institutional IRB requirements

**Informed Consent:**
- Disclose questionnaire in consent form
- Explain data use
- Note if audio recording included
- Allow opt-out where possible

**Debriefing:**
- Consider using questionnaire for debriefing
- Explain purpose of questions
- Provide researcher contact for questions

---

## Troubleshooting

### Questionnaire Not Appearing

**Problem:** Participants don't see questionnaire after experiment

**Solutions:**
1. Verify questionnaire is enabled in designer
2. Check experiment is using latest version (publish changes)
3. Ensure at least one page with questions exists
4. Test in preview mode

### Responses Not Saving

**Problem:** Participant answers not recorded

**Solutions:**
1. Check participant has internet connection
2. Verify Firebase permissions configured
3. Check browser console for errors
4. Test with different browser

### Back Button Not Working

**Problem:** Cannot navigate to previous pages

**Solutions:**
1. Check "Allow Back Navigation" is enabled
2. Already on first page (no back possible)
3. Browser back button not supported (use questionnaire back button)

### Required Questions Issue

**Problem:** Can proceed despite required questions

**Solutions:**
1. Verify "Required Completion" is enabled globally
2. Check individual questions are marked required
3. Refresh page and re-test
4. Check browser console for validation errors

---

## Advanced Topics

### Conditional Logic (Future Feature)

Currently, all questions are shown to all participants. Future versions will support:
- Skip logic based on previous answers
- Branching paths through questionnaire
- Dynamic question visibility

### Question Randomization

Currently available:
- Multiple choice option randomization

Future support:
- Question order randomization within pages
- Page order randomization

### Custom Validation

Future support for:
- Regular expression validation (text input)
- Min/max value constraints (numeric)
- Custom validation rules
- Cross-question validation

---

## Summary Checklist

Before launching with a questionnaire:

- [ ] Questionnaire enabled in designer
- [ ] All pages have descriptive titles
- [ ] Questions organized logically across pages
- [ ] Required questions marked correctly
- [ ] All question text is clear and unambiguous
- [ ] Appropriate question types selected
- [ ] Validation rules configured (min/max length, etc.)
- [ ] Tested complete flow in preview mode
- [ ] Mobile compatibility verified
- [ ] Estimated completion time acceptable (5-10 min)
- [ ] IRB approval obtained (if demographic data collected)
- [ ] Consent form mentions questionnaire

---

## Next Steps

- [Participant Flow](./participant-flow.md) - See questionnaires in full participant journey
- [Experiment Completion](./experiment-completion.md) - Configure what happens after questionnaire
- [Data Management](../data-management.md) - Export and analyze questionnaire data
- [API Access](../api-access/overview.md) - Retrieve questionnaire data programmatically
