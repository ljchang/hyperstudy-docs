---
title: Consent Forms
sidebar_position: 8
---

# Consent Forms

Consent forms are a critical component of ethical research. HyperStudy provides built-in support for digital informed consent, ensuring participants understand and agree to the study procedures before beginning your experiment.

## Overview

The consent form system in HyperStudy:
- Presents consent information before experiment participation
- Records participant agreement with timestamp
- Supports multiple consent types (general, recording, data sharing)
- Integrates seamlessly with the experiment flow
- Maintains compliance with IRB and ethics requirements

## Consent in Participant Flow

The consent form is **the first required gate** in the participant journey. Understanding where consent fits in the overall flow is essential for designing your experiment.

### Flow Position

```
Lobby → [CONSENT FORM] → Instructions → Waiting Room → Experiment
         ↑ You are here
```

**Entry Requirement:**
- Participant must be authenticated (logged in)
- Experiment must be active and accessible

**Completion Requirement:**
- ✅ **Must complete to proceed to instructions**
- Declining consent ends participation immediately
- No access to waiting room or experiment without consent

**What Happens:**
1. Participant accesses experiment link
2. Authenticates (if not already logged in)
3. Consent form displayed immediately
4. Participant reviews and agrees (or declines)
5. Agreement timestamped and recorded
6. Proceeds to instructions → waiting room → experiment

**Configuration Impact:**
- Consent cannot be skipped (ethical requirement)
- Always appears before any experimental content
- Blocks all experiment access until completed
- Separate from experiment instructions

:::tip Complete Participant Journey
For a comprehensive view of the entire participant experience, see the [Participant Flow Guide](./participant-flow.md).
:::

## Adding Consent Forms

### Creating a Consent Form

To add a consent form to your experiment:

1. Open your experiment in the Experiment Designer
2. Navigate to the "Metadata" or "Settings" tab
3. Find the "Consent Form" section
4. Click "Add Consent Form" or "Edit Consent"
5. Enter your consent text using the rich text editor
6. Configure consent options and requirements
7. Save your changes

### Consent Form Content

Your consent form should typically include:

1. **Study Title and Researchers**
   - Name of the study
   - Principal investigator and contact information
   - Institution and department

2. **Purpose and Procedures**
   - Why the research is being conducted
   - What participants will be asked to do
   - Expected duration of participation
   - Number of participants being recruited

3. **Risks and Benefits**
   - Potential risks or discomforts
   - Potential benefits to participants or society
   - Statement that participation is voluntary

4. **Data and Privacy**
   - What data will be collected
   - How data will be stored and protected
   - Who will have access to the data
   - How long data will be retained
   - Whether data will be shared or published

5. **Compensation**
   - Payment amount and method
   - Conditions for receiving compensation
   - Tax implications if applicable

6. **Rights and Withdrawal**
   - Right to withdraw at any time
   - How to withdraw from the study
   - What happens to data if participant withdraws
   - Contact information for questions or concerns

7. **Special Considerations**
   - Audio/video recording if applicable
   - Screen recording if applicable
   - Use of images or recordings in publications
   - Future use of data

## Consent Types

### Standard Informed Consent

The basic consent that all participants must accept:

```markdown
# Informed Consent

## Study Title
[Your Study Title]

## Researcher Information
Principal Investigator: [Name]
Institution: [Your Institution]
Contact: [Email]

## Purpose
You are invited to participate in a research study about [topic]. 
The purpose of this study is to [research goals].

## Procedures
If you agree to participate, you will [describe activities].
This will take approximately [duration].

## Voluntary Participation
Your participation is voluntary. You may withdraw at any time 
without penalty by [withdrawal method].

[Additional sections as required by your IRB]

By clicking "I Agree" below, you confirm that:
- You are 18 years or older
- You have read and understood this information
- You voluntarily agree to participate
```

### Recording Consent

For experiments involving audio or video recording:

```markdown
## Recording Consent

This study involves [audio/video] recording for [purpose].

Recordings will be:
- Used only for research purposes
- Stored securely and accessible only to the research team
- Destroyed after [time period] or upon study completion
- [Additional uses if applicable]

You may participate without being recorded by [alternative option].

□ I consent to audio recording
□ I consent to video recording
□ I do not wish to be recorded
```

### Data Sharing Consent

For studies involving data sharing or open science:

```markdown
## Data Sharing

De-identified data from this study may be:
- Shared with other researchers for future studies
- Posted in online data repositories
- Used in publications and presentations

Your personal information will be removed, but complete 
anonymity cannot be guaranteed.

□ I consent to data sharing as described
□ I do not consent to data sharing
```

## Consent Flow

### Participant Experience

1. **Initial Presentation**
   - Consent form appears when participant joins
   - Clear, readable formatting
   - Scrollable if content is long
   - Print/download option available

2. **Review Process**
   - Participants must scroll through entire form
   - Key sections may be highlighted
   - Questions or clarifications can be provided

3. **Agreement Mechanism**
   - Clear "I Agree" and "I Do Not Agree" buttons
   - Checkbox confirmations for specific items
   - Timestamp recorded upon agreement

4. **Post-Consent**
   - Copy of consent provided to participant
   - Proceeds to experiment setup
   - Consent status recorded in participant data

### Handling Refusal

If a participant does not consent:

1. Thank them for their consideration
2. Explain they cannot proceed without consent
3. Provide researcher contact for questions
4. Redirect to exit page or study list
5. Record non-consent in recruitment logs

## Best Practices

### Writing Effective Consent Forms

1. **Use Plain Language**
   - Avoid jargon and technical terms
   - Write at an 8th-grade reading level
   - Define necessary technical terms

2. **Be Concise but Complete**
   - Include all required elements
   - Use bullet points and formatting
   - Break into clear sections

3. **Be Transparent**
   - Clearly state what participation involves
   - Don't minimize risks or overstate benefits
   - Be honest about data use

4. **Consider Accessibility**
   - Use readable fonts and sizes
   - Ensure good contrast
   - Provide alternative formats if needed

### IRB Compliance

1. **Get Approval First**
   - Submit consent form to IRB before use
   - Include any required institutional language
   - Update if procedures change

2. **Version Control**
   - Track consent form versions
   - Note which version each participant saw
   - Archive old versions

3. **Documentation**
   - Keep records of all consents
   - Note any special circumstances
   - Maintain audit trail

### International Considerations

For international studies:

1. **Language**
   - Provide translations as needed
   - Ensure translations are certified
   - Allow language selection

2. **Legal Requirements**
   - Comply with local regulations (GDPR, etc.)
   - Consider age of consent variations
   - Address data transfer restrictions

3. **Cultural Sensitivity**
   - Adapt language and examples
   - Consider cultural norms
   - Provide culturally appropriate contact methods

## Technical Implementation

### Consent Form Settings

Configure consent behavior in the Experiment Designer:

```javascript
{
  "consent": {
    "required": true,
    "type": "standard",
    "showPrintOption": true,
    "requireScroll": true,
    "minimumReadTime": 30,
    "recordingConsent": false,
    "dataSharingConsent": false
  }
}
```

### Consent Data Storage

Consent records include:
- Participant ID
- Timestamp of consent
- Version of consent form
- Specific items agreed to
- IP address (if required)
- Browser/device information

### Conditional Consent

For complex studies with optional components:

1. **Core Consent**: Required for all participants
2. **Optional Modules**: Additional consent for specific features
3. **Conditional Flow**: Different paths based on consent choices
4. **Partial Participation**: Allow participation in some components

## Examples

### Minimal Online Study

```markdown
# Consent to Participate

You are invited to participate in a brief online study about 
decision-making. The study takes about 10 minutes.

**What you'll do:** Answer questions and make choices in 
hypothetical scenarios.

**Risks:** Minimal - similar to everyday computer use.

**Benefits:** Contribute to scientific knowledge about decision-making.

**Data:** Your responses will be anonymous and used only for research.

**Voluntary:** You may stop at any time by closing your browser.

By clicking "I Agree," you confirm you are 18+ and consent to participate.
```

### Video Recording Study

```markdown
# Informed Consent for Video Study

[Standard consent sections...]

## Video Recording

This study requires video recording to analyze nonverbal communication.

**What is recorded:** Your face and upper body during tasks
**How it's used:** Coded for research purposes only
**Who sees it:** Only the research team
**Storage:** Encrypted and deleted after 5 years

You cannot participate without video recording due to study requirements.

□ I understand and consent to video recording
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Consent form not showing | Check that consent is enabled in experiment settings |
| Participants can't proceed | Verify all required checkboxes are marked |
| Form too long | Break into pages or reduce content |
| Print option not working | Enable print option in settings; check browser compatibility |
| Consent not recorded | Verify data collection is configured correctly |

## Next Steps

Related documentation:
- [Participant Flow Guide](./participant-flow.md) - Complete participant journey
- [Experiment Instructions](./experiment-instructions.md) - Next stage after consent
- [Waiting Room System](./waiting-room.md) - Participant matching (requires consent)
- [Participant Guide](../../participants/getting-started.md) - Participant perspective
- [Getting Started](../getting-started.md) - Experimenter guide