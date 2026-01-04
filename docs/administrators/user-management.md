---
title: User Management
sidebar_position: 2
---

# User Management

As an administrator, you have full control over user accounts, permissions, and roles. This guide covers all aspects of user management in the HyperStudy platform.

## User Roles Overview

The platform has three primary user roles, each with different permissions:

1. **Administrators**
   - Full system access
   - Manage all users, experiments, and content
   - Configure system settings
   - Access to all rooms and recordings

2. **Experimenters**
   - Create and manage their own experiments
   - Upload media for their experiments
   - Manage participant assignments
   - Access only to their experiments and shared experiments

3. **Participants**
   - Join assigned experiments
   - Access only their participation history
   - Limited system functionality


## The User Management Interface

Access the user management interface from the Admin Dashboard by clicking the "Users" tab.

The interface includes:

- **User List**: Searchable, sortable table of all users
- **User Details**: Detailed information about selected users
- **Role Management**: Tools to assign and modify user roles
- **Bulk Actions**: Operations on multiple users at once

## Managing Users

### Creating New Users

While users can self-register, administrators can also create accounts directly:

1. Click the "Add User" button
2. Enter the user's email address and name
3. Select the appropriate role
4. Choose whether to send an email invitation
5. Click "Create User"

:::tip
When creating experimenter accounts, consider adding them to appropriate experimenter groups to grant access to shared resources.
:::

### Viewing User Information

To view detailed information about a user:

1. Find the user in the table (use search if needed)
2. Click on the user's name to view their details
3. The user details panel shows:
   - Account information
   - Role and permissions
   - Participation history
   - Experimenter activity (if applicable)

### Editing User Information

To modify a user's information:

1. Open the user details panel
2. Click the "Edit" button
3. Update the necessary fields
4. Click "Save Changes"

You can edit:
- Display name
- Email address
- Role
- Experimenter group membership
- Account status

### Changing User Roles

To change a user's role:

1. Open the user details panel
2. Click the "Change Role" button
3. Select the new role from the dropdown
4. Click "Update Role"

:::caution
Changing a role from Experimenter to Participant will remove access to any experiments they've created. Consider transferring ownership of these experiments first.
:::

### Deactivating Users

To temporarily deactivate a user:

1. Open the user details panel
2. Toggle the "Active" switch to off
3. Confirm the deactivation

Deactivated users:
- Cannot log in to the system
- Remain in the database with all their data
- Can be reactivated at any time

### Deleting Users

To permanently delete a user:

1. Open the user details panel
2. Click the "Delete User" button
3. Confirm the deletion

:::warning
Deleting a user is permanent and cannot be undone. All user data, including participation records, will be permanently removed.
:::

## Experimenter Management

### Approving Experimenter Requests

When users register and request experimenter privileges:

1. You'll receive a notification in the Admin Dashboard
2. Navigate to the "Pending Approvals" section
3. Review the user's information and request reason
4. Click "Approve" or "Deny"
5. Optionally, add the user to one or more experimenter groups

### Managing Experimenter Groups

Experimenter groups allow for shared experiment access and collaboration:

1. Go to the "Experimenter Groups" section
2. To create a new group:
   - Click "New Group"
   - Enter a name and description
   - Add members from the experimenter list
   - Click "Create Group"

3. To edit a group:
   - Select the group from the list
   - Modify members or group details
   - Click "Save Changes"


## Participant Management

### Bulk Participant Import

To import multiple participants at once:

1. Click "Import Participants"
2. Download the CSV template
3. Fill in participant information
4. Upload the completed CSV
5. Review the import preview
6. Click "Confirm Import"

### Assigning Participants to Experiments

To assign participants to specific experiments:

1. Navigate to the experiment in the Experiments tab
2. Click "Participant Assignment"
3. Use the participant selector to add participants
4. Assign roles if applicable
5. Click "Save Assignments"

## Advanced User Management

### User Activity Monitoring

To monitor user activity on the platform:

1. Go to the "Activity Logs" section
2. Use filters to focus on specific users, roles, or actions
3. View detailed logs of user actions
4. Export logs if needed for compliance or analysis

### User Email Management

To communicate with users:

1. Go to the "Email" section
2. Select recipients by:
   - Individual users
   - Roles
   - Experiment participation
3. Compose your message
4. Schedule or send immediately

### Permission Overrides

For special cases, you can override default role permissions:

1. Open the user details panel
2. Click "Custom Permissions"
3. Toggle specific permissions on or off
4. Click "Save Custom Permissions"

:::caution
Custom permissions should be used sparingly. Relying on standard roles ensures consistency across the platform.
:::

## Best Practices

For effective user management:

1. **Regular Audits**: Review user accounts and roles quarterly
2. **Group Organization**: Create logical experimenter groups based on departments or research areas
3. **Minimal Privileges**: Assign the least privileged role needed for each user
4. **Documentation**: Keep records of role changes and permission modifications
5. **Training**: Ensure new experimenters receive proper training before approval

## Troubleshooting

| Issue | Solution |
|-------|----------|
| User can't log in | Check account status is active; verify email is confirmed |
| Experimenter can't access shared experiment | Check experimenter group membership and experiment permissions |
| Admin notifications not received | Verify admin email settings in system configuration |
| User role change not taking effect | Clear browser cache or ask user to log out and back in |
| User appearing in wrong groups | Check for duplicate accounts with similar emails |