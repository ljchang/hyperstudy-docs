---
title: Experiment Design Overview
sidebar_position: 1
---

# Experiment Design Overview

The HyperStudy platform provides a powerful and flexible system for designing interactive experiments. This guide explains the core concepts and workflow for creating experiments.

## The Experiment Designer

The Experiment Designer is a comprehensive interface for creating and configuring experiments. It provides tabs for managing all aspects of your experiment design, from basic settings to complex state flows.

![Experiment Creation Interface](/img/experimenters/create-experiment-main.png)
_The experiment creation interface with tabs for General settings, Roles, Variables, Permissions, Recruitment, Consent, and Instructions_

## Core Concepts in Experiment Design

### States

States are the fundamental building blocks of an experiment. Each state represents a distinct phase or screen in your experiment:

- **Introduction State**: Present instructions or welcome screens
- **Stimulus State**: Show videos, images, or other media
- **Response State**: Collect data through rating scales, text input, etc.
- **Discussion State**: Enable participant interaction through video chat or text
- **Conclusion State**: Thank participants or provide debriefing information

States flow from one to another based on participant actions and predefined sequences.

### Components

Components are the interactive elements that participants see and interact with. HyperStudy offers two types:

1. **Focus Components** (State-specific): The main content for each state
   - **Media Components**:
     - Video Player (with synchronization)
     - Image Display
     - Text Display
     - Audio Recording
   - **Input Components**:
     - Multiple Choice Questions
     - Text Input
     - VAS (Visual Analog Scale) Rating
     - Continuous Rating
     - Sparse Rating
     - Rapid Rate (fast-paced rating)
     - Ranking Component
   - **Special Components**:
     - Code Component (custom JavaScript)
     - Trigger Component (hardware integration)
     - Waiting Component

2. **Global Components**: Elements that persist across multiple states
   - **Communication**:
     - Video Chat (via LiveKit)
     - Text Chat
   - **Continuous Data Collection**:
     - Continuous Rating overlay
     - Sparse Rating overlay
   - **Synchronized Media**:
     - Shared video controls
     - Synchronized playback

### Variables

Variables store data throughout the experiment. You can:

- Pre-define variables with initial values
- Capture participant responses into variables
- Use variables to control state transitions
- Set variable values based on participant actions
- Use variables in text content with expressions like `{variableName}`

Variables make your experiments dynamic and responsive to participant behavior.

### Roles

Roles define different participant experiences within the same experiment:

- Define custom roles (e.g., "Observer," "Participant," "Interviewer")
- Assign participants to roles
- Configure which components are visible to each role
- Set role-specific permissions (e.g., who can control media playback)
- Collect different data from different roles

## Experiment Design Workflow

### 1. Planning Your Experiment

Before using the designer, plan your experiment:

- Define research questions and hypotheses
- Sketch the flow of states and transitions
- List required variables and how they'll be used
- Identify necessary roles and their permissions

### 2. Creating a New Experiment

1. From your dashboard, click "New Experiment"
2. Enter a name and description
3. Configure basic settings:
   - Maximum participants
   - Default duration
   - Visibility (private/group/public)

### 3. Building States

1. Add states using the "Add State" button
2. Name each state descriptively
3. Arrange states in sequential order or create groups
4. Select the focus component for each state from the extensive component library
5. Configure component-specific properties:
   - For media: URLs, autoplay settings, synchronization
   - For ratings: scales, labels, required responses
   - For communication: permissions, recording settings

### 4. Setting Up Global Components

1. Navigate to the "Global Components" section
2. Enable desired global components:
   - Video Chat for real-time participant interaction
   - Text Chat for asynchronous communication
   - Continuous/Sparse Rating for ongoing data collection
3. Configure component properties:
   - Recording settings
   - Visibility rules
   - Role-based permissions
4. Use the Global Components Matrix to control visibility:
   - Select which states show which global components
   - Configure component behavior per state
   - Set up synchronized experiences across participants

![Global Components Configuration](/img/experimenters/experiment-global-components.png)
_Global Components configuration showing the matrix view for state-by-state visibility control_

### 5. Defining Variables

1. Go to the "Variables" tab
2. Add experiment variables with:
   - Name
   - Initial value
   - Type (string, number, boolean, object)
   - Description

### 6. Creating Roles

1. Navigate to the "Roles" tab
2. Define roles needed for your experiment (e.g., Participant A, Participant B, Observer)
3. Configure for each role:
   - Component visibility permissions
   - Media control permissions
   - Data collection settings
   - Maximum participants allowed
4. Set up role-specific experiences:
   - Different question sets
   - Unique media streams
   - Customized interfaces

![Roles Configuration](/img/experimenters/experiment-roles.png)
_Roles configuration interface for managing participant roles and permissions_

### 7. Setting Up Transitions

1. Select a state in the state list
2. Configure its "Next State" property
3. Configure state advancement options
4. Add timers or auto-advancement options if needed

### 8. Testing Your Experiment

Before recruiting participants:

1. Test all transitions and interactions
2. Verify data collection works as expected
3. Check the experiment flow with different roles

## Best Practices

### State Design

- Keep states focused on a single task or concept
- Use clear, consistent naming for states
- Order states logically in the designer
- Include instruction states before complex interactions

### Component Configuration

- Test media files before using them in experiments
- Ensure text is readable on all screen sizes
- Configure appropriate time limits
- Provide clear instructions within component content

### Variables and Logic

- Use descriptive variable names
- Document the purpose of each variable
- Test state transitions thoroughly
- Consider edge cases in participant responses

### Role Management

- Design roles with clear responsibilities
- Test the experiment from each role's perspective
- Ensure necessary permissions are granted to appropriate roles
- Balance the number of participants in each role

## Next Steps

Now that you understand the basics of experiment design, explore these topics in depth:

- [States and Flow Control](./experiment-states.md)
- [Working with Variables](./variables.md)
- [Managing Participant Roles](./roles.md)
- [Available Components](./components/index.md)
