---
title: Managing Participant Roles
sidebar_position: 4
---

# Managing Participant Roles

Roles are a powerful feature in the HyperStudy platform that allow you to create different experiences for different participants within the same experiment. This guide explains how to define, configure, and manage roles effectively.

## What are Roles?

Roles are participant categories that determine:
- What components and content each participant sees
- What permissions and capabilities they have
- What data is collected from them
- How they interact with other participants

Common role examples include:
- **Host**: Controls media playback for all participants
- **Observer**: Watches but doesn't actively participate
- **Interviewer**: Asks questions to other participants
- **Subject**: Responds to stimuli and questions
- **Confederate**: A researcher posing as a participant


## Creating and Configuring Roles

### Defining Basic Roles

To create roles for your experiment:

1. In the Experiment Designer, go to the "Roles" tab
2. Click "Add Role" to create a new role
3. Enter a name for the role (e.g., "Interviewer")
4. Set the maximum number of participants for this role
5. Configure basic permissions for the role
6. Click "Save" to create the role


### Role Properties

Each role has several configurable properties:

- **Name**: Identifying label for the role
- **Description**: Purpose and responsibilities of the role
- **Maximum Participants**: How many participants can have this role
- **Minimum Participants**: Required participants with this role (for experiment to start)
- **Permissions**: What actions the role can perform
- **Component Visibility**: Which components this role can see

### Role Permissions

You can grant different permissions to each role:

- **Media Control**: Allow controlling video/audio playback
- **Chat Permissions**: Allow sending text messages
- **Recording Control**: Allow starting/stopping recordings
- **Screen Sharing**: Allow sharing screen with others
- **Layout Control**: Allow changing the UI layout
- **State Advancement**: Allow manually advancing experiment states

Configure these in the role's permission settings.

## Role-Based Component Visibility

### Configuring Global Component Visibility

To control which global components are visible to which roles:

1. Go to the "Global Components" tab
2. Select a component (e.g., Video Chat)
3. In the properties panel, find "Role Visibility"
4. Check or uncheck roles to control visibility


### State-Specific Role Visibility

You can also configure role visibility for each state:

1. Select a state in the States panel
2. In the properties, find "Role Visibility"
3. Configure which roles can see this state
4. For roles that can't see it, configure an alternative state

This allows for role-specific experiment paths.

## Role-Specific Content

### Creating Content Variations

You can show different content to different roles:

1. Use role-based visibility settings
2. Create parallel states for different roles
3. Use conditional logic based on participant role

For example, to show different instructions:

```
if (participantRole === "interviewer") {
  instructions = "Ask the questions on your screen.";
} else if (participantRole === "subject") {
  instructions = "Answer the questions honestly.";
}
```

### Role-Specific Components

Some components can be configured differently for each role:

1. Select a component in a state
2. In the properties, look for "Role-Specific Settings"
3. Configure each property differently for each role

For example, you can show different questions or options to different roles.

## Role Interaction Patterns

### Interviewer-Interviewee

A common interaction pattern:

1. Create "Interviewer" and "Interviewee" roles
2. Give the Interviewer access to questions and prompts
3. Configure the Interviewee to see only necessary information
4. Use the Video Chat global component for interaction
5. Set up data collection for the Interviewee's responses

### Observer-Participant

For observation studies:

1. Create "Observer" and "Participant" roles
2. Give Participants the main experimental task
3. Configure Observers to see both the task and the Participants
4. Restrict Observers from communicating with Participants
5. Collect observation data from Observers

### Collaborative Tasks

For group activities:

1. Create roles for different team positions
2. Provide role-specific information and tools
3. Configure shared views for collaborative elements
4. Set up communication channels between roles
5. Track group and individual performance metrics

## Role Assignment

### Manual Assignment

To manually assign participants to roles:

1. Go to the "Participants" tab in the experiment management
2. Find the participant in the list
3. Open the role selector dropdown
4. Choose the appropriate role
5. Save the assignment


### Automatic Assignment

For automatic assignment during recruitment:

1. Configure the experiment's recruitment settings
2. Set up the desired number of participants per role
3. Define assignment rules (first-come, first-served, random, etc.)
4. Set a balanced ratio between roles if needed

### Self-Selection

Allow participants to choose their own roles:

1. Create a role selection state at the beginning of the experiment
2. Configure a role selection component
3. Set restrictions on available roles
4. Handle cases where preferred roles are already filled

## Advanced Role Features

### Role Variables

Create role-specific variables:

```
// Define variables specific to a role
interviewerQuestions = [...];
subjectResponses = [...];

// Access role-based data
if (participantRole === "interviewer") {
  currentQuestion = interviewerQuestions[questionIndex];
}
```

This helps organize your experiment variables.

### Dynamic Role Changes

In some experiments, roles may change:

1. Set up a state for role transitions
2. Use variables to track the current role
3. Update permissions and visibility based on the new role
4. Notify participants of their role change

For example, switching interviewer and interviewee halfway through.

### Role Dependencies

Configure role dependencies:

1. Define which roles must be filled for the experiment to start
2. Set up waiting states for incomplete role sets
3. Handle scenarios when participants with specific roles disconnect
4. Configure experiment continuation rules when roles are under-filled

## Role-Based Data Collection and Analysis

### Collecting Role-Specific Data

Configure data collection based on roles:

1. Define what data to collect from each role
2. Set up appropriate variables for each role
3. Use role-specific components for data collection
4. Configure export format for role-based data

### Analyzing Role-Based Data

When analyzing results:

1. Filter data by participant role
2. Compare responses between complementary roles
3. Analyze interaction patterns between roles
4. Look for role-specific trends and behaviors

The role information is included in the exported data.

## Best Practices

1. **Clear Role Definitions**: Define roles with clear purposes and responsibilities
2. **Minimal Necessary Roles**: Only create roles that serve a distinct function
3. **Role Parity**: Ensure enough participants for each required role
4. **Test All Roles**: Preview your experiment from each role's perspective
5. **Fallback Plans**: Have contingencies for when roles can't be filled
6. **Documentation**: Clearly document what each role does and sees
7. **Role Instructions**: Provide clear instructions specific to each role

## Next Steps

Now that you understand roles, explore these related topics:

- [Component Configuration](./components/index.md)
- [Participant Assignment](../recruitment/participant-assignment.md)
- [Experiment States](./experiment-states.md)