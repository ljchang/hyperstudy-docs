---
id: data-types
title: Data Types & Endpoints
slug: /experimenters/api-access/data-types
sidebar_position: 3
---

# Data Types & Endpoints

This guide documents all available data types and their API endpoints in HyperStudy.

## Endpoint Structure

All data endpoints follow this pattern:

```
/api/v3/data/{dataType}/{scope}/{scopeId}
```

### Components

- **`dataType`**: Type of data to retrieve
  - `events` - Event data
  - `recordings` - Video/audio recordings
  - `chat` - Text chat messages
  - `ratings/continuous` - Continuous rating data
  - `ratings/sparse` - Sparse rating responses
  - `sync` - Sync metrics
  - `components` - Component metadata

- **`scope`**: Data scope level
  - `experiment` - All data for an experiment
  - `room` - All data for a session/room
  - `participant` - Data for a specific participant

- **`scopeId`**: ID of the experiment/room/participant

## Available Data Types

### 1. Events

**What**: All participant interactions, component completions, state transitions, and media events.

**Endpoints**:
```
GET /api/v3/data/events/experiment/{experimentId}
GET /api/v3/data/events/room/{roomId}
GET /api/v3/data/events/participant/{participantId}?roomId={roomId}
```

**Required Scope**: `read:events`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | string | Filter by room (participant endpoint only) |
| `startTime` | ISO 8601 | Events after this timestamp |
| `endTime` | ISO 8601 | Events before this timestamp |
| `limit` | number | Max records (default: 1000) |
| `offset` | number | Skip records for pagination |
| `sort` | string | Sort field (`timestamp`, `onset`) |
| `order` | string | Sort order (`asc`, `desc`) |
| `format` | string | Response format (`json`, `csv`) |

**Response Fields**:
```json
{
  "id": "event_123",
  "timestamp": "2024-10-20T14:30:45.123Z",
  "onset": 5000,
  "experimentId": "exp_research_001",
  "sessionId": "room_abc123",
  "participantId": "user_xyz789",
  "eventType": "component.complete",
  "category": "component",
  "componentType": "ShowVideo",
  "componentId": "video_intro",
  "content": "Video: introduction.mp4",
  "stateName": "introduction_state",
  "participantRole": "participant_a",
  "duration": 45000,
  "response": {
    "value": "yes",
    "responseTime": 3245
  }
}
```

**Key Fields**:
- `onset`: Milliseconds from experiment start (can be negative)
- `timestamp`: Absolute time (ISO 8601)
- `eventType`: Type of event (e.g., "component.complete", "state.enter")
- `category`: Event category (component, state, media, communication, sync)
- `componentType`: Component that generated event (enriched)
- `content`: Human-readable description (enriched)

**Example**:
```bash
curl -H "X-API-Key: YOUR_KEY" \
  "https://api.hyperstudy.io/api/v3/data/events/room/room_abc123?limit=100&sort=onset&order=asc"
```

### 2. Recordings

**What**: Video and audio recordings from LiveKit video chat sessions.

**Endpoints**:
```
GET /api/v3/data/recordings/experiment/{experimentId}
GET /api/v3/data/recordings/room/{roomId}
GET /api/v3/data/recordings/participant/{participantId}?roomId={roomId}
```

**Required Scope**: `read:recordings`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | string | Filter by room (participant endpoint only) |
| `limit` | number | Max records |
| `offset` | number | Pagination offset |

**Response Fields**:
```json
{
  "recordingId": "rec_abc123",
  "participantId": "user_xyz789",
  "participantName": "Participant A",
  "experimentId": "exp_research_001",
  "roomId": "room_abc123",
  "startTime": "2024-10-20T14:30:00.000Z",
  "endTime": "2024-10-20T14:45:00.000Z",
  "duration": 900000,
  "videoOffset": 5000,
  "downloadUrl": "https://storage.example.com/recordings/...",
  "fileSize": 145678901,
  "status": "completed",
  "format": "mp4",
  "resolution": "1280x720"
}
```

**Key Fields**:
- `downloadUrl`: Signed URL to download the recording file (expires after some time)
- `videoOffset`: Milliseconds from experiment start when recording began
- `duration`: Recording length in milliseconds
- `fileSize`: File size in bytes

**Example**:
```python
import requests

response = requests.get(
    'https://api.hyperstudy.io/api/v3/data/recordings/room/room_abc123',
    headers={'X-API-Key': API_KEY}
)

recordings = response.json()['data']
for rec in recordings:
    print(f"Recording: {rec['participantName']}")
    print(f"Download: {rec['downloadUrl']}")
    print(f"Duration: {rec['duration']/1000:.1f}s")
```

### 3. Text Chat

**What**: Chat messages sent through the text chat component.

**Endpoints**:
```
GET /api/v3/data/chat/experiment/{experimentId}
GET /api/v3/data/chat/room/{roomId}
GET /api/v3/data/chat/participant/{participantId}?roomId={roomId}
```

**Required Scope**: `read:chat`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | string | Filter by room (participant endpoint only) |
| `startTime` | ISO 8601 | Messages after this time |
| `endTime` | ISO 8601 | Messages before this time |
| `limit` | number | Max records |
| `offset` | number | Pagination offset |

**Response Fields**:
```json
{
  "messageId": "msg_abc123",
  "experimentId": "exp_research_001",
  "roomId": "room_abc123",
  "senderId": "user_xyz789",
  "senderName": "Participant A",
  "content": "Hello, everyone!",
  "timestamp": "2024-10-20T14:32:15.000Z",
  "onset": 135000,
  "recipientIds": ["user_aaa", "user_bbb"],
  "messageType": "text"
}
```

**Example**:
```javascript
const response = await fetch(
  'https://api.hyperstudy.io/api/v3/data/chat/room/room_abc123',
  { headers: { 'X-API-Key': API_KEY } }
);

const result = await response.json();
const messages = result.data;

messages.forEach(msg => {
  console.log(`[${msg.onset/1000}s] ${msg.senderName}: ${msg.content}`);
});
```

### 4. Ratings

#### Continuous Ratings

**What**: High-frequency rating data from continuous rating components (data points every 100-500ms).

**Endpoints**:
```
GET /api/v3/data/ratings/continuous/experiment/{experimentId}
GET /api/v3/data/ratings/continuous/room/{roomId}
GET /api/v3/data/ratings/continuous/participant/{participantId}?roomId={roomId}
```

**Required Scope**: `read:ratings`

**Response Fields**:
```json
{
  "ratingId": "rating_abc123",
  "experimentId": "exp_research_001",
  "roomId": "room_abc123",
  "participantId": "user_xyz789",
  "componentId": "emotion_rating",
  "timestamp": "2024-10-20T14:35:12.456Z",
  "onset": 312456,
  "value": 0.75,
  "normalizedValue": 0.75,
  "rawValue": 75,
  "scaleMin": 0,
  "scaleMax": 100
}
```

**Use Case**: Time-series analysis of emotional responses, engagement, valence, etc.

#### Sparse Ratings

**What**: Individual rating responses from VAS scales, Likert scales, etc.

**Endpoints**:
```
GET /api/v3/data/ratings/sparse/experiment/{experimentId}
GET /api/v3/data/ratings/sparse/room/{roomId}
GET /api/v3/data/ratings/sparse/participant/{participantId}?roomId={roomId}
```

**Required Scope**: `read:ratings`

**Response Fields**:
```json
{
  "ratingId": "rating_xyz789",
  "experimentId": "exp_research_001",
  "roomId": "room_abc123",
  "participantId": "user_xyz789",
  "componentId": "mood_assessment",
  "timestamp": "2024-10-20T14:36:00.000Z",
  "onset": 320000,
  "value": 7,
  "responseTime": 3245,
  "scaleMin": 1,
  "scaleMax": 10,
  "labels": {
    "min": "Very sad",
    "max": "Very happy"
  }
}
```

### 5. Sync Metrics

**What**: Video synchronization quality data for multi-participant experiments.

**Endpoints**:
```
GET /api/v3/data/sync/experiment/{experimentId}
GET /api/v3/data/sync/room/{roomId}
GET /api/v3/data/sync/participant/{participantId}?roomId={roomId}
```

**Required Scope**: `read:sync`

**Response Fields**:
```json
{
  "metricId": "sync_abc123",
  "experimentId": "exp_research_001",
  "roomId": "room_abc123",
  "participantId": "user_xyz789",
  "timestamp": "2024-10-20T14:35:00.000Z",
  "onset": 300000,
  "timeDrift": -150,
  "playbackRate": 1.002,
  "syncQuality": 0.95,
  "latency": 85,
  "bufferHealth": 0.9
}
```

**Key Fields**:
- `timeDrift`: Difference from host in milliseconds (negative = behind)
- `playbackRate`: Current playback speed adjustment
- `syncQuality`: Quality metric from 0 (bad) to 1 (perfect)
- `latency`: Network latency in milliseconds

**Note**: Only available for multi-participant experiments with video synchronization.

### 6. Components

**What**: Metadata about experiment components and their configurations.

**Endpoints**:
```
GET /api/v3/data/components/experiment/{experimentId}
GET /api/v3/data/components/room/{roomId}
GET /api/v3/data/components/participant/{participantId}?roomId={roomId}
```

**Required Scope**: `read:components`

**Response Fields**:
```json
{
  "componentId": "video_intro",
  "componentType": "ShowVideo",
  "experimentId": "exp_research_001",
  "stateId": "introduction_state",
  "config": {
    "videoUrl": "https://example.com/intro.mp4",
    "autoplay": true,
    "controls": false
  },
  "timestamp": "2024-10-20T14:30:45.000Z",
  "onset": 5000,
  "variableSnapshot": {
    "participant_name": "John",
    "condition": "treatment"
  }
}
```

**Use Case**: Understanding component configurations and variable states at display time.

## curl Examples

For quick testing or shell scripts, you can use `curl` to make API requests.

### Basic Request

```bash
curl -H "X-API-Key: YOUR_API_KEY" \
  "https://api.hyperstudy.io/api/v3/data/events/room/YOUR_ROOM_ID?limit=10"
```

### Download Events for a Room

```bash
# Get 100 events sorted by onset time
curl -H "X-API-Key: hst_live_your_key_here" \
  "https://api.hyperstudy.io/api/v3/data/events/room/room_abc123?limit=100&sort=onset&order=asc"
```

### Download as CSV

```bash
# Download events in CSV format
curl -H "X-API-Key: hst_live_your_key_here" \
  "https://api.hyperstudy.io/api/v3/data/events/room/room_abc123?format=csv" \
  > events.csv
```

### Get Participant Data

```bash
# Get events for a specific participant in a room
curl -H "X-API-Key: hst_live_your_key_here" \
  "https://api.hyperstudy.io/api/v3/data/events/participant/user_xyz789?roomId=room_abc123"
```

### Filter by Time Range

```bash
# Get events from a specific time range
curl -H "X-API-Key: hst_live_your_key_here" \
  "https://api.hyperstudy.io/api/v3/data/events/room/room_abc123?startTime=2024-10-20T00:00:00Z&endTime=2024-10-21T00:00:00Z"
```

### Download Multiple Data Types

```bash
# Shell script to download all data types
API_KEY="hst_live_your_key_here"
ROOM_ID="room_abc123"
BASE_URL="https://api.hyperstudy.io/api/v3"

# Download events
curl -H "X-API-Key: $API_KEY" \
  "$BASE_URL/data/events/room/$ROOM_ID?format=csv" \
  > events.csv

# Download recordings
curl -H "X-API-Key: $API_KEY" \
  "$BASE_URL/data/recordings/room/$ROOM_ID?format=csv" \
  > recordings.csv

# Download chat
curl -H "X-API-Key: $API_KEY" \
  "$BASE_URL/data/chat/room/$ROOM_ID?format=csv" \
  > chat.csv

echo "Download complete!"
```

### Pagination with curl

```bash
# Download with pagination
API_KEY="hst_live_your_key_here"
ROOM_ID="room_abc123"
OFFSET=0
LIMIT=1000

# First page
curl -H "X-API-Key: $API_KEY" \
  "https://api.hyperstudy.io/api/v3/data/events/room/$ROOM_ID?limit=$LIMIT&offset=$OFFSET"

# Second page
OFFSET=1000
curl -H "X-API-Key: $API_KEY" \
  "https://api.hyperstudy.io/api/v3/data/events/room/$ROOM_ID?limit=$LIMIT&offset=$OFFSET"
```

### Pretty Print JSON (with jq)

```bash
# Install jq first: apt-get install jq  or  brew install jq

curl -H "X-API-Key: hst_live_your_key_here" \
  "https://api.hyperstudy.io/api/v3/data/events/room/room_abc123?limit=5" \
  | jq '.'

# Extract just the data array
curl -H "X-API-Key: hst_live_your_key_here" \
  "https://api.hyperstudy.io/api/v3/data/events/room/room_abc123?limit=5" \
  | jq '.data'

# Get count of events
curl -H "X-API-Key: hst_live_your_key_here" \
  "https://api.hyperstudy.io/api/v3/data/events/room/room_abc123?limit=1" \
  | jq '.metadata.pagination.total'
```

### Error Handling in Shell Scripts

```bash
#!/bin/bash

API_KEY="hst_live_your_key_here"
ROOM_ID="room_abc123"

# Make request and capture HTTP status code
HTTP_STATUS=$(curl -s -o response.json -w "%{http_code}" \
  -H "X-API-Key: $API_KEY" \
  "https://api.hyperstudy.io/api/v3/data/events/room/$ROOM_ID")

if [ $HTTP_STATUS -eq 200 ]; then
  echo "Success! Retrieved data:"
  cat response.json | jq '.data | length'
  echo "events"
elif [ $HTTP_STATUS -eq 401 ]; then
  echo "Error: Invalid API key"
elif [ $HTTP_STATUS -eq 404 ]; then
  echo "Error: Room not found"
else
  echo "Error: HTTP $HTTP_STATUS"
  cat response.json
fi

rm response.json
```

### Complete Download Script

```bash
#!/bin/bash
# complete_download.sh - Download all data for a room

set -e  # Exit on error

# Configuration
API_KEY="${HYPERSTUDY_API_KEY}"
ROOM_ID="$1"
OUTPUT_DIR="data_${ROOM_ID}_$(date +%Y%m%d_%H%M%S)"

if [ -z "$API_KEY" ]; then
  echo "Error: HYPERSTUDY_API_KEY environment variable not set"
  exit 1
fi

if [ -z "$ROOM_ID" ]; then
  echo "Usage: $0 <room_id>"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"

echo "Downloading data for room: $ROOM_ID"

# Download each data type
for DATA_TYPE in events recordings chat sync ratings/continuous; do
  FILENAME=$(echo $DATA_TYPE | tr '/' '_')
  echo "  Downloading $DATA_TYPE..."

  curl -s -H "X-API-Key: $API_KEY" \
    "https://api.hyperstudy.io/api/v3/data/$DATA_TYPE/room/$ROOM_ID?format=csv" \
    > "${FILENAME}.csv"

  LINES=$(wc -l < "${FILENAME}.csv")
  echo "    Saved ${FILENAME}.csv ($LINES lines)"
done

echo "Download complete! Files saved to: $OUTPUT_DIR"
ls -lh
```

Usage:
```bash
chmod +x complete_download.sh
export HYPERSTUDY_API_KEY="hst_live_your_key_here"
./complete_download.sh room_abc123
```

## Common Patterns

### Fetching All Data for a Participant

```python
import requests

BASE_URL = 'https://api.hyperstudy.io/api/v3'
headers = {'X-API-Key': API_KEY}

# Fetch all data types
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

### Filtering by Time Range

```python
from datetime import datetime, timedelta

# Get events from last 24 hours
end_time = datetime.now()
start_time = end_time - timedelta(hours=24)

response = requests.get(
    f'{BASE_URL}/data/events/experiment/exp_research_001',
    headers=headers,
    params={
        'startTime': start_time.isoformat(),
        'endTime': end_time.isoformat()
    }
)
```

### Exporting as CSV

```python
# Request CSV format directly
response = requests.get(
    f'{BASE_URL}/data/events/room/room_abc123',
    headers=headers,
    params={'format': 'csv'}
)

# Save to file
with open('events.csv', 'w') as f:
    f.write(response.text)

# Or load into pandas
import pandas as pd
from io import StringIO

df = pd.read_csv(StringIO(response.text))
```

## Response Metadata

All responses include metadata with useful information:

```json
"metadata": {
  "dataType": "events",
  "scope": "room",
  "scopeId": "room_abc123",
  "timestamp": "2024-10-20T14:35:00.000Z",
  "query": {
    "roomId": "room_abc123",
    "limit": 1000,
    "offset": 0
  },
  "processing": {
    "experimentStartedAt": "2024-10-20T14:30:00.000Z",
    "processingTimeMs": 145,
    "enriched": true,
    "version": "3.0.0"
  },
  "pagination": {
    "total": 2500,
    "returned": 1000,
    "hasMore": true,
    "nextOffset": 1000
  }
}
```

**Useful Fields**:
- `experimentStartedAt`: Use this to calculate onset times for other data
- `processingTimeMs`: How long the query took (useful for optimization)
- `enriched`: Whether data includes enrichment (component metadata, variable snapshots)
- `pagination`: For paginating through large datasets

## Next Steps

Now that you understand the available data types and endpoints:

- **Start coding**: Choose your language
  - [Python Guide](./python-guide.md) - Complete examples with pandas
  - [JavaScript Guide](./javascript-guide.md) - Complete examples for Node.js and browser
  - [R Guide](./r-guide.md) - Complete examples with httr and dplyr

- **Get an API Key**: [API Key Management](./api-keys.md)

- **Review API Basics**: [API Overview](./overview.md)
