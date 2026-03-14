---
id: python-guide
title: Python Guide
slug: /experimenters/api-access/python-guide
sidebar_position: 4
---

# Python Guide for HyperStudy API

The `hyperstudy` Python SDK provides a clean interface for accessing experiment data from Jupyter notebooks, marimo, or Python scripts.

## Installation

```bash
pip install hyperstudy
```

This installs the SDK along with pandas, polars, and tqdm (for progress bars).

## Setup

### API Key

Generate an API key from the HyperStudy dashboard (see [API Key Management](./api-keys.md)), then either:

**Option A**: Pass it directly:
```python
import hyperstudy

hs = hyperstudy.HyperStudy(api_key="hst_live_your_key_here")
```

**Option B**: Set an environment variable (recommended for notebooks):
```bash
# In your shell or .env file
export HYPERSTUDY_API_KEY=hst_live_your_key_here
```

```python
import hyperstudy

hs = hyperstudy.HyperStudy()  # Reads from HYPERSTUDY_API_KEY
```

## Quick Start

```python
import hyperstudy

hs = hyperstudy.HyperStudy()

# Fetch events for an experiment — returns a pandas DataFrame
events = hs.get_events("your-experiment-id")
print(events.head())
```

## Fetching Data

### Scopes

Every data method supports three scopes:

```python
# Experiment scope (default) — all data across all sessions
events = hs.get_events("experiment-id")

# Room scope — data from one session
events = hs.get_events("room-id", scope="room")

# Participant scope — one participant in one session
events = hs.get_events("participant-id", scope="participant", room_id="room-id")
```

### All Data Types

```python
events       = hs.get_events("experiment-id")
recordings   = hs.get_recordings("experiment-id")
chat         = hs.get_chat("experiment-id")
videochat    = hs.get_videochat("experiment-id")
sync         = hs.get_sync("experiment-id")
ratings      = hs.get_ratings("experiment-id", kind="continuous")
components   = hs.get_components("experiment-id")
participants = hs.get_participants("experiment-id")
rooms        = hs.get_rooms("experiment-id")
```

### Filtering

```python
events = hs.get_events(
    "experiment-id",
    start_time="2024-01-01T10:00:00Z",
    end_time="2024-01-01T12:00:00Z",
    category="component",
    sort="onset",
    order="asc",
    limit=100,
)
```

### Pagination

When `limit` is not set, the SDK automatically fetches all pages with a progress bar:

```python
# Fetches all events — shows progress bar for large datasets
all_events = hs.get_events("experiment-id")

# Set limit to fetch a single page
first_page = hs.get_events("experiment-id", limit=100)
```

## Output Formats

All data methods return pandas DataFrames by default. You can also request polars or raw dicts:

```python
# pandas DataFrame (default)
df = hs.get_events("experiment-id")

# polars DataFrame
df = hs.get_events("experiment-id", output="polars")

# Raw list of dicts
data = hs.get_events("experiment-id", output="dict")
```

DataFrames include automatic post-processing:
- Timestamp columns are parsed to datetime
- An `onset_sec` column is computed from `onset` (milliseconds to seconds)

## Complete Examples

### Example 1: Analyze Events for a Participant

```python
import hyperstudy

hs = hyperstudy.HyperStudy()

# Get events for one participant
events = hs.get_events(
    "participant-id",
    scope="participant",
    room_id="room-id",
    sort="onset",
)

print(f"Total events: {len(events)}")
print(f"Duration: {events['onset_sec'].min():.1f}s - {events['onset_sec'].max():.1f}s")
print(f"Component types: {events['componentType'].nunique()}")

# Filter to specific components
video_events = events[events['componentType'] == 'ShowVideo']
print(f"Video events: {len(video_events)}")
```

### Example 2: Download All Data for a Participant

```python
import hyperstudy

hs = hyperstudy.HyperStudy()

# Fetch all data types at once
data = hs.get_all_data("participant-id", room_id="room-id")

# data is a dict of DataFrames
for name, df in data.items():
    print(f"{name}: {len(df)} records")

# Access individual DataFrames
events = data["events"]
ratings = data["ratings"]
```

### Example 3: Export Experiment Data to CSV

```python
import hyperstudy

hs = hyperstudy.HyperStudy()

# Download all events (auto-paginates with progress bar)
events = hs.get_events("experiment-id")

# Summary
print(f"Total events: {len(events)}")
print(f"Participants: {events['participantId'].nunique()}")
print(f"Sessions: {events['roomId'].nunique()}")

# Export
events.to_csv("experiment_events.csv", index=False)
```

### Example 4: Compare Ratings Across Participants

```python
import hyperstudy

hs = hyperstudy.HyperStudy()

# Get continuous ratings for an experiment
ratings = hs.get_ratings("experiment-id", kind="continuous")

# Group by participant
by_participant = ratings.groupby("participantId")["value"].agg(["mean", "std", "count"])
print(by_participant)
```

### Example 5: Use Polars for Large Datasets

```python
import hyperstudy

hs = hyperstudy.HyperStudy()

# Polars is faster for large datasets
events = hs.get_events("experiment-id", output="polars")

# Polars syntax
video_events = events.filter(events["componentType"] == "ShowVideo")
print(f"Video events: {len(video_events)}")
```

## Experiment Management

```python
# List your experiments
experiments = hs.list_experiments()
print(experiments[["id", "name", "participantCount"]])

# Get experiment details (renders nicely in Jupyter/marimo)
exp = hs.get_experiment("experiment-id")

# Get raw config
config = hs.get_experiment_config("experiment-id")

# Create a new experiment
new_exp = hs.create_experiment(name="My New Study", description="...")

# Update an experiment
hs.update_experiment("experiment-id", name="Updated Name")

# Delete (soft-delete)
hs.delete_experiment("experiment-id")
```

## Error Handling

The SDK raises typed exceptions:

```python
from hyperstudy import HyperStudy, AuthenticationError, NotFoundError, ForbiddenError

hs = HyperStudy()

try:
    events = hs.get_events("experiment-id")
except AuthenticationError:
    print("Invalid or expired API key")
except ForbiddenError as e:
    print(f"Insufficient permissions: {e.message}")
except NotFoundError:
    print("Experiment not found")
```

## Connection Testing

```python
# Verify your API key and connectivity
result = hs.health()
print(result)  # {'status': 'success', 'version': '3.0.0', ...}
```

## Troubleshooting

**"No API key provided"**:
- Pass `api_key=` to the constructor, or set the `HYPERSTUDY_API_KEY` environment variable

**"Invalid or expired API key"**:
- Verify you copied the full key (not the masked version from the dashboard)
- Check the key hasn't expired

**"Insufficient scopes"**:
- Your API key needs the correct scopes (e.g., `read:events` for event data)
- See [API Key Management](./api-keys.md) for scope details

**Empty DataFrame returned**:
- Verify the experiment/room/participant ID is correct
- Check that the experiment has collected data

## Next Steps

- **Full SDK source code**: [github.com/ljchang/hyperstudy-pythonsdk](https://github.com/ljchang/hyperstudy-pythonsdk)
- **Interactive API reference**: [API Reference](/api-reference) -- browse all endpoints
- **Other languages**: [JavaScript](./javascript-guide.md) | [R](./r-guide.md)
- **Understand all endpoints**: [Data Types & Endpoints](./data-types.md)
- **Manage your keys**: [API Key Management](./api-keys.md)
