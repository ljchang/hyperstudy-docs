---
title: Data Permissions
sidebar_position: 2
---

# Data Permissions

Control who can view and export data from your experiments. Data permissions are managed separately from experiment design permissions, giving you fine-grained control over data access.

:::tip
For a complete overview of how permissions work across HyperStudy, see the [Permissions & Sharing](../permissions.md) guide.
:::

## Understanding Data Permissions

Data permissions control access to experiment data **completely separately** from experiment design access. This strict separation is a core security principle in HyperStudy.

:::warning Design ≠ Data
Having permission to edit an experiment does **not** grant any access to its data. You must explicitly grant data permissions separately. This protects participant data and research integrity.
:::

This separation means you can:

- Let colleagues view data without editing the experiment
- Share experiment designs without exposing collected data
- Share data with external collaborators for analysis
- Control who can export vs. just view data
- Keep sensitive data restricted while sharing experiment designs
- Support IRB requirements for data access control

## Permission Types

Data resources support two permission types:

| Permission | Icon | Description |
|------------|------|-------------|
| **View** | Eye | Can see data in the Data Management interface, view charts and summaries |
| **Export** | Download | Can download data as files (CSV, JSON, etc.) |

Export permission automatically includes view permission.

:::note
Unlike experiments and media, data resources **cannot be made public**. All data access must be explicitly granted to specific users or groups.
:::

## Access Hierarchy

HyperStudy checks data permissions in the following order:

1. **Experiment Owner** - Always has full access to their experiment's data
2. **Organization Admins** - Full access to all organization experiment data
3. **Platform Admins** - Can access data for support and debugging (all access is logged)
4. **Explicitly Shared Users/Groups** - Access based on share settings
5. **Organization Members** - Default permissions from organization group

:::note Platform Admin Access
Platform administrators may access experiment data for technical support and debugging purposes. All platform admin data access is logged in the audit trail for compliance and transparency. This access is used sparingly and only when necessary to resolve technical issues.
:::

## Managing Data Permissions

### Opening the Permission Manager

1. Go to **Data Management** from the main navigation
2. Select the experiment whose data you want to manage
3. Click the **Permissions** tab

### The Permission Interface

The Permission Manager shows all current access:

- **Owner** - The experiment owner (always has full access)
- **Organization** - Your organization's default access (marked "Default")
- **Shared Users** - Individual users with explicit access
- **Shared Groups** - Experimenter groups with access

### Granting View Access

To let someone view data without downloading:

1. Click **Add User** or **Add Group**
2. Select the user or group
3. Ensure only the **View** (eye) icon is enabled
4. The **Export** (download) icon should be disabled/gray

### Granting Export Access

To let someone download data:

1. Click **Add User** or **Add Group**
2. Select the user or group
3. Enable both **View** and **Export** icons

### Modifying Permissions

To change existing permissions:

1. Find the user or group in the list
2. Click permission icons to toggle them:
   - Click **Export** to enable/disable download capability
   - **View** cannot be disabled if Export is enabled

### Removing Access

To revoke data access:

1. Find the user or group in the list
2. Click the **X** button on their row
3. Access is revoked immediately

:::caution
You cannot remove the organization default group. To restrict organization-wide access, disable all permissions for that group instead.
:::

## Checking Your Access

When viewing the Data Management list:

- **Your experiments** - Full access (you're the owner)
- **Shared experiments** - Access level shown by permission icons
- **Not listed** - You don't have access to that experiment's data

## Common Scenarios

### Lab Data Sharing

For a research lab:

1. Organization group has **View** by default
2. Grant **Export** only to data analysts who need downloads
3. Keep export restricted for preliminary or sensitive data

### External Collaboration

For sharing data with external researchers:

1. Add the external collaborator by email
2. Grant **View** for dashboard review
3. Grant **Export** when they need raw data access
4. Remove access when collaboration concludes

### Multi-Site Studies

For studies across institutions:

1. Create a group for each site's researchers
2. Share data with appropriate groups
3. Site leads get **Export** access
4. Other site members get **View** only

## Best Practices

### For Data Security

- Start with **View** only, add **Export** when needed
- Regularly audit who has export access
- Remove access promptly when no longer needed
- Document data sharing agreements

### For Collaboration

- Use groups for team-based access
- Communicate when sharing data access
- Establish clear protocols for data handling

### For Compliance

- Keep export permission restricted for sensitive data
- Track who has accessed and downloaded data
- Review permissions before IRB audits

## Frequently Asked Questions

### Can I make data publicly accessible?

No, data cannot be made public. All data access must be explicitly granted to authenticated users. This protects participant information and research data.

### What happens to downloaded data when I remove access?

Removing access prevents future views and downloads. Data already downloaded by the user remains with them.

### Does experiment edit access include data access?

No, they are separate. Someone with experiment edit permission cannot automatically see data. You must explicitly grant data access.

### How do I share all my experiments' data at once?

Data sharing is per-experiment. For broad access, either:
- Use your organization group's default permissions
- Create an experimenter group and add it to each experiment

### Can participants access experiment data?

Never. Participants can only see their own experience during the experiment. They cannot access any data, including their own responses.

## Related Documentation

- [Permissions & Sharing](../permissions.md) - Complete permission system overview
- [Data Management](../data-management.md) - Working with experiment data
- [Data Management Interface](../data-management-interface.md) - Using the data interface
- [Collaborating Through Groups](../collaboration.md) - Managing experimenter groups
