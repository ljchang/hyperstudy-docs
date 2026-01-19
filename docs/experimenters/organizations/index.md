---
title: Organizations Overview
sidebar_position: 1
---

# Organizations

Organizations are the foundation of team collaboration in HyperStudy. They provide a way to manage team members, share experiments, track usage, and control access to resources.

## What Are Organizations?

An organization is a workspace where you and your team can:

- **Collaborate on experiments** - Share experiments with team members
- **Manage team access** - Control who can view, edit, and run experiments
- **Track usage** - Monitor resource usage across your team
- **Share resources** - Use a common pool of storage and participant quotas

## Types of Organizations

### Personal Organizations

When you first sign up, HyperStudy creates a personal organization for you. This is your private workspace where you can:

- Create and manage your own experiments
- Use your individual quotas
- Upgrade to higher plans as needed

### Team Organizations

Team organizations allow multiple users to collaborate. Team organizations provide:

- Shared experiments and resources
- Role-based access control
- Centralized usage tracking
- Team member management

## Getting Started

### Creating an Organization

1. Go to **Settings** in the main navigation
2. Select **Organizations**
3. Click **Create Organization**
4. Enter a name for your organization
5. Click **Create**

Your new organization will be created with you as the owner.

### Switching Organizations (OrgSwitcher)

If you belong to multiple organizations, use the **Organization Switcher** in the header to change your active workspace.

#### Using the OrgSwitcher

1. Look for your current organization name in the top navigation bar
2. Click it to open the organization dropdown
3. Select the organization you want to work in
4. The page refreshes with the new organization context

#### What Changes When You Switch

When you switch organizations, the following are scoped to your new active organization:

| Resource | Behavior |
|----------|----------|
| **Experiments** | Only see experiments owned by or shared within the new organization |
| **Media Library** | Only see images and videos from the new organization |
| **Data** | Only see data from experiments in the new organization |
| **Team Members** | See members of the new organization |
| **Quotas** | Usage counts against the new organization's limits |

:::info Shared Experiments
Experiments shared with you from **other organizations** appear in the separate "Shared With Me" panel, not in your main experiment list. This keeps your workspace organized and makes it clear which experiments belong to which organization.

See [Cross-Organization Collaboration](../cross-org-collaboration.md) for details on sharing across organizations.
:::

#### Organization Context Persistence

- Your selected organization persists across browser sessions
- Opening a direct link to a resource may switch your context automatically
- The OrgSwitcher shows your current organization for clarity

## Organization Roles

Organizations use a role-based access system to control what members can do:

| Role | Description |
|------|-------------|
| **Owner** | Full control over the organization, including billing and deletion |
| **Admin** | Can manage members, settings, and experiments |
| **Member** | Can create and manage their own experiments |
| **Guest** | Limited access to shared experiments only |

See [Member Management](./members.md) for details on roles and permissions.

## Quotas and Plans

Each organization has resource quotas based on its plan:

- **Free** - For individual researchers getting started
- **Pro** - For research teams and labs
- **Enterprise** - For institutions with advanced needs

See [Usage & Quotas](./usage-quotas.md) for details on monitoring usage, and [Billing & Plans](./billing.md) for plan comparisons.

## Next Steps

- [Manage team members](./members.md)
- [Monitor usage and quotas](./usage-quotas.md)
- [Upgrade your plan](./billing.md)
- [Cross-organization collaboration](../cross-org-collaboration.md) - Share with external researchers
