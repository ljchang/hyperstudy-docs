---
title: Ranking Component
sidebar_position: 12
---

# Ranking Component

The Ranking component allows participants to order items by dragging them into their preferred sequence. It's ideal for preference ordering, prioritization tasks, and forced-choice rankings.

import StorybookEmbed from '@site/src/components/StorybookEmbed';

<StorybookEmbed story="experiment-ranking--default" height="450px" />

## Key Features

- Drag-and-drop reordering
- Text and image options
- Horizontal or vertical layouts
- High/low labels for scale endpoints
- Touch-friendly for mobile devices
- Customizable appearance

## When to Use

Use the Ranking component when you need to:

- Collect preference orderings
- Prioritize items or features
- Rank alternatives from best to worst
- Assess relative importance
- Create forced-choice preference data

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Prompt** | Instructions for the ranking task | *(required)* |
| **Options** | Items to be ranked | *(required)* |
| **Output Variable** | Variable to store the ranking | *(required)* |

### Options Format

Each option can include:

| Field | Description | Required |
|-------|-------------|----------|
| **text** | Display text for the item | Yes |
| **imageUrl** | Optional image URL | No |
| **value** | Value to store (defaults to text) | No |

### Layout Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Layout** | Vertical or horizontal arrangement | `vertical` |
| **Show Labels** | Display high/low labels | `true` |
| **High Label** | Label for top/right position | `"Most Important"` |
| **Low Label** | Label for bottom/left position | `"Least Important"` |

### Appearance

| Setting | Description | Default |
|---------|-------------|---------|
| **Background Color** | Container background | *theme default* |
| **Card Color** | Individual item cards | *theme default* |
| **Text Color** | Item text color | *theme default* |
| **Drag Handle** | Show drag handles | `true` |

## Examples

### Basic Text Ranking

<StorybookEmbed story="experiment-ranking--default" height="450px" />

### Horizontal Layout

<StorybookEmbed story="experiment-ranking--horizontal-layout" height="350px" />

### Without Labels

<StorybookEmbed story="experiment-ranking--no-labels" height="400px" />

## Setting Up Options

Options are defined as an array of objects:

```javascript
options: [
  { text: "Quality", imageUrl: null },
  { text: "Price", imageUrl: null },
  { text: "Speed", imageUrl: null },
  { text: "Support", imageUrl: null }
]
```

### With Images

```javascript
options: [
  { text: "Option A", imageUrl: "/media/option-a.jpg" },
  { text: "Option B", imageUrl: "/media/option-b.jpg" },
  { text: "Option C", imageUrl: "/media/option-c.jpg" }
]
```

### With Custom Values

```javascript
options: [
  { text: "First Choice", value: "choice_1" },
  { text: "Second Choice", value: "choice_2" },
  { text: "Third Choice", value: "choice_3" }
]
```

## Data Collection

The Ranking component stores the final order:

- **Ranking**: Array of items in selected order (top/left = first)
- **Response Time**: Time from display to submission
- **Interactions**: Optional tracking of drag operations

Example data structure:
```json
{
  "ranking": [
    { "text": "Quality", "position": 1 },
    { "text": "Price", "position": 2 },
    { "text": "Speed", "position": 3 },
    { "text": "Support", "position": 4 }
  ],
  "responseTime": 8934,
  "timestamps": {
    "displayed": 1621453287000,
    "firstDrag": 1621453290125,
    "submitted": 1621453295934
  }
}
```

## Analyzing Ranking Data

### Average Rank
Calculate the mean position for each item across participants.

### Rank Frequencies
Count how often each item appears in each position.

### Kendall's Tau
Measure agreement between participants' rankings.

### Top-K Analysis
Examine which items most frequently appear in top positions.

## Best Practices

1. **Clear Instructions**: Explain what "higher" and "lower" mean in context
2. **Reasonable Number**: Keep to 3-7 items for manageable rankings
3. **Distinct Options**: Ensure items are clearly different from each other
4. **Meaningful Labels**: Use labels that match your research question
5. **Mobile Testing**: Verify drag-and-drop works on touch devices
6. **Random Initial Order**: Consider randomizing starting positions

## Common Use Cases

### Feature Prioritization
```
Prompt: "Rank these features from most to least important to you:"
Options: [Quality, Price, Speed, Support, Design]
High Label: "Most Important"
Low Label: "Least Important"
```

### Preference Ordering
```
Prompt: "Order these options from your most to least preferred:"
Options: [Option A, Option B, Option C]
High Label: "Most Preferred"
Low Label: "Least Preferred"
```

### Value Assessment
```
Prompt: "Rank these values based on their importance in your life:"
Options: [Family, Career, Health, Wealth, Happiness]
```

## Related Components

- **[Multiple Choice](./multiple-choice.md)** - For selecting without ordering
- **[Likert Scale](./likert-scale.md)** - For rating individual items on a scale
- **[VAS Rating](./vas-rating.md)** - For continuous ratings per item
