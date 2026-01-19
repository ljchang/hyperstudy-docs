---
title: Platform Administration
sidebar_position: 5
---

# Platform Administration

Platform administrators have elevated access across all organizations for support, debugging, and system management. This guide explains platform admin capabilities and responsibilities.

## Platform Admin vs Organization Admin

HyperStudy has two levels of administrative access:

| Aspect | Organization Admin | Platform Admin |
|--------|-------------------|----------------|
| Scope | Single organization | All organizations |
| User management | Org members only | All users |
| Resource access | Org resources only | All resources (logged) |
| Settings | Org settings | Platform settings |
| Audit logs | Org audit logs | Platform-wide logs |
| Typical role | Lab manager, PI | HyperStudy staff, IT admin |

## Platform Admin Capabilities

### Cross-Organization Resource Access

Platform admins can access resources from any organization for support and debugging:

- **Experiments**: View and troubleshoot experiment configurations
- **Data**: Access experiment data to diagnose issues
- **Media**: Review media files when investigating problems
- **Users**: View user accounts and organization memberships

:::warning All Access is Logged
Every resource access by a platform admin is recorded in the audit trail. This ensures transparency and accountability for elevated access.
:::

### User Support Functions

Platform admins can assist users with:

1. **Account recovery** - Reset passwords, unlock accounts
2. **Organization transfers** - Move users between organizations
3. **Permission troubleshooting** - Diagnose access issues
4. **Data recovery** - Retrieve accidentally deleted data
5. **Quota adjustments** - Modify organization quotas

### System Management

Platform admins have access to:

- **Platform health monitoring**
- **Feature flag management**
- **System-wide announcements**
- **Rate limit adjustments**
- **Maintenance mode controls**

## Access Logging and Compliance

### What Gets Logged

All platform admin actions are recorded:

```javascript
// Example audit log entry
{
  action: "platform_admin_access",
  actorId: "admin_user_123",
  actorEmail: "admin@hyperstudy.io",
  resourceType: "experiment",
  resourceId: "exp_abc123",
  resourceOrganization: "org_xyz789",
  accessType: "view",
  reason: "support_ticket_#12345",  // Optional ticket reference
  ipAddress: "10.0.0.1",
  userAgent: "Mozilla/5.0...",
  timestamp: "2024-10-20T14:30:00.000Z"
}
```

### Viewing Admin Access Logs

Organization admins can see when platform admins accessed their resources:

1. Go to **Settings > Organization > Audit Log**
2. Filter by **Action Type: Platform Admin Access**
3. Review the access events and reasons

### Compliance Reports

For audits and compliance requirements, platform admins can generate:

- **Access reports**: All platform admin access within a date range
- **Organization reports**: All activity for a specific organization
- **User reports**: All activity by a specific admin

## Best Practices for Platform Admins

### When to Use Platform Admin Access

**Appropriate uses:**
- Responding to support tickets
- Investigating reported bugs
- Assisting with data recovery
- Troubleshooting permission issues
- Emergency incident response

**Inappropriate uses:**
- Casual browsing of user data
- Accessing data without a documented reason
- Bypassing user consent
- Personal curiosity

### Documentation Requirements

When accessing user resources, platform admins should:

1. **Document the reason** - Reference support ticket or incident
2. **Limit scope** - Access only what's needed to resolve the issue
3. **Notify if appropriate** - Inform the organization of the access
4. **Log the resolution** - Document what was done and the outcome

### Security Responsibilities

Platform admins must:

- Use strong, unique passwords
- Enable two-factor authentication
- Never share credentials
- Report suspicious access attempts
- Follow the principle of least privilege

## Managing Platform Admins

### Granting Platform Admin Access

Platform admin access is granted by existing platform admins or through infrastructure configuration:

1. User must have verified HyperStudy account
2. Background check / trust verification
3. Training on platform admin responsibilities
4. Access granted via Firebase custom claims

### Revoking Platform Admin Access

To revoke platform admin access:

1. Remove the `platformAdmin` custom claim
2. Invalidate active sessions
3. Review recent access logs for anomalies
4. Update access documentation

### Auditing Platform Admin Actions

Regularly review platform admin activity:

1. **Weekly**: Review all platform admin access events
2. **Monthly**: Audit admin accounts for necessity
3. **Quarterly**: Full access review and policy compliance check

## Emergency Procedures

### Incident Response

When responding to security incidents:

1. **Assess**: Determine scope and impact
2. **Contain**: Limit further damage
3. **Document**: Record all actions taken
4. **Notify**: Inform affected organizations
5. **Remediate**: Fix the underlying issue
6. **Review**: Post-incident analysis

### Data Recovery

For data recovery requests:

1. Verify the request is legitimate
2. Check backup availability
3. Document the recovery scope
4. Perform recovery in isolated environment first
5. Verify recovered data integrity
6. Apply recovery to production
7. Confirm with requesting user

### Maintenance Mode

When entering maintenance mode:

1. Schedule maintenance window
2. Notify all organization admins
3. Display maintenance banner to users
4. Enable maintenance mode
5. Perform maintenance
6. Disable maintenance mode
7. Verify system health
8. Send completion notification

## Related Documentation

- [User Management](./user-management.md) - Managing user accounts
- [Monitoring](./monitoring.md) - System monitoring and alerts
- [Multi-Tenant Architecture](../developers/architecture/multi-tenant.md) - Technical details on data isolation
