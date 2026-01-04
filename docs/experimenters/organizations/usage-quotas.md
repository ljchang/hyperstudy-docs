---
title: Usage & Quotas
sidebar_position: 3
---

# Usage & Quotas

HyperStudy tracks resource usage for each organization. Understanding your quotas helps you plan experiments and manage resources effectively.

## Usage Metrics

HyperStudy tracks the following metrics for each organization:

| Metric | Description | Reset Period |
|--------|-------------|--------------|
| **Experiments** | Total number of experiments created | Cumulative |
| **Participants/Month** | Participants who joined experiments | Monthly |
| **Storage** | Media files, recordings, and data | Cumulative |
| **Team Members** | Users in the organization | Current count |
| **Video Chat Minutes** | LiveKit video chat usage | Monthly |
| **Recording Storage** | Video/audio recordings saved | Cumulative |

### Monthly vs Cumulative Metrics

- **Monthly metrics** (participants, video chat minutes) reset at the beginning of each billing cycle
- **Cumulative metrics** (experiments, storage) accumulate over time

## Viewing Usage

To view your organization's current usage:

1. Go to **Settings > Organizations**
2. Select your organization
3. Click the **Usage** tab

The usage dashboard shows:
- Current usage for each metric
- Quota limits for your plan
- Usage percentage (visual progress bars)
- Historical usage trends

## Quota Limits by Plan

### Free Plan

| Metric | Limit |
|--------|-------|
| Experiments | 3 |
| Participants/Month | 50 |
| Storage | 1 GB |
| Team Members | 1 |
| Video Chat | Not available |
| Recording Storage | Not available |

### Pro Plan

| Metric | Limit |
|--------|-------|
| Experiments | 25 |
| Participants/Month | 500 |
| Storage | 50 GB |
| Team Members | 5 |
| Video Chat | 1,000 minutes/month |
| Recording Storage | 25 GB |

### Enterprise Plan

| Metric | Limit |
|--------|-------|
| Experiments | Unlimited |
| Participants/Month | Unlimited |
| Storage | 500 GB |
| Team Members | Unlimited |
| Video Chat | Unlimited |
| Recording Storage | 100 GB |

## Usage Warnings

HyperStudy notifies you when approaching limits:

| Threshold | Notification |
|-----------|--------------|
| 80% | Warning notification |
| 90% | Urgent warning |
| 100% | Limit reached notification |

When you reach a limit:
- You cannot create new resources of that type
- Existing experiments continue to function
- You can still access and download existing data

## Managing Usage

### Reducing Storage Usage

If you're approaching storage limits:

1. **Delete unused media** - Remove videos and images no longer needed
2. **Archive old experiments** - Export data and delete old experiments
3. **Compress media** - Use optimized video formats before upload

### Optimizing Participant Usage

To stay within participant limits:

1. **Plan experiment schedules** - Spread experiments across billing periods
2. **Use test accounts** - Don't count internal testing against quotas
3. **Consolidate sessions** - Fewer sessions with more participants per session

### Upgrading Your Plan

If you consistently hit limits, consider [upgrading to a higher plan](./billing.md).

## Usage Recalculation

Usage metrics are calculated in real-time but can occasionally drift. Organization admins can request a recalculation:

1. Go to **Settings > Organizations > Usage**
2. Click **Recalculate Usage**
3. Wait for the recalculation to complete

This counts all actual resources and corrects any discrepancies.

## Frequently Asked Questions

### What happens when I hit a limit?

You cannot create new resources of that type until you:
- Wait for monthly limits to reset
- Delete existing resources
- Upgrade to a higher plan

Existing experiments and data remain accessible.

### Do test participants count against my quota?

Yes, all participants who join an experiment count toward your monthly quota. Use preview mode for testing when possible.

### How is storage calculated?

Storage includes:
- Uploaded media files (videos, images, audio)
- Experiment recordings
- Exported data files

It does not include experiment configurations or settings.

### Can I purchase additional quotas?

Currently, you must upgrade to a higher plan for increased quotas. Contact support for Enterprise plans with custom quotas.
