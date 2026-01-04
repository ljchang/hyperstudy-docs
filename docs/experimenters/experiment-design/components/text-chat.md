---
title: Text Chat Component
sidebar_position: 2
---

# Text Chat Component

The Text Chat component enables real-time text messaging between participants during experiments. It uses LiveKit's data channels for reliable, low-latency communication.

import StorybookEmbed from '@site/src/components/StorybookEmbed';

<StorybookEmbed story="livekit-textchat--default" height="500px" />

## Key Features

- Real-time text messaging
- Message history persistence
- Configurable position on screen
- Message deletion (optional)
- Read-only observer mode
- Automatic participant identification
- Timestamps on messages

## When to Use

Use the Text Chat component when you need to:

- Enable text-based communication between participants
- Allow collaboration without audio/video
- Supplement video chat with text
- Record written discussions for analysis
- Provide an accessible communication option

## Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Position** | Screen position of chat panel | `bottom-right` |
| **Allow Sending Messages** | Whether participants can send | `true` |
| **Allow Message Deletion** | Whether senders can delete their messages | `true` |

### Position Options

| Position | Description |
|----------|-------------|
| `top-left` | Upper left corner |
| `top-right` | Upper right corner |
| `bottom-left` | Lower left corner |
| `bottom-right` | Lower right corner |

### Appearance

| Setting | Description | Default |
|---------|-------------|---------|
| **Width** | Chat panel width | `300px` |
| **Height** | Chat panel height | `400px` |
| **Minimizable** | Allow collapsing the panel | `true` |
| **Show Timestamps** | Display message times | `true` |

## Examples

### Default Chat

<StorybookEmbed story="livekit-textchat--default" height="500px" />

### Read-Only Mode

<StorybookEmbed story="livekit-textchat--read-only" height="500px" />

For observers who can see but not participate.

### Different Positions

<StorybookEmbed story="livekit-textchat--top-left-position" height="500px" />

Position the chat where it won't interfere with main content.

## As a Global Component

Text Chat is a **global component** that persists across experiment states:

1. **Enable** in the Global Components tab
2. **Configure** position and settings
3. **Set visibility** per state using the matrix view

This allows chat to remain active while participants complete different tasks.

## Message Persistence

Chat messages are:
- Stored for the duration of the experiment session
- Available for data export after the experiment
- Associated with participant IDs and timestamps

## Data Collection

Text Chat stores all messages:

```json
{
  "messages": [
    {
      "id": "msg_1234",
      "senderId": "participant_1",
      "senderName": "Participant A",
      "content": "Hello, can you see this?",
      "timestamp": 1621453287000,
      "deleted": false
    },
    {
      "id": "msg_1235",
      "senderId": "participant_2",
      "senderName": "Participant B",
      "content": "Yes, I can see it!",
      "timestamp": 1621453290000,
      "deleted": false
    }
  ]
}
```

## Best Practices

1. **Clear Purpose**: Explain to participants when and how to use chat
2. **Position Wisely**: Place chat where it won't obscure important content
3. **Monitor Usage**: Review chat logs for research-relevant content
4. **Set Expectations**: Let participants know messages are recorded
5. **Consider Accessibility**: Text chat helps participants who can't use audio

## Text Chat vs Video Chat

| Feature | Text Chat | Video Chat |
|---------|-----------|------------|
| **Communication** | Written messages | Audio/video |
| **Bandwidth** | Very low | Higher |
| **Permanence** | Messages saved | Real-time only |
| **Accessibility** | Easy to review | Harder to transcribe |
| **Privacy** | More anonymous | Face visible |

Many experiments use both together for flexible communication.

## Common Use Cases

### Collaborative Tasks
Enable participants to coordinate on shared tasks.

### Discussion Experiments
Study how participants communicate about topics.

### Supplemental Communication
Backup channel when video chat isn't suitable.

### Observer Mode
Let researchers monitor without interfering.

## Related Components

- **[Video Chat](./videochat.md)** - For audio/video communication
- **[Waiting](./waiting.md)** - For synchronization between participants
