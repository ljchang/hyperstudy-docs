---
title: Global States
sidebar_position: 5
---

# Global States

Global States are special elements that can remain visible and active across multiple experiment states. Unlike experiment states, global states provide consistent functionality throughout the experiment, making them ideal for ongoing interactions or data collection.


## Understanding Global Components

### What Makes Components "Global"

Global States:

1. **Persist Across Experiment States**: Remain visible as participants move through different states
2. **Maintain Their State**: Preserve their data and configuration
3. **Can Be Toggled**: Visibility can be toggled per state
4. **Have Consistent Configuration**: Share settings across the experiment
5. **Work Independently**: Function without interfering with experiment states

### When to Use Global States

Use global states when you need:

- Continuous communication between participants (video chat, text chat)
- Ongoing data collection throughout multiple states (continuous ratings)

## Available Global States

The platform includes several built-in global components:

| Component                                              | Description                         | Common Uses                          |
| ------------------------------------------------------ | ----------------------------------- | ------------------------------------ |
| [Video Chat](./components/videochat.md)                | Real-time audio/video communication | Participant interactions, interviews |
| Text Chat                                               | Text messaging between participants | Text-based communication             |
| [Continuous Rating](./components/continuous-rating.md) | Real-time rating scale              | Ongoing assessment during stimuli    |
| [Sparse Rating](./components/sparse-rating.md)         | Time-based rating prompts           | Moment-specific evaluations          |

Each component is documented in detail in its own section.

## Setting Up Global States

### Enabling Global States

To set up global states for your experiment:

1. In the Experiment Designer, go to the "Global States" tab
2. For each state you want to use:
   - Toggle the component's "Enabled" switch
   - Configure the component's properties
   - Set default visibility across states


### The Global State Matrix

The matrix view shows which global states are visible in which experiment states:

1. Rows represent experiment states
2. Columns represent global states
3. Checkboxes indicate visibility in each state
4. Use the matrix to quickly adjust visibility patterns

This provides a comprehensive overview of component visibility throughout the experiment.

### Component Properties

Each global component has configurable properties:

1. **Basic Settings**: Name, description, and general behavior
2. **Appearance**: Size, position, and styling
3. **Behavior**: Functionality and interactive features
4. **Role Visibility**: Which participant roles can see/use the component
5. **Data Collection**: How participant interactions are recorded

Configure these in the component's properties panel.

## Visibility Management

### State-Specific Visibility

You can control which states show which components:

1. In the Global Components Matrix, check/uncheck boxes for each state-component pair
2. Alternatively, select a state and adjust which components are visible
3. Use bulk selection tools to quickly set patterns (e.g., "show in all states")

This allows for precise control over the participant experience.

### Role-Based Visibility

You can also control which roles see which global components:

1. In the component configuration, find "Role Visibility"
2. Check/uncheck roles to grant/restrict access
3. Configure role-specific appearances or functionality

For example, showing a timer only to the experiment facilitator.

## Common Usage Patterns

### Communication Components

Video Chat and Text Chat components are typically used for:

1. **Participant Interaction**: Allowing participants to see and talk to each other
2. **Facilitated Discussions**: Guided conversations with an experimenter
3. **Reaction Capture**: Recording facial/verbal responses to stimuli
4. **Instructions and Guidance**: Providing real-time help from experimenters

### Measurement Components

Continuous Rating components are used for:

1. **Real-time Assessment**: Capturing moment-by-moment reactions
2. **Ongoing Monitoring**: Tracking changes in perception over time
3. **Dual-Task Paradigms**: Rating while engaging with other content
4. **Comparative Evaluation**: Rating across multiple states or stimuli

### Component Initialization

Global components are:

1. Initialized when the experiment begins
2. Configured based on experiment-level settings
3. Rendered based on state-specific visibility settings
4. Updated when visibility or configuration changes

### State Persistence

Global components maintain their state:

1. Data persists when moving between states
2. Configuration remains consistent
3. Ongoing interactions continue uninterrupted
4. Component resumes from previous state when re-shown

### Data Collection

Data from global components:

1. Can be continuously recorded throughout the experiment
2. Is associated with specific states when relevant
3. Can be timestamped for synchronization with other data
4. Is stored in experiment variables for analysis

## Best Practices

### Performance Considerations

1. **Limit Active Components**: Enable only necessary global components
2. **Consider Resource Usage**: Video chat is resource-intensive
3. **Test Combinations**: Verify performance with all planned components
4. **Mobile Compatibility**: Check how components work on smaller screens

### UX Design

1. **Consistent Positioning**: Keep global components in consistent locations
2. **Avoid Overcrowding**: Limit the number of simultaneous global components
3. **Clear Visual Hierarchy**: Ensure focus components remain prominent
4. **Responsive Layout**: Test how components adapt to different screen sizes

### Experimental Design

1. **Purposeful Use**: Only include global components that serve clear functions
2. **Participant Awareness**: Inform participants about persistent elements
3. **Data Planning**: Consider how global component data integrates with other measures
4. **Balancing Attention**: Ensure global components don't distract from primary tasks

## Example Configurations

### Interview Setup

```
Global Components:
- Video Chat: Enabled (all states)
  - Roles: Interviewer can control audio/video, Participant can only toggle own audio/video
- Text Chat: Disabled
- Continuous Rating: Disabled
```

### Media Co-Viewing with Discussion

```
Global Components:
- Video Chat: Enabled (discussion states only)
  - Size: Small, Position: Bottom-right
- Text Chat: Enabled (all states)
  - Position: Right side
- Continuous Rating: Enabled (during media states)
  - Prompt: "How engaging is this content?"
  - Position: Bottom of screen
```

### Continuous Evaluation Study

```
Global Components:
- Video Chat: Disabled
- Text Chat: Disabled
- Continuous Rating: Enabled (all states)
  - Multiple instances with different prompts:
    - "Emotional Impact" (top)
    - "Personal Relevance" (middle)
    - "Credibility" (bottom)
```

## Troubleshooting

### Common Issues

1. **Component Not Appearing**: Check both global enablement and state-specific visibility
2. **Inconsistent Behavior**: Verify configuration is correct and consistent
3. **Performance Problems**: Reduce the number of active global components
4. **Position Conflicts**: Adjust layout to prevent overlapping components

### Diagnosing Problems

When global components don't work as expected:

1. Check the Global Components Matrix for correct visibility settings
2. Verify the component is enabled at the experiment level
3. Check role permissions for visibility restrictions
4. Test in preview mode to confirm configuration
5. Review browser console for technical errors

## Next Steps

To learn more about specific global components:

- [Video Chat Component](./components/videochat.md)
- Text Chat Component (documentation coming soon)
- [Continuous Rating Component](./components/continuous-rating.md)
- [Sparse Rating Component](./components/sparse-rating.md)
