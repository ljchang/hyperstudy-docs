---
title: Text Input Component
sidebar_position: 5
---

# Text Input Component

The Text Input component allows participants to provide free-form text responses. It supports single-line inputs, multi-line text areas, and specialized input types like email and number.

import StorybookEmbed from '@site/src/components/StorybookEmbed';

<StorybookEmbed story="experiment-textinput--default" height="400px" />

## Key Features

- Single-line and multi-line input modes
- Character count and limits
- Input validation (email, number, minimum/maximum length)
- Placeholder text
- Required field enforcement
- Customizable appearance

## When to Use

Use the Text Input component when you need to:

- Collect open-ended responses
- Gather short answers or comments
- Collect specific data types (email, numbers)
- Allow participants to explain their choices
- Capture qualitative feedback

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Prompt** | Question or instruction for participants | *(required)* |
| **Placeholder** | Hint text shown when input is empty | `""` |
| **Input Type** | Type of input: text, textarea, email, number | `text` |
| **Required** | Whether a response must be provided | `false` |
| **Output Variable** | Variable to store the response | *(required)* |

### Text Validation

| Setting | Description | Default |
|---------|-------------|---------|
| **Min Length** | Minimum character count required | `0` |
| **Max Length** | Maximum character count allowed | *none* |
| **Show Character Count** | Display current/max characters | `false` |

### Number Input Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Min** | Minimum allowed value | *none* |
| **Max** | Maximum allowed value | *none* |
| **Step** | Increment for number input | `1` |

### Multi-line Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Rows** | Number of visible text rows | `4` |
| **Resize** | Allow user to resize the textarea | `vertical` |

### Appearance

| Setting | Description | Default |
|---------|-------------|---------|
| **Background Color** | Input field background | *theme default* |
| **Text Color** | Input text color | *theme default* |
| **Border Color** | Input border color | *theme default* |

## Input Types

### Single-Line Text

<StorybookEmbed story="experiment-textinput--default" height="350px" />

Standard text input for short responses.

### Multi-Line Textarea

<StorybookEmbed story="experiment-textinput--multi-line" height="400px" />

For longer responses that may span multiple lines.

### With Character Limit

<StorybookEmbed story="experiment-textinput--with-character-limit" height="350px" />

Shows character count and enforces maximum length.

### Email Input

<StorybookEmbed story="experiment-textinput--email-input" height="350px" />

Validates email format before submission.

### Number Input

<StorybookEmbed story="experiment-textinput--number-input" height="350px" />

Accepts only numeric values with optional min/max constraints.

## Data Collection

The Text Input component stores:

- **Response Value**: The text entered by the participant
- **Response Time**: Time from display to submission
- **Timestamps**: When displayed, first keystroke, and submitted

Example data structure:
```json
{
  "value": "This is my response to the question.",
  "responseTime": 15234,
  "timestamps": {
    "displayed": 1621453287000,
    "firstKeypress": 1621453290125,
    "submitted": 1621453302234
  }
}
```

## Best Practices

1. **Clear Prompts**: Write specific questions that guide participants
2. **Appropriate Length**: Use textarea for longer responses, single-line for brief answers
3. **Reasonable Limits**: Set min/max length based on expected response depth
4. **Helpful Placeholders**: Provide example responses when helpful
5. **Validation Feedback**: Let participants know when their input doesn't meet requirements

## Related Components

- **[Multiple Choice](./multiple-choice.md)** - For structured response options
- **[VAS Rating](./vas-rating.md)** - For continuous ratings instead of text
- **[Likert Scale](./likert-scale.md)** - For standard agreement scales
