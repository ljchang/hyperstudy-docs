---
title: Code Component
sidebar_position: 8
---

# Code Component

The Code component displays syntax-highlighted code snippets. It's useful for programming experiments, code review tasks, or any situation where you need to present formatted code to participants.

import StorybookEmbed from '@site/src/components/StorybookEmbed';

<StorybookEmbed story="experiment-code--javascript" height="400px" />

## Key Features

- Syntax highlighting for multiple languages
- Support for JavaScript, Python, HTML, SQL, and more
- Optional continue button
- Customizable appearance
- Line numbers display

## When to Use

Use the Code component when you need to:

- Present code for participants to read or review
- Display programming problems or puzzles
- Show code examples in educational experiments
- Present stimuli for code comprehension studies
- Display formatted text that benefits from monospace font

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Code** | The code snippet to display | *(required)* |
| **Language** | Programming language for syntax highlighting | `javascript` |
| **Show Continue Button** | Display a button to proceed | `false` |
| **Continue Button Text** | Text for the continue button | `"Continue"` |

### Supported Languages

The Code component supports syntax highlighting for:

- **JavaScript** / TypeScript
- **Python**
- **HTML** / CSS
- **SQL**
- **JSON**
- **Markdown**
- **C** / C++ / C#
- **Java**
- **Go**
- **Rust**
- **And many more...**

### Appearance Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Theme** | Color theme for syntax highlighting | `dark` |
| **Show Line Numbers** | Display line numbers | `true` |
| **Font Size** | Code font size | `14px` |
| **Max Height** | Maximum height before scrolling | *none* |

## Examples

### JavaScript Code

<StorybookEmbed story="experiment-code--javascript" height="400px" />

### Python Code

<StorybookEmbed story="experiment-code--python" height="400px" />

### HTML Code

<StorybookEmbed story="experiment-code--html" height="400px" />

### With Continue Button

<StorybookEmbed story="experiment-code--with-continue" height="350px" />

## Data Collection

When using a continue button, the component stores:

- **Response Time**: Time from display to button click
- **Timestamps**: When displayed and when continued

Example data structure:
```json
{
  "continued": true,
  "responseTime": 12456,
  "timestamps": {
    "displayed": 1621453287000,
    "continued": 1621453299456
  }
}
```

## Best Practices

1. **Choose the Right Language**: Select the correct language for proper syntax highlighting
2. **Readable Font Size**: Ensure code is large enough to read comfortably
3. **Appropriate Length**: Keep code snippets focused on the relevant portion
4. **Context**: Provide explanation text before or after the code if needed
5. **Line Numbers**: Enable line numbers when you'll reference specific lines

## Use Cases

### Code Comprehension Study
Display code and ask participants to predict output or identify bugs.

### Programming Education
Show example code with explanations as part of learning materials.

### Code Review Task
Present code snippets and ask participants to evaluate quality or find issues.

### Algorithm Comparison
Show different implementations of the same algorithm.

## Related Components

- **[Text Display](./text.md)** - For formatted text without syntax highlighting
- **[Multiple Choice](./multiple-choice.md)** - For questions about the code
- **[Text Input](./text-input.md)** - For code-related open responses
