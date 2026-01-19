---
title: Collaborative Editing Architecture
sidebar_position: 4
---

# Collaborative Editing Architecture

HyperStudy's Experiment Designer uses WebSocket-based real-time editing, enabling multiple users to edit experiments simultaneously with instant persistence.

## Overview

The collaborative editing system replaced the previous HTTP-based auto-save approach:

| Aspect | Old (HTTP Auto-Save) | New (WebSocket) |
|--------|---------------------|-----------------|
| Save mechanism | Debounced HTTP POST (2s delay) | Instant WebSocket emit |
| Payload size | 50-500KB (full experiment snapshot) | ~50 bytes (field delta) |
| Collaboration | Not supported | Real-time multi-user |
| Persistence | After debounce timer | Immediate |
| Conflict handling | Last-write-wins | Version tracking |

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│    Editor A     │         │    Editor B     │
│    (Browser)    │         │    (Browser)    │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ WebSocket                 │ WebSocket
         │                           │
         ▼                           ▼
┌──────────────────────────────────────────────┐
│          Socket.IO Server                    │
│    /experimentdesigner namespace             │
├──────────────────────────────────────────────┤
│  ┌────────────────┐    ┌─────────────────┐  │
│  │     Redis      │    │    Firestore    │  │
│  │   (versions)   │    │     (data)      │  │
│  └────────────────┘    └─────────────────┘  │
└──────────────────────────────────────────────┘
```

### Data Flow

1. **Editor makes change** → marks update as local
2. **Client sends update** → via WebSocket to server
3. **Server validates** → checks permissions and version
4. **Server writes** → to Firestore
5. **Server increments** → Redis version counter
6. **Server broadcasts** → to all editors in room
7. **Other editors receive** → apply update
8. **Original editor ignores** → echo prevention filters own update

## Key Components

### Client-Side

#### ExperimentDesignerSocket.js

Manages the WebSocket connection with automatic reconnection:

```javascript
// frontend/src/lib/experiment/experimentDesignerSocket.js

class ExperimentDesignerSocket {
  constructor(experimentId, onUpdate, onEditorsChange) {
    this.experimentId = experimentId;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.pendingUpdates = [];
  }

  connect() {
    this.socket = io('/experimentdesigner', {
      auth: { token: this.authToken }
    });

    this.socket.on('connect', () => {
      this.socket.emit('join', { experimentId: this.experimentId });
      this.flushPendingUpdates();
    });

    this.socket.on('update', (data) => {
      // Check if this is our own update (echo)
      if (!this.isOwnUpdate(data)) {
        this.onUpdate(data);
      }
    });

    this.socket.on('editors', (editors) => {
      this.onEditorsChange(editors);
    });

    this.socket.on('disconnect', () => {
      this.scheduleReconnect();
    });
  }

  sendUpdate(field, value) {
    const update = {
      field,
      value,
      clientId: this.clientId,
      timestamp: Date.now()
    };

    if (this.socket?.connected) {
      this.socket.emit('update', update);
    } else {
      this.pendingUpdates.push(update);
    }
  }

  flushPendingUpdates() {
    while (this.pendingUpdates.length > 0) {
      const update = this.pendingUpdates.shift();
      this.socket.emit('update', update);
    }
  }
}
```

#### remoteUpdateApplicator.js

Prevents echo feedback when receiving own updates:

```javascript
// frontend/src/lib/experiment/remoteUpdateApplicator.js

class RemoteUpdateApplicator {
  constructor() {
    this.localUpdateIds = new Set();
  }

  // Mark an update as locally initiated
  markLocal(updateId) {
    this.localUpdateIds.add(updateId);
    // Clean up after 5 seconds
    setTimeout(() => this.localUpdateIds.delete(updateId), 5000);
  }

  // Check if an update should be applied
  shouldApply(update) {
    // Don't apply our own updates (they're already reflected in UI)
    if (this.localUpdateIds.has(update.clientUpdateId)) {
      return false;
    }
    return true;
  }

  // Apply a remote update to the store
  applyUpdate(update, experimentStore) {
    if (!this.shouldApply(update)) {
      return;
    }

    // Apply the update to the appropriate part of the experiment
    experimentStore.applyRemoteUpdate(update.field, update.value);
  }
}
```

### Server-Side

#### experimentDesignerServer.js

Socket.IO namespace handler for the experiment designer:

```javascript
// backend/src/experiment/experimentDesignerServer.js

const experimentDesignerNamespace = io.of('/experimentdesigner');

experimentDesignerNamespace.on('connection', async (socket) => {
  // Authenticate user
  const user = await authenticateSocket(socket);
  if (!user) {
    socket.disconnect();
    return;
  }

  socket.on('join', async ({ experimentId }) => {
    // Check permissions (with 30s cache)
    const hasAccess = await checkPermissionCached(user.uid, experimentId, 'edit');
    if (!hasAccess) {
      socket.emit('error', { message: 'Access denied' });
      return;
    }

    // Join the room for this experiment
    socket.join(`experiment:${experimentId}`);

    // Track editor
    await addEditor(experimentId, user);
    broadcastEditors(experimentId);

    // Send current version
    const version = await getVersion(experimentId);
    socket.emit('version', { version });
  });

  socket.on('update', async (data) => {
    const { experimentId, field, value, clientUpdateId } = data;

    // Validate permissions
    const hasAccess = await checkPermissionCached(socket.userId, experimentId, 'edit');
    if (!hasAccess) {
      socket.emit('error', { message: 'Access denied' });
      return;
    }

    // Write to Firestore
    await updateExperimentField(experimentId, field, value);

    // Increment version in Redis
    const newVersion = await incrementVersion(experimentId);

    // Broadcast to all editors in room (including sender for confirmation)
    experimentDesignerNamespace.to(`experiment:${experimentId}`).emit('update', {
      field,
      value,
      version: newVersion,
      clientUpdateId,
      editorId: socket.userId
    });
  });

  socket.on('disconnect', async () => {
    await removeEditor(socket.experimentId, socket.userId);
    broadcastEditors(socket.experimentId);
  });
});
```

## Connection Flow

```
1. User opens Experiment Designer
   │
2. ExperimentDesignerSocket.connect()
   │
3. Socket.IO connection established
   │
4. Client emits 'join' with experimentId
   │
5. Server validates permissions (cached 30s)
   │
6. Server joins socket to room 'experiment:{id}'
   │
7. Server tracks editor, broadcasts editor list
   │
8. Server sends current version
   │
9. Client ready for bidirectional updates
```

## Update Flow

### Local Update (User Types)

```
1. User changes field in UI
   │
2. Store update triggers sendUpdate()
   │
3. remoteUpdateApplicator.markLocal(updateId)
   │
4. ExperimentDesignerSocket.sendUpdate(field, value, updateId)
   │
5. Server receives 'update' event
   │
6. Server validates permissions
   │
7. Server writes to Firestore
   │
8. Server increments Redis version
   │
9. Server broadcasts to room
   │
10. Original client receives broadcast
    │
11. remoteUpdateApplicator.shouldApply() returns false
    │
12. Update ignored (already reflected in UI)
```

### Remote Update (Collaborator Change)

```
1. Server broadcasts update to room
   │
2. Client receives 'update' event
   │
3. remoteUpdateApplicator.shouldApply() returns true
   │
4. remoteUpdateApplicator.applyUpdate()
   │
5. Store updated with remote change
   │
6. UI reflects change
```

## Batch Operations

For atomic multi-field updates (e.g., reordering states):

```javascript
// Client
socket.emit('batchUpdate', {
  experimentId,
  updates: [
    { field: 'states.0.order', value: 1 },
    { field: 'states.1.order', value: 0 },
  ],
  clientUpdateId
});

// Server
socket.on('batchUpdate', async ({ experimentId, updates, clientUpdateId }) => {
  // Atomic Firestore batch write
  const batch = db.batch();
  const experimentRef = db.collection('experiments').doc(experimentId);

  for (const update of updates) {
    // Build the update object
  }

  await batch.commit();

  // Single version increment
  const newVersion = await incrementVersion(experimentId);

  // Single broadcast
  experimentDesignerNamespace.to(`experiment:${experimentId}`).emit('batchUpdate', {
    updates,
    version: newVersion,
    clientUpdateId,
    editorId: socket.userId
  });
});
```

## Permission Caching

Permissions are cached for 30 seconds to reduce database load:

```javascript
const permissionCache = new Map();

async function checkPermissionCached(userId, experimentId, action) {
  const cacheKey = `${userId}:${experimentId}:${action}`;
  const cached = permissionCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < 30000) {
    return cached.hasAccess;
  }

  const hasAccess = await checkPermission(userId, experimentId, action);

  permissionCache.set(cacheKey, {
    hasAccess,
    timestamp: Date.now()
  });

  return hasAccess;
}
```

:::note 30-Second Permission Delay
If a user is just granted edit access, they may need to wait up to 30 seconds (or refresh) for the permission to take effect due to caching.
:::

## Redis Version Tracking

Redis tracks the current version of each experiment for cross-pod consistency:

```javascript
// Get current version
async function getVersion(experimentId) {
  const version = await redis.get(`experiment:${experimentId}:version`);
  return parseInt(version) || 0;
}

// Increment and return new version
async function incrementVersion(experimentId) {
  return await redis.incr(`experiment:${experimentId}:version`);
}
```

This ensures all server pods see the same version, preventing conflicts in horizontal scaling scenarios.

## Editor Tracking

The system tracks who is currently editing:

```javascript
async function addEditor(experimentId, user) {
  await redis.hset(
    `experiment:${experimentId}:editors`,
    user.uid,
    JSON.stringify({
      name: user.displayName,
      email: user.email,
      joinedAt: Date.now()
    })
  );
}

async function removeEditor(experimentId, userId) {
  await redis.hdel(`experiment:${experimentId}:editors`, userId);
}

async function getEditors(experimentId) {
  const editors = await redis.hgetall(`experiment:${experimentId}:editors`);
  return Object.entries(editors).map(([uid, data]) => ({
    uid,
    ...JSON.parse(data)
  }));
}

function broadcastEditors(experimentId) {
  const editors = await getEditors(experimentId);
  experimentDesignerNamespace
    .to(`experiment:${experimentId}`)
    .emit('editors', editors);
}
```

## Automatic Variable Sync

When `outputVariable` changes on a component, variables are automatically synchronized:

```javascript
socket.on('update', async (data) => {
  const { field, value } = data;

  // Check if this is an outputVariable change
  if (field.endsWith('.outputVariable')) {
    const componentPath = field.replace('.outputVariable', '');

    // Get the component to find old variable name
    const experiment = await getExperiment(experimentId);
    const component = getByPath(experiment, componentPath);

    if (component.outputVariable && component.outputVariable !== value) {
      // Sync variable definition
      await syncVariableDefinition(experimentId, component.outputVariable, value);
    }
  }

  // Normal update processing...
});
```

## Feature Flag

The WebSocket system can be disabled for debugging:

```javascript
// Disable WebSocket editing (falls back to HTTP)
localStorage.setItem('experimentDesigner.useWebSocket', 'false');

// Re-enable (default)
localStorage.removeItem('experimentDesigner.useWebSocket');
```

## Reconnection Handling

The client handles disconnections gracefully:

```javascript
class ExperimentDesignerSocket {
  scheduleReconnect() {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    setTimeout(() => {
      if (!this.socket?.connected) {
        this.connect();
      }
    }, delay);
  }

  flushPendingUpdates() {
    // On reconnect, send any updates that were queued while offline
    while (this.pendingUpdates.length > 0) {
      const update = this.pendingUpdates.shift();
      this.socket.emit('update', update);
    }
  }
}
```

## Key Implementation Files

| File | Purpose |
|------|---------|
| `frontend/src/lib/experiment/experimentDesignerSocket.js` | WebSocket client |
| `frontend/src/lib/experiment/remoteUpdateApplicator.js` | Echo prevention |
| `backend/src/experiment/experimentDesignerServer.js` | Socket.IO server |
| `backend/src/services/experimentVersionService.js` | Redis version tracking |

## Future Roadmap

The current implementation is **Phase 1** (infrastructure). Future phases may include:

- **Cursor sharing**: See where collaborators are editing
- **Conflict UI**: Visual indicators when edits overlap
- **Offline mode**: Full offline editing with sync on reconnect
- **Presence indicators**: Typing indicators and selection highlighting

## Related Documentation

- [Experiment Design Overview](../../experimenters/experiment-design/overview.md) - User-facing documentation
- [Horizontal Scaling](./horizontal-scaling.md) - How Redis enables cross-pod consistency
