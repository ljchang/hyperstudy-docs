---
title: Waiting Component
sidebar_position: 9
---

# Waiting Component

The Waiting component displays a message with an optional loading spinner. It's used for transitions, synchronization points, or any situation where participants need to wait.

import StorybookEmbed from '@site/src/components/StorybookEmbed';

<StorybookEmbed story="experiment-waiting--default" height="300px" />

## Key Features

- Customizable waiting message
- Optional loading spinner
- HTML formatting support
- Customizable appearance
- Clean, non-interactive display

## When to Use

Use the Waiting component when you need to:

- Create a pause between experiment states
- Wait for other participants to catch up
- Display a processing or loading message
- Create synchronization points in multi-participant experiments
- Provide a transition between sections

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Message** | Text to display while waiting | `"Please wait..."` |
| **Show Spinner** | Display a loading animation | `true` |

### Appearance Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Background Color** | Screen background color | *theme default* |
| **Text Color** | Message text color | *theme default* |
| **Spinner Color** | Loading spinner color | *theme default* |
| **Font Size** | Message text size | `18px` |

## Examples

### Default Waiting Screen

<StorybookEmbed story="experiment-waiting--default" height="300px" />

### Waiting for Other Participants

<StorybookEmbed story="experiment-waiting--waiting-for-others" height="300px" />

### Text Only (No Spinner)

<StorybookEmbed story="experiment-waiting--text-only" height="300px" />

### Detailed Message with HTML

<StorybookEmbed story="experiment-waiting--detailed-message" height="350px" />

The message field supports HTML formatting:

```html
<h3>Please wait</h3>
<p>We are preparing the next part of the experiment.</p>
<p><small>This may take a few moments.</small></p>
```

## Common Use Cases

### Synchronization Points

In multi-participant experiments, use waiting states to synchronize all participants before proceeding:

```
Message: "Waiting for all participants to complete..."
Show Spinner: true
```

### Processing Feedback

After a participant submits a complex response:

```
Message: "Processing your response..."
Show Spinner: true
```

### Section Transitions

Between major sections of an experiment:

```
Message: "The next part will begin shortly."
Show Spinner: false
```

### Timed Delays

When you need a brief pause (combined with state timing):

```
Message: "Get ready..."
Show Spinner: false
```

## State Timing

The Waiting component is often used with timed state transitions:

1. Set the state's **Duration** to the desired wait time
2. Configure the Waiting component's message
3. The experiment automatically advances when the timer completes

This is useful for:
- Fixed-duration rest periods
- Brief transitions between stimuli
- Countdowns before tasks begin

## Data Collection

The Waiting component doesn't collect participant responses, but timestamps are recorded:

```json
{
  "stateEntered": 1621453287000,
  "stateExited": 1621453292000,
  "duration": 5000
}
```

## Best Practices

1. **Clear Messages**: Tell participants what they're waiting for
2. **Appropriate Spinner**: Use spinner for active waiting, hide for brief pauses
3. **Reasonable Duration**: Don't make participants wait longer than necessary
4. **Progress Indication**: For longer waits, consider more detailed messages
5. **Consistent Styling**: Match the appearance to your experiment's theme

## Related Components

- **[Text Display](./text.md)** - For interactive content with continue button
- **[Trigger](./trigger.md)** - For hardware synchronization
