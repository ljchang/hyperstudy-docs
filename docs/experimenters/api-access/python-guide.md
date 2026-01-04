---
id: python-guide
title: Python Guide
slug: /experimenters/api-access/python-guide
sidebar_position: 4
---

# Python Guide for HyperStudy API

This guide provides complete, working examples for accessing HyperStudy data using Python.

## Prerequisites

### Installation

Install required packages:

```bash
pip install requests pandas python-dotenv
```

### API Key Setup

1. Generate an API key (see [API Key Management](./api-keys.md))
2. Create a `.env` file in your project directory:

```bash
# .env
HYPERSTUDY_API_KEY=hst_live_your_api_key_here
HYPERSTUDY_BASE_URL=https://api.hyperstudy.io/api/v3
```

3. Add `.env` to your `.gitignore`:

```bash
# .gitignore
.env
```

## Quick Start

### Minimal Example

```python
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv('HYPERSTUDY_API_KEY')
BASE_URL = os.getenv('HYPERSTUDY_BASE_URL')

# Make your first request
response = requests.get(
    f'{BASE_URL}/data/events/room/your-room-id',
    headers={'X-API-Key': API_KEY},
    params={'limit': 10}
)

if response.ok:
    result = response.json()
    events = result['data']
    print(f"Retrieved {len(events)} events")

    for event in events:
        print(f"{event['onset']}ms: {event['componentType']}")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

## Complete Examples

### Example 1: Download Events for One Participant

**Goal**: Fetch all events for a specific participant in a session.

```python
import os
import requests
from dotenv import load_dotenv

def download_participant_events(api_key, participant_id, room_id):
    """
    Download all events for a participant in a specific session.

    Args:
        api_key: Your HyperStudy API key
        participant_id: Participant's ID
        room_id: Room/session ID

    Returns:
        list: List of event dictionaries
    """
    base_url = 'https://api.hyperstudy.io/api/v3'

    response = requests.get(
        f'{base_url}/data/events/participant/{participant_id}',
        headers={'X-API-Key': api_key},
        params={
            'roomId': room_id,
            'sort': 'onset',
            'order': 'asc'
        }
    )

    # Check for errors
    if not response.ok:
        print(f"Error {response.status_code}: {response.text}")
        return []

    result = response.json()

    # Check API status
    if result['status'] != 'success':
        print(f"API Error: {result.get('error', {}).get('message')}")
        return []

    events = result['data']
    metadata = result['metadata']

    print(f"Retrieved {len(events)} events")
    print(f"Experiment started at: {metadata['processing']['experimentStartedAt']}")
    print(f"Total events available: {metadata['pagination']['total']}")

    return events

# Usage
if __name__ == '__main__':
    load_dotenv()

    events = download_participant_events(
        api_key=os.getenv('HYPERSTUDY_API_KEY'),
        participant_id='your-participant-id',
        room_id='your-room-id'
    )

    # Analyze events
    if events:
        print(f"\nFirst 5 events:")
        for event in events[:5]:
            onset_sec = event['onset'] / 1000
            print(f"  {onset_sec:7.2f}s: {event['componentType']:20s} - {event['content']}")
```

### Example 2: Download All Data Types for Analysis

**Goal**: Fetch events, recordings, chat, and ratings for comprehensive analysis.

```python
import os
import requests
from dotenv import load_dotenv

def download_all_participant_data(api_key, participant_id, room_id):
    """
    Download all data types for a participant.

    Args:
        api_key: Your HyperStudy API key
        participant_id: Participant's ID
        room_id: Room/session ID

    Returns:
        dict: Dictionary with keys: events, recordings, chat, ratings
    """
    base_url = 'https://api.hyperstudy.io/api/v3'
    headers = {'X-API-Key': api_key}
    params = {'roomId': room_id}

    data_types = {
        'events': 'events',
        'recordings': 'recordings',
        'chat': 'chat',
        'continuous_ratings': 'ratings/continuous',
        'sync_metrics': 'sync'
    }

    all_data = {}

    print(f"Downloading data for participant {participant_id}...")

    for key, endpoint in data_types.items():
        url = f'{base_url}/data/{endpoint}/participant/{participant_id}'

        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)

            if response.ok:
                result = response.json()
                all_data[key] = result['data']
                print(f"  ✓ {key}: {len(result['data'])} records")
            else:
                print(f"  ✗ {key}: Error {response.status_code}")
                all_data[key] = []

        except requests.exceptions.RequestException as e:
            print(f"  ✗ {key}: Request failed - {e}")
            all_data[key] = []

    print(f"\nDownload complete!")
    return all_data

# Usage
if __name__ == '__main__':
    load_dotenv()

    all_data = download_all_participant_data(
        api_key=os.getenv('HYPERSTUDY_API_KEY'),
        participant_id='your-participant-id',
        room_id='your-room-id'
    )

    # Summary
    print("\nData Summary:")
    for data_type, records in all_data.items():
        if records:
            print(f"  {data_type}: {len(records)} records")
            if data_type == 'events' and len(records) > 0:
                first = records[0]
                last = records[-1]
                duration = (last['onset'] - first['onset']) / 1000
                print(f"    Duration: {duration:.1f} seconds")
```

### Example 3: Export to pandas DataFrame and CSV

**Goal**: Download event data and export to pandas DataFrame and CSV file.

```python
import os
import requests
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime

def export_events_to_csv(api_key, room_id, output_file):
    """
    Download events and export to CSV file with pandas.

    Args:
        api_key: Your HyperStudy API key
        room_id: Room/session ID
        output_file: Path to output CSV file
    """
    base_url = 'https://api.hyperstudy.io/api/v3'

    print(f"Fetching events for room {room_id}...")

    response = requests.get(
        f'{base_url}/data/events/room/{room_id}',
        headers={'X-API-Key': api_key},
        params={'sort': 'onset', 'order': 'asc'}
    )

    if not response.ok:
        print(f"Error: {response.status_code} - {response.text}")
        return None

    result = response.json()
    events = result['data']

    print(f"Retrieved {len(events)} events")

    # Convert to DataFrame
    df = pd.DataFrame(events)

    # Add computed columns
    df['onset_sec'] = df['onset'] / 1000  # Convert to seconds

    # Parse timestamps
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Extract response values if present
    if 'response' in df.columns:
        # Flatten response column if it exists
        df['response_value'] = df['response'].apply(
            lambda x: x.get('value') if isinstance(x, dict) else None
        )
        df['response_time'] = df['response'].apply(
            lambda x: x.get('responseTime') if isinstance(x, dict) else None
        )

    # Export to CSV
    df.to_csv(output_file, index=False)
    print(f"Exported to {output_file}")

    # Display summary statistics
    print("\nSummary Statistics:")
    print(f"  Total events: {len(df)}")
    print(f"  Unique participants: {df['participantId'].nunique()}")
    print(f"  Component types: {df['componentType'].nunique()}")
    print(f"  Time range: {df['onset_sec'].min():.1f}s - {df['onset_sec'].max():.1f}s")

    # Show component type distribution
    print("\nEvents by Component Type:")
    print(df['componentType'].value_counts().head(10))

    return df

# Usage
if __name__ == '__main__':
    load_dotenv()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f'events_{timestamp}.csv'

    df = export_events_to_csv(
        api_key=os.getenv('HYPERSTUDY_API_KEY'),
        room_id='your-room-id',
        output_file=output_file
    )

    # Further analysis with pandas
    if df is not None:
        # Filter to specific component types
        video_events = df[df['componentType'] == 'ShowVideo']
        print(f"\nVideo events: {len(video_events)}")

        # Group by participant
        by_participant = df.groupby('participantId').size()
        print(f"\nEvents per participant:")
        print(by_participant)
```

### Example 4: Download Entire Experiment with Pagination

**Goal**: Download all events for an experiment, handling pagination for large datasets.

```python
import os
import requests
from dotenv import load_dotenv

def download_experiment_all_pages(api_key, experiment_id):
    """
    Download all events for an experiment using pagination.

    Args:
        api_key: Your HyperStudy API key
        experiment_id: Experiment ID

    Returns:
        list: All events from all pages
    """
    base_url = 'https://api.hyperstudy.io/api/v3'
    headers = {'X-API-Key': api_key}

    all_events = []
    offset = 0
    limit = 1000
    has_more = True

    print(f"Downloading all events for experiment {experiment_id}...")

    while has_more:
        # Make request with pagination
        response = requests.get(
            f'{base_url}/data/events/experiment/{experiment_id}',
            headers=headers,
            params={
                'limit': limit,
                'offset': offset,
                'sort': 'onset',
                'order': 'asc'
            },
            timeout=60
        )

        if not response.ok:
            print(f"Error: {response.status_code} - {response.text}")
            break

        result = response.json()

        # Add events from this page
        page_events = result['data']
        all_events.extend(page_events)

        # Check pagination
        pagination = result['metadata']['pagination']
        total = pagination['total']
        has_more = pagination.get('hasMore', False)

        print(f"  Downloaded {len(all_events)}/{total} events ({len(all_events)/total*100:.1f}%)")

        # Update offset for next page
        if has_more:
            offset = pagination.get('nextOffset', offset + limit)
        else:
            print("  All pages downloaded!")

    print(f"\nTotal: {len(all_events)} events downloaded")
    return all_events

# Usage
if __name__ == '__main__':
    load_dotenv()

    all_events = download_experiment_all_pages(
        api_key=os.getenv('HYPERSTUDY_API_KEY'),
        experiment_id='your-experiment-id'
    )

    # Analyze complete dataset
    if all_events:
        import pandas as pd

        df = pd.DataFrame(all_events)
        df['onset_sec'] = df['onset'] / 1000

        print(f"\nDataset Summary:")
        print(f"  Total events: {len(df)}")
        print(f"  Participants: {df['participantId'].nunique()}")
        print(f"  Sessions: {df['sessionId'].nunique()}")
        print(f"  Duration: {df['onset_sec'].max():.1f} seconds")

        # Save to CSV
        output_file = f"experiment_{experiment_id}_all_events.csv"
        df.to_csv(output_file, index=False)
        print(f"\nSaved to {output_file}")
```

## Reusable Client Class

For production use, create a reusable client class:

```python
# hyperstudy_client.py

import requests
import pandas as pd
from typing import Optional, List, Dict

class HyperStudyClient:
    """Python client for HyperStudy API v3"""

    def __init__(self, api_key: str, base_url: str = 'https://api.hyperstudy.io/api/v3'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {'X-API-Key': api_key}

    def get_events(self, scope: str, scope_id: str, **kwargs) -> Optional[List[Dict]]:
        """Fetch events"""
        result = self._request(f'data/events/{scope}/{scope_id}', params=kwargs)
        return result['data'] if result else None

    def get_recordings(self, scope: str, scope_id: str, **kwargs) -> Optional[List[Dict]]:
        """Fetch recordings"""
        result = self._request(f'data/recordings/{scope}/{scope_id}', params=kwargs)
        return result['data'] if result else None

    def get_all_participant_data(self, participant_id: str, room_id: str) -> Dict:
        """Fetch all data types for a participant"""
        return {
            'events': self.get_events('participant', participant_id, roomId=room_id) or [],
            'recordings': self.get_recordings('participant', participant_id, roomId=room_id) or [],
        }

    def to_dataframe(self, data: List[Dict]) -> pd.DataFrame:
        """Convert data to pandas DataFrame"""
        df = pd.DataFrame(data)
        if 'onset' in df.columns:
            df['onset_sec'] = df['onset'] / 1000
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
        return df

    def _request(self, endpoint: str, params: Optional[Dict] = None) -> Optional[Dict]:
        """Make API request"""
        url = f"{self.base_url}/{endpoint}"
        response = requests.get(url, headers=self.headers, params=params, timeout=30)

        if not response.ok:
            print(f"Error: {response.status_code} - {response.text}")
            return None

        result = response.json()
        return result if result['status'] == 'success' else None

# Usage
from dotenv import load_dotenv
import os

load_dotenv()
client = HyperStudyClient(api_key=os.getenv('HYPERSTUDY_API_KEY'))

# Fetch and analyze
events = client.get_events('room', 'your-room-id')
df = client.to_dataframe(events)
print(df.describe())
```

## Error Handling

### Robust Error Handling Pattern

```python
import requests
import time

def make_robust_request(url, headers, params=None, max_retries=3):
    """Make API request with retry logic and error handling"""

    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)

            # Check HTTP status
            response.raise_for_status()

            # Parse JSON
            result = response.json()

            # Check API status
            if result['status'] == 'error':
                error = result['error']
                print(f"API Error [{error['code']}]: {error['message']}")
                if 'details' in error:
                    print(f"Details: {error['details']}")
                return None

            return result

        except requests.exceptions.Timeout:
            print(f"Timeout on attempt {attempt + 1}/{max_retries}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:  # Rate limit
                wait_time = int(e.response.headers.get('Retry-After', 60))
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"HTTP Error: {e}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    print("Max retries exceeded")
    return None
```

## Common Patterns

### Download Multiple Rooms

```python
def download_multiple_rooms(api_key, room_ids):
    """Download data for multiple rooms"""
    all_data = {}

    for room_id in room_ids:
        print(f"\nProcessing room: {room_id}")
        response = requests.get(
            f'https://api.hyperstudy.io/api/v3/data/events/room/{room_id}',
            headers={'X-API-Key': api_key}
        )

        if response.ok:
            result = response.json()
            all_data[room_id] = result['data']
            print(f"  Retrieved {len(result['data'])} events")

    return all_data
```

### Real-time Monitoring

```python
import time

def monitor_experiment(api_key, experiment_id, interval=30):
    """Monitor experiment and report new events"""
    last_count = 0

    while True:
        response = requests.get(
            f'https://api.hyperstudy.io/api/v3/data/events/experiment/{experiment_id}',
            headers={'X-API-Key': api_key},
            params={'limit': 1}  # Just get metadata
        )

        if response.ok:
            result = response.json()
            current_count = result['metadata']['pagination']['total']

            if current_count > last_count:
                new_events = current_count - last_count
                print(f"[{time.strftime('%H:%M:%S')}] {new_events} new events (total: {current_count})")
                last_count = current_count

        time.sleep(interval)
```

## Troubleshooting

### Common Issues

**"Module not found" error**:
```bash
pip install requests pandas python-dotenv
```

**"HYPERSTUDY_API_KEY not found"**:
- Check `.env` file exists
- Verify `load_dotenv()` is called
- Print `os.getenv('HYPERSTUDY_API_KEY')` to debug

**"Invalid API key"**:
- Verify you copied the full key (not masked version)
- Check key hasn't expired
- Ensure using `X-API-Key` header

**Slow downloads**:
- Use pagination with smaller `limit`
- Download data types separately
- Consider parallel requests (but respect rate limits)

## Next Steps

- **Learn about other languages**: [JavaScript](./javascript-guide.md) | [R](./r-guide.md)
- **Understand all endpoints**: [Data Types & Endpoints](./data-types.md)
- **Manage your keys**: [API Key Management](./api-keys.md)
