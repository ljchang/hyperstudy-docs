---
title: Participant Assignment
sidebar_position: 2
---

# Participant Assignment

In HyperStudy, participant assignment to roles happens automatically when participants join your experiment. This guide explains how the automatic assignment system works and how to configure it for your experimental design.

## Understanding Automatic Role Assignment

### Key Concepts

The automatic assignment system handles:

1. **Roles**: Different positions or functions within your experiment (e.g., "Role 0", "Role 1", "Role 2")
2. **Random Assignment**: Participants are randomly assigned to available roles when they join
3. **Balanced Distribution**: The system attempts to balance the number of participants across roles
4. **Real-time Assignment**: Assignment happens immediately when participants enter the waiting room

### How Assignment Works

The assignment process is fully automated:

1. Participant clicks the experiment link and joins
2. System checks available roles in the experiment
3. Participant is randomly assigned to a role with available slots
4. Assignment is recorded and maintained throughout the experiment
5. Participant sees role-specific content and interfaces

## Configuring Roles

### Setting Up Roles in Your Experiment

To configure roles for your experiment:

1. Open your experiment in the Experiment Designer
2. Navigate to the "Roles" section
3. Define the number of roles needed (e.g., 2 for dyadic interactions, 4 for group tasks)
4. Configure role-specific settings for components
5. Save your experiment configuration

### Role-Specific Component Configuration

Many components can have different settings for different roles:

1. **Video Chat**: Control who can see whom
2. **Rating Scales**: Show different questions to different roles
3. **Instructions**: Provide role-specific task descriptions
4. **Media**: Show different videos or images to different roles

Example configuration for a two-role experiment:
```javascript
{
  "roles": {
    "count": 2,
    "names": ["Role 0", "Role 1"]
  },
  "components": {
    "instructions": {
      "roleConfigs": {
        "0": { "text": "You are the speaker..." },
        "1": { "text": "You are the listener..." }
      }
    }
  }
}
```

## Assignment Distribution

### How the System Balances Roles

The automatic assignment system uses these principles:

1. **Equal Distribution**: Attempts to keep equal numbers in each role
2. **Random Selection**: When multiple roles have the same count, randomly selects
3. **Fill Order**: Fills roles that have fewer participants first
4. **No Reassignment**: Once assigned, participants keep their role throughout

### Example Assignment Patterns

For a 2-role experiment with 6 participants joining:
- Participant 1 → Role 0 (random)
- Participant 2 → Role 1 (balance)
- Participant 3 → Role 0 (balance)
- Participant 4 → Role 1 (balance)
- Participant 5 → Role 0 (balance)
- Participant 6 → Role 1 (balance)
- Result: 3 in Role 0, 3 in Role 1

## Working with Assigned Roles

### Accessing Role Information

In your experiment, you can access participant role information:

1. **In Components**: Use role-specific configurations
2. **In Data**: Role information is recorded with all participant responses
3. **In Analysis**: Filter and analyze data by role

### Role-Based Experiment Flow

Design your experiment to accommodate automatic role assignment:

1. **Flexible Instructions**: Write instructions that work for random assignment
2. **Clear Role Descriptions**: Make role differences obvious to participants
3. **Balanced Tasks**: Ensure all roles have engaging activities
4. **Role Indicators**: Consider showing participants their assigned role

## Multi-Participant Coordination

### Waiting Room and Role Assignment

The waiting room manages role-assigned participants:

1. Participants join and receive role assignments
2. Waiting room shows current participants and their roles
3. Experiment starts when minimum requirements are met
4. Late joiners are assigned to available roles

### Group Formation with Roles

For experiments requiring specific role combinations:

1. Set minimum participants per role in waiting room settings
2. Configure whether all roles must be present to start
3. Define timeout behavior if roles aren't filled
4. System automatically manages role-based group formation

## Implementation Examples

### Dyadic Interaction Study

```
Configuration:
- Number of Roles: 2
- Assignment: Automatic random
- Minimum to Start: 1 of each role
- Components: Role-specific instructions and tasks
- Data Collection: Responses tagged with role ID
```

### Group Decision-Making Experiment

```
Configuration:
- Number of Roles: 4 (e.g., different information conditions)
- Assignment: Automatic balanced distribution
- Minimum to Start: At least 3 participants
- Components: Role-specific information displays
- Interaction: All roles can communicate via chat
```

### Observer Study

```
Configuration:
- Number of Roles: 3 (2 actors, 1 observer)
- Assignment: Automatic with 2:1 ratio
- Components: Actors see task, observer sees both actors
- Data: Different measures for actors vs. observers
```

## Best Practices

### Designing for Automatic Assignment

1. **Role Neutrality**: Design roles that are equally engaging
2. **Clear Differentiation**: Make role differences obvious and meaningful
3. **Flexible Numbers**: Design experiments that work with varying role distributions
4. **Pilot Testing**: Test with different role assignments to ensure balance

### Participant Communication

1. **Set Expectations**: Inform participants that roles are randomly assigned
2. **Explain Roles**: Provide clear descriptions of what each role involves
3. **Equal Value**: Emphasize that all roles are important to the research
4. **No Switching**: Clarify that role assignments cannot be changed

### Data Considerations

1. **Track Assignments**: Role information is automatically recorded
2. **Balanced Analysis**: Plan analyses that account for role differences
3. **Sample Size**: Ensure adequate participants per role for statistical power
4. **Role Effects**: Consider role as a factor in your analysis

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Uneven role distribution | This is normal with small samples; increases balance with more participants |
| Participants confused about roles | Improve role descriptions in instructions; add visual role indicators |
| Experiment won't start | Check minimum participant requirements; adjust waiting room settings |
| Role-specific content not showing | Verify component role configurations; check role assignment in data |
| Need specific role assignments | Current system is random; consider post-hoc grouping in analysis |

## Limitations

The current automatic assignment system:

- Cannot pre-assign specific participants to specific roles
- Cannot change assignments once made
- Cannot guarantee exact role balance with small samples
- Does not support complex assignment rules or conditions

For experiments requiring specific assignment control, consider:
- Running separate sessions for different conditions
- Using role as a between-subjects factor
- Post-hoc classification based on participant characteristics

## Next Steps

Now that you understand automatic role assignment:

- [Waiting Room Configuration](../experiment-design/waiting-room.md)
- [Role-Specific Components](../experiment-design/roles.md)
- [Experiment States](../experiment-design/experiment-states.md)
- [Data Collection](../../developers/data-api/data-collection-v2.md)