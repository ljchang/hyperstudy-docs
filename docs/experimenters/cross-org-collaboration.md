---
title: Cross-Organization Collaboration
sidebar_position: 9
---

# Cross-Organization Collaboration

HyperStudy supports collaboration between researchers across different organizations, enabling multi-site studies and external partnerships while maintaining data isolation and security.

## Overview

Cross-organization collaboration allows you to:

- **Share experiments** with researchers at other institutions
- **Collaborate with external users** by inviting them via email
- **Set time-limited access** with automatic expiration dates
- **Maintain audit trails** for compliance (HIPAA/FERPA/GDPR)
- **View shared experiments** in a dedicated "Shared With Me" panel

:::info Multi-Tenant Architecture
HyperStudy uses a multi-tenant architecture where each organization's data is isolated. Cross-organization sharing creates explicit permission bridges that allow controlled access without compromising data isolation.
:::

## Sharing with External Users

You can share experiments with any HyperStudy user, regardless of their organization.

### By Email Address

To share with someone outside your organization:

1. Open the experiment in the Experiment Designer
2. Click the **Permissions** tab
3. In the **Grant Access** section, click **Add User**
4. Enter the external user's email address
5. Select them from the search results (they must have a HyperStudy account)
6. Configure permissions:
   - **View** - Can see the experiment design
   - **Edit** - Can modify the experiment (use with caution)
   - **Duplicate** - Can create their own copy
7. Optionally set an **expiration date** (see below)

:::tip
External collaborators appear with their organization name displayed next to their name in the permissions list, making it easy to identify cross-organization shares.
:::

### Permission Recommendations for External Users

| Collaboration Type | Recommended Permissions |
|-------------------|------------------------|
| Review/feedback | View only |
| Create their own version | View + Duplicate |
| Active co-design | View + Edit |
| Full collaboration | View + Edit + Duplicate |

:::caution
**Manage Access** permission should rarely be granted to external users, as it allows them to modify who else has access to the experiment.
:::

## Sharing with External Organizations

For ongoing collaborations with another institution, you can share directly with their organization:

1. Open the experiment's **Permissions** tab
2. Click **Add Organization** in the Grant Access section
3. Search for the organization by name
4. Select the organization from the results
5. Configure organization-wide permissions
6. All members of that organization inherit the permissions you set

This is useful for:
- Multi-site research studies
- Institutional partnerships
- Course collaborations across universities

## Time-Limited Access

All cross-organization shares support expiration dates for enhanced security and compliance.

### Setting an Expiration Date

1. After adding an external user or organization, find them in the permissions list
2. Click the **calendar icon** next to their entry
3. Select an expiration date
4. Access automatically revokes on that date at midnight (UTC)

### Common Expiration Patterns

| Scenario | Suggested Duration |
|----------|-------------------|
| One-time review | 1-2 weeks |
| Active collaboration | 3-6 months |
| Grant period | Match grant end date |
| Course collaboration | End of semester |
| Indefinite | Leave expiration blank |

### Expiration Notifications

- Users receive a notification 7 days before access expires
- Owners receive a summary of expiring permissions weekly
- Expired permissions are logged in the audit trail

## The "Shared With Me" Panel

Experiments shared with you from other organizations appear in a dedicated section.

### Accessing Shared Experiments

1. Go to your Experimenter Dashboard
2. Look for the **Shared With Me** panel in the sidebar
3. Shared experiments are grouped by the sharing organization
4. Click an experiment to open it (based on your permissions)

### Shared Experiments vs. Organization Experiments

| Feature | Organization Experiments | Shared With Me |
|---------|-------------------------|----------------|
| Location | Main experiment list | Shared With Me panel |
| Media access | Full library | Only media in experiment |
| Data access | Based on data permissions | Separate data sharing required |
| Can duplicate | Always | Only if granted |
| Appears in search | Yes | No (use panel) |

:::note
Shared experiments do **not** appear in your main experiment search. Always use the Shared With Me panel to access them.
:::

## Data Sharing Considerations

**Experiment permissions and data permissions are separate.** Sharing an experiment does not automatically share its data.

### To Share Data with External Collaborators

1. Share the experiment (as described above)
2. Go to **Data Management**
3. Select the experiment
4. Open the **Permissions** tab
5. Add the same external users/organizations
6. Grant **View** and/or **Export** permissions

### Data Access Separation

This separation is intentional for:

- **Privacy compliance** - Control who can access participant data
- **Research integrity** - Share designs without sharing results
- **Staged collaboration** - Grant data access only when needed

## Audit Trail and Compliance

All cross-organization activities are logged for compliance with research regulations.

### What Gets Logged

- When access was granted
- Who granted the access
- What permissions were given
- Expiration dates set
- When access was used
- When access expired or was revoked

### Accessing Audit Logs

Organization administrators can view audit logs:

1. Go to **Settings > Organization > Audit Log**
2. Filter by:
   - Resource type (experiments, data, media)
   - Action type (share, access, modify, revoke)
   - Time period
   - External organization
3. Export logs for compliance documentation

### Compliance Features

| Regulation | Supported Feature |
|------------|-------------------|
| HIPAA | Access logging, expiration dates, role-based access |
| FERPA | Data isolation, explicit permissions, audit trails |
| GDPR | Time-limited access, access logging, data separation |

## Best Practices for Multi-Site Studies

### Before Starting

1. **Document the collaboration** - Create a data sharing agreement
2. **Identify roles** - Who needs what access at each site?
3. **Plan permissions** - Map out experiment vs. data access needs
4. **Set timelines** - Use expiration dates aligned with study phases

### During the Study

1. **Use groups when possible** - Share with an external organization rather than individuals
2. **Review permissions quarterly** - Remove unused access
3. **Communicate changes** - Notify collaborators before modifying experiments
4. **Keep audit logs** - Export logs periodically for your records

### After the Study

1. **Review all external access** - Revoke unnecessary permissions
2. **Archive shared experiments** - Move completed work to archive folders
3. **Export final audit logs** - Document the collaboration for IRB records
4. **Update data sharing** - Ensure ongoing access matches agreements

## Security Considerations

### What External Users Can See

When you share an experiment, external users can:
- View/edit the experiment design (based on permissions)
- See experiment-level settings
- Access media **used in that specific experiment** only

External users **cannot**:
- Access your organization's media library
- See other experiments in your organization
- Access data without explicit data permissions
- See other organization members

### Recommended Security Practices

1. **Start with minimal permissions** - Add more as needed
2. **Use expiration dates** - Default to time-limited access
3. **Regular audits** - Review external shares monthly
4. **Revoke promptly** - Remove access when collaboration ends
5. **Separate design and data** - Share data only when necessary

## Frequently Asked Questions

### Can I share with someone who doesn't have a HyperStudy account?

No, users must have a HyperStudy account. Send them to [hyperstudy.io](https://hyperstudy.io) to create a free account, then share with their registered email.

### What happens when an external user's organization changes?

Their individual access remains intact. Organization-level shares only affect current members of that organization.

### Can I see who from an external organization accessed my experiment?

Yes, the audit log shows individual access events, including which user accessed what and when.

### How do I handle a multi-site study with different IRB protocols?

Each site maintains their own data permissions. Share the experiment design broadly, but grant data access only to users authorized under your IRB protocol.

### Can external users add their own participants to my experiment?

Only if they have **Edit** permission and your experiment allows multiple recruiters. Otherwise, they can duplicate the experiment and run it independently.

### What's the difference between sharing with a user vs. an organization?

- **User share**: Only that specific person gets access
- **Organization share**: All current members get access; new members automatically get access; departing members lose access

## Related Documentation

- [Permissions & Sharing](./permissions.md) - Complete permission system overview
- [Organizations](./organizations/index.md) - Managing your organization
- [Data Permissions](./data-management/permissions.md) - Controlling data access
- [Collaborating Through Groups](./collaboration.md) - Internal team collaboration
