---
title: Collaborative Editing
sidebar_position: 7
---

# Collaborative Editing

HyperStudy supports real-time collaborative editing in the Experiment Designer. Multiple team members can work on the same experiment simultaneously, with live presence indicators showing who is editing and where they are working.

## Overview

When you open an experiment that someone else is also editing, you'll see:

- **Collaborator avatars** in the toolbar showing who is currently online
- **Color-coded borders** on fields that other editors are focused on
- **Typing indicators** when someone is actively editing a field
- **Selection highlighting** when someone selects a state, tab, or group
- **Auto-save status** showing that all changes are being saved in real-time

No setup is required. Collaborative editing works automatically whenever multiple users have edit access to the same experiment.

## What You See When Others Are Editing

### Collaborator Avatars

When other users are editing the same experiment, their avatars appear in the toolbar area. Each collaborator is assigned a unique color that persists throughout their editing session.

- **Profile photo or initials** displayed in a circular avatar
- **Color-coded border** matching the collaborator's assigned color
- **Pulsing dot** on the avatar when the collaborator is actively typing

### Field Focus Highlighting

When another editor clicks on or focuses a field, you see a colored border around that field in their assigned color. This tells you at a glance which part of the experiment someone else is working on, helping you avoid editing the same field simultaneously.

### Typing Indicators

When a collaborator is actively typing in a field:

- The field's border outline changes to indicate active input
- A pulsing animation appears on their avatar
- These indicators disappear shortly after they stop typing

### Selection Highlighting

When a collaborator selects a structural element in the experiment (not just a text field), you see their color applied to that element's outline:

- **States**: The state card gets a colored border in the collaborator's color
- **Tabs**: The active tab shows the collaborator's color
- **Groups**: Component groups are highlighted with the collaborator's color

This helps you understand the broader context of where someone is working, not just which specific field they're in.

## Auto-Save

The Experiment Designer uses WebSocket-based auto-save. There is no manual save button or save action needed.

### How It Works

1. When you make a change (edit a field, add a component, rearrange states), the change is sent to the server immediately via WebSocket
2. The server applies the change and increments the experiment version
3. All other connected editors receive the update and see the change in real-time
4. The save status indicator in the toolbar reflects the current state

### Connection Status Indicators

The toolbar shows the current connection state:

| Status | Meaning |
|--------|---------|
| **All Changes Saved** | Everything is synced; you're connected and up to date |
| **Saving...** | A change is being sent to the server |
| **Connecting** | Establishing the WebSocket connection (shown with a spinner) |
| **Reconnecting** | Connection was lost; attempting to reconnect automatically |

### Offline Resilience

If your internet connection drops:

1. Changes you make are **queued locally** in memory
2. The status shows **Reconnecting** with a spinner
3. When the connection is restored, queued changes are automatically sent to the server
4. The system re-joins the editing session and syncs the latest experiment state
5. Other editors see your queued changes applied once you reconnect

:::note
If you close the browser tab while disconnected, queued changes that haven't been sent to the server will be lost. Keep the tab open until the status returns to "All Changes Saved."
:::

## How Conflicts Work

HyperStudy uses a **last-write-wins** approach to conflict resolution. There is no field locking.

### What This Means

- Two people can edit the same field at the same time
- The last change to reach the server is the one that persists
- Both users will see the same final state after all changes are applied
- Changes to different fields never conflict, even if made simultaneously

### In Practice

Conflicts are rare because:
- Presence indicators show you where others are working
- Typing indicators warn you when someone is actively editing a field
- Most experiments have enough fields that two people rarely need the same one at the same time

If you do edit the same field simultaneously, you'll see the other person's change appear (replacing or modifying what you typed). Simply re-enter your change if needed.

## Best Practices

### Coordinate Your Work

- **Watch the presence indicators** to see where others are working before you start editing
- **Work on different sections** when possible (e.g., one person handles states while another configures global settings)
- **Communicate** with your collaborators through external channels (chat, video call) during intensive editing sessions

### Be Aware of Others

- **Check avatars** before making large structural changes (adding/removing states, reordering components)
- **Look for colored borders** on fields before you click into them
- **Notice typing indicators** that show active editing in progress

### Handle Structural Changes Carefully

Changes that affect the overall experiment structure (adding states, deleting components, reordering) are more impactful than editing a single text field. When making structural changes:

- Confirm with your collaborators before deleting states or components
- Be aware that reordering may affect what others see
- Large changes are visible to all editors in real-time

## Technical Details

For developers interested in the implementation, see the [Collaborative Editing Architecture](../developers/architecture/collaborative-editing.md) guide, which covers the WebSocket protocol, version tracking, and server-side handling.

## Related Documentation

- [Permissions & Sharing](./permissions.md) - Control who can edit your experiments
- [Collaborating Through Groups](./collaboration.md) - Manage team access with groups
- [Experiment Design Overview](./experiment-design/overview.md) - Getting started with the Experiment Designer
