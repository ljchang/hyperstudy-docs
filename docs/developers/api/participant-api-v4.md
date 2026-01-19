---
title: V4 Participant API
sidebar_position: 1
---

# V4 Participant API

The V4 Participant API provides improved performance and security for participant-facing endpoints through session-based authentication.

## Overview

### Why V4?

The V4 API improves on V3 with:

| Aspect | V3 | V4 |
|--------|----|----|
| Authentication | JWT token verification per request | Session-based (single verification) |
| Performance | JWT decode overhead on each request | Pre-authenticated session |
| Session tracking | Via participant records | Dedicated session collection |
| Rate limiting | Per-user | Per-session with better controls |
| Feature flag | Always active | Controlled rollout via `USE_V4_PARTICIPANT_API` |

### Feature Flag

V4 is controlled by a feature flag for gradual rollout:

```javascript
// Backend environment variable
USE_V4_PARTICIPANT_API=true

// To disable V4 (revert to V3)
USE_V4_PARTICIPANT_API=false
```

## Session-Based Authentication

### How It Works

```
1. Participant joins experiment
   │
2. Frontend calls POST /api/v4/participant/join
   │
3. Backend creates session record in participantSessions collection
   │
4. Backend returns sessionId and sessionToken
   │
5. All subsequent requests include sessionId in header
   │
6. Backend validates session (fast lookup, no JWT decode)
```

### Session Lifecycle

```javascript
// Session record in Firestore
// Collection: participantSessions/{sessionId}
{
  sessionId: "sess_abc123",
  participantId: "part_xyz789",
  experimentId: "exp_research_001",
  roomId: "room_live_456",
  userId: "user_auth_123",           // Firebase Auth UID
  createdAt: Timestamp,
  lastActivityAt: Timestamp,
  expiresAt: Timestamp,              // 24 hours from creation
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  status: "active"                   // active | completed | expired | revoked
}
```

### Session TTL

- **Default TTL**: 24 hours from creation
- **Activity extension**: Last activity timestamp updated on each request
- **Cleanup**: Expired sessions cleaned up via scheduled job

## Endpoints

### Discovery

Check available experiments and validate session:

```http
GET /api/v4/participant/discover
```

**Headers:**
```http
X-Session-Id: sess_abc123
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "experiments": [
      {
        "experimentId": "exp_research_001",
        "name": "Research Study 1",
        "status": "recruiting",
        "availableSlots": 5
      }
    ],
    "session": {
      "valid": true,
      "expiresIn": 82800
    }
  }
}
```

### Join Experiment

Create a session and join an experiment:

```http
POST /api/v4/participant/join
Content-Type: application/json

{
  "experimentId": "exp_research_001",
  "role": "participant",
  "metadata": {
    "source": "prolific",
    "prolificPid": "abc123"
  }
}
```

**Headers:**
```http
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "sessionId": "sess_abc123",
    "sessionToken": "stkn_xyz789...",
    "participantId": "part_def456",
    "roomId": "room_live_789",
    "experimentConfig": {
      "name": "Research Study 1",
      "states": [...],
      "globalComponents": [...]
    },
    "expiresAt": "2024-10-21T14:30:00.000Z"
  }
}
```

### Submit Events

Record experiment events:

```http
POST /api/v4/participant/events
Content-Type: application/json

{
  "events": [
    {
      "type": "state_transition",
      "stateId": "state_intro",
      "timestamp": 1697815800000,
      "data": {
        "fromState": null,
        "toState": "introduction"
      }
    },
    {
      "type": "component_response",
      "componentId": "rating_1",
      "timestamp": 1697815850000,
      "data": {
        "value": 7,
        "responseTime": 2500
      }
    }
  ]
}
```

**Headers:**
```http
X-Session-Id: sess_abc123
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "recorded": 2,
    "serverTimestamp": "2024-10-20T14:30:50.123Z"
  }
}
```

### Complete Experiment

Mark participation as complete:

```http
POST /api/v4/participant/complete
Content-Type: application/json

{
  "completionCode": "STUDY123",
  "finalState": "debriefing",
  "summary": {
    "totalEvents": 150,
    "duration": 1800000
  }
}
```

**Headers:**
```http
X-Session-Id: sess_abc123
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "completionCode": "STUDY123",
    "redirectUrl": "https://prolific.com/return?code=STUDY123",
    "sessionEnded": true
  }
}
```

### Session History

Get participant's session history (for returning participants):

```http
GET /api/v4/participant/history
```

**Headers:**
```http
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "sessions": [
      {
        "sessionId": "sess_abc123",
        "experimentId": "exp_research_001",
        "experimentName": "Research Study 1",
        "status": "completed",
        "startedAt": "2024-10-20T14:00:00.000Z",
        "completedAt": "2024-10-20T14:30:00.000Z",
        "completionCode": "STUDY123"
      }
    ]
  }
}
```

## Rate Limiting

V4 implements per-session rate limiting:

| Endpoint | Limit |
|----------|-------|
| `/join` | 5 per minute |
| `/events` | 100 per minute |
| `/complete` | 3 per minute |
| `/discover` | 20 per minute |
| `/history` | 10 per minute |

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1697815860
```

## Migration from V3

### Key Differences

1. **Authentication**: Replace JWT verification with session ID
2. **Session creation**: Call `/join` to get a session before other calls
3. **Event batching**: V4 encourages batching events (array in single request)
4. **Completion flow**: Explicit `/complete` endpoint instead of implicit

### Migration Steps

1. **Enable feature flag** in staging:
   ```bash
   USE_V4_PARTICIPANT_API=true
   ```

2. **Update frontend** to use session-based flow:
   ```javascript
   // Old (V3)
   const response = await fetch('/api/v3/participant/events', {
     headers: { 'Authorization': `Bearer ${idToken}` }
   });

   // New (V4)
   const session = await joinExperiment(experimentId, idToken);
   const response = await fetch('/api/v4/participant/events', {
     headers: { 'X-Session-Id': session.sessionId }
   });
   ```

3. **Test thoroughly** with real participants

4. **Monitor performance** in production

5. **Full rollout** when stable

### Fallback Behavior

When V4 is disabled, requests automatically fall back to V3:

```javascript
// Backend routing
if (process.env.USE_V4_PARTICIPANT_API === 'true') {
  app.use('/api/v4/participant', v4ParticipantRoutes);
} else {
  // V4 routes redirect to V3 equivalents
  app.use('/api/v4/participant', (req, res, next) => {
    req.url = req.url.replace('/v4/', '/v3/');
    next();
  });
}
```

## Error Handling

### V4-Specific Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `SESSION_EXPIRED` | Session has expired | Re-authenticate with `/join` |
| `SESSION_INVALID` | Session not found or revoked | Re-authenticate with `/join` |
| `SESSION_MISMATCH` | Session doesn't match experiment | Use correct session |
| `EXPERIMENT_CLOSED` | Experiment no longer accepting participants | N/A |

### Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "SESSION_EXPIRED",
    "message": "Session has expired. Please rejoin the experiment.",
    "details": {
      "sessionId": "sess_abc123",
      "expiredAt": "2024-10-20T14:30:00.000Z"
    }
  }
}
```

## Implementation Files

| File | Purpose |
|------|---------|
| `backend/src/api/v4/routes/participant.js` | V4 endpoint handlers |
| `backend/src/api/v4/middleware/sessionAuth.js` | Session validation middleware |
| `backend/src/services/participantSessionService.js` | Session CRUD operations |
| `frontend/src/lib/services/participantService.js` | Frontend V4 client |

## Security Considerations

### Session Security

- **Session IDs**: Cryptographically random, 32 bytes
- **Session tokens**: Signed with server secret, validated on each request
- **IP binding**: Optional - session can be bound to originating IP
- **User agent validation**: Detect session hijacking attempts

### Recommended Practices

1. Store session ID in memory only (not localStorage)
2. Re-authenticate on page refresh
3. Implement session timeout warnings for long experiments
4. Use HTTPS exclusively

## Related Documentation

- [Data Collection V2](../data-api/data-collection-v2.md) - Event recording architecture
- [Horizontal Scaling](../architecture/horizontal-scaling.md) - How sessions work across pods
