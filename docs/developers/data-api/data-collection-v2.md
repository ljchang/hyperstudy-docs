---
id: data-collection-v2
title: Data Collection V2 System
slug: /developers/data-api/data-collection-v2
---

# Data Collection V2 System

> **Note**: For downloading data programmatically using the V3 API, see the [API Access Guide](/experimenters/api-access/api-overview) in the Experimenter Guide, which includes complete examples for Python, JavaScript, and R.

## Overview

The Data Collection V2 system is HyperStudy's new unified approach to capturing and managing experimental data. This modern system provides improved performance, better data organization, and enhanced analytics capabilities while maintaining full backward compatibility with existing experiments.

### Key Benefits

- **Unified Event Model**: All data is captured in a consistent format across all experiment components
- **Real-time Performance**: Events are batched and optimized for minimal latency
- **Comprehensive Analytics**: Better querying and analysis capabilities for research insights
- **Future-proof**: Easily extensible for new event types and data requirements

## Key Improvements

### 1. Simplified Data Structure

**Legacy System**: Data was scattered across multiple collections (rooms, participations, chat_messages, etc.)

**V2 System**: All events are stored in a unified `experiment_events_v2` collection with consistent schema

### 2. Better Performance

- **Event Batching**: Multiple events are sent together, reducing network overhead
- **Optimized Queries**: Purpose-built indexes for common research queries
- **Reduced Latency**: Events are processed more efficiently on both client and server

### 3. Enhanced Data Quality

- **Automatic Enrichment**: Events include standardized metadata (timestamps, session context, etc.)
- **Data Validation**: Ensures consistency and completeness of recorded data
- **Error Tracking**: System errors and issues are automatically captured

### 4. Improved Analytics

- **Timeline Reconstruction**: Easy to rebuild participant journey through experiment
- **Cross-participant Analysis**: Compare behaviors and responses across participants
- **Real-time Monitoring**: Track experiment progress as it happens

## Migration from V1 to V2

### Automatic Migration

The system handles migration automatically:

1. **Dual Writing**: During transition, data is written to both old and new systems
2. **Gradual Rollout**: Experiments can be migrated individually using feature flags
3. **Data Integrity**: All historical data is preserved and accessible

### For Experiment Designers

No changes are required to existing experiments. The system automatically:

- Captures all existing event types
- Maintains compatibility with current analysis scripts
- Preserves all functionality

## Understanding the Unified Event Model

Every event in the V2 system follows a consistent structure:

```javascript
{
  // Core Identifiers
  eventId: "evt_1234567_abcdef",
  experimentId: "exp_research_2024",
  sessionId: "sess_participant_123",
  participantId: "user_abc123",

  // Event Classification
  eventType: "component.complete",
  category: "component",

  // Timestamps
  timestamp: "2024-01-15T10:30:45.123Z",
  sessionTime: 125000,  // milliseconds since session start

  // Event-specific Data
  data: {
    componentId: "mood_assessment",
    response: "happy",
    responseTime: 3245
  },

  // Context
  context: {
    stateId: "assessment_state",
    role: "participant_a"
  }
}
```

### Key Fields Explained

- **eventId**: Unique identifier for each event
- **sessionTime**: Time elapsed since participant joined (useful for synchronizing events)
- **category**: High-level grouping (component, state, media, communication, sync)
- **eventType**: Specific event within category (e.g., "component.complete")
- **data**: Event-specific information (varies by event type)
- **context**: Experiment state and participant role information

## Types of Events Collected

### 1. Component Events

Capture participant interactions with experiment components:

```javascript
// Multiple Choice Response
{
  eventType: "component.complete",
  category: "component",
  data: {
    componentId: "demographics_q1",
    componentType: "multiple_choice",
    question: "What is your age group?",
    response: "25-34",
    responseTime: 4521
  }
}

// Continuous Rating Update
{
  eventType: "component.update",
  category: "component",
  data: {
    componentId: "engagement_rating",
    componentType: "continuous_rating",
    value: 0.75,
    videoTime: 45.3
  }
}
```

### 2. State Events

Track experiment flow and progression:

```javascript
// State Transition
{
  eventType: "state.transition",
  category: "state",
  data: {
    fromState: "instructions",
    toState: "main_task",
    transitionType: "manual",
    trigger: "participant_action"
  }
}
```

### 3. Media Events

Monitor media consumption and synchronization:

```javascript
// Video Playback
{
  eventType: "media.play",
  category: "media",
  data: {
    mediaId: "stimulus_video_1",
    mediaType: "video",
    currentTime: 0,
    duration: 180.5
  }
}
```

### 4. Communication Events

Record participant interactions:

```javascript
// Text Chat Message
{
  eventType: "communication.message",
  category: "communication",
  data: {
    messageType: "text",
    content: "I noticed that too!",
    recipient: "all"
  }
}
```

### 5. Synchronization Events

Track technical performance and sync quality:

```javascript
// Sync Metrics
{
  eventType: "sync.metrics",
  category: "sync",
  data: {
    offset: 12.5,
    latency: 45,
    qualityScore: 0.95
  }
}
```

## Performance Optimizations

### Event Batching

The V2 system automatically batches events for efficient transmission:

- **Low-priority events**: Grouped and sent every 1 second or when batch size reaches 10
- **High-priority events**: Sent immediately (e.g., critical state transitions)
- **Page unload**: All pending events are flushed automatically

### Efficient Querying

Optimized indexes enable fast queries:

```javascript
// Get all responses from a participant
const responses = await dataService.getParticipantEvents(participantId, {
  category: "component",
  eventType: "component.complete",
});

// Get timeline for a session
const timeline = await dataService.getSessionEvents(sessionId, {
  sortBy: "timestamp",
  order: "asc",
});
```

## Feature Flag Controls

The V2 system can be enabled/disabled at multiple levels:

### Global Control

```javascript
// In backend configuration
USE_NEW_EVENT_SYSTEM = true;
```

### Per-Experiment Control

```javascript
// In experiment settings
{
  "featureFlags": {
    "useDataCollectionV2": true
  }
}
```

### Gradual Rollout

```javascript
// Percentage-based rollout
{
  "featureFlags": {
    "dataCollectionV2Percentage": 50  // 50% of new sessions
  }
}
```

## Data Export and Analysis

### Exporting Data

#### Via Data Management Interface

1. Navigate to your experiment's data management page
2. Select the date range and event types you're interested in
3. Click "Download" and choose your format (CSV or JSON)

{/* Screenshot: Data Export Interface will be added here */}

#### Via API

```javascript
// Download all events as CSV
await dataService.downloadEventsCSV(experimentId, {
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  categories: ["component", "state"],
});
```

### Common Analysis Tasks

#### 1. Reconstruct Participant Timeline

```javascript
// Get all events for a participant in chronological order
const timeline = await dataService.getParticipantTimeline(
  participantId,
  sessionId
);

// Result includes all events with relative timing
timeline.events.forEach((event) => {
  console.log(`${event.sessionTime}ms: ${event.eventType}`);
});
```

#### 2. Analyze Response Patterns

```javascript
// Get all rating responses
const ratings = await dataService.getExperimentEvents(experimentId, {
  category: "component",
  "data.componentType": "vas_rating",
});

// Calculate average ratings by component
const averages = {};
ratings.forEach((event) => {
  const componentId = event.data.componentId;
  if (!averages[componentId]) {
    averages[componentId] = { sum: 0, count: 0 };
  }
  averages[componentId].sum += event.data.value;
  averages[componentId].count++;
});
```

#### 3. Track Engagement Over Time

```javascript
// Get continuous rating data
const engagementData = await dataService.getSessionEvents(sessionId, {
  eventType: "component.update",
  "data.componentId": "engagement_rating",
});

// Create time series data
const timeSeries = engagementData.map((event) => ({
  time: event.data.videoTime,
  value: event.data.value,
}));
```

#### 4. Communication Analysis

```javascript
// Get all chat messages
const messages = await dataService.getExperimentEvents(experimentId, {
  category: "communication",
  eventType: "communication.message",
});

// Count messages by participant
const messageCounts = {};
messages.forEach((event) => {
  const participant = event.participantId;
  messageCounts[participant] = (messageCounts[participant] || 0) + 1;
});
```

## Backward Compatibility

The V2 system maintains full compatibility with existing code:

### Legacy Data Access

Old data remains accessible through existing collections:

- `rooms` - Session information
- `participations` - Participant responses
- `chat_messages` - Communication data

### Compatibility Layer

The system automatically:

1. Writes to both old and new collections during transition
2. Provides unified API that queries both systems
3. Migrates historical data without disruption

### Existing Analysis Scripts

Your current analysis scripts will continue to work. When ready, you can update them to use the new unified API for better performance and features.

## Best Practices

### 1. Use Event Categories

When querying data, filter by category first for better performance:

```javascript
// Good: Specific category
const componentEvents = await dataService.getExperimentEvents(experimentId, {
  category: "component",
});

// Less efficient: No category filter
const allEvents = await dataService.getExperimentEvents(experimentId);
```

### 2. Leverage Session Time

Use `sessionTime` for synchronized analysis across participants:

```javascript
// Compare participant responses at same point in experiment
const responses = await Promise.all(
  participantIds.map((id) =>
    dataService.getParticipantEvents(id, {
      sessionTime: { $gte: 60000, $lte: 65000 }, // 60-65 seconds
    })
  )
);
```

### 3. Monitor Data Quality

Check for missing or anomalous data:

```javascript
// Find participants with incomplete data
const summary = await dataService.getEventSummary({
  experimentId,
  groupBy: "participantId",
});

const incomplete = summary.participants.filter(
  (p) => p.eventCount < expectedEventCount
);
```

## Troubleshooting

### Missing Events

If events appear to be missing:

1. Check feature flag settings
2. Verify participant completed the component
3. Look for error events in the same time window
4. Check browser console for client-side errors

### Performance Issues

For slow queries:

1. Use category and eventType filters
2. Limit date ranges when possible
3. Consider using event summaries for large datasets
4. Export data for offline analysis of very large datasets

### Data Inconsistencies

If data seems inconsistent:

1. Check if dual-writing is enabled (transition period)
2. Verify timestamp filters include full session
3. Look for duplicate events (rare but possible during network issues)

## Next Steps

- [Data Management Interface Guide](../../experimenters/data-management-interface.md) - Learn to use the new data interface
- [API Access Guide](../../experimenters/api-access/overview.md) - Programmatic data access with Python, JavaScript, or R
  {/* - [API Reference](../../developers/api/data-v2.md) - Detailed API documentation */}
  {/* - [Migration Guide](../../developers/migration/data-collection-v2.md) - For custom integrations */}
