---
id: data-types
title: Data Types & Endpoints
slug: /experimenters/api-access/data-types
sidebar_position: 3
---

# Data Types & Endpoints

This guide explains the data types available through the HyperStudy API and when to use each one. For full endpoint details, parameters, and response schemas, see the **[Interactive API Reference](/api-reference)**.

## Endpoint Structure

All data endpoints follow this pattern:

```
/api/v3/data/{dataType}/{scope}/{scopeId}
```

### Scopes

Every data type supports three scope levels:

| Scope | Description | Example |
|-------|-------------|---------|
| `experiment` | All data across every session | `/data/events/experiment/{experimentId}` |
| `room` | Data for a single session | `/data/events/room/{roomId}` |
| `participant` | Data for one participant | `/data/events/participant/{participantId}?roomId={roomId}` |

### Common Query Parameters

Most endpoints accept these query parameters:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `startTime` | ISO 8601 | Filter records after this time | — |
| `endTime` | ISO 8601 | Filter records before this time | — |
| `limit` | number | Max records per page | 1000 |
| `offset` | number | Skip records for pagination | 0 |
| `sort` | string | Sort field | `timestamp` |
| `order` | string | Sort order (`asc`, `desc`) | `asc` |
| `format` | string | Response format (`json`, `csv`, `ndjson`) | `json` |

## Available Data Types

### 1. Events

**Scope**: `read:events`

All participant interactions, component completions, state transitions, and media events. This is the primary data type for behavioral analysis.

**Key fields**: `onset` (ms from experiment start), `eventType`, `category`, `componentType`, `content` (enriched descriptions), `stateName`, `participantRole`, `response`

**Unique parameter**: `category` — filter by event category (e.g., `component`, `state`, `media`)

**Batch recording**: `POST /data/events/batch` allows recording up to 100 events per request (requires `write:events` scope).

### 2. Recordings

**Scope**: `read:recordings`

Video and audio recordings from LiveKit video chat sessions. Each recording includes a signed download URL and metadata about format, resolution, and timing.

**Key fields**: `downloadUrl` (signed, temporary), `videoOffset` (ms from experiment start), `duration`, `fileSize`, `status`, `format`, `resolution`

### 3. Video Chat

**Scope**: `read:videochat`

LiveKit video chat connection data and session metadata. Useful for analyzing video chat participation patterns.

### 4. Text Chat

**Scope**: `read:chat`

Chat messages sent through the text chat component. Includes sender information, message content, and timing.

### 5. Ratings

**Scope**: `read:ratings`

Rating data is split into two sub-types:

**Continuous Ratings** (`/data/ratings/continuous/...`)
High-frequency rating data from continuous rating components. Data points are recorded every 100-500ms, making this ideal for time-series analysis of emotional responses, engagement, or valence.

**Sparse Ratings** (`/data/ratings/sparse/...`)
Individual rating responses from VAS scales, Likert scales, and other discrete rating components. Each record includes the response value, response time, and scale metadata.

### 6. Sync Metrics

**Scope**: `read:sync`

Video synchronization quality data for multi-participant experiments. Only available when experiments use synchronized media playback.

**Key fields**: `timeDrift` (ms from host), `playbackRate`, `syncQuality` (0-1), `latency`

**Unique parameter**: `aggregationWindow` — aggregate metrics over a time window in milliseconds

### 7. Components

**Scope**: `read:components`

Component response data including configurations and variable snapshots at display time. Useful for understanding what each participant saw and how they responded.

**Unique parameters**: `componentType` (e.g., `ShowVideo`, `TextInput`), `completed` (boolean), `stateId`

### 8. Participants

**Scope**: `read:events` (uses events scope)

Participant metadata and session information. Available at experiment and room scopes only (not individual participant scope).

**Unique parameters**: `completionCode` (enum: `SUCCESS`, `TIMEOUT`, `TECHNICAL`, `NOCONSENT`, `ABANDONED`, `IN_PROGRESS`, `COMPLETED_NO_CODE`), `deploymentId`

**Unique sort fields**: `joinedAt`, `completedAt`, `id`, `email`, `role`, `status`, `completionCode`

### 9. Rooms

**Scope**: `read:events` (uses events scope)

Room/session metadata for an experiment. Enriched with deployment names and participant counts. Returns up to 5,000 rooms.

### 10. Data Access Check

**No scope required** (authentication only)

Check whether you have view and/or export permissions for a specific experiment before fetching data.

```
GET /data/check-access/experiment/{experimentId}
```

Returns `{ canView: boolean, canExport: boolean }`.

## Experiment Management

In addition to data endpoints, the API provides full CRUD operations for experiments:

| Operation | Method | Path | Scope |
|-----------|--------|------|-------|
| List experiments | GET | `/experiments` | `read:experiments` |
| Get experiment | GET | `/experiments/{id}` | `read:experiments` |
| Get config | GET | `/experiments/{id}/config` | `read:experiments` |
| Export | GET | `/experiments/{id}/export` | `read:experiments` |
| Create | POST | `/experiments` | `write:experiments` |
| Update | PUT | `/experiments/{id}` | `write:experiments` |
| Validate | POST | `/experiments/validate` | `write:experiments` |
| Delete | DELETE | `/experiments/{id}` | `delete:experiments` |

See the [API Reference](/api-reference) for full request/response schemas.

## Common Patterns

### Fetching All Data for a Participant

```python
import requests

BASE_URL = 'https://api.hyperstudy.io/api/v3'
headers = {'X-API-Key': API_KEY}

participant_id = 'user_xyz789'
room_id = 'room_abc123'

data_types = ['events', 'recordings', 'chat', 'ratings/continuous', 'sync']
all_data = {}

for data_type in data_types:
    response = requests.get(
        f'{BASE_URL}/data/{data_type}/participant/{participant_id}',
        headers=headers,
        params={'roomId': room_id}
    )

    if response.ok:
        result = response.json()
        all_data[data_type] = result['data']
        print(f"{data_type}: {len(result['data'])} records")
```

### Exporting as CSV

```python
# Request CSV format directly from the API
response = requests.get(
    f'{BASE_URL}/data/events/room/room_abc123',
    headers=headers,
    params={'format': 'csv'}
)

# Save to file
with open('events.csv', 'w') as f:
    f.write(response.text)

# Or load directly into pandas
import pandas as pd
from io import StringIO

df = pd.read_csv(StringIO(response.text))
```

## Next Steps

- **Interactive reference**: [API Reference](/api-reference) — try endpoints live
- **Start coding**: [Python Guide](./python-guide.md) | [JavaScript Guide](./javascript-guide.md) | [R Guide](./r-guide.md)
- **Get an API Key**: [API Key Management](./api-keys.md)
