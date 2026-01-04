---
title: Data Management
sidebar_position: 5
---

# Data Management

HyperStudy provides comprehensive tools for accessing, managing, and downloading your experiment data. You can access your data through the graphical interface for quick viewing and downloads, or programmatically through the API for automated analysis and integration with your research workflows.

## Overview

### Two Ways to Access Your Data

1. **Graphical Interface** (see [Data Management Interface Guide](./data-management-interface.md))
   - Navigate and browse your data visually
   - Preview data before downloading
   - Download individual data types or bulk exports
   - Best for: Quick exploration, one-time downloads
   - This page provides a high-level overview; see the full [Interface Guide](./data-management-interface.md) for details

2. **API Access** (see [API Access Guide](./api-access/overview.md))
   - Programmatic access with Python, JavaScript, or R
   - Automate data exports and analysis
   - Integrate with your research pipelines
   - Best for: Repeated analysis, automation, large-scale processing

## Accessing Data Through the GUI

### Data Dashboard Navigation

HyperStudy organizes your data in a hierarchical structure for easy navigation:

```
Experiments → Rooms → Participants → Data
```

**To access your data**:

1. Log in to HyperStudy
2. Navigate to **Admin Dashboard**
3. Click on the **Data** tab in the sidebar

You'll see a table of all your experiments.

### Hierarchical Navigation

#### 1. Experiments Table

The first view shows all experiments you have access to:

- **Experiment Name**: Click to view rooms/sessions
- **Status**: Active, completed, archived
- **Participant Count**: Total participants across all sessions
- **Created Date**: When the experiment was created

**Actions**:
- Click on any experiment to view its rooms/sessions
- Use the breadcrumb at the top to navigate back

#### 2. Rooms Table

After selecting an experiment, you'll see all rooms (sessions) for that experiment:

- **Room ID**: Unique identifier for each session
- **Participant Count**: Number of participants in this session
- **Status**: Active, completed
- **Start Time**: When the session began
- **Duration**: How long the session lasted

**Actions**:
- Click on any room to view participants
- Click **Download All** to export all data for this room
- Use breadcrumbs to navigate back to experiments

#### 3. Participants Table

After selecting a room, you'll see all participants in that session:

- **Participant ID**: Unique participant identifier
- **Role**: Their assigned role in the experiment
- **Status**: Completed, active, disconnected
- **Data Available**: Which data types are available

**Actions**:
- Click on any participant to view their data
- Click **Download All** to export all data for all participants in this room
- Use breadcrumbs to navigate back

#### 4. Data Viewer

After selecting a participant, you'll see a tabbed interface showing all their data:

**Available Tabs**:
- **Events**: All interactions, component completions, state transitions
- **Recordings**: Video/audio recordings from video chat sessions
- **Text Chat**: Chat messages sent during the experiment
- **Continuous Ratings**: Real-time rating data from rating components
- **Sparse Ratings**: Individual rating responses
- **Sync Metrics**: Video synchronization quality data
- **Components**: Metadata about experiment components

**Features**:
- Preview data inline in each tab
- Sort and filter within each data type
- Download individual data types
- Download all data types at once

## Downloading Data

### Download Options

You can download data at multiple levels:

1. **Individual Data Type**
   - In the Data Viewer, click **Download** in any tab
   - Downloads just that data type for that participant

2. **All Data for a Participant**
   - In the Data Viewer, click **Download All Data**
   - Downloads all available data types for this participant

3. **All Data for a Room**
   - In the Participants Table, click **Download All**
   - Downloads data for all participants in this session

4. **All Data for an Experiment**
   - In the Rooms Table, click **Download All**
   - Downloads data for all rooms/sessions in this experiment

### Export Formats

HyperStudy supports three export formats:

#### CSV (Comma-Separated Values)
- **Best for**: Excel, statistical software (R, SPSS, SAS)
- **Features**:
  - Human-readable
  - One row per record
  - Wide compatibility
  - Easy to import into analysis tools
- **When to use**: Most common format for data analysis

#### JSON (JavaScript Object Notation)
- **Best for**: Programming languages (Python, JavaScript)
- **Features**:
  - Preserves data structure and hierarchy
  - Includes all metadata
  - Maintains data types
  - Better for complex nested data
- **When to use**: Custom data processing pipelines

#### ZIP (Compressed Archive)
- **Best for**: Bulk downloads with many files
- **Features**:
  - Combines multiple data types
  - Includes metadata file
  - Smaller download size
  - Organized directory structure
- **When to use**: Downloading all data for experiment/room

### Download Progress

For large datasets, HyperStudy shows a progress modal:

- **Progress bar**: Visual indication of completion
- **Status message**: Current operation (e.g., "Fetching events...", "Creating ZIP...")
- **Cancel button**: Stop the download if needed

The browser will automatically download the file when ready.

## Understanding Your Data

### Data Types Explained

#### 1. Events
All participant interactions and system events:

- **Component Events**: Button clicks, form submissions, rating inputs
- **State Transitions**: Moving between experiment states
- **Media Events**: Video play/pause, audio recording start/stop
- **Timing Information**: Precise timestamps and onset times

**Key Fields**:
- `timestamp`: Absolute time of event (ISO 8601)
- `onset`: Milliseconds from experiment start (can be negative)
- `eventType`: Type of event (e.g., "component.complete")
- `componentType`: Which component generated the event
- `content`: Human-readable description
- `response`: Participant's response data (if applicable)

#### 2. Recordings
Video and audio recordings from LiveKit video chat:

- **Video Recordings**: Participant webcam recordings
- **Audio Recordings**: Participant microphone recordings
- **Download URLs**: Signed URLs for accessing media files
- **Timing**: When recording started/stopped, duration

**Key Fields**:
- `recordingId`: Unique identifier for the recording
- `participantId`: Who was recorded
- `startTime`: When recording began
- `endTime`: When recording ended
- `duration`: Length in milliseconds
- `downloadUrl`: URL to download the recording file
- `videoOffset`: Offset from experiment start

#### 3. Text Chat
Messages sent through the text chat component:

- **Message Content**: Text of each message
- **Sender Info**: Who sent the message
- **Timestamps**: When message was sent
- **Recipients**: Who received the message (if targeted)

**Key Fields**:
- `messageId`: Unique message identifier
- `senderId`: Who sent the message
- `content`: Message text
- `timestamp`: When sent
- `recipientIds`: List of recipients

#### 4. Continuous Ratings
Real-time rating data from continuous rating components:

- **High Frequency**: Data points every 100-500ms while rating
- **Rating Values**: Numerical rating at each timestamp
- **Component Context**: Which rating scale was used

**Key Fields**:
- `timestamp`: When rating was recorded
- `value`: Rating value (normalized or raw)
- `componentId`: Which rating component
- `onset`: Time from experiment start

**Analysis Tip**: Use for time-series analysis of emotional responses, engagement, etc.

#### 5. Sparse Ratings
Individual rating responses (VAS, Likert scales):

- **One Entry Per Response**: Discrete rating submissions
- **Response Time**: How long participant took
- **Scale Information**: Min/max values, labels

**Key Fields**:
- `value`: Rating value
- `responseTime`: Time taken to respond
- `componentId`: Which rating component
- `labels`: Scale labels (if applicable)

#### 6. Sync Metrics
Video synchronization quality data (for multi-participant experiments):

- **Sync Quality**: How well videos stayed in sync
- **Latency**: Network delays
- **Adjustments**: Playback rate corrections
- **Health Indicators**: Overall sync performance

**Key Fields**:
- `timestamp`: When measured
- `timeDrift`: Difference from host (milliseconds)
- `playbackRate`: Current playback speed adjustment
- `syncQuality`: Quality metric (0-1)

#### 7. Components
Metadata about experiment components:

- **Component Definitions**: Configuration of each component
- **States**: Which state each component appeared in
- **Variables**: Variable values at component display time

### Data Structure and Timing

#### Timestamps and Onset Times

All events include two time representations:

1. **Absolute Timestamp** (`timestamp` field)
   - ISO 8601 format: `2024-10-20T14:30:45.123Z`
   - Exact moment the event occurred
   - Use for: Cross-referencing with external systems

2. **Onset Time** (`onset` field)
   - Milliseconds from experiment start
   - Can be **negative** (events before experiment officially started)
   - Use for: Aligning events, analyzing timing patterns

**Example**:
```
Experiment started at: 2024-10-20T14:30:00.000Z

Event 1:
  timestamp: 2024-10-20T14:29:55.000Z
  onset: -5000  (5 seconds before start)

Event 2:
  timestamp: 2024-10-20T14:30:10.500Z
  onset: 10500  (10.5 seconds after start)
```

#### Participant and Session IDs

- **Participant ID**: Unique identifier for each participant (e.g., Firebase UID)
- **Session ID / Room ID**: Unique identifier for each experimental session
- **Experiment ID**: Unique identifier for the experiment design

These IDs link all data together for analysis.

## Data Quality and Validation

### Automatic Data Validation

HyperStudy automatically validates:

1. **Required Fields**: All critical fields are populated
2. **Data Types**: Correct format (numbers, timestamps, etc.)
3. **Timing Consistency**: Logical sequence of events
4. **Completeness**: No missing critical data

### Data Quality Indicators

In the Data Viewer, look for:

- **Record Counts**: How many records for each data type
- **Time Ranges**: First and last timestamp
- **Completeness**: Percentage of expected data received

### Common Data Issues

| Issue | Possible Cause | What to Check |
|-------|----------------|---------------|
| Missing events | Participant disconnected | Check session duration, connection quality |
| No recordings | Participant denied camera | Check permissions, browser console logs |
| Sparse chat data | Participants didn't chat | Expected behavior if chat wasn't required |
| Sync metrics missing | Single-participant session | Normal - sync only for multi-participant |
| Negative onset times | Events before experiment start | Normal - includes setup/consent events |

## Privacy and Security

### Access Control

Data access is role-based:

1. **Experiment Owner**
   - Full access to all data
   - Can download and export
   - Can delete data

2. **Collaborators** (if added)
   - View permissions
   - Limited export (based on granted permissions)
   - Cannot delete data

3. **Participants**
   - Can request their own data (if enabled)
   - Anonymized view

### Data Anonymization

When exporting data, you can:

1. **Keep Identifiers**
   - Useful for tracking participants across sessions
   - Use when you have consent for identified data

2. **Remove Identifiers**
   - Participant IDs replaced with anonymous codes
   - Email addresses removed
   - IP addresses stripped

3. **Aggregate Only**
   - Export summary statistics only
   - No individual participant data

### Data Retention

Configure how long data is stored:

- Set automatic deletion dates
- Archive old experiments
- Comply with IRB requirements and regulations (GDPR, etc.)

## Programmatic Access via API

For automated analysis, repeated downloads, or integration with your research workflow, use the **HyperStudy API**.

### When to Use the API

Use the API when you need to:

- **Automate data exports**: Download data on a schedule
- **Process large datasets**: Paginate through millions of records
- **Integrate with analysis pipelines**: Feed data directly into R, Python, MATLAB
- **Real-time monitoring**: Track experiment progress as it happens
- **Batch processing**: Download data for multiple experiments/sessions

### Getting Started with the API

1. **Generate an API Key**
   - See [API Key Management Guide](./api-access/api-keys.md)
   - Navigate to Admin Dashboard → API Keys
   - Create a key with appropriate permissions

2. **Choose Your Language**
   - [Python Guide](./api-access/python-guide.md) - Most common for data analysis
   - [JavaScript Guide](./api-access/javascript-guide.md) - For web integrations
   - [R Guide](./api-access/r-guide.md) - For statistical analysis

3. **Learn the API**
   - [API Overview](./api-access/overview.md) - Introduction to the API
   - [Data Types & Endpoints](./api-access/data-types.md) - Available endpoints

## Best Practices

### Regular Backups

1. **During Data Collection**
   - Download data periodically (daily or weekly)
   - Don't wait until collection is complete

2. **Storage**
   - Keep multiple backup copies
   - Store in different locations
   - Use version control for analysis scripts

3. **Documentation**
   - Record what data was downloaded and when
   - Document any data cleaning steps
   - Keep analysis logs

### Data Organization

Organize your downloads:

```
project_name/
├── raw_data/
│   ├── experiment_123_2024-10-20/
│   │   ├── events.csv
│   │   ├── recordings.csv
│   │   ├── chat.csv
│   │   └── metadata.json
│   └── experiment_123_2024-10-27/
├── processed_data/
└── analysis_scripts/
```

### Compliance

1. **IRB Requirements**
   - Follow your institution's data handling policies
   - Secure storage of identifiable data
   - Proper data destruction when required

2. **Participant Consent**
   - Only export data you have consent to use
   - Respect participant withdrawal requests
   - Maintain proper anonymization when required

3. **GDPR Compliance** (if applicable)
   - Right to access: Provide participants their data
   - Right to deletion: Delete data upon request
   - Data minimization: Only collect necessary data

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Download fails | Try smaller date ranges; check browser console for errors |
| Data missing | Verify session completed; check filters; ensure sync completed |
| Export timeout | Use API for very large datasets; download in smaller chunks |
| File won't open | Check file extension matches format; try different software |
| Slow loading | Filter to smaller dataset; use pagination; consider API access |

### Getting Help

If you encounter issues:

1. Check browser console for error messages (F12 → Console)
2. Try a different export format
3. Verify you have the correct permissions
4. Contact support with:
   - Experiment ID
   - What you were trying to download
   - Error messages or screenshots

## Next Steps

- **Master the interface**: [Data Management Interface Guide](./data-management-interface.md) - Complete guide to the data dashboard
- **Learn about API access**: [API Overview](./api-access/overview.md)
- **Generate API keys**: [API Key Management](./api-access/api-keys.md)
- **Start coding**: [Python](./api-access/python-guide.md) | [JavaScript](./api-access/javascript-guide.md) | [R](./api-access/r-guide.md)
- **Manage your experiments**: [Collaboration](./collaboration.md)
- **Design new experiments**: [Experiment Design](./experiment-design/overview.md)
