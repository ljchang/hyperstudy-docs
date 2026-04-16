---
title: Rapid Rate Component
sidebar_position: 13
---

# Rapid Rate Component

The Rapid Rate component provides a multi-dimensional rating interface for quick assessments across multiple attributes. Participants can rate several dimensions simultaneously using parallel sliders.

import ComponentPlayground from '@site/src/components/ComponentPlayground';
import StorybookEmbed from '@site/src/components/StorybookEmbed';

<ComponentPlayground
  story="experiment-rapidrate--default"
  height="500px"
  argTypes={{
    'config.prompt': { control: 'text', multiline: true, defaultValue: 'Please rate the following dimensions:', description: 'Prompt text' },
    'config.showReferenceLines': { control: 'boolean', defaultValue: false, description: 'Show reference lines from previous ratings' },
    'config.requireClickToActivate': { control: 'boolean', defaultValue: true, description: 'Require click to activate slider' },
    'config.sensitivity': { control: 'number', defaultValue: 1.0, min: 0.1, max: 2.0, step: 0.1, description: 'Mouse drag sensitivity' },
    'config.backgroundColor': { control: 'color', defaultValue: '#1c1c1c', description: 'Background color' },
    'config.textColor': { control: 'color', defaultValue: '#ffffff', description: 'Text color' },
  }}
  presets={[
    { name: 'Emotion (VAD)', args: { 'config.prompt': 'How are you feeling right now?', 'config.dimensions': [{ label: 'Valence', minLabel: 'Negative', maxLabel: 'Positive' }, { label: 'Arousal', minLabel: 'Calm', maxLabel: 'Excited' }, { label: 'Dominance', minLabel: 'Submissive', maxLabel: 'Dominant' }] } },
    { name: 'Product eval', args: { 'config.prompt': 'Rate this product:', 'config.dimensions': [{ label: 'Quality', minLabel: 'Poor', maxLabel: 'Excellent' }, { label: 'Value', minLabel: 'Overpriced', maxLabel: 'Great Value' }, { label: 'Design', minLabel: 'Unappealing', maxLabel: 'Beautiful' }] } },
    { name: 'Immediate drag', args: { 'config.requireClickToActivate': false, 'config.sensitivity': 1.0 } },
    { name: 'High sensitivity', args: { 'config.sensitivity': 1.8, 'config.requireClickToActivate': true } },
  ]}
/>

## Key Features

- Multiple parallel rating dimensions
- Quick drag-across interaction
- Custom dimension labels
- Reference lines for comparisons
- Optional countdown timer
- Responsive design

## When to Use

Use the Rapid Rate component when you need to:

- Collect ratings across multiple dimensions quickly
- Assess emotional states (valence, arousal, dominance)
- Evaluate products or stimuli on several criteria
- Gather multi-attribute judgments in time-limited scenarios
- Compare ratings to previous responses

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Prompt** | Instructions for the rating task | *(required)* |
| **Dimensions** | Array of rating dimensions | *(required)* |
| **Output Variable** | Variable to store responses | *(required)* |

### Dimension Configuration

Each dimension includes:

| Field | Description | Default |
|-------|-------------|---------|
| **label** | Name of the dimension | *(required)* |
| **minLabel** | Label for minimum value | `"Low"` |
| **maxLabel** | Label for maximum value | `"High"` |
| **initialValue** | Starting position (0-100) | `50` |

### Display Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Show Reference Lines** | Display previous values | `false` |
| **Show Values** | Display numeric values | `false` |
| **Show Countdown** | Display time remaining | `false` |
| **Countdown Style** | Visual style of timer | `progressBar` |

## Examples

### Default Two Dimensions

<StorybookEmbed story="experiment-rapidrate--default" height="400px" />

### Emotion Rating (VAD Model)

<StorybookEmbed story="experiment-rapidrate--emotion-rating" height="450px" />

Three-dimensional emotional assessment:
- **Valence**: Negative to Positive
- **Arousal**: Calm to Excited
- **Dominance**: Submissive to Dominant

### Product Evaluation

<StorybookEmbed story="experiment-rapidrate--product-evaluation" height="500px" />

Multi-attribute product assessment:
- Quality
- Value
- Design
- Usability

### With Reference Lines

<StorybookEmbed story="experiment-rapidrate--with-reference-lines" height="400px" />

Shows previous ratings for comparison.

## Setting Up Dimensions

Dimensions are configured as an array:

```javascript
dimensions: [
  {
    label: "Valence",
    minLabel: "Negative",
    maxLabel: "Positive"
  },
  {
    label: "Arousal",
    minLabel: "Calm",
    maxLabel: "Excited"
  },
  {
    label: "Dominance",
    minLabel: "Submissive",
    maxLabel: "Dominant"
  }
]
```

### With Initial Values

```javascript
dimensions: [
  {
    label: "Quality",
    minLabel: "Poor",
    maxLabel: "Excellent",
    initialValue: 50
  },
  {
    label: "Value",
    minLabel: "Overpriced",
    maxLabel: "Great Value",
    initialValue: 50
  }
]
```

## Data Collection

The Rapid Rate component stores all dimension values:

```json
{
  "ratings": {
    "Valence": 72,
    "Arousal": 45,
    "Dominance": 58
  },
  "responseTime": 3456,
  "timestamps": {
    "displayed": 1621453287000,
    "firstInteraction": 1621453288500,
    "submitted": 1621453290456
  },
  "interactions": [
    { "dimension": "Valence", "time": 1621453288500, "value": 65 },
    { "dimension": "Valence", "time": 1621453289100, "value": 72 },
    { "dimension": "Arousal", "time": 1621453289400, "value": 45 }
  ]
}
```

## Common Dimension Sets

### Affect Grid (Russell's Model)
```
dimensions: [
  { label: "Valence", minLabel: "Unpleasant", maxLabel: "Pleasant" },
  { label: "Arousal", minLabel: "Sleepy", maxLabel: "Activated" }
]
```

### SAM (Self-Assessment Manikin)
```
dimensions: [
  { label: "Pleasure", minLabel: "Unhappy", maxLabel: "Happy" },
  { label: "Arousal", minLabel: "Calm", maxLabel: "Excited" },
  { label: "Dominance", minLabel: "Controlled", maxLabel: "In Control" }
]
```

### Product Attributes
```
dimensions: [
  { label: "Quality", minLabel: "Low", maxLabel: "High" },
  { label: "Price", minLabel: "Too Expensive", maxLabel: "Great Value" },
  { label: "Design", minLabel: "Unattractive", maxLabel: "Beautiful" }
]
```

## Best Practices

1. **Limit Dimensions**: Keep to 2-5 dimensions for quick responses
2. **Clear Labels**: Use concise, understandable endpoint labels
3. **Consistent Scales**: Use similar scales across related assessments
4. **Order Strategically**: Put most important dimensions first
5. **Time Constraints**: Consider using countdown for spontaneous ratings
6. **Reference Lines**: Use for repeated measures to show change

## Rapid Rate vs Other Rating Components

| Component | Best For |
|-----------|----------|
| **Rapid Rate** | Multiple dimensions simultaneously |
| **VAS Rating** | Single dimension, precise measurement |
| **Likert Scale** | Standard survey questions |
| **Continuous Rating** | Real-time ratings during stimuli |

## Related Components

- **[VAS Rating](./vas-rating.md)** - For single-dimension continuous ratings
- **[Likert Scale](./likert-scale.md)** - For ordinal scale ratings
- **[Continuous Rating](./continuous-rating.md)** - For real-time ratings during media
