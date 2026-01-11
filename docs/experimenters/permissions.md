---
title: Permissions & Sharing
sidebar_position: 6
---

# Permissions & Sharing

HyperStudy provides a unified permission system for controlling access to experiments, media, and data. This guide explains how permissions work and how to share resources with collaborators.

## Overview

The permission system allows you to:

- Control who can view, edit, and duplicate your resources
- Share with individual users or entire groups
- Set organization-wide defaults
- Make resources publicly accessible
- Manage granular permissions for different actions

## Permission Types

Different resource types support different permissions:

### Experiments, Images & Videos

| Permission | Description |
|------------|-------------|
| **View** | Can see the resource and its contents |
| **Edit** | Can modify the resource (design, settings, etc.) |
| **Duplicate** | Can create a copy of the resource |
| **Manage Access** | Can change permission settings for others |

### Data

| Permission | Description |
|------------|-------------|
| **View** | Can see data in the Data Management interface |
| **Export** | Can download data as files (CSV, JSON, etc.) |

:::note
Data permissions are separate from experiment permissions. Someone with experiment edit access doesn't automatically get data access.
:::

## Access Hierarchy

HyperStudy checks permissions in the following order:

1. **Owner** - Full access to all actions
2. **Organization Admins** - Full access to all organization resources
3. **Shared Users/Groups** - Access based on specific share settings
4. **Organization Members** - Default permissions set for the organization group
5. **Public Access** - Permissions granted to all authenticated users (if enabled)

## Using the Permission Manager

The Permission Manager provides a unified interface for managing access to any resource.

### Opening the Permission Manager

**For Experiments:**
1. Open the experiment in the Experiment Designer
2. Click the **Permissions** tab

**For Media (Images/Videos):**
1. Go to the Media Library
2. Select an image or video
3. Click **Permissions** in the info panel or context menu

**For Data:**
1. Go to Data Management
2. Select an experiment
3. Click the **Permissions** tab

### Understanding the Interface

The Permission Manager shows:

- **Owner** - The resource owner (you, if you created it)
- **Who Has Access** - List of all users, groups, and public access
- **Grant Access** - Options to add new users or groups

### Permission Icons

Each row shows toggleable permission icons:

| Icon | Permission |
|------|------------|
| Eye | View |
| Pencil | Edit |
| Copy | Duplicate |
| Gear | Manage Access |
| Download | Export (data only) |

- **Colored** = Permission enabled
- **Gray** = Permission disabled

Click any icon to toggle that permission.

## Managing Access

### Organization Default

When you create a resource, it automatically includes your **Organization** group with default permissions. This ensures all organization members have baseline access.

- The organization group shows a "Default" badge
- You can modify organization permissions but cannot remove the group
- All current and future organization members inherit these permissions

### Adding Users

To share with a specific user:

1. Click **Add User** in the Grant Access section
2. Search for the user by name or email
3. Select the user from the dropdown
4. The user is added with default View permission
5. Toggle additional permissions as needed

### Adding Groups

To share with an experimenter group:

1. Click **Add Group** in the Grant Access section
2. Select from your available groups
3. The group is added with default View permission
4. Toggle additional permissions as needed

### Removing Access

To remove a user or group:

1. Find them in the "Who Has Access" list
2. Click the **X** button on their row
3. Access is revoked immediately

:::caution
You cannot remove the organization default group. You can only modify its permissions.
:::

### Public Access

For experiments, images, and videos, you can enable public access:

1. Find the **Public** row in the "Who Has Access" section
2. Toggle the **View** permission to enable public access
3. Optionally enable additional public permissions

When public access is enabled:
- Any authenticated HyperStudy user can access the resource
- They receive only the permissions you've enabled
- This is useful for shared templates or published experiments

:::warning
Data resources cannot be made public. Data access must always be explicitly granted.
:::

## Permission Scenarios

### Lab Team Collaboration

For a research lab working on shared experiments:

1. Create an experimenter group for your lab
2. When creating experiments, the organization group provides default access
3. Optionally share with specific lab group for tighter control
4. Grant **Edit** permission to collaborators who help design experiments
5. Keep **Manage Access** limited to project leads

### External Collaboration

For collaborating with researchers outside your organization:

1. Add the external collaborator as a user (they need a HyperStudy account)
2. Grant them specific permissions:
   - **View** only for review purposes
   - **View + Duplicate** to let them create their own version
   - **View + Edit** for active collaboration

### Data Sharing

For sharing experiment data with analysts:

1. Go to Data Management > Permissions
2. Add users who need data access
3. Grant **View** for dashboard-only access
4. Grant **Export** to allow data downloads

### Published Templates

To share an experiment template publicly:

1. Open experiment Permissions
2. Enable **View** for Public access
3. Enable **Duplicate** so others can copy it
4. Keep **Edit** and **Manage Access** disabled

## Best Practices

### Security

- Start with minimal permissions and add as needed
- Regularly audit who has access to sensitive resources
- Remove access promptly when collaboration ends
- Keep **Manage Access** permission restricted to owners and leads

### Organization

- Use groups for team-based access rather than individual shares
- Document why specific users have elevated permissions
- Use consistent permission patterns across similar resources

### Data Protection

- Keep data access separate from experiment access
- Only grant **Export** permission when data download is needed
- Use **View** permission for oversight without download capability

## Frequently Asked Questions

### Can I share with someone outside my organization?

Yes, as long as they have a HyperStudy account. Add them by their email address. They'll see shared resources in their dashboard.

### What happens when someone leaves the organization?

When removed from your organization, they lose access to all organization-shared resources. Explicit individual shares remain until you remove them.

### Can participants see experiment designs or data?

No. Participants only see the experiment interface during participation. They never have access to design, settings, or data.

### How do I transfer ownership?

1. Open the Permission Manager
2. Click **Transfer Owner** in the Owner section
3. Select the new owner from your organization members
4. Confirm the transfer

:::caution
Transferring ownership gives the new owner full control, including the ability to revoke your access.
:::

### Do folder permissions apply to contents?

Yes, for media folders. When you set permissions on a folder:
- All items in the folder inherit those permissions
- New items added to the folder get the same permissions
- You can override individual item permissions if needed

## Related Documentation

- [Collaborating Through Groups](./collaboration.md) - Managing experimenter groups
- [Data Permissions](./data-management/permissions.md) - Detailed data access controls
- [Media Management](./media-management.md) - Managing images and videos
- [Organizations](./organizations/index.md) - Organization membership and roles
