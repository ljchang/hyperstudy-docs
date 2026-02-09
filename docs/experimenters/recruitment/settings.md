---
title: Recruitment Settings
sidebar_position: 1
---

# Recruitment Settings

Participant recruitment in HyperStudy is configured at the **deployment** level. When you create a [deployment](../deployments.md), you choose a recruitment method that determines how participants join your study. This guide explains the available recruitment options and best practices.

## Accessing Recruitment Settings

To configure recruitment for your study:

1. Navigate to the **Deployments** page
2. Create a new deployment or open an existing one
3. Click on the **Recruitment** section within the deployment
4. Select your recruitment method and configure settings
5. Changes save automatically as you modify settings

:::tip Why Deployments?
Recruitment is tied to deployments rather than experiments because the same experiment can be deployed multiple times with different recruitment strategies. See the [Deployments](../deployments.md) guide for details.
:::

## Recruitment Methods

HyperStudy offers three recruitment methods. Select your method when creating or configuring a deployment.

### 1. Public Enrollment

**Best for:** Open studies, broad recruitment campaigns, general populations

Public enrollment allows any registered participant to join your study through a shareable link.

**How it works:**
- Your deployment generates a unique participation URL
- Participants access the experiment through this link
- No invitation required -- open to all eligible participants
- Participants are routed to the correct deployment automatically

**Participation URL format:**
```
https://hyperstudy.io/participant?experimentId=X&deploymentId=Y
```

**Configuration:**
1. Select **Public Enrollment** as the recruitment method
2. Copy the generated participation URL from the deployment
3. Share the link through your preferred channels (email lists, social media, forums)

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

Private enrollment restricts participation to only those you specifically invite through the deployment's recruitment panel.

**How it works:**
- Only invited participants can access the experiment
- You select participants or enter email addresses from the deployment
- System sends invitation emails automatically
- Participants receive personalized invitation links
- System tracks who was invited and their response status

**Two Invitation Methods:**

#### A. Select Existing Participants

Invite participants already registered in the system:

1. Open your deployment
2. Go to the **Recruitment** section
3. Click **Select Participants**
4. Search for participants by name or email
5. Select one or multiple participants from the list
6. Click **Send Invitations**
7. System creates participant assignments and sends invitation emails

**What participants receive:**
- Email invitation with experiment details
- Direct link to join through this specific deployment
- Can accept or decline invitation
- In-app notification on their participant dashboard

#### B. Email Invitations (Non-Registered Users)

Invite people who don't have HyperStudy accounts yet:

1. Open your deployment
2. Go to the **Recruitment** section
3. Enter email addresses (one per line or comma-separated)
4. Click **Send Invitations**
5. System sends invitation emails to all addresses

**What recipients receive:**
- Email invitation with experiment description
- Registration link that routes to this deployment after account creation
- Prompted to create account first, then automatically directed to the experiment

**Participant Assignment System:**

When you invite participants through a deployment, the system creates **participant assignments** to track invitations:

- **Status Tracking**: Active, Declined, Completed
- **Invitation History**: When invited, by whom
- **Re-invitation**: Can re-invite participants who declined
- **Dashboard View**: See all invited participants and their status in the deployment

**Re-invitation Workflow:**
1. Participant declines initial invitation
2. Status changes to "Declined"
3. You can re-invite from the deployment recruitment panel
4. System tracks re-invitation date
5. Participant receives new invitation email

**Advantages:**
- Complete control over participant selection
- Target specific demographics
- Track invitation status per deployment
- Professional participant management
- Can invite non-registered users

**Considerations:**
- Requires manual participant selection
- Time investment for invitation management
- May need follow-up with non-responders

### 3. Prolific Integration

**Best for:** Academic research, paid studies, diverse participant pools, quality control

Connect with Prolific for professional participant recruitment with built-in payment processing and advanced screening. Prolific studies are scoped to individual deployments.

**How it works:**
- Configure study details within the deployment's Prolific section
- Study published directly to Prolific platform
- Prolific handles participant recruitment and payment
- Participants authenticate automatically via Prolific tokens
- Participants are routed through the deployment for tracking
- Completion codes returned to Prolific for payment approval

**Key Features:**
- **Payment Management**: Set reward per participant (minimum $1.25 USD)
- **Participant Screening**: Advanced eligibility filters
- **Device Requirements**: Desktop, Tablet, Mobile compatibility
- **Quality Control**: Automatic or manual approval
- **Real-time Monitoring**: Track participant progress within the deployment
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
- If participant declines, they receive a `NO_CONSENT` code
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
- Each participant is tracked within their specific deployment

### Waiting Room Configuration

Configure how participants wait for experiments to begin:

1. Set minimum participant requirements in the experiment design
2. Configure maximum waiting time
3. Define messages shown to waiting participants
4. Set automatic start conditions

## Email Communications

### Invitation Emails (Private Enrollment)

When using Private Enrollment, the system automatically sends invitation emails:

**For Registered Participants:**
- **Subject**: Invitation to participate in "[Experiment Name]"
- **Content**: Experiment description, estimated duration, direct join link (includes deployment ID)
- **Delivery**: Sent via AWS SES with delivery tracking
- **Success/Failure**: Tracked and displayed in the deployment recruitment panel

**For Non-Registered Users:**
- **Subject**: Invitation to participate in "[Experiment Name]"
- **Content**: Experiment details, registration instructions, combined registration + join link
- **Registration Flow**: User creates account, then automatically directed to the deployment
- **Delivery Tracking**: Success/failure status available in the deployment

**Email Template Customization:**
- Templates can be customized by administrators
- Edit via Admin Dashboard > Email Templates > "Participant Invitation"
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

1. Set the payment amount in your Prolific study settings within the deployment
2. Configure completion codes for payment verification
3. Payments are handled directly through Prolific's platform

### Manual Compensation Tracking

For non-Prolific studies:

1. Export participant completion data from the deployment
2. Process payments through your preferred method
3. Track compensation status in your records

## Privacy and Consent

### Consent Forms

Configure informed consent:

1. Add consent forms in the Experiment Designer (design-level setting)
2. Participants must accept before proceeding in any deployment of that experiment
3. Consent records are stored with participant data within the deployment
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
Deployment: "Emotion Recognition - Spring 2026"
Recruitment Method: Prolific Integration
Compensation: $15.00 USD (30 minutes x $30/hour)
Target Count: 100 participants
Device Requirements: Desktop only, Webcam required
Participant Filters:
  - Age: 18-65
  - Location: United States
  - Approval Rate: > 95%
Consent: Required (unified HyperStudy consent form)
Completion: Auto-approve on SUCCESS code
```

**Workflow:**
1. Create deployment linked to your experiment
2. Configure Prolific study within the deployment
3. Publish to Prolific
4. Participants recruited via Prolific platform
5. Authenticate automatically with Prolific tokens
6. Complete consent > experiment > completion code
7. Prolific processes payment
8. Data available in deployment's data management

---

### Example 2: Classroom Study (Private Enrollment)

**Scenario:** Course assignment for psychology students, invitation-only

**Configuration:**
```
Deployment: "Psych 101 - Lab Assignment 3"
Recruitment Method: Private Enrollment
Invitation Method: Select Existing Participants
Target: Students registered as "Student_Psych101"
Waiting Room: Pairs (2 participants), 10-minute timeout
Roles: Speaker, Listener
Consent: Required (course-specific consent)
Compensation: Course credit (tracked manually)
```

**Workflow:**
1. Create deployment for this lab assignment
2. Students register for accounts with .edu email
3. Open deployment, go to Recruitment section
4. Search for students by email domain
5. Select all students from roster
6. Click "Send Invitations"
7. Students receive email invitations
8. Students join at their convenience (pairs matched in waiting room)

---

### Example 3: Pilot Study (Private Enrollment - Email Invitations)

**Scenario:** Testing new experiment with colleagues, some not registered

**Configuration:**
```
Deployment: "Pilot Test - v2"
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
1. Create a deployment for pilot testing
2. Enter colleague email addresses in the recruitment panel
3. Click "Send Invitations"
4. Non-registered colleagues create accounts
5. Automatically directed to experiment through the deployment
6. Provide feedback via debrief questions

---

### Example 4: Public Online Study

**Scenario:** Open study on decision-making, anonymous participation

**Configuration:**
```
Deployment: "Decision Making - Open Recruitment"
Recruitment Method: Public Enrollment
Access: Any registered participant via link
Waiting Room: Single-participant, immediate start
Consent: Required (detailed IRB-approved consent)
Compensation: None (voluntary participation)
```

**Workflow:**
1. Create deployment with Public Enrollment
2. Copy the participation URL from the deployment
3. Share link on social media, forums, email lists
4. Participants register/login and follow the link
5. Complete consent > immediate experiment start

## Best Practices

### Recruitment Planning

1. **Clear Instructions**: Provide detailed participation instructions
2. **Technical Requirements**: Clearly state browser and device requirements
3. **Time Estimates**: Give accurate completion time estimates
4. **Availability**: Consider timezone differences for international participants
5. **Separate Deployments**: Create distinct deployments for different recruitment waves

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
| Participants not linked to deployment | Verify the participation URL includes the `deploymentId` parameter |

## Next Steps

Now that you understand recruitment settings, explore these related topics:

- [Deployments](../deployments.md) - Managing deployment lifecycle and tracking
- [Prolific Integration](./prolific-integration.md) - Detailed Prolific setup guide
- [Waiting Room Configuration](../experiment-design/waiting-room.md) - Waiting room settings
- [Consent Forms](../experiment-design/consent-forms.md) - Configuring informed consent
