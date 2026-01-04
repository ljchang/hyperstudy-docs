---
title: VAS Rating Component
sidebar_position: 5
---

import StorybookEmbed from '@site/src/components/StorybookEmbed';

# VAS Rating Component

The Visual Analog Scale (VAS) Rating component allows participants to provide responses along a continuous scale by selecting a point that represents their answer. It's ideal for collecting subjective ratings, opinions, feelings, or perceptions on a dimensional scale.

## Interactive Demo

Try the component with different configurations:

<StorybookEmbed story="experiment-vasrating--default" showControls height="500px" />

## Key Features

- Continuous scale for precise measurement
- Customizable scale range and step size
- Horizontal or vertical orientation
- Customizable labels and tick marks
- Optional numerical value display
- Adjustable appearance and styling
- Data capture with response time metrics
- Optional default values and reset functionality

## When to Use

Use the VAS Rating component when you need to:

- Collect subjective ratings (e.g., pain, mood, agreement)
- Measure perceived intensity or magnitude
- Gather opinions on a continuous spectrum
- Collect fine-grained responses beyond discrete categories
- Measure subtle changes in perception or feeling

## Configuration

### Basic Settings


| Setting | Description | Default |
|---------|-------------|---------|
| **Question/Prompt** | The question or statement for participants to rate | *(required)* |
| **Minimum Value** | The lowest value on the scale | `0` |
| **Maximum Value** | The highest value on the scale | `100` |
| **Step Size** | Granularity of the scale (0 for continuous) | `0` |
| **Default Value** | Starting position of the slider | *(none)* |
| **Left Label** | Text label for minimum value end | `""` |
| **Right Label** | Text label for maximum value end | `""` |
| **Required** | Whether a response must be provided | `true` |
| **Submit Button Text** | Label for the submission button | `"Submit"` |
| **Output Variable** | Variable to store the rating | *(required)* |

### Scale Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| **Orientation** | Horizontal or vertical display | `Horizontal` |
| **Scale Width/Length** | Size of the rating scale (px or %) | `80%` |
| **Show Tick Marks** | Display marks at intervals | `false` |
| **Tick Interval** | Distance between tick marks | `10` |
| **Show Value** | Display numerical value | `false` |
| **Value Precision** | Decimal places to display | `0` |
| **Allow Reset** | Include button to clear selection | `false` |

### Appearance Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Track Color** | Color of the slider track | `#e0e0e0` |
| **Filled Track Color** | Color of the filled portion | `#2196f3` |
| **Thumb Color** | Color of the draggable handle | `#2196f3` |
| **Track Height** | Thickness of the slider track | `8px` |
| **Thumb Size** | Size of the draggable handle | `20px` |
| **Label Font Size** | Size of endpoint labels | `14px` |
| **Value Font Size** | Size of the numerical display | `16px` |

## Types of VAS Scales

### Standard Numeric Scale

A basic numeric range, typically from 0 to 100:

```
Prompt: "How would you rate your current level of stress?"
Min Value: 0
Max Value: 100
Left Label: "No stress"
Right Label: "Extreme stress"
```

### Bipolar Scale

Ranges from negative to positive values:

```
Prompt: "How do you feel about this policy?"
Min Value: -50
Max Value: 50
Left Label: "Strongly oppose"
Right Label: "Strongly support"
Center Label: "Neutral"
```

### Percentage Scale

Uses 0-100% range:

```
Prompt: "What percentage of the time do you experience this symptom?"
Min Value: 0
Max Value: 100
Left Label: "0%"
Right Label: "100%"
Show Value: true
Value Suffix: "%"
```

### Custom Range Scale

Uses a specific meaningful range:

```
Prompt: "Rate the temperature of the room"
Min Value: 60
Max Value: 85
Left Label: "Too cold"
Right Label: "Too hot"
Center Label: "Comfortable"
Step Size: 1
Show Value: true
Value Suffix: "°F"
```

## Advanced Features

### Intermediate Labels

You can add labels at points between the endpoints:

1. Enable "Show Intermediate Labels" in the configuration
2. Define label positions and text:
   ```
   [{position: 25, label: "Mild"}, {position: 50, label: "Moderate"}, {position: 75, label: "Severe"}]
   ```

This helps participants calibrate their responses.

### Dynamic Range

You can set the scale range dynamically:

1. Store range values in experiment variables
2. Reference these variables in the component configuration
3. Adjust ranges based on previous responses or conditions

For example, personalizing scales based on a participant's baseline.

### Conditional Visibility

You can show/hide additional questions based on the rating:

1. Store the rating value in a variable
2. Use conditional logic to show follow-up questions
3. Configure different paths based on rating ranges

For example, showing different follow-up questions for high vs. low ratings.

### Multi-Dimensional Rating

For complex assessments, use multiple scales:

1. Create multiple VAS components for different dimensions
2. Group them visually with clear labels
3. Store responses in structured variables
4. Analyze relationships between dimensions

For example, rating both valence and arousal of emotional responses.

## Data Collection

### Stored Values

The VAS component stores:

- **Selection Value**: The numerical rating value
- **Response Time**: How long it took to make the selection
- **Interaction Data**: (Optional) Tracking of handle movements

Example data structure:
```json
{
  "value": 73.5,
  "responseTime": 3245,
  "timestamps": {
    "displayed": 1621453287000,
    "firstInteraction": 1621453288125,
    "submitted": 1621453290245
  },
  "interactions": [
    {"time": 1621453288125, "position": 45},
    {"time": 1621453289430, "position": 65},
    {"time": 1621453290245, "position": 73.5}
  ]
}
```

### Response Metrics

You can analyze various aspects of the rating:

- **Final Value**: The submitted rating
- **Decision Time**: Time from presentation to submission
- **Adjustment Pattern**: Changes before final submission
- **Initial Impression**: First position selected
- **Confidence**: (Inferred from) Amount of adjustment

## Implementation Examples

### Pain Assessment

```
Prompt: "Rate your current level of pain"
Min Value: 0
Max Value: 10
Left Label: "No pain"
Right Label: "Worst possible pain"
Show Intermediate Labels: true
Labels: [
  {position: 2, label: "Mild"},
  {position: 5, label: "Moderate"},
  {position: 8, label: "Severe"}
]
Show Value: true
Value Precision: 1
```

### Emotional Response

```
Prompt: "How did this video make you feel?"
Min Value: -100
Max Value: 100
Left Label: "Very negative"
Right Label: "Very positive"
Center Label: "Neutral"
Track Color: "#e0e0e0"
Filled Track Color (negative): "#ff5252"
Filled Track Color (positive): "#4caf50"
Show Value: true
```

### Agreement Rating

```
Prompt: "The instructions for this task were clear and easy to understand."
Min Value: 0
Max Value: 100
Left Label: "Strongly disagree"
Right Label: "Strongly agree"
Show Tick Marks: true
Tick Interval: 25
Show Intermediate Labels: true
Labels: [
  {position: 25, label: "Disagree"},
  {position: 50, label: "Neutral"},
  {position: 75, label: "Agree"}
]
```

### Continuous Monitoring

```
Prompt: "Rate your engagement with the ongoing conversation"
Min Value: 0
Max Value: 100
Left Label: "Not engaged"
Right Label: "Fully engaged"
Auto-submit: true
Submission Interval: 5000 (every 5 seconds)
Store History: true
```

## Best Practices

1. **Clear Instructions**: Provide explicit guidance on how to use the scale
2. **Meaningful Anchors**: Use clear, descriptive labels at scale endpoints
3. **Appropriate Range**: Choose a scale range that makes sense for the question
4. **Consider Granularity**: Use step size to control precision when needed
5. **Visual Clarity**: Ensure the scale is large enough to select precise values
6. **Intuitive Design**: Make the scale direction align with participants' expectations
7. **Test on Mobile**: Ensure comfortable usage on touch devices
8. **Consistency**: Use similar scales for similar questions

## Accessibility Considerations

1. **Keyboard Navigation**: Ensure the scale can be operated with arrow keys
2. **Screen Reader Support**: Add appropriate ARIA labels
3. **Color Contrast**: Ensure sufficient contrast between elements
4. **Touch Target Size**: Make handle large enough for easy selection
5. **Alternative Input**: Consider number input for precise values

## Component Combinations

The VAS Rating component works well with:

- **Text Component**: Provide context or detailed instructions
- **Image/Video Component**: Rate stimuli immediately after presentation
- **Multiple Choice**: Use for initial categorization before detailed rating
- **Text Input**: Allow optional comments explaining ratings

## Comparison to Other Rating Methods

| Method | Advantages | Disadvantages |
|--------|------------|---------------|
| **VAS Rating** | Continuous data, precise measurement, captures subtle differences | Can be harder to interpret, requires more thought |
| **Likert Scale** | Familiar format, easier to complete, standardized | Limited options, less sensitive to small changes |
| **Multiple Choice** | Simple to understand, clear categories | Forced into discrete options, less nuanced |
| **Slider Rating** | Similar to VAS but with visible scale markings | Can anchor responses to visible marks |

## Alternatives to Consider

- **Continuous Rating**: When you need real-time ratings during stimulus presentation
- **Multiple Choice**: When discrete categories are more appropriate than a continuum
- **Likert Scale**: For standardized agreement scales
- **Two-dimensional Grid**: For rating two dimensions simultaneously (e.g., valence and arousal)