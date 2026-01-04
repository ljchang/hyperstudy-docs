---
title: Likert Scale Component
sidebar_position: 11
---

# Likert Scale Component

The Likert Scale component presents a standard ordinal scale for measuring agreement, frequency, or other survey-style responses. It supports 3, 5, 7, or custom point scales with customizable labels.

import StorybookEmbed from '@site/src/components/StorybookEmbed';

<StorybookEmbed story="experiment-likertscale--default" height="350px" />

## Key Features

- Standard 3, 5, or 7-point scales
- Custom point labels
- Endpoint and midpoint labels
- Required response enforcement
- Visual selection feedback
- Mobile-friendly design

## When to Use

Use the Likert Scale component when you need to:

- Measure agreement/disagreement with statements
- Collect frequency ratings
- Gather satisfaction scores
- Assess attitudes or opinions
- Administer standardized survey questions

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Question** | The statement or question to rate | *(required)* |
| **Scale** | Number of points (3, 5, or 7) | `5` |
| **Required** | Whether a selection is required | `false` |
| **Output Variable** | Variable to store the response | *(required)* |

### Scale Labels

| Setting | Description | Default |
|---------|-------------|---------|
| **Min Label** | Label for the lowest value | `"Strongly Disagree"` |
| **Max Label** | Label for the highest value | `"Strongly Agree"` |
| **Labels** | Custom labels for each point | *none* |

### Appearance

| Setting | Description | Default |
|---------|-------------|---------|
| **Button Style** | Visual style of options | `default` |
| **Layout** | Horizontal or vertical | `horizontal` |
| **Show Labels** | Display label text | `true` |

## Examples

### 5-Point Agreement Scale

<StorybookEmbed story="experiment-likertscale--default" height="350px" />

The classic agreement scale from "Strongly Disagree" to "Strongly Agree".

### 7-Point Satisfaction Scale

<StorybookEmbed story="experiment-likertscale--seven-point" height="350px" />

More granular options for detailed responses.

### Frequency Scale

<StorybookEmbed story="experiment-likertscale--frequency-scale" height="350px" />

Measure how often something occurs.

### Custom Labels

<StorybookEmbed story="experiment-likertscale--with-custom-labels" height="350px" />

Define specific text for each point.

## Common Scale Types

### Agreement Scale (5-point)
```
1: Strongly Disagree
2: Disagree
3: Neither Agree nor Disagree
4: Agree
5: Strongly Agree
```

### Frequency Scale (5-point)
```
1: Never
2: Rarely
3: Sometimes
4: Often
5: Always
```

### Satisfaction Scale (5-point)
```
1: Very Dissatisfied
2: Dissatisfied
3: Neutral
4: Satisfied
5: Very Satisfied
```

### Likelihood Scale (5-point)
```
1: Very Unlikely
2: Unlikely
3: Undecided
4: Likely
5: Very Likely
```

## Data Collection

The Likert Scale component stores:

- **Selected Value**: The numeric value (1 to scale size)
- **Selected Label**: The text label of the selection
- **Response Time**: Time from display to selection

Example data structure:
```json
{
  "value": 4,
  "label": "Agree",
  "responseTime": 2341,
  "timestamps": {
    "displayed": 1621453287000,
    "selected": 1621453289341
  }
}
```

## Best Practices

1. **Clear Statements**: Write unambiguous statements that participants can easily evaluate
2. **Consistent Scales**: Use the same scale type throughout related questions
3. **Appropriate Points**: Use 5-point for general purposes, 7-point when more granularity is needed
4. **Meaningful Labels**: Ensure labels accurately represent the continuum
5. **Balanced Options**: Include both positive and negative options in equal measure
6. **Neutral Option**: Include a neutral midpoint for odd-numbered scales

## Likert vs VAS Rating

| Likert Scale | VAS Rating |
|--------------|------------|
| Discrete points | Continuous scale |
| Familiar survey format | More precise measurement |
| Easier to analyze | Captures subtle differences |
| Limited options | Harder to interpret |

Choose Likert for standard surveys and questionnaires. Choose VAS when you need continuous, precise measurements.

## Related Components

- **[VAS Rating](./vas-rating.md)** - For continuous rather than discrete ratings
- **[Multiple Choice](./multiple-choice.md)** - For non-ordinal selections
- **[Ranking](./ranking.md)** - For ordering items by preference
