---
title: Data Management Interface
sidebar_position: 6
---

# Data Management Interface

The HyperStudy data management interface provides a comprehensive dashboard for viewing, analyzing, and exporting experiment data. This guide covers all aspects of the system, from accessing the dashboard to working with different data types.

## Overview

The data management interface is designed to:
- Provide real-time access to experiment data
- Support multiple data types (events, ratings, chat, video recordings, sync metrics)
- Enable flexible filtering and searching
- Offer multiple export formats (CSV, JSON)
- Scale efficiently with large datasets

For programmatic access to the same data, see the [API Access Guide](./api-access/overview.md).

## Accessing the Data Management Dashboard

### For Experimenters
1. Log in to your experimenter account
2. Navigate to your Experimenter Dashboard
3. Click on the "Data" tab in the sidebar
4. You'll see a list of your experiments that have collected data

### For Administrators
1. Log in to your administrator account
2. Navigate to the Admin Dashboard
3. Select "Data Management" from the menu
4. You'll have access to data from all experiments on the platform

## Understanding the Interface Layout

The data management interface uses a hierarchical navigation structure:

1. **Experiments Level**: View all experiments with collected data
2. **Rooms Level**: See all rooms/sessions for a selected experiment
3. **Participants Level**: View all participants in a selected room
4. **Data Level**: Access detailed data for a selected participant

### Breadcrumb Navigation

A breadcrumb trail at the top shows your current location and allows quick navigation:
```
Data > Experiment Name > Room Name > Participant ID
```

Click any level in the breadcrumb to navigate back to that view.

## Viewing Event Data

The Events tab provides a comprehensive view of all participant interactions during an experiment.

### Event Categories

Events are organized into categories:
- **Component Events**: Interactions with experiment components (images, videos, ratings, etc.)
- **Continuous Rating Events**: Real-time rating samples
- **Media Events**: Video playback status updates
- **State Events**: Experiment state transitions
- **Communication Events**: Chat and video communication
- **Sync Events**: Media synchronization metrics
- **System Events**: Technical system events

### Event Information

Each event includes:
- **Timestamp**: When the event occurred (ISO 8601 format)
- **Onset**: Milliseconds from experiment start (can be negative for setup events)
- **Duration**: How long the event lasted (for applicable events)
- **Event Type**: Specific type of event
- **Category**: Event category
- **State**: Current experiment state
- **Role**: Participant's role
- **Component Details**: Information about the stimulus (for component events)
- **Response**: Participant's response (if applicable)

### Expanding Event Details

Click on any event row to expand and view:
- Complete event data
- Context information
- Variable states at time of event
- Raw JSON data

This is useful for debugging or understanding the exact data structure.

## Filtering and Searching Capabilities

### Event Type Filtering

Use the dropdown menu to filter events by category:
1. Select the desired category from the "Event Type" dropdown
2. The table will update to show only events of that type
3. The event count updates to show filtered results

### Column Filtering

Each column supports text-based filtering:
1. Click "Show Filters" to reveal filter inputs
2. Type in any column's filter box to search
3. Filters work across all columns simultaneously
4. Use partial text matching for flexible searches

**Example**: Filter by participant role, state name, or component type

### Sorting

Click any column header to sort:
- First click: Sort ascending
- Second click: Sort descending
- Third click: Remove sort

You can sort by timestamp, onset, event type, or any other column.

## Export Options and Formats

### Quick Export

Each data table includes export buttons with quick export options:
- **CSV Format**: Ideal for analysis in Excel or statistical software (R, SPSS, SAS)
- **JSON Format**: Best for programmatic processing or archival

### Export Features

1. **Contextual Exports**: Export only the data currently visible (respects filters)
2. **Timestamp Formatting**: Timestamps automatically converted to ISO 8601 format
3. **Flattened Structure**: Complex nested data flattened for CSV compatibility
4. **UTF-8 Encoding**: Proper character encoding with BOM for Excel compatibility

### Batch Export

At the room or experiment level:
1. Click "Download All Data" button
2. Choose your format (CSV or JSON)
3. Download includes all participants and events

For large datasets or automated workflows, consider using the [API](./api-access/overview.md) instead.

## Working with Different Data Types

### Ratings Data

The Ratings tab shows all rating responses:
- **Sparse Ratings**: Single-point rating responses (VAS, Likert scales, multiple choice)
- **Continuous Ratings**: Time-series rating data sampled during video playback
- **Scale Information**: Min/max values for each rating
- **Dimension Data**: Rating dimension metadata

**Key features**:
- View rating values with scale context
- Export for statistical analysis
- Filter by rating type or time range

**Analysis Tips**:
- Continuous ratings are best analyzed as time series
- Export with onset times to align with other events
- Check response times to identify rushed responses

### Text Chat

The Text Chat tab displays all chat messages:
- **Sender Identification**: Visual distinction between participants
- **Message Content**: Full text with preserved formatting
- **Timestamps**: Exact time of each message
- **Export Options**: Download chat transcripts

**Features**:
- Color-coded sender identification
- Searchable message content
- Chronological ordering

**Use Cases**:
- Analyze communication patterns
- Extract participant quotes
- Measure collaboration frequency

### Video Chat Recordings

The Video Chat tab provides access to recorded sessions:
- **Recording Cards**: Visual overview of each recording
- **Recording Details**: Start time, duration, file size
- **Status Indicators**: Recording completion status
- **Direct Actions**: View or download recordings

**Recording features**:
- **In-Browser Preview**: Watch recordings without downloading
- **Direct Download**: Save recordings locally (MP4 format)
- **Metadata Export**: Export recording information as CSV/JSON

**Important Notes**:
- Recordings are stored in cloud storage with time-limited access URLs
- Download recordings for archival purposes
- Respect participant privacy and consent agreements

### Sync Metrics

The Sync Metrics tab shows media synchronization performance (multi-participant experiments only):

#### Summary Metrics
- **Average Drift**: Mean synchronization offset in milliseconds
- **Maximum Drift**: Worst-case synchronization deviation
- **Sync Quality**: Overall quality percentage (0-100%)
- **Total Samples**: Number of sync measurements collected

#### Detailed Metrics Table
- **Timestamp**: When measurement was taken
- **Actual vs Predicted**: Timestamp comparison
- **Drift**: Synchronization error in milliseconds
- **Playback Rate**: Current playback speed adjustment
- **Latency**: Network delay estimation

#### Sync Parameters
View the synchronization algorithm parameters used:
- PID Controller settings (P, I, D gains)
- Kalman Filter configuration (process/measurement noise)
- Threshold values (acceptable drift, playback rate limits)

**Quality Indicators**:
- 🟢 Green (< 100ms drift): Excellent sync
- 🟡 Yellow (100-500ms drift): Acceptable sync
- 🔴 Red (> 500ms drift): Poor sync, may affect data quality

## Real-time Data Access

The data management system provides near real-time data access:
- Data typically available within seconds of collection
- No need to wait for post-processing
- Automatic refresh when navigating between views

**Note**: For true real-time monitoring during an experiment, use the [API](./api-access/overview.md) with polling or webhooks.

## Common Tasks Step-by-Step

### Exporting Participant Ratings

1. Navigate to the participant's data view
2. Click on the "Ratings" tab
3. Review the ratings data in the table
4. (Optional) Apply filters to select specific ratings
5. Click the "Download CSV" button
6. Open in your analysis software (Excel, R, Python, etc.)

### Downloading Chat Transcripts

1. Access the participant's data view
2. Select the "Text Chat" tab
3. Use filters if needed to find specific conversations or time periods
4. Click "Download CSV" for spreadsheet format
5. Or click "Download JSON" for complete metadata

**Tip**: JSON format preserves message threading and metadata that may be lost in CSV.

### Analyzing Sync Performance

1. Go to the participant's "Sync Metrics" tab
2. Review the summary statistics at the top
3. Check quality indicators (color-coded)
4. For detailed analysis:
   - Examine the metrics table for drift patterns
   - Look for periods of poor synchronization
   - Export data for statistical analysis
   - Correlate sync quality with participant responses

### Accessing Video Recordings

1. Navigate to the "Video Chat" tab
2. Browse recording cards to find the desired recording
3. To preview: Click "View Recording" (plays in browser)
4. To download: Click "Download Recording" (saves MP4 file)
5. For batch operations: Use the "Download All" button

**Important**: Recordings may be large files (100MB-1GB+). Consider your network bandwidth and storage space.

## Programmatic Access via API

For automation, batch processing, or custom analysis, use the **HyperStudy v3 API**:

### Why Use the API?

- **Automation**: Schedule automatic data downloads
- **Batch Processing**: Download data for multiple experiments at once
- **Real-time Integration**: Feed data directly into analysis pipelines
- **Custom Filtering**: Precise queries with custom parameters
- **Large Datasets**: Efficient pagination for millions of records

### Getting Started

1. **Generate an API Key**: See [API Key Management](./api-access/api-keys.md)
2. **Read the API Docs**: Start with [API Overview](./api-access/overview.md)
3. **Choose Your Language**:
   - [Python Guide](./api-access/python-guide.md) - Most popular for data analysis
   - [JavaScript Guide](./api-access/javascript-guide.md) - For web apps
   - [R Guide](./api-access/r-guide.md) - For statistical analysis

### API Example

Here's a quick example using Python to fetch event data:

```python
import requests

API_KEY = 'hst_live_your_api_key_here'
BASE_URL = 'https://api.hyperstudy.io/api/v3'

# Fetch events for a room
response = requests.get(
    f'{BASE_URL}/data/events/room/room_abc123',
    headers={'X-API-Key': API_KEY},
    params={'limit': 1000, 'sort': 'onset'}
)

events = response.json()['data']
print(f"Retrieved {len(events)} events")
```

See the [full API documentation](./api-access/overview.md) for complete details.

## Tips and Best Practices

### Performance Optimization
- Use filters to reduce data volume before exporting
- Export in batches if working with very large datasets (millions of events)
- Close expanded event details when not needed
- Consider using the API for very large datasets

### Data Analysis
- Export events with onset times for temporal analysis
- Use CSV format for immediate analysis in Excel/SPSS/R
- Use JSON format when you need complete metadata
- Include variable states for context-aware analysis

### Data Organization

Organize your downloaded data:

```
project_name/
├── raw_data/
│   ├── experiment_123_2024-10-20/
│   │   ├── room_abc/
│   │   │   ├── events.csv
│   │   │   ├── ratings.csv
│   │   │   ├── chat.csv
│   │   │   └── recordings.csv
│   │   └── room_xyz/
│   └── experiment_123_2024-10-27/
├── processed_data/
└── analysis_scripts/
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Data appears missing | Check filter settings; verify experiment completed; ensure sync finished |
| Slow loading | Apply filters to reduce data volume; try smaller date ranges |
| Export fails | Try smaller batches; check browser console for errors |
| Download timeout | Use API for very large datasets; download in chunks |
| File won't open in Excel | Ensure CSV format selected; check UTF-8 encoding |
| Missing recordings | Verify participant permissions granted; check recording status |

**Getting Help**: If issues persist, contact support with:
- Experiment ID
- Room ID (if applicable)
- What you were trying to download
- Error messages or screenshots

## Data Privacy and Security

### Access Control

Data access is role-based:

1. **Experiment Owner**: Full access to all data
2. **Collaborators**: View/export permissions (configurable)
3. **Administrators**: Platform-wide access (if enabled)

### Data Retention

Configure data retention policies:
- Set automatic deletion dates
- Archive old experiments
- Comply with IRB requirements and regulations (GDPR, HIPAA, etc.)

### Anonymization

When exporting data:
- Participant IDs can be replaced with anonymous codes
- Personal information can be stripped
- Consider your consent agreements and IRB requirements

## Related Documentation

- **Data Overview**: [Data Management Guide](./data-management.md)
- **API Access**: [API Overview](./api-access/overview.md)
- **Data Types**: [API Data Types & Endpoints](./api-access/data-types.md)
- **Python Guide**: [Python API Guide](./api-access/python-guide.md)
- **JavaScript Guide**: [JavaScript API Guide](./api-access/javascript-guide.md)
- **R Guide**: [R API Guide](./api-access/r-guide.md)

## Next Steps

- **Explore the API**: [API Overview](./api-access/overview.md)
- **Generate API Keys**: [API Key Management](./api-access/api-keys.md)
- **Design Experiments**: [Experiment Design Guide](./experiment-design/overview.md)
- **Manage Collaborators**: [Collaboration Guide](./collaboration.md)
