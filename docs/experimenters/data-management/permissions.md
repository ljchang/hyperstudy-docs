---
title: Data Permissions
sidebar_position: 2
---

# Data Permissions

Control who can view and export data from your experiments. HyperStudy provides flexible data sharing options to support collaboration while maintaining data security.

## Understanding Data Permissions

Data permissions control access to experiment data separately from experiment design access. This means you can:

- Let colleagues view data without editing the experiment
- Share data with external collaborators
- Control who can export vs. just view data

## Visibility Levels

Each experiment has a visibility setting that controls default access:

### Private

**Default for all experiments**

- Only the experiment owner can access data
- No one else can view or export unless explicitly shared
- Most restrictive option

### Organization

- All members of your organization can **view** data
- Export still requires explicit sharing
- Good for team transparency

:::note
Organization visibility only grants view access. To allow colleagues to export data, you must share with them explicitly.
:::

## Permission Types

When sharing data, you can grant two types of permissions:

| Permission | Description |
|------------|-------------|
| **View** | Can view data in the Data Management interface |
| **Export** | Can download data as files (CSV, JSON, etc.) |

Export permission automatically includes view permission.

## Access Hierarchy

HyperStudy checks permissions in the following order:

1. **Experiment Owner** - Always has full access
2. **Organization Admins** - Full access to all org experiments
3. **Explicitly Shared Users** - Access based on share settings
4. **Organization Members** - View access if visibility is "Organization"
5. **Everyone Else** - No access

## Managing Permissions

### Changing Visibility

To change an experiment's visibility:

1. Go to **Data Management** for your experiment
2. Click the **Permissions** tab
3. Under **Visibility**, select the desired level
4. Click **Save**

### Sharing with Users

To share data with a specific user:

1. Go to **Data Management > Permissions**
2. Click **Share with User**
3. Enter the user's email address
4. Select permissions:
   - **View** - Can view data only
   - **Export** - Can view and download data
5. Click **Share**

The user will now see this experiment in their Data Management interface.

### Sharing with Groups

If you have experimenter groups set up, you can share with entire groups:

1. Go to **Data Management > Permissions**
2. Click **Share with Group**
3. Select the group
4. Select permissions (View or Export)
5. Click **Share**

All current and future group members will have access.

### Viewing Current Shares

The Permissions tab shows all current shares:

- **Users** - Individual users with access
- **Groups** - Groups with access
- **Permission level** - View or Export for each

### Removing Shares

To revoke access:

1. Find the share in the Permissions list
2. Click the **Remove** button (trash icon)
3. Confirm the removal

Access is revoked immediately.

## Checking Your Access

To check your access level to an experiment:

1. Go to **Data Management**
2. Find the experiment
3. Look for the access indicator:
   - **Full Access** - You own this experiment
   - **Export Access** - You can view and download
   - **View Access** - You can only view

If an experiment doesn't appear in your Data Management, you don't have access to it.

## Best Practices

### For Experiment Owners

- Start with **Private** visibility
- Share explicitly with collaborators who need access
- Grant **Export** permission only to those who need to download data
- Review shares periodically and remove outdated access

### For Data Security

- Use organization visibility for internal transparency
- Keep sensitive experiments on Private visibility
- Don't share Export permission unless necessary
- Remove access promptly when collaboration ends

### For Collaboration

- Use groups for lab-wide or team-wide access
- Document who has access and why
- Communicate with collaborators when sharing

## Frequently Asked Questions

### Can I share with someone outside my organization?

Yes, as long as they have a HyperStudy account. Share using their email address.

### What happens when I remove someone from a share?

They immediately lose access. Any data they previously downloaded remains with them.

### Can participants see experiment data?

No, participants never have access to experiment data. Only experimenters with appropriate permissions can access data.

### How do I share all my experiments at once?

Currently, sharing is per-experiment. For team-wide access, use Organization visibility or set up experimenter groups.

### Does visibility affect experiment design access?

No, visibility only controls **data** access. Experiment design (editing states, components, etc.) is controlled through [Collaboration](../collaboration.md) settings.
