---
title: Multi-Tenant Architecture
sidebar_position: 3
---

# Multi-Tenant Architecture

HyperStudy uses a multi-tenant architecture where each organization's data is isolated while still enabling cross-organization collaboration when explicitly permitted.

## Overview

The multi-tenant system provides:

- **Data isolation**: Each organization's experiments, media, and data are isolated by default
- **Cross-organization sharing**: Controlled access bridges between organizations
- **Granular permissions**: Fine-grained control over who can access what
- **Audit logging**: Comprehensive tracking for compliance

## Data Isolation Model

```
┌─────────────────────────────────────────────────────┐
│              HyperStudy Platform                    │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐         ┌──────────────┐         │
│  │    Org A     │         │    Org B     │         │
│  │ ──────────── │         │ ──────────── │         │
│  │ Experiments  │◄───────►│ Experiments  │ (cross-org sharing)
│  │ Media        │         │ Media        │         │
│  │ Data         │         │ Data         │ (isolated by default)
│  └──────────────┘         └──────────────┘         │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         resourcePermissions Collection        │  │
│  │   (Explicit permission bridges across orgs)   │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Organization Scoping

All queries for experiments, media, and data include organization scoping:

```javascript
// Example: Organization-scoped experiment query
const experiments = await db.collection('experiments')
  .where('organizationId', '==', currentOrganizationId)
  .get();
```

Users only see resources from their currently active organization, with shared resources appearing in a separate "Shared With Me" view.

## Permission System

### resourcePermissions Collection

The `resourcePermissions` collection stores all permission grants:

```javascript
// Schema: resourcePermissions/{permissionId}
{
  resourceId: "exp_abc123",           // ID of the resource
  resourceType: "experiment",          // experiment | image | video | data
  organizationId: "org_xyz",           // Organization that owns the resource

  // Grant target (one of these)
  userId: "user_123",                  // Specific user
  groupId: "group_456",                // Experimenter group
  targetOrganizationId: "org_other",   // External organization

  // Permissions
  permissions: {
    view: true,
    edit: false,
    duplicate: true,
    manageAccess: false,
    export: false                      // Data-specific permission
  },

  // Time-limited access
  expiresAt: Timestamp,                // Optional expiration

  // Audit fields
  grantedBy: "user_456",
  grantedAt: Timestamp,
  updatedAt: Timestamp
}
```

### Permission Hierarchy

Permission checks follow this order:

```
1. Owner
   ↓
2. Organization Admin (same org)
   ↓
3. Platform Admin (global, all access logged)
   ↓
4. Explicitly Shared (user/group/external org)
   ↓
5. Organization Default (org members)
   ↓
6. Public (if enabled)
```

### Permission Checking Flow

```javascript
// Simplified permission check flow
async function checkPermission(userId, resourceId, action) {
  // 1. Check if user is resource owner
  const resource = await getResource(resourceId);
  if (resource.ownerId === userId) return true;

  // 2. Check if user is organization admin
  const userOrgs = await getUserOrganizations(userId);
  if (userOrgs.some(o => o.id === resource.organizationId && o.role === 'admin')) {
    return true;
  }

  // 3. Check if user is platform admin (log access)
  if (await isPlatformAdmin(userId)) {
    await logPlatformAdminAccess(userId, resourceId, action);
    return true;
  }

  // 4. Check explicit permissions
  const permissions = await getResourcePermissions(resourceId, userId);
  return permissions[action] === true;
}
```

## Middleware Implementation

### verifyExperimentAccess

Used for experiment design access:

```javascript
// backend/src/middleware/verifyExperimentAccess.js
async function verifyExperimentAccess(req, res, next) {
  const { experimentId } = req.params;
  const userId = req.user.uid;
  const action = getActionFromMethod(req.method); // view, edit, etc.

  const hasAccess = await checkExperimentPermission(userId, experimentId, action);

  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
}
```

### verifyDataAccess

**Separate middleware** for data access (critical for data isolation):

```javascript
// backend/src/middleware/verifyDataAccess.js
async function verifyDataAccess(req, res, next) {
  const { experimentId } = req.params;
  const userId = req.user.uid;
  const action = req.query.export ? 'export' : 'view';

  // IMPORTANT: Uses data-specific permission check
  const hasAccess = await checkDataPermission(userId, experimentId, action);

  if (!hasAccess) {
    return res.status(403).json({ error: 'Data access denied' });
  }

  next();
}
```

:::warning Design ≠ Data
`verifyExperimentAccess` and `verifyDataAccess` are intentionally separate. Experiment design access does NOT grant data access. Always use the appropriate middleware.
:::

## Organization-Scoped API Queries

### X-Organization-Id Header

API requests that return organization-scoped data should include the organization header:

```javascript
// Frontend API call
const response = await fetch('/api/v3/experiments', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Organization-Id': currentOrganizationId
  }
});
```

### Backend Organization Filtering

```javascript
// Backend route handler
app.get('/api/v3/experiments', async (req, res) => {
  const organizationId = req.headers['x-organization-id'];
  const userId = req.user.uid;

  // Verify user belongs to organization
  const membership = await getOrganizationMembership(userId, organizationId);
  if (!membership) {
    return res.status(403).json({ error: 'Not a member of this organization' });
  }

  // Query with organization scope
  const experiments = await db.collection('experiments')
    .where('organizationId', '==', organizationId)
    .get();

  res.json(experiments);
});
```

## Cross-Organization Sharing

### Sharing Endpoint

```javascript
// POST /api/v3/experiments/:experimentId/share
app.post('/api/v3/experiments/:experimentId/share', async (req, res) => {
  const { experimentId } = req.params;
  const { targetType, targetId, permissions, expiresAt } = req.body;

  // Verify user can manage access
  const canManage = await checkPermission(req.user.uid, experimentId, 'manageAccess');
  if (!canManage) {
    return res.status(403).json({ error: 'Cannot manage access' });
  }

  // Create permission record
  await db.collection('resourcePermissions').add({
    resourceId: experimentId,
    resourceType: 'experiment',
    [targetType]: targetId, // userId, groupId, or targetOrganizationId
    permissions,
    expiresAt: expiresAt || null,
    grantedBy: req.user.uid,
    grantedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Log to audit trail
  await auditLog({
    action: 'permission_granted',
    resourceId: experimentId,
    targetType,
    targetId,
    permissions,
    actorId: req.user.uid
  });

  res.json({ success: true });
});
```

### Fetching Shared Resources

```javascript
// GET /api/v3/experiments/shared
app.get('/api/v3/experiments/shared', async (req, res) => {
  const userId = req.user.uid;
  const userOrgs = await getUserOrganizations(userId);
  const currentOrgId = req.headers['x-organization-id'];

  // Find all permissions granted to:
  // 1. This user directly
  // 2. Groups this user belongs to
  // 3. Organizations this user belongs to (excluding current)
  const sharedPermissions = await db.collection('resourcePermissions')
    .where('resourceType', '==', 'experiment')
    .where('organizationId', '!=', currentOrgId) // From OTHER orgs
    .get();

  // Filter to permissions that apply to this user
  const relevantPermissions = sharedPermissions.filter(p => {
    if (p.userId === userId) return true;
    if (userGroups.includes(p.groupId)) return true;
    if (userOrgs.some(o => o.id === p.targetOrganizationId)) return true;
    return false;
  });

  // Fetch the actual experiments
  const experiments = await Promise.all(
    relevantPermissions.map(p => getExperiment(p.resourceId))
  );

  res.json(experiments);
});
```

## Audit Logging

### auditLogService

All permission-related and cross-organization activities are logged:

```javascript
// backend/src/services/auditLogService.js
async function auditLog(event) {
  await db.collection('auditLogs').add({
    ...event,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    ipAddress: event.ipAddress,
    userAgent: event.userAgent
  });
}

// Logged events:
// - permission_granted
// - permission_revoked
// - permission_modified
// - resource_accessed (for cross-org access)
// - platform_admin_access
// - data_exported
```

### Platform Admin Access Logging

All platform admin access is explicitly logged:

```javascript
async function logPlatformAdminAccess(adminId, resourceId, action) {
  await auditLog({
    action: 'platform_admin_access',
    actorId: adminId,
    resourceId,
    accessType: action,
    reason: 'support_access' // Can be enhanced with ticket numbers
  });
}
```

## Key Implementation Files

| File | Purpose |
|------|---------|
| `backend/src/services/resourcePermissionService.js` | Permission CRUD and checking |
| `backend/src/services/auditLogService.js` | Audit logging |
| `backend/src/middleware/verifyExperimentAccess.js` | Experiment access middleware |
| `backend/src/middleware/verifyDataAccess.js` | Data access middleware |
| `frontend/src/components/shared/PermissionManager.svelte` | Permission UI |
| `frontend/src/components/admin/OrgSwitcher.svelte` | Organization switching |
| `frontend/src/components/experiment/SharedExperimentsPanel.svelte` | Cross-org shared view |

## Security Considerations

### Never Bypass Organization Filtering

```javascript
// BAD: No organization filtering
const allExperiments = await db.collection('experiments').get();

// GOOD: Always filter by organization
const experiments = await db.collection('experiments')
  .where('organizationId', '==', currentOrgId)
  .get();
```

### Always Use Appropriate Middleware

```javascript
// Experiment design routes
router.get('/experiments/:id', verifyExperimentAccess, getExperiment);
router.put('/experiments/:id', verifyExperimentAccess, updateExperiment);

// Data routes - MUST use verifyDataAccess
router.get('/experiments/:id/data', verifyDataAccess, getData);
router.get('/experiments/:id/export', verifyDataAccess, exportData);
```

### Validate Cross-Organization Operations

```javascript
// Always verify the target exists and is valid
async function shareWithOrganization(resourceId, targetOrgId) {
  // Verify target organization exists
  const targetOrg = await getOrganization(targetOrgId);
  if (!targetOrg) {
    throw new Error('Target organization not found');
  }

  // Proceed with share...
}
```

## Testing Multi-Tenant Features

When testing multi-tenant functionality:

1. **Test organization isolation**: Verify users can't see resources from other orgs
2. **Test cross-org sharing**: Verify shared resources appear correctly
3. **Test permission expiration**: Verify expired permissions are enforced
4. **Test audit logging**: Verify all actions are logged
5. **Test platform admin access**: Verify access works and is logged

## Related Documentation

- [Permissions & Sharing](../../experimenters/permissions.md) - User-facing permission guide
- [Cross-Organization Collaboration](../../experimenters/cross-org-collaboration.md) - User guide for cross-org features
- [Data Permissions](../../experimenters/data-management/permissions.md) - Data-specific permissions
