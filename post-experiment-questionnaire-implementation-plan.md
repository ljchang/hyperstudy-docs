# Post-Experiment Questionnaire Feature - Implementation Plan

**Created**: 2025-10-30
**Status**: Planning
**Target Release**: TBD

## Overview

This document outlines the implementation plan for adding a post-experiment questionnaire feature to HyperStudy. This feature allows experimenters to collect participant responses after the main experiment completes, but before the final completion screen or Prolific redirect.

## User Requirements

### Core Requirements

- **Positioning**: Questionnaire appears after all experiment states complete, before Prolific/dashboard redirect
- **No Synchronization**: Each participant completes at their own pace (no cross-participant sync)
- **Page-based Layout**: Similar to consent forms and instructions pages with markdown support
- **Multiple Question Types**: Support text inputs, multiple choice, rating scales, ranking, and audio recording
- **Configurable Navigation**: Option to allow/disallow backward navigation through pages
- **Optional Feature**: Can be enabled/disabled per experiment
- **Required/Optional**: Configurable whether completion is mandatory
- **Validation**: Required field validation (no comprehension checks)
- **Routing**: Similar to Lobby, Waiting Room, Experiment, there should be a unique route for Questionnaires

### User Responses

Based on clarification questions:

- ✅ No comprehension checks (only data collection)
- ✅ Back navigation: Configurable, default to allowed
- ✅ Completion: Configurable per experiment
- ✅ Question types: Text (short/long), Multiple choice, VAS/Likert ratings, Ranking, Audio recording

---

## Architecture Overview

### System Components Affected

#### Backend

- **Experiment State Server** (`backend/src/experiment/experimentStateServer.js`)
- **Data Collection Service** (`backend/src/services/dataCollectionService.js`)
- **API Routes**: Extend existing data API for questionnaire responses

#### Frontend - Participant View

- **Experiment Runner** (`frontend/src/components/experiment/ExperimentRunner.svelte`)
- **New Components**:
  - `PostExperimentQuestionnaireDisplay.svelte`
  - `QuestionnaireQuestionDisplay.svelte`

#### Frontend - Designer View

- **Experiment Designer** (`frontend/src/components/admin/experiment/ExperimentDesigner.svelte`)
- **New Component**: `PostExperimentQuestionnaire.svelte`
- **Reuse**: `QuestionBuilder.svelte` from Instructions

#### Frontend - Data Management

- **Data Management V3** (`frontend/src/components/dataManagement/DataManagementV3.svelte`)
- **Data Export Service** (`frontend/src/lib/services/dataExportService.js`)

---

## Data Model

### Firebase Schema Extension

Add to experiments collection:

```typescript
interface PostExperimentQuestionnaire {
  enabled: boolean; // Feature toggle
  required: boolean; // Can participants skip?
  allowBackNavigation: boolean; // Can they edit previous pages?
  pages: QuestionnairePageConfig[];
}

interface QuestionnairePageConfig {
  id: string; // Unique page ID
  title: string; // Page title
  content: string; // Markdown content for instructions
  questions: QuestionConfig[];
}

interface QuestionConfig {
  id: string; // Unique question ID
  type: QuestionType;
  question: string; // Question text
  required: boolean;
  config: QuestionTypeConfig; // Type-specific configuration
}

type QuestionType =
  | "text-short"
  | "text-long"
  | "multiple-choice"
  | "vas-rating"
  | "likert"
  | "ranking"
  | "audio-recording";

// Type-specific configs
interface TextConfig {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

interface MultipleChoiceConfig {
  options: string[];
  allowOther?: boolean;
}

interface VasRatingConfig {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  step?: number;
}

interface LikertConfig {
  scale: number; // e.g., 5, 7
  minLabel?: string;
  maxLabel?: string;
  labels?: string[]; // Optional labels for each point
}

interface RankingConfig {
  items: string[];
}

interface AudioRecordingConfig {
  maxDuration?: number; // Max seconds
  minDuration?: number; // Min seconds
}
```

### Data Storage

Store responses in existing Firebase `responses` collection:

```typescript
interface QuestionnaireResponse {
  eventType: "questionnaire.response";
  category: "post_experiment";
  experimentId: string;
  participantId: string;
  roomId?: string;
  timestamp: string; // ISO 8601
  value: {
    questionId: string;
    questionText: string;
    questionType: QuestionType;
    answer: any; // Type depends on question type
    pageIndex: number;
    pageTitle: string;
    pageId: string;
    responseTime: number; // Milliseconds
  };
}

// Completion event
interface QuestionnaireCompletion {
  eventType: "questionnaire.completed";
  category: "post_experiment";
  experimentId: string;
  participantId: string;
  timestamp: string;
  value: {
    totalPages: number;
    totalQuestions: number;
    totalResponseTime: number; // Total time in ms
  };
}
```

---

## Implementation Phases

## Phase 1: Backend Data Model & API (2-3 days)

### 1.1 Firebase Schema

- [ ] Add `postExperimentQuestionnaire` field to experiment documents
- [ ] Create validation schema for questionnaire configuration
- [ ] Test schema with sample data

### 1.2 Data Collection

- [ ] Extend `dataCollectionService` to handle questionnaire events
- [ ] Add event types: `questionnaire.response`, `questionnaire.completed`
- [ ] Test data persistence

### 1.3 API Routes

Extend existing data API (no new route files needed):

**GET** `/api/v3/data/questionnaire-responses/experiment/:experimentId`

- Query parameters: `participantId`, `startDate`, `endDate`
- Returns: Array of questionnaire responses
- Permissions: Experimenter/admin access only

**GET** `/api/v3/data/questionnaire-responses/participant/:participantId`

- Query parameters: `experimentId`, `roomId`
- Returns: Array of responses for specific participant
- Permissions: Participant (own data) or experimenter/admin

**Implementation Notes**:

- Leverage existing event filtering in data service
- Use category filter: `'post_experiment'`
- Include in existing CSV export functionality

---

## Phase 2: Frontend - Participant Experience (3-4 days)

### 2.1 Create Questionnaire Display Component

**File**: `frontend/src/components/participant/PostExperimentQuestionnaireDisplay.svelte`

**Component Structure**:

```svelte
<script>
  // Props
  const {
    experiment,
    onComplete
  } = $props();

  // Local state
  let currentPageIndex = $state(0);
  let answers = $state({});  // questionId -> answer
  let startTimes = $state({});  // questionId -> timestamp

  // Derived
  const config = $derived(experiment.postExperimentQuestionnaire);
  const currentPage = $derived(config.pages[currentPageIndex]);
  const isLastPage = $derived(currentPageIndex === config.pages.length - 1);
  const canGoBack = $derived(config.allowBackNavigation && currentPageIndex > 0);
  const canContinue = $derived(validateCurrentPage());
</script>
```

**Key Features**:

- Full-page card layout (match `ConsentFormDisplay.svelte` styling)
- Markdown content rendering using existing `processContent()` function
- Multi-page navigation with progress dots
- Required field validation before allowing navigation
- Auto-save responses to Firebase on each answer
- Time tracking per question

**Layout Inspiration**: Based on `InstructionsDisplay.svelte`

- Dark theme (#1a1a1a background, #2a2a2a card)
- Scrollable content area
- Fixed navigation footer
- Progress indicator dots

### 2.2 Create Question Display Component

**File**: `frontend/src/components/participant/QuestionnaireQuestionDisplay.svelte`

**Component Structure**:

```svelte
<script>
  const {
    question,
    answer = $bindable(),
    onAnswerChange
  } = $props();

  // Render appropriate input component based on question.type
</script>

{#if question.type === 'text-short' || question.type === 'text-long'}
  <TextInputComponent
    config={...}
    bind:value={answer}
    oncomplete={onAnswerChange}
  />
{:else if question.type === 'multiple-choice'}
  <MultipleChoiceComponent ... />
{:else if question.type === 'vas-rating'}
  <VasRatingComponent ... />
{:else if question.type === 'ranking'}
  <RankingComponent ... />
{:else if question.type === 'audio-recording'}
  <AudioRecordingComponent ... />
{/if}
```

**Reuse Existing Components**:

- ✅ `TextInputComponent.svelte` - Short/long text
- ✅ `MultipleChoiceComponent.svelte` - Single selection
- ✅ `VasRatingComponent.svelte` - Continuous ratings
- ✅ `RankingComponent.svelte` - Rank ordering
- ✅ `AudioRecordingComponent.svelte` - Audio responses

**Adaptation Notes**:

- Remove state transition logic (not needed here)
- Focus on data capture only
- Pass through validation rules from question config

### 2.3 Integrate with ExperimentRunner

**File**: `frontend/src/components/experiment/ExperimentRunner.svelte`

**Modify Lines ~438-465** (completion flow):

```javascript
// Current flow (simplified):
// 1. All states complete
// 2. Mark session completed
// 3. Check if Prolific → show ProlificCompletion
// 4. Otherwise → redirect to dashboard after delay

// New flow:
// 1. All states complete
// 2. Check if postExperimentQuestionnaire.enabled
// 3a. If YES → showPostQuestionnaire = true
// 3b. Display PostExperimentQuestionnaireDisplay
// 3c. On questionnaire completion → proceed to step 4
// 4. Mark session completed
// 5. Check if Prolific → show ProlificCompletion
// 6. Otherwise → redirect to dashboard after delay
```

**Implementation**:

```svelte
<script>
  let showPostQuestionnaire = $state(false);
  let questionnaireComplete = $state(false);

  async function handleStateCompletion() {
    // Check if questionnaire is enabled
    if (experimentDataForStart?.postExperimentQuestionnaire?.enabled) {
      showPostQuestionnaire = true;
      return; // Don't proceed to completion yet
    }

    // No questionnaire, proceed to normal completion
    await handleExperimentComplete();
  }

  async function handleQuestionnaireComplete() {
    showPostQuestionnaire = false;
    questionnaireComplete = true;
    await handleExperimentComplete();
  }
</script>

<!-- Add to template -->
{#if showPostQuestionnaire}
  <PostExperimentQuestionnaireDisplay
    experiment={experimentDataForStart}
    onComplete={handleQuestionnaireComplete}
  />
{:else if showProlificCompletion}
  <ProlificCompletion ... />
{:else}
  <!-- Normal experiment UI -->
{/if}
```

---

## Phase 3: Frontend - Designer Experience (3-4 days)

### 3.1 Create Questionnaire Designer Component

**File**: `frontend/src/components/admin/experiment/PostExperimentQuestionnaire.svelte`

**Component Structure**: Similar to `Instructions.svelte`

```svelte
<script>
  const {
    experiment = {},
    onQuestionnaireChange = null
  } = $props();

  let editingPageIndex = $state(0);
  let showPageManager = $state(false);

  const config = $derived(experiment.postExperimentQuestionnaire || {
    enabled: false,
    required: true,
    allowBackNavigation: true,
    pages: []
  });
</script>

<!-- Layout -->
<div class="questionnaire-designer">
  <!-- Enable/Disable Toggle -->
  <label>
    <input type="checkbox" bind:checked={config.enabled} />
    Enable Post-Experiment Questionnaire
  </label>

  {#if config.enabled}
    <!-- Configuration Options -->
    <div class="config-section">
      <label>
        <input type="checkbox" bind:checked={config.required} />
        Required (participants must complete)
      </label>

      <label>
        <input type="checkbox" bind:checked={config.allowBackNavigation} />
        Allow participants to navigate back and edit answers
      </label>
    </div>

    <!-- Page Manager -->
    <div class="page-manager">
      <h3>Questionnaire Pages</h3>
      <button onclick={addPage}>Add Page</button>

      <!-- Page List with reordering -->
      {#each config.pages as page, index}
        <div class="page-item">
          <button onclick={() => editingPageIndex = index}>
            {page.title || `Page ${index + 1}`}
          </button>
        </div>
      {/each}
    </div>

    <!-- Page Editor -->
    {#if config.pages[editingPageIndex]}
      <div class="page-editor">
        <input
          type="text"
          bind:value={config.pages[editingPageIndex].title}
          placeholder="Page Title"
        />

        <textarea
          bind:value={config.pages[editingPageIndex].content}
          placeholder="Page instructions (Markdown supported)"
        />

        <!-- Question Builder -->
        <QuestionBuilder
          bind:questions={config.pages[editingPageIndex].questions}
        />
      </div>
    {/if}
  {/if}
</div>
```

**Key Features**:

- Enable/disable toggle
- Configuration options (required, allowBackNavigation)
- Multi-page management (add, remove, reorder)
- Markdown editor for page content
- Integrated question builder
- Preview functionality
- Validation warnings

### 3.2 Reuse Question Builder

**File**: `frontend/src/components/admin/experiment/QuestionBuilder.svelte` (existing)

**Required Modifications**:

- Ensure it supports all question types:
  - ✅ text-short, text-long
  - ✅ multiple-choice
  - ✅ true-false (not needed for questionnaire)
  - ✅ numeric (map to vas-rating)
  - ➕ vas-rating (add if not present)
  - ➕ likert (add if not present)
  - ➕ ranking (add if not present)
  - ➕ audio-recording (add if not present)

**New Question Type Configs**:

```svelte
<!-- VAS Rating Config -->
{#if question.type === 'vas-rating'}
  <div class="config-panel">
    <label>
      Minimum Value: <input type="number" bind:value={question.config.min} />
    </label>
    <label>
      Maximum Value: <input type="number" bind:value={question.config.max} />
    </label>
    <label>
      Minimum Label: <input type="text" bind:value={question.config.minLabel} />
    </label>
    <label>
      Maximum Label: <input type="text" bind:value={question.config.maxLabel} />
    </label>
  </div>
{/if}

<!-- Similar panels for likert, ranking, audio-recording -->
```

### 3.3 Add Tab to Experiment Settings

**File**: `frontend/src/components/admin/experiment/ExperimentDesigner.svelte`

**Modify Lines 502-510** (TabGroup configuration):

```javascript
<TabGroup
  tabs={[
    { id: "metadata", label: "General" },
    { id: "roles", label: "Roles" },
    { id: "variables", label: "Variables" },
    { id: "permissions", label: "Permissions" },
    { id: "recruitment", label: "Recruitment" },
    { id: "consent", label: "Consent" },
    { id: "instructions", label: "Instructions" },
    { id: "postQuestionnaire", label: "Post-Experiment" }, // NEW
  ]}
  activeTab={selectedTab}
  onTabChange={(tabId) => (selectedTab = tabId)}
/>
```

**Add to tab content section (after line 550)**:

```svelte
{:else if selectedTab === 'postQuestionnaire'}
  <PostExperimentQuestionnaire
    experiment={autoSave.experiment}
    onQuestionnaireChange={(event) => handleMetadataChange(event.detail.field, event.detail.value)}
  />
```

---

## Phase 4: Data Management & Analytics (2 days)

### 4.1 Extend Data Management UI

**File**: `frontend/src/components/dataManagement/DataManagementV3.svelte`

**Add New Section**:

```svelte
<!-- After existing data sections -->
<section class="data-section">
  <h2>Post-Experiment Questionnaire Responses</h2>

  <div class="filters">
    <select bind:value={selectedExperiment}>
      <option value="">All Experiments</option>
      {#each experiments as exp}
        <option value={exp.id}>{exp.name}</option>
      {/each}
    </select>

    <input type="date" bind:value={startDate} />
    <input type="date" bind:value={endDate} />

    <button onclick={loadQuestionnaireData}>Load Data</button>
    <button onclick={exportQuestionnaireData}>Export CSV</button>
  </div>

  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th>Participant ID</th>
          <th>Page</th>
          <th>Question</th>
          <th>Answer</th>
          <th>Response Time</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {#each questionnaireResponses as response}
          <tr>
            <td>{response.participantId}</td>
            <td>{response.value.pageTitle}</td>
            <td>{response.value.questionText}</td>
            <td>{formatAnswer(response.value.answer)}</td>
            <td>{(response.value.responseTime / 1000).toFixed(1)}s</td>
            <td>{new Date(response.timestamp).toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
```

**Data Loading Function**:

```javascript
async function loadQuestionnaireData() {
  const token = await getUserToken();
  const params = new URLSearchParams();
  if (selectedExperiment) params.append("experimentId", selectedExperiment);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await fetch(
    `/api/v3/data/questionnaire-responses?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  questionnaireResponses = await response.json();
}
```

### 4.2 Data Export Enhancement

**File**: `frontend/src/lib/services/dataExportService.js`

**Add Export Function**:

```javascript
async function exportQuestionnaireResponses(experimentId, options = {}) {
  const responses = await fetchQuestionnaireResponses(experimentId, options);

  // Convert to CSV format
  const rows = responses.map((r) => ({
    experiment_id: r.experimentId,
    participant_id: r.participantId,
    room_id: r.roomId || "",
    page_index: r.value.pageIndex,
    page_title: r.value.pageTitle,
    page_id: r.value.pageId,
    question_id: r.value.questionId,
    question_text: r.value.questionText,
    question_type: r.value.questionType,
    answer: formatAnswerForExport(r.value.answer, r.value.questionType),
    response_time_ms: r.value.responseTime,
    timestamp: r.timestamp,
  }));

  return convertToCSV(rows);
}

function formatAnswerForExport(answer, questionType) {
  switch (questionType) {
    case "ranking":
      return answer.join(", ");
    case "multiple-choice":
      return answer;
    case "audio-recording":
      return answer.url || answer.filename;
    default:
      return String(answer);
  }
}
```

---

## Phase 5: Additional Features & Polish (2-3 days)

### 5.1 Validation & User Experience

**Required Field Validation**:

```javascript
function validateCurrentPage() {
  const page = config.pages[currentPageIndex];

  for (const question of page.questions) {
    if (question.required && !answers[question.id]) {
      return false;
    }

    // Type-specific validation
    if (question.type === "text-short" || question.type === "text-long") {
      const answer = answers[question.id];
      const { minLength, maxLength } = question.config;

      if (minLength && answer.length < minLength) return false;
      if (maxLength && answer.length > maxLength) return false;
    }
  }

  return true;
}
```

**Visual Indicators**:

- Progress dots showing completed pages (filled vs outline)
- Question progress within page (X of Y answered)
- Character count for text inputs with limits
- Real-time validation feedback (not blocking)

**Time Tracking**:

```javascript
function handleAnswerChange(questionId, answer) {
  // Record start time on first interaction
  if (!startTimes[questionId]) {
    startTimes[questionId] = Date.now();
  }

  // Update answer
  answers[questionId] = answer;

  // Auto-save to Firebase
  const responseTime = Date.now() - startTimes[questionId];
  recordQuestionnaireResponse(questionId, answer, responseTime);
}
```

### 5.2 Preview Mode

**Add to Designer Component**:

```svelte
<button onclick={openPreview} class="preview-button">
  Preview Questionnaire
</button>

{#if showPreview}
  <div class="preview-modal">
    <div class="preview-content">
      <PostExperimentQuestionnaireDisplay
        experiment={{ postExperimentQuestionnaire: config }}
        onComplete={() => showPreview = false}
        previewMode={true}
      />
    </div>
  </div>
{/if}
```

**Preview Features**:

- Shows questionnaire exactly as participants see it
- Uses mock data for testing
- Doesn't save responses
- Validates configuration
- Shows warnings for incomplete setup

### 5.3 Templates (Optional Enhancement)

**Pre-built Questionnaire Templates**:

```javascript
const QUESTIONNAIRE_TEMPLATES = {
  demographics: {
    name: "Demographics",
    description: "Collect basic demographic information",
    pages: [{
      title: "Demographics",
      content: "Please provide some basic information about yourself.",
      questions: [
        { type: 'text-short', question: 'What is your age?', ... },
        { type: 'multiple-choice', question: 'What is your gender?', ... },
        // ...
      ]
    }]
  },

  satisfaction: {
    name: "Post-Study Satisfaction",
    description: "Gather feedback about the study experience",
    pages: [{
      title: "Study Feedback",
      content: "Please rate your experience in this study.",
      questions: [
        { type: 'likert', question: 'Overall, how satisfied were you...', ... },
        { type: 'text-long', question: 'What could be improved?', ... },
        // ...
      ]
    }]
  },

  nasa_tlx: {
    name: "NASA-TLX Workload Assessment",
    description: "Standard workload assessment instrument",
    pages: [/* NASA-TLX scales */]
  }
};
```

**Template Selector UI**:

```svelte
<div class="template-selector">
  <h4>Start from Template</h4>
  <div class="template-grid">
    {#each Object.entries(QUESTIONNAIRE_TEMPLATES) as [key, template]}
      <button onclick={() => applyTemplate(key)}>
        <h5>{template.name}</h5>
        <p>{template.description}</p>
      </button>
    {/each}
  </div>
</div>
```

---

## Testing Strategy

### Unit Tests

**Backend Tests**:

```javascript
// backend/src/__tests__/questionnaireDataCollection.test.js
describe("Questionnaire Data Collection", () => {
  test("records questionnaire response event", async () => {
    const response = await dataCollectionService.recordEvent({
      eventType: "questionnaire.response",
      category: "post_experiment",
      value: { questionId: "q1", answer: "test" },
    });

    expect(response).toBeDefined();
    // Verify stored in Firebase
  });

  test("records questionnaire completion event", async () => {
    // ...
  });
});
```

**Frontend Tests**:

```javascript
// frontend/src/components/participant/__tests__/PostExperimentQuestionnaireDisplay.test.js
describe("PostExperimentQuestionnaireDisplay", () => {
  test("renders all pages", () => {
    // ...
  });

  test("validates required fields", () => {
    // ...
  });

  test("prevents navigation when validation fails", () => {
    // ...
  });

  test("allows back navigation when enabled", () => {
    // ...
  });

  test("prevents back navigation when disabled", () => {
    // ...
  });
});
```

### Integration Tests

```javascript
describe("Questionnaire Integration", () => {
  test("complete flow from experiment to questionnaire", async () => {
    // 1. Complete all experiment states
    // 2. Verify questionnaire appears
    // 3. Fill out questionnaire
    // 4. Submit
    // 5. Verify completion screen appears
  });

  test("questionnaire data persists to Firebase", async () => {
    // 1. Complete questionnaire
    // 2. Query Firebase for responses
    // 3. Verify all answers recorded correctly
  });

  test("Prolific redirect works after questionnaire", async () => {
    // 1. Set up Prolific-enabled experiment
    // 2. Complete questionnaire
    // 3. Verify ProlificCompletion screen appears
    // 4. Verify correct redirect URL
  });
});
```

### E2E Tests

```javascript
// Test full participant journey
test("participant completes experiment with questionnaire", async () => {
  // 1. Join experiment
  // 2. Complete all states
  // 3. Fill out questionnaire (3 pages)
  // 4. Submit final page
  // 5. Verify completion
  // 6. Verify redirect to dashboard
});

// Test designer workflow
test("experimenter creates questionnaire", async () => {
  // 1. Create new experiment
  // 2. Navigate to Post-Experiment tab
  // 3. Enable questionnaire
  // 4. Add pages and questions
  // 5. Preview questionnaire
  // 6. Save experiment
  // 7. Verify configuration persists
});
```

---

## Files to Create

### New Files

#### Backend

No new files - extend existing services

#### Frontend - Participant View

- `frontend/src/components/participant/PostExperimentQuestionnaireDisplay.svelte`
- `frontend/src/components/participant/QuestionnaireQuestionDisplay.svelte`

#### Frontend - Designer View

- `frontend/src/components/admin/experiment/PostExperimentQuestionnaire.svelte`

#### Tests

- `backend/src/__tests__/questionnaireDataCollection.test.js`
- `frontend/src/components/participant/__tests__/PostExperimentQuestionnaireDisplay.test.js`
- `frontend/src/components/admin/experiment/__tests__/PostExperimentQuestionnaire.test.js`

### Files to Modify

#### Frontend

- `frontend/src/components/experiment/ExperimentRunner.svelte` - Add questionnaire phase
- `frontend/src/components/admin/experiment/ExperimentDesigner.svelte` - Add tab
- `frontend/src/components/admin/experiment/QuestionBuilder.svelte` - Add question types
- `frontend/src/components/dataManagement/DataManagementV3.svelte` - Add data section
- `frontend/src/lib/services/dataExportService.js` - Add export function

#### Backend (Minimal Changes)

- Extend existing data API routes to filter by category='post_experiment'

---

## Suggested Future Enhancements

### High Priority (Include in Initial Implementation)

- ✅ Time tracking per question
- ✅ Required field validation
- ✅ Preview mode in designer
- ✅ Character limits for text inputs

### Medium Priority (Next Iteration)

- 🔄 Questionnaire templates
- 🔄 Conditional question display (show Q2 if Q1 = X)
- 🔄 Answer randomization (for multiple choice options)
- 🔄 Question groups/sections within pages
- 🔄 Progress saving (auto-save in case of disconnection)

### Future Enhancements

- 📋 Branching logic (skip to page based on answer)
- 📋 Multi-language support
- 📋 Attention check questions
- 📋 Matrix questions (multiple sub-questions, same scale)
- 📋 File upload questions
- 📋 Piped text (reference previous answers in questions)

---

## Documentation Updates

### New Documentation Files

**Primary Documentation**:

- `docs/docs/experimenters/experiment-design/post-experiment-questionnaire.md`
  - Overview and use cases
  - Configuration guide
  - Question type reference
  - Best practices
  - Examples

**Updates to Existing Files**:

- `docs/docs/experimenters/experiment-design/experiment-states.md`

  - Add section on post-experiment questionnaire
  - Update completion flow diagram

- `docs/docs/experimenters/data-collection/data-types.md`

  - Add questionnaire response data type
  - Schema documentation

- `docs/docs/experimenters/data-collection/exporting-data.md`
  - Add questionnaire data export instructions

### Example Documentation Outline

```markdown
# Post-Experiment Questionnaire

## Overview

The post-experiment questionnaire allows you to collect participant responses after the main experiment completes.

## When to Use

- Collect demographic information
- Gather post-experiment feedback
- Assess participant state (mood, fatigue, etc.)
- Validate experimental manipulations
- Collect qualitative impressions

## Configuration

### Enabling the Questionnaire

1. Go to Experiment Designer
2. Click "Post-Experiment" tab
3. Toggle "Enable Post-Experiment Questionnaire"

### Settings

- **Required**: Check to require completion before study ends
- **Allow Back Navigation**: Allow participants to edit previous answers

### Creating Pages

...

## Question Types

...

## Data Analysis

...
```

---

## Estimated Effort

| Phase     | Task                         | Estimated Time             |
| --------- | ---------------------------- | -------------------------- |
| 1         | Backend Data Model & API     | 2-3 days                   |
| 2         | Frontend Participant View    | 3-4 days                   |
| 3         | Frontend Designer View       | 3-4 days                   |
| 4         | Data Management UI           | 2 days                     |
| 5         | Additional Features & Polish | 2-3 days                   |
| 6         | Testing                      | 2-3 days                   |
| 7         | Documentation                | 1 day                      |
| **Total** |                              | **15-20 days** (3-4 weeks) |

### Breakdown by Role

- **Software Engineer**: 12-15 days
- **Test Engineer**: 2-3 days
- **Technical Writer**: 1 day
- **Code Reviewer**: 1-2 days (ongoing)

---

## Success Criteria

### Functional Requirements

- ✅ Questionnaire appears after experiment completes
- ✅ Supports all specified question types
- ✅ Required field validation works
- ✅ Back navigation configurable
- ✅ Data persists to Firebase correctly
- ✅ Prolific integration unaffected
- ✅ Data visible in management UI
- ✅ CSV export includes questionnaire data

### Non-Functional Requirements

- ✅ Mobile responsive (works on phones/tablets)
- ✅ Accessible (keyboard navigation, screen readers)
- ✅ Performance: < 2s load time for questionnaire
- ✅ No data loss (auto-save responses)
- ✅ Works offline (with queued sync)

### User Experience

- ✅ Clear progress indication
- ✅ Helpful validation messages
- ✅ Smooth transitions between pages
- ✅ Preview mode helps experimenters validate design
- ✅ Designer UI intuitive (similar to instructions)

---

## Risk Mitigation

### Technical Risks

**Risk**: Audio recording questions may have upload issues

- **Mitigation**: Reuse existing AudioRecordingComponent which has proven reliability
- **Fallback**: Provide text alternative for audio questions

**Risk**: Large questionnaires may cause performance issues

- **Mitigation**: Implement pagination, lazy load questions
- **Limit**: Suggest max 50 questions per experiment

**Risk**: Data loss if participant closes browser

- **Mitigation**: Auto-save each answer immediately
- **Recovery**: Store in localStorage as backup

### User Experience Risks

**Risk**: Participants abandon study due to long questionnaire

- **Mitigation**: Show progress clearly, allow saving/resuming
- **Guidance**: Document best practices (keep < 10 minutes)

**Risk**: Experimenters create confusing questionnaires

- **Mitigation**: Provide templates and examples
- **Preview**: Preview mode to test before launch

---

## Rollout Plan

### Phase 1: Internal Testing (Week 1)

- Deploy to development environment
- Internal QA testing
- Fix critical bugs

### Phase 2: Beta Testing (Week 2)

- Select 3-5 experimenters for early access
- Gather feedback on usability
- Iterate based on feedback

### Phase 3: Production Release (Week 3)

- Deploy to production
- Monitor for issues
- Provide user support

### Phase 4: Post-Release (Week 4+)

- Collect user feedback
- Plan iteration 2 features
- Update documentation based on common questions

---

## Appendix

### Reference Files

**Key Files for Implementation**:

- Experiment Runner: `frontend/src/components/experiment/ExperimentRunner.svelte:438-465`
- Experiment Designer Tabs: `frontend/src/components/admin/experiment/ExperimentDesigner.svelte:502-550`
- Consent Form Layout: `frontend/src/components/participant/ConsentFormDisplay.svelte`
- Instructions Layout: `frontend/src/components/participant/InstructionsDisplay.svelte`
- Question Builder: `frontend/src/components/admin/experiment/QuestionBuilder.svelte`
- Data Service: `frontend/src/lib/services/dataServiceV2.js`

### API Endpoints Reference

Existing data API pattern:

```
GET  /api/v3/data/events/experiment/:experimentId
GET  /api/v3/data/events/participant/:participantId
GET  /api/v3/data/events/room/:roomId
```

New endpoints (extend existing routes):

```
GET  /api/v3/data/questionnaire-responses/experiment/:experimentId
GET  /api/v3/data/questionnaire-responses/participant/:participantId
```

### Component Reuse Map

| Component               | Purpose                | Reuse From                      |
| ----------------------- | ---------------------- | ------------------------------- |
| TextInputComponent      | Short/long text        | ✅ Existing                     |
| MultipleChoiceComponent | Single selection       | ✅ Existing                     |
| VasRatingComponent      | Continuous rating      | ✅ Existing                     |
| RankingComponent        | Order items            | ✅ Existing                     |
| AudioRecordingComponent | Audio capture          | ✅ Existing                     |
| QuestionBuilder         | Question configuration | ✅ Existing (from Instructions) |

---

## Changelog

| Date       | Version | Changes                     |
| ---------- | ------- | --------------------------- |
| 2025-10-30 | 1.0     | Initial implementation plan |

---

**End of Implementation Plan**
