---
id: javascript-guide
title: JavaScript Guide
slug: /experimenters/api-access/javascript-guide
sidebar_position: 5
---

# JavaScript Guide for HyperStudy API

This guide provides complete, working examples for accessing HyperStudy data using JavaScript in both Node.js and browser environments.

## Prerequisites

### Node.js Installation

If using Node.js, install the `node-fetch` package:

```bash
npm install node-fetch dotenv
```

### Browser Usage

For browser environments, use the built-in `fetch` API (no installation needed).

### API Key Setup

Create a `.env` file for Node.js:

```bash
# .env
HYPERSTUDY_API_KEY=hst_live_your_api_key_here
HYPERSTUDY_BASE_URL=https://api.hyperstudy.io/api/v3
```

Add to `.gitignore`:
```bash
.env
```

**⚠️ Security Warning**: Never use API keys in browser JavaScript! Only use in Node.js server-side code.

## Quick Start

### Node.js Example

```javascript
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.HYPERSTUDY_API_KEY;
const BASE_URL = process.env.HYPERSTUDY_BASE_URL;

// Make your first request
const response = await fetch(
  `${BASE_URL}/data/events/room/your-room-id?limit=10`,
  {
    headers: {
      'X-API-Key': API_KEY
    }
  }
);

if (response.ok) {
  const result = await response.json();
  const events = result.data;

  console.log(`Retrieved ${events.length} events`);
  events.forEach(event => {
    console.log(`${event.onset}ms: ${event.componentType}`);
  });
} else {
  console.error(`Error: ${response.status} - ${await response.text()}`);
}
```

## Complete Examples

### Example 1: Download Events for One Participant

**Goal**: Fetch all events for a specific participant in a session.

```javascript
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Download all events for a participant in a specific session
 * @param {string} apiKey - Your HyperStudy API key
 * @param {string} participantId - Participant's ID
 * @param {string} roomId - Room/session ID
 * @returns {Promise<Array>} List of events
 */
async function downloadParticipantEvents(apiKey, participantId, roomId) {
  const baseUrl = 'https://api.hyperstudy.io/api/v3';

  const url = new URL(`${baseUrl}/data/events/participant/${participantId}`);
  url.searchParams.append('roomId', roomId);
  url.searchParams.append('sort', 'onset');
  url.searchParams.append('order', 'asc');

  const response = await fetch(url.toString(), {
    headers: {
      'X-API-Key': apiKey
    }
  });

  // Check for errors
  if (!response.ok) {
    console.error(`Error ${response.status}: ${await response.text()}`);
    return [];
  }

  const result = await response.json();

  // Check API status
  if (result.status !== 'success') {
    console.error(`API Error: ${result.error?.message}`);
    return [];
  }

  const events = result.data;
  const metadata = result.metadata;

  console.log(`Retrieved ${events.length} events`);
  console.log(`Experiment started at: ${metadata.processing.experimentStartedAt}`);
  console.log(`Total events available: ${metadata.pagination.total}`);

  return events;
}

// Usage
const events = await downloadParticipantEvents(
  process.env.HYPERSTUDY_API_KEY,
  'your-participant-id',
  'your-room-id'
);

// Analyze events
if (events.length > 0) {
  console.log('\nFirst 5 events:');
  events.slice(0, 5).forEach(event => {
    const onsetSec = (event.onset / 1000).toFixed(2);
    console.log(`  ${onsetSec.padStart(7)}s: ${event.componentType.padEnd(20)} - ${event.content}`);
  });
}
```

### Example 2: Download All Data Types in Parallel

**Goal**: Fetch events, recordings, chat, and ratings simultaneously using `Promise.all`.

```javascript
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Download all data types for a participant in parallel
 * @param {string} apiKey - Your HyperStudy API key
 * @param {string} participantId - Participant's ID
 * @param {string} roomId - Room/session ID
 * @returns {Promise<Object>} Object with all data types
 */
async function downloadAllParticipantData(apiKey, participantId, roomId) {
  const baseUrl = 'https://api.hyperstudy.io/api/v3';
  const headers = { 'X-API-Key': apiKey };

  const dataTypes = {
    events: 'events',
    recordings: 'recordings',
    chat: 'chat',
    continuousRatings: 'ratings/continuous',
    syncMetrics: 'sync'
  };

  console.log(`Downloading data for participant ${participantId}...`);

  // Create all fetch promises
  const fetchPromises = Object.entries(dataTypes).map(async ([key, endpoint]) => {
    const url = new URL(`${baseUrl}/data/${endpoint}/participant/${participantId}`);
    url.searchParams.append('roomId', roomId);

    try {
      const response = await fetch(url.toString(), { headers });

      if (response.ok) {
        const result = await response.json();
        console.log(`  ✓ ${key}: ${result.data.length} records`);
        return [key, result.data];
      } else {
        console.log(`  ✗ ${key}: Error ${response.status}`);
        return [key, []];
      }
    } catch (error) {
      console.log(`  ✗ ${key}: Request failed - ${error.message}`);
      return [key, []];
    }
  });

  // Wait for all requests to complete
  const results = await Promise.all(fetchPromises);

  // Convert array of [key, value] pairs to object
  const allData = Object.fromEntries(results);

  console.log('\nDownload complete!');
  return allData;
}

// Usage
const allData = await downloadAllParticipantData(
  process.env.HYPERSTUDY_API_KEY,
  'your-participant-id',
  'your-room-id'
);

// Summary
console.log('\nData Summary:');
for (const [dataType, records] of Object.entries(allData)) {
  if (records.length > 0) {
    console.log(`  ${dataType}: ${records.length} records`);

    if (dataType === 'events' && records.length > 0) {
      const first = records[0];
      const last = records[records.length - 1];
      const duration = (last.onset - first.onset) / 1000;
      console.log(`    Duration: ${duration.toFixed(1)} seconds`);
    }
  }
}
```

### Example 3: Export to CSV (Browser Download)

**Goal**: Download events and trigger a CSV download in the browser.

```javascript
/**
 * Convert data array to CSV string
 * @param {Array} data - Array of objects
 * @returns {string} CSV string
 */
function toCSV(data) {
  if (data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Build CSV rows
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';

      // Escape and quote if necessary
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
      }
      return stringValue;
    });

    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Trigger browser download of CSV file
 * @param {Array} data - Data to export
 * @param {string} filename - Output filename
 */
function downloadCSV(data, filename) {
  const csv = toCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Usage (browser environment)
async function exportEventsToCSV(apiKey, roomId) {
  const response = await fetch(
    `https://api.hyperstudy.io/api/v3/data/events/room/${roomId}`,
    {
      headers: { 'X-API-Key': apiKey }
    }
  );

  if (response.ok) {
    const result = await response.json();
    const events = result.data;

    console.log(`Retrieved ${events.length} events`);

    // Add computed columns
    const enrichedEvents = events.map(event => ({
      ...event,
      onset_sec: event.onset / 1000
    }));

    // Trigger download
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(enrichedEvents, `events_${timestamp}.csv`);

    console.log('CSV download triggered!');
  } else {
    console.error(`Error: ${response.status}`);
  }
}
```

### Example 4: Download with Pagination

**Goal**: Download all events for an experiment, handling pagination for large datasets.

```javascript
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Download all events for an experiment using pagination
 * @param {string} apiKey - Your HyperStudy API key
 * @param {string} experimentId - Experiment ID
 * @returns {Promise<Array>} All events from all pages
 */
async function downloadExperimentAllPages(apiKey, experimentId) {
  const baseUrl = 'https://api.hyperstudy.io/api/v3';
  const headers = { 'X-API-Key': apiKey };

  let allEvents = [];
  let offset = 0;
  const limit = 1000;
  let hasMore = true;

  console.log(`Downloading all events for experiment ${experimentId}...`);

  while (hasMore) {
    // Build URL with pagination parameters
    const url = new URL(`${baseUrl}/data/events/experiment/${experimentId}`);
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);
    url.searchParams.append('sort', 'onset');
    url.searchParams.append('order', 'asc');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${await response.text()}`);
      break;
    }

    const result = await response.json();

    // Add events from this page
    const pageEvents = result.data;
    allEvents = allEvents.concat(pageEvents);

    // Check pagination
    const pagination = result.metadata.pagination;
    const total = pagination.total;
    hasMore = pagination.hasMore || false;

    console.log(`  Downloaded ${allEvents.length}/${total} events (${(allEvents.length/total*100).toFixed(1)}%)`);

    // Update offset for next page
    if (hasMore) {
      offset = pagination.nextOffset || offset + limit;
    } else {
      console.log('  All pages downloaded!');
    }
  }

  console.log(`\nTotal: ${allEvents.length} events downloaded`);
  return allEvents;
}

// Usage
const allEvents = await downloadExperimentAllPages(
  process.env.HYPERSTUDY_API_KEY,
  'your-experiment-id'
);

// Analyze complete dataset
if (allEvents.length > 0) {
  // Calculate statistics
  const participants = new Set(allEvents.map(e => e.participantId));
  const sessions = new Set(allEvents.map(e => e.sessionId));

  const onsetTimes = allEvents.map(e => e.onset / 1000);
  const maxOnset = Math.max(...onsetTimes);

  console.log('\nDataset Summary:');
  console.log(`  Total events: ${allEvents.length}`);
  console.log(`  Participants: ${participants.size}`);
  console.log(`  Sessions: ${sessions.size}`);
  console.log(`  Duration: ${maxOnset.toFixed(1)} seconds`);

  // Export to JSON file (Node.js)
  const fs = await import('fs');
  const outputFile = `experiment_${experimentId}_all_events.json`;
  fs.writeFileSync(outputFile, JSON.stringify(allEvents, null, 2));
  console.log(`\nSaved to ${outputFile}`);
}
```

## Reusable Client Class

For production use, create a reusable client class:

```javascript
// hyperstudyClient.js

export class HyperStudyClient {
  constructor(apiKey, baseUrl = 'https://api.hyperstudy.io/api/v3') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.headers = {
      'X-API-Key': apiKey
    };
  }

  async getEvents(scope, scopeId, params = {}) {
    return this._request(`data/events/${scope}/${scopeId}`, params);
  }

  async getRecordings(scope, scopeId, params = {}) {
    return this._request(`data/recordings/${scope}/${scopeId}`, params);
  }

  async getAllParticipantData(participantId, roomId) {
    const [events, recordings, chat] = await Promise.all([
      this.getEvents('participant', participantId, { roomId }),
      this.getRecordings('participant', participantId, { roomId }),
      this._request(`data/chat/participant/${participantId}`, { roomId })
    ]);

    return {
      events: events || [],
      recordings: recordings || [],
      chat: chat || []
    };
  }

  async _request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), { headers: this.headers });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${await response.text()}`);
      return null;
    }

    const result = await response.json();
    return result.status === 'success' ? result.data : null;
  }
}

// Usage
import dotenv from 'dotenv';
dotenv.config();

const client = new HyperStudyClient(process.env.HYPERSTUDY_API_KEY);

const events = await client.getEvents('room', 'your-room-id');
console.log(`Retrieved ${events.length} events`);
```

## Error Handling

### Robust Error Handling Pattern

```javascript
async function makeRobustRequest(url, headers, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();

        if (result.status === 'error') {
          console.error(`API Error [${result.error.code}]: ${result.error.message}`);
          if (result.error.details) {
            console.error('Details:', result.error.details);
          }
          return null;
        }

        return result;
      }

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        console.log(`Rate limited. Waiting ${retryAfter}s...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      console.error(`HTTP Error: ${response.status}`);
      return null;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Timeout on attempt ${attempt + 1}/${maxRetries}`);
      } else {
        console.error(`Request failed: ${error.message}`);
      }

      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error('Max retries exceeded');
  return null;
}
```

## Common Patterns

### Real-time Monitoring

```javascript
async function monitorExperiment(apiKey, experimentId, intervalSeconds = 30) {
  let lastCount = 0;

  while (true) {
    const response = await fetch(
      `https://api.hyperstudy.io/api/v3/data/events/experiment/${experimentId}?limit=1`,
      { headers: { 'X-API-Key': apiKey } }
    );

    if (response.ok) {
      const result = await response.json();
      const currentCount = result.metadata.pagination.total;

      if (currentCount > lastCount) {
        const newEvents = currentCount - lastCount;
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${newEvents} new events (total: ${currentCount})`);
        lastCount = currentCount;
      }
    }

    await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
  }
}
```

## Troubleshooting

### Common Issues

**Module not found (Node.js)**:
```bash
npm install node-fetch dotenv
```

**Using API key in browser**:
- **Don't!** API keys should only be used server-side
- Use a backend API that you control

**CORS errors in browser**:
- API keys must be used server-side only
- Set up a Node.js backend to proxy requests

**ESM import errors**:
- Use `.mjs` file extension
- Or add `"type": "module"` to `package.json`

## Next Steps

- **Learn about other languages**: [Python](./python-guide.md) | [R](./r-guide.md)
- **Understand all endpoints**: [Data Types & Endpoints](./data-types.md)
- **Manage your keys**: [API Key Management](./api-keys.md)
