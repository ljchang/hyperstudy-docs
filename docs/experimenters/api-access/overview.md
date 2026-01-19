---
id: api-overview
title: API Overview
slug: /experimenters/api-access/overview
sidebar_position: 2
---

# HyperStudy API Overview

The HyperStudy API allows you to access your experiment data programmatically using Python, JavaScript, R, or any programming language that can make HTTP requests.

## What is the HyperStudy API?

The HyperStudy API is a **REST API** that provides programmatic access to all your experiment data. Instead of manually downloading data through the web interface, you can write scripts to:

- Automate data downloads
- Process data in real-time
- Integrate with your analysis pipelines
- Build custom data visualizations
- Monitor experiments as they run

## Why Use the API?

### GUI vs API: When to Use Each

**Use the GUI** when you:
- Want to quickly view data
- Need a one-time download
- Prefer visual navigation
- Are exploring data structure

**Use the API** when you:
- Need repeated data downloads
- Want to automate your workflow
- Have large datasets
- Need to integrate with other tools
- Want real-time data access

### Benefits of the API

1. **Automation**
   - Schedule automatic downloads
   - No manual clicking required
   - Consistent, repeatable process

2. **Flexibility**
   - Filter and query data precisely
   - Paginate through large datasets
   - Choose your own data format

3. **Integration**
   - Feed data directly into R, Python, MATLAB
   - Connect with visualization tools
   - Build custom dashboards

4. **Real-time Access**
   - Monitor experiments as they run
   - Get data as soon as it's collected
   - Build live dashboards

## Getting Started

### Prerequisites

Before using the API, you need:

1. **A HyperStudy Account**
   - With experimenter or admin role

2. **An API Key**
   - See [API Key Management Guide](./api-keys.md)
   - Navigate to Admin Dashboard → API Keys → Create API Key

3. **A Programming Environment**
   - Python (recommended): `pip install requests pandas`
   - JavaScript/Node.js: `npm install node-fetch`
   - R: `install.packages(c("httr", "jsonlite"))`

### Quick Start Example

Here's a complete example in Python:

```python
import requests
import os

# Your API key (store in environment variable)
API_KEY = os.environ.get('HYPERSTUDY_API_KEY')
BASE_URL = 'https://api.hyperstudy.io/api/v3'

# Make your first API request
response = requests.get(
    f'{BASE_URL}/data/events/room/your-room-id',
    headers={'X-API-Key': API_KEY},
    params={'limit': 10}
)

# Check if successful
if response.ok:
    result = response.json()
    events = result['data']
    print(f"Retrieved {len(events)} events")

    # Access event data
    for event in events:
        print(f"{event['onset']}ms: {event['componentType']} - {event['content']}")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

## API Basics

### Base URL

All API requests use this base URL:

```
Production: https://api.hyperstudy.io/api/v3
Development: https://dev.hyperstudy.io/api/v3
```

### Authentication

Every API request must include your API key in the headers:

```http
X-API-Key: hst_live_your_api_key_here
```

**Example** (Python):
```python
headers = {
    'X-API-Key': 'hst_live_your_api_key_here'
}

response = requests.get(url, headers=headers)
```

**Example** (JavaScript):
```javascript
const headers = {
  'X-API-Key': 'hst_live_your_api_key_here'
};

const response = await fetch(url, { headers });
```

**Example** (R):
```r
response <- GET(
  url,
  add_headers("X-API-Key" = "hst_live_your_api_key_here")
)
```

### Organization Scoping

HyperStudy uses a multi-tenant architecture where data is isolated by organization. When making API requests, you should include your organization ID:

```http
X-Organization-Id: org_your_organization_id
```

**Why Organization Scoping?**

- **Data isolation**: Each organization's data is kept separate
- **Explicit context**: Ensures you're accessing data from the correct organization
- **Cross-org support**: Required when accessing shared resources from other organizations

**Example with Organization Header** (Python):
```python
headers = {
    'X-API-Key': 'hst_live_your_api_key_here',
    'X-Organization-Id': 'org_abc123'  # Your organization ID
}

response = requests.get(url, headers=headers)
```

:::tip Finding Your Organization ID
You can find your organization ID in:
- **Settings > Organization** - shown at the top of the page
- **API Keys page** - displayed when creating a key
- **Browser URL** - often visible in the URL bar when viewing organization settings
:::

### Accessing Shared Data

To access experiments shared with you from other organizations, use the `/shared` endpoints:

```python
# Get experiments shared with you from other organizations
response = requests.get(
    f'{BASE_URL}/experiments/shared',
    headers={
        'X-API-Key': API_KEY,
        'X-Organization-Id': YOUR_ORG_ID  # Your organization
    }
)

# Access data from a specific shared experiment
response = requests.get(
    f'{BASE_URL}/data/events/experiment/{SHARED_EXPERIMENT_ID}',
    headers={
        'X-API-Key': API_KEY,
        'X-Organization-Id': YOUR_ORG_ID
    }
)
```

See [Cross-Organization Collaboration](../cross-org-collaboration.md) for more details on sharing resources across organizations.

### Endpoint Structure

API endpoints follow this pattern:

```
/api/v3/data/{dataType}/{scope}/{scopeId}
```

- **`dataType`**: What kind of data (events, recordings, chat, etc.)
- **`scope`**: Level of data (experiment, room, participant)
- **`scopeId`**: ID of the experiment/room/participant

**Examples**:
```
# Get events for a specific room
/api/v3/data/events/room/room_abc123

# Get recordings for a participant
/api/v3/data/recordings/participant/user_xyz789?roomId=room_abc123

# Get chat for an experiment
/api/v3/data/chat/experiment/exp_research_001
```

See [Data Types & Endpoints](./data-types.md) for complete documentation.

## Response Format

All successful API responses follow this structure:

```json
{
  "status": "success",
  "data": [
    {
      "id": "event_123",
      "timestamp": "2024-10-20T14:30:45.123Z",
      "onset": 5000,
      "componentType": "ShowVideo",
      "content": "Video: introduction.mp4"
    }
  ],
  "metadata": {
    "dataType": "events",
    "scope": "room",
    "scopeId": "room_abc123",
    "timestamp": "2024-10-20T14:35:00.000Z",
    "processing": {
      "experimentStartedAt": "2024-10-20T14:30:40.000Z",
      "processingTimeMs": 145,
      "enriched": true
    },
    "pagination": {
      "total": 2500,
      "returned": 1000,
      "hasMore": true,
      "nextOffset": 1000
    }
  }
}
```

### Response Fields

- **`status`**: "success" or "error"
- **`data`**: Array of data objects (events, recordings, etc.)
- **`metadata`**: Information about the response
  - `dataType`: Type of data returned
  - `scope`: Scope of query (experiment/room/participant)
  - `scopeId`: ID being queried
  - `processing`: Processing metadata
    - `experimentStartedAt`: When experiment started (used for onset calculation)
    - `processingTimeMs`: How long the query took
    - `enriched`: Whether data includes enrichment (component metadata, etc.)
  - `pagination`: Pagination information (see below)

## Pagination

For large datasets, the API returns data in pages.

### Understanding Pagination

```json
"pagination": {
  "total": 2500,        // Total records available
  "returned": 1000,     // Records in this response
  "hasMore": true,      // More pages available?
  "nextOffset": 1000    // Offset for next page
}
```

### Fetching All Pages

**Python Example**:
```python
def fetch_all_events(api_key, room_id):
    """Fetch all events using pagination"""
    all_events = []
    offset = 0
    limit = 1000
    has_more = True

    while has_more:
        response = requests.get(
            f'{BASE_URL}/data/events/room/{room_id}',
            headers={'X-API-Key': api_key},
            params={'limit': limit, 'offset': offset}
        )

        result = response.json()
        all_events.extend(result['data'])

        # Check pagination
        pagination = result['metadata']['pagination']
        has_more = pagination['hasMore']
        offset = pagination.get('nextOffset', offset + limit)

        print(f"Fetched {len(all_events)}/{pagination['total']} events")

    return all_events
```

### Pagination Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | number | Max records per page | 1000 (varies by endpoint) |
| `offset` | number | Number of records to skip | 0 |

**Example**:
```
# First page (records 0-999)
GET /api/v3/data/events/room/abc123?limit=1000&offset=0

# Second page (records 1000-1999)
GET /api/v3/data/events/room/abc123?limit=1000&offset=1000
```

## Query Parameters

Many endpoints accept query parameters to filter and customize results:

### Common Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `roomId` | Filter by room/session | `?roomId=room_abc123` |
| `startTime` | Filter events after this time | `?startTime=2024-10-20T00:00:00Z` |
| `endTime` | Filter events before this time | `?endTime=2024-10-21T00:00:00Z` |
| `limit` | Max records to return | `?limit=100` |
| `offset` | Records to skip (pagination) | `?offset=1000` |
| `sort` | Sort field | `?sort=timestamp` |
| `order` | Sort order (asc/desc) | `?order=desc` |
| `format` | Response format (json/csv) | `?format=csv` |

**Example with multiple parameters**:
```
GET /api/v3/data/events/room/abc123?startTime=2024-10-20T00:00:00Z&limit=500&sort=onset&order=asc
```

See [Data Types & Endpoints](./data-types.md) for endpoint-specific parameters.

## Error Handling

### Error Response Format

When an error occurs, the API returns:

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid date format for startTime",
    "details": {
      "parameter": "startTime",
      "value": "invalid-date",
      "expected": "ISO 8601 timestamp"
    }
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 401 | `UNAUTHORIZED` | Missing or invalid API key | Check API key, verify not expired |
| 403 | `FORBIDDEN` | Insufficient permissions | Check API key scopes |
| 404 | `NOT_FOUND` | Resource not found | Verify experiment/room/participant ID |
| 400 | `INVALID_PARAMETER` | Invalid query parameter | Fix parameter format |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry, add delays |
| 500 | `INTERNAL_SERVER_ERROR` | Server error | Contact support |

### Example Error Handling

**Python**:
```python
try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raises exception for 4xx/5xx

    result = response.json()

    if result['status'] == 'error':
        error = result['error']
        print(f"API Error [{error['code']}]: {error['message']}")
        if 'details' in error:
            print(f"Details: {error['details']}")
    else:
        data = result['data']
        # Process data...

except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
```

## Rate Limiting

To ensure fair usage and system stability, the API has rate limits:

### Current Limits

- **API Keys**: 1000 requests per hour
- **Per Endpoint**: 100 requests per minute

### Handling Rate Limits

When you exceed the limit, you'll receive a `429 Too Many Requests` response with a `Retry-After` header.

**Best Practices**:

1. **Add delays between requests**
   ```python
   import time

   for item in items:
       response = requests.get(url, headers=headers)
       # Process response...
       time.sleep(0.1)  # 100ms delay
   ```

2. **Use pagination wisely**
   - Don't request more data than you need
   - Use appropriate `limit` values

3. **Cache results**
   - Store downloaded data locally
   - Don't re-fetch the same data

4. **Retry with backoff**
   ```python
   import time

   def make_request_with_retry(url, headers, max_retries=3):
       for attempt in range(max_retries):
           response = requests.get(url, headers=headers)

           if response.status_code != 429:
               return response

           # Exponential backoff
           wait_time = 2 ** attempt
           print(f"Rate limited. Waiting {wait_time}s...")
           time.sleep(wait_time)

       return response
   ```

## Data Formats

The API supports multiple response formats:

### JSON (Default)

```http
GET /api/v3/data/events/room/abc123
```

Returns structured JSON with full metadata.

### CSV

```http
GET /api/v3/data/events/room/abc123?format=csv
```

Returns comma-separated values, great for Excel or statistical software.

**Python Example**:
```python
import pandas as pd
from io import StringIO

response = requests.get(url, headers=headers, params={'format': 'csv'})
df = pd.read_csv(StringIO(response.text))
```

## API Health Check

Test if the API is available:

```http
GET /api/v3/health
```

**Response**:
```json
{
  "status": "healthy",
  "version": "3.0.0",
  "timestamp": "2024-10-20T14:30:00.000Z"
}
```

## Next Steps

Now that you understand the basics:

1. **Get an API Key**: [API Key Management](./api-keys.md)
2. **Learn the Endpoints**: [Data Types & Endpoints](./data-types.md)
3. **Start Coding**:
   - [Python Guide](./python-guide.md) - Most common for data analysis
   - [JavaScript Guide](./javascript-guide.md) - For web integrations
   - [R Guide](./r-guide.md) - For statistical analysis

## Additional Resources

- **GUI Data Management**: [Data Management Guide](../data-management.md)
- **API Specification**: OpenAPI/Swagger docs (coming soon)
- **Support**: Contact support with questions or issues
