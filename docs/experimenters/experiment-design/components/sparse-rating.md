---
title: Sparse Rating Component
sidebar_position: 10
---

import StorybookEmbed from '@site/src/components/StorybookEmbed';

# Sparse Rating Component (Global State)

The Sparse Rating component is a global state component that enables researchers to collect participant ratings at specific, predefined moments during video playback. Unlike continuous rating which collects data constantly, sparse rating prompts participants only at designated time points, reducing cognitive load while still capturing important temporal data.

## Interactive Demo

<StorybookEmbed story="experiment-sparserating--default" showControls height="500px" />

## Overview

Sparse rating is particularly useful for:

- **Moment-based evaluations**: Capturing reactions at key video moments
- **Reduced participant burden**: Less intrusive than continuous rating
- **Synchronized data collection**: All participants rate at the same moments
- **Per-state customization**: Different rating configurations for each state
- **Reference-based comparisons**: Optionally showing previous ratings for comparison

## Key Features

### Per-State Configuration

Each video state in your experiment can have its own sparse rating configuration:

- **Independent Settings**: Different rating types, prompts, and schedules per state
- **State-Specific Timing**: Pause times are relative to each state's start (t=0)
- **Flexible Design**: Mix different rating approaches across your experiment
- **Synchronized Sampling**: All participants in a session share the same pause times
- **Multi-Video Support**: Same video used in different states can have different sparse rating configs

### State-Relative Timing

All pause times are calculated from the start of the video state:

- **t=0**: When the video state begins
- **Pause at 30s**: 30 seconds after video starts playing
- **Consistent Across Sessions**: Same schedule used for all sessions (deterministic)
- **Room-Specific**: Schedules are generated per-room using `roomId-stateId` as seed

## Configuration Structure

### Enabling States for Sparse Rating

1. Navigate to the "Global Components" section in the Experiment Designer
2. Find "Sparse Rating" in the available components list
3. Toggle the component to "Enabled"
4. **Select which video states** should have sparse rating enabled
5. Configure settings for each enabled state

### State-Specific Configuration

For each video state you enable, configure:

#### 1. Sampling Strategy

Choose how pause times are generated:

**Stratified Sampling** (Structured) - **DEFAULT**
- Divides video into equal bins, samples within each
- Good for ensuring coverage across entire video
- Provides consistent temporal coverage
- Parameters:
  - `numBins`: Number of bins to divide video into (default: 5)
  - `samplesPerBin`: Number of pauses per bin (default: 1)
  - `binSamplingType`: How to sample within bin (`uniform` or `center`, default: `uniform`)

**Uniform Distribution** (Random)
- Pauses at random intervals between min and max
- Good for unpredictable sampling
- Parameters:
  - `minInterval`: Minimum time between pauses (milliseconds)
  - `maxInterval`: Maximum time between pauses (milliseconds)

**Poisson Distribution** (Natural)
- Exponentially distributed intervals (models natural events)
- Good for realistic temporal patterns
- Parameters:
  - `lambda`: Average events per minute

**Manual Timing** (Precise)
- Exact pause times specified by researcher
- Good for specific moments of interest
- Parameters:
  - `times`: Array of times in seconds (e.g., `[15, 30, 45, 90]`)

#### 2. Rating Component

Select the input method for collecting ratings:

- **VAS Rating**: Visual analog scale (slider)
- **Multiple Choice**: Predefined options
- **Text Input**: Free text responses
- **Rapid Rate**: Multi-dimensional quick ratings
- **Audio Recording**: Voice responses
- **Ranking**: Rank-order items

Each rating type has its own configuration (see component-specific docs).

#### 3. Timing & Behavior

Control how ratings are collected:

- **Response Time Limit**: Maximum time allowed for rating (milliseconds, default: `30000`)
- **Show Countdown**: Display countdown timer (default: `false`)
  - **Countdown Style**: `time` (shows seconds) or `progressBar` (shows progress bar)
  - **Countdown Position**: `top` or `bottom` (default: `top`)
  - **Countdown Color**: Color of countdown display (default: `#2196F3`)
- **Seek Back Duration**: How far to rewind after rating (milliseconds, default: `0`)
  - Useful for rewinding to review content that occurred during rating

#### 4. Data Management

- **Output Variable**: Variable name to store ratings (default: `sparseRatingResponse`)
- **Show Previous Rating**: Display participant's previous rating for reference (default: `false`)
  - Supported: VAS Rating, Rapid Rate
  - VAS: Shows as reference line with previous value
  - Rapid Rate: Shows as reference lines for each dimension
  - Helps participants maintain consistency across ratings

## Configuration Examples

### Example 1: Basic Emotion Rating (Stratified - Default)

```json
{
  "enabledStates": ["state_video1", "state_video3"],
  "stateConfigurations": {
    "state_video1": {
      "stateId": "state_video1",
      "videoDuration": 120000,
      "distribution": {
        "type": "stratified",
        "parameters": {
          "numBins": 5,
          "samplesPerBin": 1,
          "binSamplingType": "uniform"
        }
      },
      "ratingComponent": {
        "type": "vasrating",
        "config": {
          "prompt": "How positive or negative do you feel?",
          "min": -100,
          "max": 100,
          "minLabel": "Very Negative",
          "maxLabel": "Very Positive"
        }
      },
      "showCountdown": true,
      "countdownStyle": "time",
      "countdownPosition": "top",
      "responseTimeLimit": 30000,
      "outputVariable": "emotionRating"
    }
  }
}
```

### Example 2: Engagement Assessment (Uniform)

```json
{
  "enabledStates": ["state_video2"],
  "stateConfigurations": {
    "state_video2": {
      "stateId": "state_video2",
      "videoDuration": 180000,
      "distribution": {
        "type": "uniform",
        "parameters": {
          "minInterval": 30000,
          "maxInterval": 60000
        }
      },
      "ratingComponent": {
        "type": "multiplechoice",
        "config": {
          "prompt": "How engaged are you with this content?",
          "choices": [
            "Not at all engaged",
            "Slightly engaged",
            "Moderately engaged",
            "Very engaged",
            "Extremely engaged"
          ]
        }
      },
      "showPreviousRating": false,
      "outputVariable": "engagementLevel"
    }
  }
}
```

### Example 3: Moment-Specific Feedback (Manual)

```json
{
  "enabledStates": ["state_video4"],
  "stateConfigurations": {
    "state_video4": {
      "stateId": "state_video4",
      "videoDuration": 240000,
      "distribution": {
        "type": "manual",
        "parameters": {
          "times": [15, 30, 45, 75, 90]
        }
      },
      "ratingComponent": {
        "type": "textinput",
        "config": {
          "prompt": "What are you thinking about right now?",
          "maxLength": 200,
          "placeholder": "Enter your thoughts..."
        }
      },
      "responseTimeLimit": 60000,
      "seekBackDuration": 3000,
      "outputVariable": "thoughts"
    }
  }
}
```

### Example 4: Multi-Dimensional Rating (Poisson)

```json
{
  "enabledStates": ["state_video5"],
  "stateConfigurations": {
    "state_video5": {
      "stateId": "state_video5",
      "videoDuration": 300000,
      "distribution": {
        "type": "poisson",
        "parameters": {
          "lambda": 1.5
        }
      },
      "ratingComponent": {
        "type": "rapidrate",
        "config": {
          "prompt": "Rate your current emotional state",
          "dimensions": [
            {"name": "Valence", "min": -100, "max": 100},
            {"name": "Arousal", "min": 0, "max": 100},
            {"name": "Engagement", "min": 0, "max": 100}
          ]
        }
      },
      "showPreviousRating": true,
      "responseTimeLimit": 45000,
      "outputVariable": "emotionalState"
    }
  }
}
```

## Setting Up Sparse Rating

### Step-by-Step Setup

**1. Enable the Sparse Rating Global Component**
- Navigate to "Global Components" tab in the Experiment Designer
- Toggle "Sparse Rating" to enabled

**2. Select States for Sparse Rating**
- Use the "Select Video State to Configure" dropdown
- Select each video state you want to enable for sparse rating
- Only video states (with ShowVideo component) are available

**3. Configure Each State**
- Select a state from the dropdown to open its configuration panel
- If no configuration exists, click "Create Configuration"
- Choose a sampling strategy and set parameters (default: stratified)
- Select a rating component type (default: VAS rating)
- Configure the rating component settings (prompt, labels, options, etc.)
- Set behavior options (countdown, time limits, rewind duration)
- Configure output variable and previous rating display

**4. Set Visibility in States**
- Use the Global Components Matrix to control visibility
- Sparse rating should be visible during video states
- Can be hidden in non-video states

**5. Test Your Configuration**
- Preview the experiment to verify timing
- Check that prompts appear at expected moments
- Test that ratings are recorded correctly
- Verify synchronization works across participants (multi-participant experiments)

## Data Collection

### Recorded Data Structure

Each sparse rating interaction generates an event with:

```javascript
{
  eventType: 'sparse_rating_response',
  category: 'sparse_rating',

  // Identifiers
  participantId: 'participant_123',
  experimentId: 'exp_456',
  roomId: 'room_789',

  // Timestamp (absolute)
  timestamp: '2024-01-15T14:30:25.123Z',

  // Rating data (nested in value field)
  value: {
    videoId: 'video1',
    stateId: 'state_video1',
    componentType: 'vasrating',
    componentData: {
      value: 75,
      // Component-specific data varies by rating type
    },
    pauseIndex: 2,
    videoRelativeTime: 45000, // 45s from video start
    pauseTimestamp: 1705329025123,
    responseTime: 2300,
    previousRating: null // or previous value if showPreviousRating enabled
  }
}
```

### Key Data Fields

- **videoId**: Which video this rating is for
- **stateId**: The experiment state ID (primary identifier for configuration)
- **pauseIndex**: Which pause in the sequence (0-indexed)
- **videoRelativeTime**: Milliseconds from video start (state-relative)
- **componentData**: The actual rating value and component-specific data
- **responseTime**: Milliseconds taken to respond
- **previousRating**: Previous rating for this state+video combination (if showPreviousRating enabled)

### Data Access

Sparse rating data can be accessed via:

1. **API v3 Ratings Endpoint**:
   ```
   GET /api/v3/data/ratings/room/{roomId}?ratingType=sparse
   ```

2. **Data Management Interface**:
   - Navigate to experiment data viewer
   - Filter by "Sparse Rating" category
   - View by participant, room, or experiment

3. **Export Options**:
   - CSV export with all sparse rating fields
   - JSON export with full nested structure
   - Integrated with other event data

## Analysis Considerations

### Temporal Alignment

- All times are relative to video state start
- Use `videoRelativeTime` for aligning with video content
- Use `timestamp` for absolute chronological order
- Use `onset` (from processed data) for experiment-relative timing

### Multi-State Experiments

- Each state has independent pause schedule
- Same video can be used in multiple states with different configs
- Compare ratings across states using `stateId`
- Track participant patterns across multiple states
- Previous ratings only show within same state+video combination

### Synchronization

- All participants in a room share the same pause schedule
- Schedule is deterministic (based on `roomId-stateId` seed)
- Ensures synchronized data collection across participants
- Enables direct comparison of responses at same moments
- Schedule generated server-side during room initialization
- Loaded during experiment setup phase (before LiveKit connection)

### Missing Data

- Participants may not respond before time limit
- Check `responseTime` field to identify timeouts
- Empty `componentData` indicates no response
- Consider minimum response rates in your design

## Best Practices

### Sampling Strategy Selection

**Use Stratified Sampling When:** (DEFAULT - Recommended)
- Need to ensure coverage across entire video
- Want equal representation from beginning, middle, end
- Comparing specific video segments
- Want consistent temporal structure across sessions
- **Best for most research applications**

**Use Uniform Distribution When:**
- You want unpredictable timing to avoid anticipation effects
- Natural variation in pause intervals is desired
- No specific structure to temporal sampling is needed

**Use Poisson Distribution When:**
- Modeling natural event patterns
- Want realistic temporal distribution
- Avoiding regular patterns that participants might predict

**Use Manual Timing When:**
- Specific moments of interest are known
- Aligning with particular video content/events
- Precise experimental control is required

### Timing Considerations

1. **Minimum Interval**: Allow at least 15-20 seconds between pauses
2. **Response Time**: Set realistic time limits (3-5 seconds for simple ratings)
3. **Video Duration**: Ensure pause schedule fits within video length
4. **Cognitive Load**: Balance frequency with participant burden

### Configuration Tips

1. **Test First**: Always preview timing before collecting real data
2. **Pilot Study**: Test with representative participants
3. **Validation**: Verify pause times make sense for your video content
4. **Documentation**: Document your sampling strategy and rationale
5. **Consistency**: Use consistent prompts across similar videos

### User Experience

1. **Clear Instructions**: Explain the rating task upfront
2. **Practice**: Consider a practice video with sparse rating
3. **Feedback**: Show confirmation after rating submission
4. **Visual Design**: Ensure modal is clearly visible and accessible
5. **Mobile Friendly**: Test on different screen sizes

## Troubleshooting

### Prompts Not Appearing

**Check:**
- Global component is enabled
- State is in `enabledStates` list
- State has a configuration in `stateConfigurations`
- Component is visible in current state (Global Components Matrix)
- Pause schedule is valid (times < video duration)
- Schedule was loaded during experiment setup phase

### Timing Issues

**Check:**
- Video synchronization is working (multi-participant experiments)
- Manual times are in seconds, not milliseconds
- Pause schedule was generated (check browser console logs)
- Video duration is correctly calculated from state config
- State ID matches between configuration and experiment state

### Data Not Recording

**Check:**
- Network connectivity
- Browser console for errors
- Event is being sent (check Network tab)
- Participant has necessary permissions

### Synchronization Problems

**Check:**
- Experiment requires sync (multi-participant with video)
- Host role is correctly assigned (config.hostRole)
- Sync socket connection is established (multi-participant only)
- All participants joined same room
- Video playback is synchronized
- Schedule loaded successfully for all participants

## Integration with Other Components

### ShowVideo Component

Sparse rating is tightly integrated with ShowVideo:

- Pause times calculated from video state start
- Video pauses automatically during rating (if configured)
- Can seek back after rating to review content
- Synchronized across all participants in room

### Continuous Rating

Can be used alongside sparse rating:

- Sparse for explicit, deliberate evaluations
- Continuous for implicit, ongoing responses
- Different variables for each to avoid conflicts
- Both can be visible during same video

### Text Chat / Video Chat

Consider interaction with communication components:

- May want to hide chat during rating to avoid interference
- Or keep visible for discussion-based studies
- Timing of ratings relative to discussion points
- Participant awareness of ongoing communication

## Related Documentation

- [Continuous Rating Component](./continuous-rating.md)
- [VAS Rating Component](./vas-rating.md)
- [Multiple Choice Component](./multiple-choice.md)
- [Text Input Component](./text.md)
- [Audio Recording Component](./audio-recording.md)
- [Global States Overview](../global-states.md)
- [Video Component](./video.md)
- [Video Synchronization](../../../developers/video-synchronization.md)

## Technical Details

### Sampling Implementation

Pause time generation uses:

- **Deterministic RNG**: Seeded with `${roomId}-${stateId}`
- **Video Duration**: Auto-calculated from state config
- **Validation**: Negative times and times > duration are filtered out
- **Server-Side Generation**: Schedule generated during room initialization
- **Composite Keys**: Uses `${stateId}-${videoId}` for schedule storage

### Architecture

**Setup Phase:**
1. Backend initializes room with sparse rating config
2. Backend generates pause schedules for all enabled states
3. Frontend requests schedule during experiment setup
4. Schedule passed as prop to SparseRatingComponent
5. Setup completes before LiveKit connection

**Runtime Flow:**
1. ShowVideoComponent emits video start event with stateId and videoId
2. Backend activates schedule for that state+video combination
3. Frontend tracks video time locally
4. At pause threshold, frontend shows modal
5. Participant responds, frontend emits response event
6. Backend records response
7. Video resumes (optionally with seek-back)

### Synchronization

**Multi-Participant Mode:**
- Schedule shared across all participants in room
- Video synchronization handled by sync socket (separate from sparse rating)
- Pause detection happens on each participant independently
- All participants see modal at same video time
- Responses collected independently per participant

**Single-Participant Mode:**
- No sync socket created
- Schedule still loaded for consistency
- Pause detection purely local
- Simpler flow without network coordination
