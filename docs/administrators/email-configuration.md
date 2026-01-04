---
sidebar_position: 4
---

# Email System

HyperStudy uses Amazon SES (Simple Email Service) as its transactional email provider for sending automated emails such as user invitations, approval notifications, and other system messages. This guide covers how administrators can manage email templates and monitor the email system.

## Overview

The HyperStudy email system provides:
- Pre-configured transactional email service via Amazon SES
- Customizable email templates for different message types
- HTML and plain text versions of all emails
- Variable substitution for personalized content
- Template preview functionality
- Easy reset to default templates

## Accessing Email Configuration

1. Log in as an administrator
2. Navigate to the Admin Dashboard
3. Click on the "Email Config" tab

{/* Screenshot placeholder: Email configuration interface showing template manager */}

## Email Service Status

The email configuration page displays the current status of the email service:

- **Service Provider**: Amazon SES
- **Configuration Status**: Active/Inactive
- **Test Email**: Send a test email to verify the service is working

If the email service is not configured, contact your system administrator to set up the Amazon SES credentials in the server environment.

## Email Templates

HyperStudy uses customizable email templates for different types of automated messages. Each template supports both HTML and plain text versions to ensure compatibility with all email clients.

### Available Templates

#### 1. User Invitation
Sent when inviting new users to join HyperStudy.

**Available Variables:**
- `{{role}}` - The role being assigned (Experimenter, Participant, or Admin)
- `{{inviterName}}` - Name of the person sending the invitation
- `{{invitationUrl}}` - Link to accept the invitation
- `{{personalMessage}}` - Optional personalized message from the inviter

#### 2. Group Invitation
Sent when adding users to experimenter groups.

**Available Variables:**
- `{{groupName}}` - Name of the experimenter group
- `{{inviterName}}` - Name of the group administrator
- `{{invitationUrl}}` - Link to accept the group invitation

#### 3. Experimenter Approval
Sent when an experimenter account is approved or rejected.

**Available Variables:**
- `{{approved}}` - Boolean indicating approval status
- `{{status}}` - Text status ("approved" or "rejected")
- `{{message}}` - Plain text message from the administrator
- `{{htmlMessage}}` - HTML formatted message from the administrator

#### 4. Participant Invitation
Sent when inviting participants to specific experiments.

**Available Variables:**
- `{{experimentName}}` - Name of the experiment
- `{{experimentDescription}}` - Description of the experiment
- `{{experimentDuration}}` - Expected duration of participation
- `{{sessionUrl}}` - Direct link to join the experiment session

## Managing Email Templates

### Viewing Templates

1. In the Email Config section, you'll see a list of all available templates
2. Each template shows:
   - Template name and description
   - Last modified date
   - Preview and edit options

### Editing Templates

To customize an email template:

1. Click the "Edit" button next to the template you want to modify
2. The template editor will open with two tabs:
   - **HTML Version**: For rich text formatting
   - **Plain Text Version**: For email clients that don't support HTML

3. Edit the template content:
   - Keep all variable placeholders (e.g., `{{variableName}}`) intact
   - You can add custom text, formatting, and styling
   - Ensure important information is in both HTML and plain text versions

4. Use the "Available Variables" reference panel to see which variables you can use
5. Click "Save Template" to apply your changes

{/* Screenshot placeholder: Email template editor showing HTML and plain text tabs */}

### Template Best Practices

1. **Maintain Consistency**: Keep branding and tone consistent across all templates
2. **Clear Call-to-Action**: Make buttons and links prominent in HTML versions
3. **Accessibility**: Ensure plain text versions contain all essential information
4. **Variable Usage**: Always include required variables to ensure emails are properly personalized
5. **Testing**: Send test emails after making changes to verify formatting

### Previewing Templates

Before saving changes:

1. Click the "Preview" button to see how the email will look
2. The preview shows both HTML and plain text versions
3. Sample data is used to populate variables so you can see the final result

### Resetting Templates

If you need to restore a template to its original state:

1. Click the "Reset to Default" button next to the template
2. Confirm the action when prompted
3. The template will be restored to the system default

:::warning
Resetting a template will permanently discard all customizations. Make sure to save any important changes elsewhere before resetting.
:::

## Testing Email Delivery

To verify the email system is working correctly:

1. Click the "Send Test Email" button at the top of the Email Config page
2. Enter a recipient email address
3. Click "Send"
4. Check the recipient's inbox (including spam folder)

The test email will confirm:
- Email service connectivity
- Proper sender configuration
- Basic deliverability

## Email Delivery Monitoring

### Checking Email Status

While HyperStudy doesn't provide detailed email analytics in the interface, administrators can:

1. Monitor successful email sends through the application logs
2. Check for error messages in the Email Config status section
3. Access detailed metrics through the AWS SES console (requires AWS account access)

### Common Issues

**Emails Not Being Received:**
- Check recipient's spam/junk folder
- Verify the recipient's email address is correct
- Ensure the email service shows as "Active" in the configuration

**Template Variables Not Replaced:**
- Verify all required variables are present in the template
- Check that variable names match exactly (case-sensitive)
- Ensure double curly braces `{{}}` are used correctly

**Formatting Issues:**
- Test emails in multiple email clients
- Keep HTML formatting simple and table-based
- Always provide a plain text alternative

## Security and Compliance

The HyperStudy email system follows best practices for transactional email:

1. **Authentication**: All emails are sent through authenticated Amazon SES
2. **No Bulk Email**: The system is designed for transactional messages only
3. **Unsubscribe Handling**: Not applicable for transactional emails
4. **Data Protection**: Email content is generated dynamically and not stored

## Getting Help

If you encounter issues with the email system:

1. Check the email service status in the Email Config section
2. Verify templates contain all required variables
3. Test with different recipient addresses
4. Contact your system administrator for server-side configuration issues
5. Report persistent issues through the HyperStudy support channels