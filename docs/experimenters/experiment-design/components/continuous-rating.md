---
title: Continuous Rating Component
sidebar_position: 7
---

# Continuous Rating Component

The Continuous Rating component allows participants to provide real-time, ongoing assessments throughout an experiment. As a global component, it can persist across multiple states, enabling moment-by-moment ratings during various tasks, stimuli presentations, or interactions.


## Key Features

- Real-time continuous rating capture
- Customizable scale range and appearance
- Timeline visualization of rating history
- Configurable sampling rate
- Integration with video/audio stimuli timecodes
- Data export with precise timestamps
- Optional automatic reset between states
- Multiple instances for different dimensions

## When to Use

Use the Continuous Rating component when you need to:

- Capture moment-by-moment reactions to dynamic stimuli
- Track fluctuating subjective states over time
- Measure ongoing responses during interactions
- Record emotional reactions throughout an experience
- Collect continuous feedback during extended activities
- Compare perceived changes across different aspects

## Configuration

### Basic Settings


| Setting | Description | Default |
|---------|-------------|---------|
| **Prompt/Question** | Text describing what to rate | *(required)* |
| **Minimum Value** | Lowest value on the scale | `0` |
| **Maximum Value** | Highest value on the scale | `100` |
| **Left Label** | Text for minimum value | `""` |
| **Right Label** | Text for maximum value | `""` |
| **Initial Value** | Starting position | `50` |
| **Sampling Rate** | How often to record values (ms) | `250` |
| **Width** | Component width (px or %) | `80%` |
| **Height** | Component height (px) | `60px` |
| **Position** | Component placement | `Bottom` |

### Visual Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Show Current Value** | Display numeric value | `false` |
| **Show History** | Display rating history visualization | `true` |
| **History Duration** | How much history to display (seconds) | `30` |
| **Track Color** | Color of the slider track | `#e0e0e0` |
| **Thumb Color** | Color of the draggable handle | `#2196f3` |
| **History Color** | Color of the history visualization | `rgba(33, 150, 243, 0.3)` |
| **Show Center Line** | Display line at midpoint | `true` |
| **Label Font Size** | Size of endpoint labels | `12px` |

### Behavior Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Reset Between States** | Clear rating when changing states | `false` |
| **Require Interaction** | Require participants to move slider | `false` |
| **Lock After Idle** | Lock slider after period of no movement | `false` |
| **Idle Timeout** | Time before locking (ms) | `5000` |
| **Show Instructions** | Display usage instructions | `true` |

## Data Collection

### Stored Values

The Continuous Rating component records:

- **Timestamped Ratings**: Value and precise timestamp
- **Interaction Events**: When participants start/stop rating
- **Sample Rate**: Configurable frequency of data points
- **State Context**: Which experiment state the rating occurred in

Example data structure:
```json
{
  "componentId": "mood-rating",
  "data": [
    {"timestamp": 1621453287000, "value": 50, "state": "introduction"},
    {"timestamp": 1621453287250, "value": 52, "state": "introduction"},
    {"timestamp": 1621453287500, "value": 55, "state": "introduction"},
    {"timestamp": 1621453287750, "value": 60, "state": "introduction"},
    // ... more data points
  ],
  "events": [
    {"type": "start", "timestamp": 1621453287000},
    {"type": "pause", "timestamp": 1621453290000},
    {"type": "resume", "timestamp": 1621453292000},
    {"type": "stateChange", "timestamp": 1621453300000, "fromState": "introduction", "toState": "videoStimulus"}
  ],
  "config": {
    "minValue": 0,
    "maxValue": 100,
    "sampleRate": 250
  }
}
```

### Data Synchronization

The component supports synchronization with other experimental elements:

- **Media Timecodes**: Align ratings with video/audio timestamps
- **State Transitions**: Mark when state changes occur
- **Event Markers**: Record when significant events happen
- **Multi-Participant Alignment**: Synchronize across participant timelines

This enables precise analysis of ratings in context.

## Types of Continuous Ratings

### Emotional Response Tracking

Monitor emotional reactions in real-time:

```
Prompt: "How does this content make you feel?"
Min Value: -100
Max Value: 100
Left Label: "Very negative"
Right Label: "Very positive"
Center Line: Enabled
```

### Engagement Monitoring

Track participant engagement:

```
Prompt: "How engaging is this content?"
Min Value: 0
Max Value: 100
Left Label: "Not engaging"
Right Label: "Highly engaging"
Show History: true
History Duration: 60 seconds
```

### Multi-Dimensional Assessment

Use multiple instances to track different dimensions:

```
Instance 1:
Prompt: "Pleasantness"
Position: Top-left

Instance 2:
Prompt: "Arousal"
Position: Top-right

Instance 3:
Prompt: "Relevance"
Position: Bottom
```

### Task Difficulty Rating

Monitor perceived difficulty:

```
Prompt: "How difficult is this task currently?"
Min Value: 0
Max Value: 10
Left Label: "Very easy"
Right Label: "Very difficult"
Sampling Rate: 500ms
```

## Advanced Features

### Timeline Visualization

The history visualization shows rating patterns:

1. **Scrolling Timeline**: Shows recent rating history
2. **Shaded Area**: Represents rating intensity over time
3. **Marker Events**: Can show significant events on timeline
4. **Current Position**: Indicates current rating in context

Configure appearance and duration in settings.

### Media Integration

Integrate with media components:

1. Enable "Media Sync" option
2. Select the media component to sync with
3. Ratings will be recorded with media playback time
4. Export includes both real time and media time

This allows precise analysis of reactions to specific media moments.

### Event Markers

Add markers for significant events:

1. Configure event triggers in the experiment
2. Events appear as vertical lines on the timeline
3. Export includes marker positions with descriptions
4. Use for identifying key moments in the rating data

### Aggregated Views

For experimenter monitoring:

1. Enable "Aggregated View" in experimenter interface
2. See combined ratings from all participants
3. View statistics like average, median, range
4. Identify consensus and divergence in real-time

## Implementation Examples

### Video Stimulus Rating

```
Configuration:
- Prompt: "How engaging is this video?"
- Media Sync: Enabled, linked to video component
- Position: Bottom of screen
- Show History: true
- History Duration: 60 seconds
- Reset Between States: true
```

### Conversation Assessment

```
Configuration:
- Prompt: "How much do you agree with what is being said?"
- Position: Right side panel
- Min Value: -100
- Max Value: 100
- Left Label: "Strongly disagree"
- Right Label: "Strongly agree"
- Center Line: true
- Reset Between States: false
```

### Multiple Affect Dimensions

```
Configuration:
Component 1: "Mood Rating"
- Prompt: "Valence (negative-positive)"
- Position: Bottom-left

Component 2: "Arousal Rating"
- Prompt: "Arousal (calm-excited)"
- Position: Bottom-right

Both:
- Show History: true
- Sampling Rate: 200ms
- Show Current Value: true
```

## Analysis Approaches

### Time Series Analysis

Analyze rating patterns:

- **Trend Analysis**: Overall direction and slope
- **Variability Metrics**: Standard deviation, range
- **Change Points**: Significant shifts in ratings
- **Frequency Analysis**: Cyclic patterns in ratings
- **Cross-correlation**: Relationship with other time series

### Event-Related Analysis

Analyze ratings around specific events:

- **Pre/Post Comparisons**: Changes following events
- **Response Latency**: Time between event and rating change
- **Peak Response**: Maximum change after events
- **Recovery Time**: Return to baseline after events

### Participant Comparison

Compare ratings between participants:

- **Synchrony**: Correlation between participant ratings
- **Divergence Points**: When ratings start to differ
- **Consensus Analysis**: Agreement across participants
- **Individual Differences**: Characteristic rating patterns

## Best Practices

### Experimental Design

1. **Clear Instructions**: Explain exactly what participants should rate
2. **Appropriate Scale**: Choose meaningful scale endpoints and labels
3. **Consider Cognitive Load**: Be aware of dual-task demands
4. **Practice Phase**: Allow participants to familiarize with the interface
5. **Interpret Carefully**: Continuous ratings have natural lag and biases

### Technical Setup

1. **Appropriate Sampling**: Balance data resolution with analysis needs
2. **Test Performance**: Verify the interface remains responsive
3. **Data Volume**: Be aware of the amount of data generated
4. **Synchronization**: Test timing alignment with other components
5. **Mobile Compatibility**: Ensure usability on touch devices

## Troubleshooting

### Common Issues

| Issue | Potential Solutions |
|-------|---------------------|
| Participants not moving slider | Enable "Require Interaction" option; improve instructions |
| Too much/little data | Adjust sampling rate appropriately |
| Timeline not showing | Check "Show History" setting; verify history duration |
| Performance issues | Reduce sampling rate; simplify visualization |
| Missing data points | Check for technical errors; verify continuous data collection |

## Component Combinations

The Continuous Rating component works well with:

- **Video Component**: Rate reactions to video content
- **Audio Component**: Rate responses to audio stimuli
- **Video Chat**: Rate ongoing conversations
- **Text Display**: Rate responses to narratives
- **Multiple Continuous Ratings**: For multi-dimensional assessment

## Alternatives to Consider

- **VAS Rating Component**: For single-point rather than continuous assessment
- **Multiple Choice**: For categorical rather than continuous responses
- **Text Input**: For qualitative rather than quantitative feedback