---
title: Recruitment Settings
sidebar_position: 1
---

# Recruitment Settings

Participant recruitment is a crucial aspect of experiment design in the HyperStudy platform. The Recruitment Settings panel allows you to configure how participants join your experiment. This guide explains the available recruitment options and best practices.

## Accessing Recruitment Settings

To configure recruitment for your experiment:

1. Open your experiment in the Experiment Designer
2. Click on the "Recruitment" tab in the main navigation
3. You'll see the recruitment configuration panel
4. Changes save automatically as you modify settings

## Recruitment Methods

HyperStudy offers three recruitment methods to suit different research needs. Select your method in the Recruitment tab of the Experiment Designer using the radio button options.

### 1. Public Enrollment

**Best for:** Open studies, broad recruitment campaigns, general populations

Public enrollment allows any registered participant to join your experiment from their participant dashboard.

**How it works:**
- Your experiment appears in the public experiment list (if published)
- Participants can browse and enroll themselves
- No invitation required - open to all eligible participants
- Participants click "Join Experiment" to enroll

**Configuration:**
1. Select "Public Enrollment" radio button
2. Publish your experiment to make it available
3. Share your experiment link: `https://hyperstudy.io/participant`

**Participant Eligibility:**
- Currently: Open to all registered participants
- Future updates will include eligibility criteria filtering (age, location, etc.)

**Advantages:**
- Quick to set up
- Reaches maximum audience
- No manual invitation management
- Self-service enrollment

**Considerations:**
- Less control over participant demographics
- May receive participants outside target population
- Requires clear eligibility criteria in description

### 2. Private Enrollment

**Best for:** Targeted recruitment, specific participant pools, invitation-only studies

Private enrollment restricts participation to only those you specifically invite. This provides maximum control over who joins your experiment.

**How it works:**
- Only invited participants can access the experiment
- You select participants or enter email addresses
- System sends invitation emails automatically
- Participants receive personalized invitation links
- System tracks who was invited and their response status

**Two Invitation Methods:**

#### A. Select Existing Participants

Invite participants already registered in the system:

1. Select "Private Enrollment" radio button
2. Click "Select Participants" button
3. Search for participants by name or email
4. Select one or multiple participants from the list
5. Click "Send Invitations"
6. System creates participant assignments and sends invitation emails

**What participants receive:**
- Email invitation with experiment details
- Direct link to join: `https://hyperstudy.io/participant?experiment={experimentId}`
- Can accept or decline invitation
- In-app notification on their participant dashboard

#### B. Email Invitations (Non-Registered Users)

Invite people who don't have HyperStudy accounts yet:

1. Select "Private Enrollment" radio button
2. Enter email addresses (one per line or comma-separated)
3. Click "Send Invitations"
4. System sends invitation emails to all addresses

**What recipients receive:**
- Email invitation with experiment description
- Registration link: `https://hyperstudy.io/auth/participant?redirect=/participant&experiment={experimentId}`
- Prompted to create account first
- Then automatically directed to experiment

**Participant Assignment System:**

When you invite participants, the system creates **participant assignments** to track invitations:

- **Status Tracking**: Active, Declined, Completed
- **Invitation History**: When invited, by whom
- **Re-invitation**: Can re-invite participants who declined
- **Dashboard View**: See all invited participants and their status

**Re-invitation Workflow:**
1. Participant declines initial invitation
2. Status changes to "Declined"
3. You can re-invite from the recruitment dashboard
4. System tracks re-invitation date
5. Participant receives new invitation email

**Advantages:**
- Complete control over participant selection
- Target specific demographics
- Track invitation status
- Professional participant management
- Can invite non-registered users

**Considerations:**
- Requires manual participant selection
- Time investment for invitation management
- May need follow-up with non-responders

### 3. Prolific Integration

**Best for:** Academic research, paid studies, diverse participant pools, quality control

Connect with Prolific for professional participant recruitment with built-in payment processing and advanced screening.

**How it works:**
- Configure study details in HyperStudy
- Study published directly to Prolific platform
- Prolific handles participant recruitment and payment
- Participants authenticate automatically via Prolific tokens
- Completion codes returned to Prolific for payment approval

**Key Features:**
- **Payment Management**: Set reward per participant (minimum $1.25 USD)
- **Participant Screening**: Advanced eligibility filters
- **Device Requirements**: Desktop, Tablet, Mobile compatibility
- **Quality Control**: Automatic or manual approval
- **Real-time Monitoring**: Track participant progress
- **Workspace Management**: Organize studies by project

**Study Lifecycle:**
```
Draft → Unpublished → Active → Paused/Stopped → Completed
```

**Completion Codes:**
- `SUCCESS` - Participant completed successfully
- `TIMEOUT` - Exceeded time limit
- `TECHNICAL` - Technical issues reported
- `NO_CONSENT` - Declined consent form

**Consent Integration:**
- Uses HyperStudy's unified consent system
- If participant declines → receives `NO_CONSENT` code
- Returned to Prolific without payment
- Study slot becomes available for others

**For detailed setup instructions and configuration options, see [Prolific Integration](./prolific-integration.md).**

**Advantages:**
- Access to large, diverse participant pool
- Automated payment processing
- Advanced screening options
- Professional quality standards
- Built-in fraud prevention

**Considerations:**
- Minimum payment requirements ($1.25 USD)
- Prolific fees apply
- Requires Prolific API key
- Study approval may take time

---

### Choosing the Right Method

| Scenario | Recommended Method |
|----------|-------------------|
| Open online study, anyone can participate | Public Enrollment |
| Classroom study, specific student group | Private Enrollment |
| Research with participant pool | Private Enrollment |
| Need specific demographics with payment | Prolific Integration |
| Academic study requiring IRB payment documentation | Prolific Integration |
| Pilot study with colleagues | Private Enrollment |
| Longitudinal study with returning participants | Private Enrollment |

## Participant Management

### Immediate Participation

HyperStudy uses an immediate participation model:

- Participants can join as soon as they access the participation link
- The waiting room manages participant flow
- Sessions start when minimum participant requirements are met
- No advance scheduling required

### Waiting Room Configuration

Configure how participants wait for experiments to begin:

1. Set minimum participant requirements
2. Configure maximum waiting time
3. Define messages shown to waiting participants
4. Set automatic start conditions

## Email Communications

### Invitation Emails (Private Enrollment)

When using Private Enrollment, the system automatically sends invitation emails:

**For Registered Participants:**
- **Subject**: Invitation to participate in "[Experiment Name]"
- **Content**: Experiment description, estimated duration, direct join link
- **Delivery**: Sent via AWS SES with delivery tracking
- **Success/Failure**: Tracked and displayed in recruitment dashboard

**For Non-Registered Users:**
- **Subject**: Invitation to participate in "[Experiment Name]"
- **Content**: Experiment details, registration instructions, combined registration + join link
- **Registration Flow**: User creates account → automatically directed to experiment
- **Delivery Tracking**: Success/failure status available in admin dashboard

**Email Template Customization:**
- Templates can be customized by administrators
- Edit via Admin Dashboard → Email Templates → "Participant Invitation"
- Supports variables: `{{experimentName}}`, `{{sessionUrl}}`, `{{experimentDescription}}`
- Markdown formatting supported

### Prolific Communications

For Prolific studies, communication is handled by Prolific's platform:
- Participants recruited through Prolific's internal messaging
- Study invitations sent by Prolific (not HyperStudy)
- Completion notifications managed by Prolific
- Payment confirmations from Prolific

### Currently Not Supported

The following email notifications are **not currently implemented**:
- ~~Registration confirmations~~ (participants see in-app confirmation only)
- ~~Experiment reminders~~ (no scheduled reminder system)
- ~~Completion confirmations~~ (participants see completion page only)
- ~~Follow-up surveys~~ (no automated follow-up system)

:::tip Future Enhancements
Email reminder and follow-up systems are planned for future releases. For now, use external email tools if you need to send reminders or follow-ups to participants.
:::

## Compensation Settings

### Prolific Payments

When using Prolific integration:

1. Set the payment amount in your Prolific study settings
2. Configure completion codes for payment verification
3. Payments are handled directly through Prolific's platform

### Manual Compensation Tracking

For non-Prolific studies:

1. Export participant completion data
2. Process payments through your preferred method
3. Track compensation status in your records

## Privacy and Consent

### Consent Forms

Configure informed consent:

1. Add consent forms in the Experiment Designer
2. Participants must accept before proceeding
3. Consent records are stored with participant data
4. Configure consent text and requirements

### Data Usage Disclosure

Inform participants about data handling:

1. Include data collection notices in consent forms
2. Specify how data will be used
3. Define data retention policies
4. Provide contact information for questions

### Recording Notifications

For experiments with audio/video recording:

1. Clearly disclose recording in consent forms
2. Require explicit consent for recording
3. Explain how recordings will be used
4. Provide opt-out options where appropriate

## Implementation Examples

### Example 1: Academic Study via Prolific

**Scenario:** Psychology experiment on emotion recognition, paid participants

**Configuration:**
```
Recruitment Method: Prolific Integration
Compensation: $15.00 USD (30 minutes × $30/hour)
Total Slots: 100 participants
Device Requirements: Desktop only, Webcam required
Participant Filters:
  - Age: 18-65
  - Location: United States
  - Approval Rate: > 95%
Consent: Required (unified HyperStudy consent form)
Completion: Auto-approve on SUCCESS code
```

**Workflow:**
1. Configure study in HyperStudy Prolific tab
2. Publish to Prolific
3. Participants recruited via Prolific platform
4. Authenticate automatically with Prolific tokens
5. Complete consent → experiment → completion code
6. Prolific processes payment

**Data Collection:**
- Participant demographics from Prolific
- Consent timestamps
- Experiment performance data
- Completion codes

---

### Example 2: Classroom Study (Private Enrollment)

**Scenario:** Course assignment for psychology students, invitation-only

**Configuration:**
```
Recruitment Method: Private Enrollment
Invitation Method: Select Existing Participants
Target: Students registered as "Student_Psych101"
Waiting Room: Pairs (2 participants), 10-minute timeout
Roles: Speaker, Listener
Consent: Required (course-specific consent)
Compensation: Course credit (tracked manually)
```

**Workflow:**
1. Students register for accounts with .edu email
2. Instructor searches for students by email domain
3. Selects all students from roster
4. Clicks "Send Invitations"
5. Students receive email invitations
6. Students join at their convenience (pairs matched in waiting room)

**Participant Management:**
- View invitation status for each student
- Re-invite students who missed deadline
- Track completion status
- Export data for grading

---

### Example 3: Pilot Study (Private Enrollment - Email Invitations)

**Scenario:** Testing new experiment with colleagues, some not registered

**Configuration:**
```
Recruitment Method: Private Enrollment
Invitation Method: Email Addresses
Email List:
  - colleague1@university.edu
  - colleague2@university.edu
  - researcher@institution.edu
Participants: Single-participant design
Consent: Optional (IRB approved waiver)
```

**Workflow:**
1. Enter colleague email addresses in text field
2. Click "Send Invitations"
3. System sends invitation emails
4. Non-registered colleagues create accounts
5. Automatically directed to experiment
6. Provide feedback via debrief questions

**Advantages:**
- Quick pilot testing
- Invite external collaborators
- Informal consent process
- Rapid iteration

---

### Example 4: Public Online Study

**Scenario:** Open study on decision-making, anonymous participation

**Configuration:**
```
Recruitment Method: Public Enrollment
Access: Any registered participant
Waiting Room: Single-participant, immediate start
Consent: Required (detailed IRB-approved consent)
Data Collection: Anonymous (no email/name stored with responses)
Compensation: None (voluntary participation)
```

**Workflow:**
1. Select "Public Enrollment"
2. Publish experiment
3. Share participation link on social media, forums, email lists
4. Participants register/login → browse experiments
5. Click "Join Experiment" from their dashboard
6. Complete consent → immediate experiment start

**Recruitment Channels:**
- Twitter/social media with experiment link
- Email to department mailing list
- Post on r/SampleSize or research forums
- University announcement boards

**Considerations:**
- No control over participant demographics
- Self-selection bias
- Require clear eligibility criteria in description
- Monitor for duplicate/spam participants

## Best Practices

### Recruitment Planning

1. **Clear Instructions**: Provide detailed participation instructions
2. **Technical Requirements**: Clearly state browser and device requirements
3. **Time Estimates**: Give accurate completion time estimates
4. **Availability**: Consider timezone differences for international participants

### Technical Considerations

1. **Browser Compatibility**: Test with Chrome, Firefox, Safari, and Edge
2. **Mobile Support**: Verify if your experiment works on mobile devices
3. **Connection Requirements**: Specify minimum internet speed for video experiments
4. **Fallback Options**: Have a plan for technical difficulties

### Ethical Guidelines

1. **Transparency**: Be clear about what participation involves
2. **Informed Consent**: Ensure participants understand the study
3. **Right to Withdraw**: Make withdrawal process clear
4. **Data Protection**: Follow GDPR and relevant privacy regulations
5. **IRB Compliance**: Ensure recruitment meets institutional requirements

## Troubleshooting

### Common Issues

| Issue | Potential Solutions |
|-------|---------------------|
| Low participation rates | Review study description; adjust compensation; broaden recruitment channels |
| Technical problems | Provide clear setup instructions; test on multiple browsers; offer tech support contact |
| Waiting room timeouts | Adjust minimum participant requirements; schedule specific session times |
| Prolific integration issues | Verify API credentials; check study settings; ensure completion URLs are correct |

## Next Steps

Now that you understand recruitment settings, explore these related topics:

- [Prolific Integration](./prolific-integration.md)
- [Waiting Room Configuration](../experiment-design/waiting-room.md)
- [Experiment States](../experiment-design/experiment-states.md)
- [Consent Forms](../experiment-design/consent-forms.md)