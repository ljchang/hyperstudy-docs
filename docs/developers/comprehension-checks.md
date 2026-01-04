---
title: Comprehension Checks System
sidebar_position: 11
---

# Comprehension Checks System

Technical documentation for the comprehension check feature in HyperStudy.

## Overview

The comprehension check system allows experimenters to embed quiz questions directly into instruction pages to verify participant understanding before they enter the waiting room. Questions are embedded at the page level and validated client-side with automatic data recording.

## Architecture

### Component Structure

```
Instructions.svelte (Admin)
├── QuestionBuilder.svelte
│   └── Question configuration UI
│   └── Type-specific forms
│   └── Question management

InstructionsDisplay.svelte (Participant)
├── Question rendering
├── Answer collection
├── Validation logic
└── Data recording integration
```

### Data Flow

```
1. Admin creates questions in Instructions.svelte
   ↓
2. Questions stored in experiment.instructionsPages[].questions
   ↓
3. Participant views InstructionsDisplay.svelte
   ↓
4. Questions rendered with appropriate inputs
   ↓
5. Answers validated using comprehensionCheckValidation.js
   ↓
6. Results recorded to dataServiceV2
   ↓
7. Session updated in participantSessionService
```

## Key Files

### Core Implementation

#### `/frontend/src/lib/utils/comprehensionCheckValidation.js`

Validation logic for all question types.

**Key Functions:**
- `validateMultipleChoice(question, userAnswer)` - Validates MC answers
- `validateTrueFalse(question, userAnswer)` - Validates T/F answers
- `validateTextAnswer(question, userAnswer)` - Validates text with keywords/phrases
- `validateNumericAnswer(question, userAnswer)` - Validates numbers with tolerance
- `validateAnswers(questions, userAnswers, passingScore)` - Main validator
- `areAllQuestionsAnswered(questions, userAnswers)` - Completeness check
- `randomizeQuestions(questions)` - Shuffle question order
- `randomizeQuestionOptions(question)` - Shuffle MC options
- `sanitizeInput(input)` - XSS prevention

**Example Usage:**
```javascript
import { validateAnswers } from './comprehensionCheckValidation.js';

const result = validateAnswers(
  questions,        // Array of question objects
  userAnswers,      // { questionId: answer }
  80                // Passing score (%)
);

// result = {
//   score: 75,
//   passed: false,
//   correct: 3,
//   total: 4,
//   feedback: { q1: { correct: true, explanation: null }, ... }
// }
```

#### `/frontend/src/components/admin/experiment/QuestionBuilder.svelte`

Admin UI for creating and managing questions.

**Props:**
- `questions` - Questions object from instruction page
- `onUpdate` - Callback when questions change

**State:**
- `config` - Complete questions configuration
- `editingQuestionIndex` - Currently expanded question
- `newQuestionType` - Type for new questions

**Key Functions:**
- `addQuestion()` - Creates new question based on type
- `removeQuestion(index)` - Deletes a question
- `updateQuestion(index, field, value)` - Updates question property
- `moveQuestionUp/Down(index)` - Reorders questions

#### `/frontend/src/components/admin/experiment/Instructions.svelte`

Admin interface for instruction pages (modified to include questions).

**Added Functions:**
- `toggleQuestions()` - Enable/disable questions for current page
- `handleQuestionsUpdate(questions)` - Save question changes

**Integration:**
```svelte
{#if hasQuestions}
  <QuestionBuilder
    questions={currentPage.questions}
    onUpdate={handleQuestionsUpdate}
  />
{/if}
```

#### `/frontend/src/components/participant/InstructionsDisplay.svelte`

Participant view that renders and validates questions.

**Key State:**
- `currentAnswers` - User's answers `{ questionId: answer }`
- `pageAttempts` - All attempts per page `{ pageIndex: [attempts] }`
- `showQuestions` - Whether quiz is visible
- `showFeedback` - Whether results are shown
- `displayedQuestions` - Randomized question list

**Key Functions:**
- `initializeQuestions()` - Sets up questions with randomization
- `startComprehensionCheck()` - Shows quiz interface
- `submitAnswers()` - Validates and records attempt
- `handleComprehensionFailure()` - Handles max attempts reached
- `retryCheck()` - Resets for new attempt

**Data Recording:**
```javascript
await dataServiceV2.recordEvent({
  eventType: 'instructions.comprehension_attempt',
  category: 'pre_experiment',
  experimentId: experiment.id,
  participantId: auth.currentUser.uid,
  value: {
    pageIndex,
    attemptNumber,
    answers,
    score,
    passed,
    correctCount,
    totalQuestions,
    timestamp
  },
  priority: 'high'
});
```

### Testing

#### `/frontend/src/lib/utils/__tests__/comprehensionCheckValidation.test.js`

Comprehensive test suite with 43 tests covering:
- All question type validations
- Edge cases (null, undefined, empty)
- Score calculation accuracy
- Randomization functions
- Input sanitization

**Run Tests:**
```bash
cd frontend
npm test -- src/lib/utils/__tests__/comprehensionCheckValidation.test.js
```

## Data Model

### Question Object Structure

#### Base Question
```javascript
{
  id: "q_timestamp_random",  // Unique identifier
  type: "multiple-choice|true-false|short-text|numeric",
  question: "Question text",
  explanation: "Explanation for incorrect answers"
}
```

#### Multiple Choice
```javascript
{
  ...base,
  type: "multiple-choice",
  options: ["Option 1", "Option 2", "Option 3"],
  correctAnswer: 1  // Index of correct option (0-based)
}
```

#### True/False
```javascript
{
  ...base,
  type: "true-false",
  correctAnswer: true  // Boolean value
}
```

#### Short Text
```javascript
{
  ...base,
  type: "short-text",
  keywords: ["keyword1", "keyword2"],  // All must be present
  acceptableAnswers: ["exact phrase 1", "exact phrase 2"],
  caseSensitive: false,
  partialMatch: false,
  minLength: 10
}
```

#### Numeric
```javascript
{
  ...base,
  type: "numeric",
  correctAnswer: 50,
  validation: {
    exact: false,           // Require exact match
    tolerance: 5,           // Accept ±5
    min: 45,                // OR range validation
    max: 55,
    allowDecimals: true,
    unit: "trials"          // Display unit
  }
}
```

### Questions Configuration

```javascript
{
  title: "Check Your Understanding",
  required: true,
  passingScore: 80,       // Percentage (0-100)
  allowRetry: true,
  maxAttempts: 3,
  showFeedback: true,
  showExplanations: true,
  randomizeQuestions: false,
  randomizeOptions: false,
  items: [/* question objects */]
}
```

### Instruction Page with Questions

```javascript
{
  title: "Study Instructions",
  content: "# Instructions markdown...",
  questions: {
    /* questions configuration */
  }
}
```

## Validation Logic

### Text Answer Validation

Text answers are validated in this priority order:

1. **Exact Match** - Check acceptableAnswers array
2. **Keywords** - All keywords must be present
3. **Partial Match** - Substring matching if enabled
4. **Minimum Length** - Character count validation

**Case Handling:**
```javascript
const normalized = caseSensitive
  ? userAnswer.trim()
  : userAnswer.toLowerCase().trim();
```

### Numeric Validation

Numeric answers support three validation modes:

1. **Exact**: `answer === correctAnswer`
2. **Tolerance**: `Math.abs(answer - correctAnswer) <= tolerance`
3. **Range**: `answer >= min && answer <= max`

**Decimal Handling:**
```javascript
if (!allowDecimals && !Number.isInteger(answer)) {
  return false;
}
```

### Scoring

```javascript
score = (correctCount / totalQuestions) * 100;
passed = score >= passingScore;
```

## Event Recording

### Event Types

| Event Type | When Fired | Priority |
|------------|------------|----------|
| `instructions.comprehension_attempt` | Each quiz submission | high |
| `instructions.comprehension_passed` | Participant passes | high |
| `instructions.comprehension_failed` | Max attempts reached | high |
| `instructions.completed` | All instructions done | high |

### Event Data Structure

```javascript
{
  eventType: 'instructions.comprehension_attempt',
  category: 'pre_experiment',
  experimentId: string,
  participantId: string,
  value: {
    pageIndex: number,
    pageTitle: string,
    attemptNumber: number,
    answers: { [questionId]: answer },
    score: number,
    passed: boolean,
    correctCount: number,
    totalQuestions: number,
    timestamp: number
  },
  timestamp: ISO8601 string,
  priority: 'high'
}
```

### Session Updates

When comprehension check fails:
```javascript
await sessionService.updateSession(userId, {
  comprehensionFailed: true,
  failedAt: new Date().toISOString()
});
```

## Security

### XSS Prevention

All user text inputs are sanitized:
```javascript
function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

### Validation Location

- **Client-side only**: Fast feedback, reduces server load
- **Answers not sent to server**: Privacy-friendly
- **No retry limits**: Configured per experiment

## Performance

### Validation Speed
- **Typical**: < 1ms for 5 questions
- **No network calls**: Instant feedback
- **Memory efficient**: Questions cleared on page change

### Bundle Size
- **Validation utils**: ~5KB minified
- **QuestionBuilder**: ~8KB minified
- **No external dependencies**

## Extending the System

### Adding New Question Types

1. **Add validation function** in `comprehensionCheckValidation.js`:
```javascript
export function validateNewType(question, userAnswer) {
  // Validation logic
  return boolean;
}
```

2. **Add case in validateAnswers**:
```javascript
case 'new-type':
  isCorrect = validateNewType(question, userAnswer);
  break;
```

3. **Add UI in QuestionBuilder.svelte**:
```svelte
{:else if question.type === 'new-type'}
  <!-- Configuration UI -->
{/if}
```

4. **Add input in InstructionsDisplay.svelte**:
```svelte
{:else if question.type === 'new-type'}
  <!-- Answer input UI -->
{/if}
```

5. **Add tests** in test file

### Customizing Validation

Override or extend validation functions:
```javascript
import { validateAnswers as baseValidate } from './comprehensionCheckValidation.js';

export function customValidateAnswers(questions, answers, passingScore) {
  const result = baseValidate(questions, answers, passingScore);
  // Custom logic
  return result;
}
```

## Troubleshooting

### Common Issues

**Questions not appearing:**
- Check `hasQuestions` derived value
- Verify `questions.items` array exists and has length
- Check `showQuestions` state

**Validation not working:**
- Verify question `correctAnswer` is set
- Check answer format matches question type
- Test validation function in isolation

**Data not recording:**
- Check `auth.currentUser` is defined
- Verify `dataServiceV2` is imported
- Check console for errors
- Confirm `priority: 'high'` is set

**Randomization issues:**
- Ensure `displayedQuestions` is used, not `questions.items`
- Check `initializeQuestions()` is called on page change
- Verify correct answer index updates for MC randomization

## Best Practices

### For Developers

1. **Use Svelte 5 Runes**: Follow `$state`, `$derived`, `$effect` patterns
2. **Type Safety**: Add JSDoc comments for complex objects
3. **Error Handling**: Wrap data recording in try-catch
4. **Validation**: Always validate user input
5. **Testing**: Update tests when changing validation logic

### For Experimenters (in docs)

1. **Clear Questions**: Test with naive users
2. **Appropriate Difficulty**: 70-80% passing score
3. **Helpful Feedback**: Explain correct answers
4. **Strategic Placement**: After critical information
5. **Test First**: Pilot test comprehension checks

## Migration Guide

### From Old System

If upgrading from component-based comprehension checks:

1. **Questions are now per-page**, not separate states
2. **Validation is automatic**, no manual checking needed
3. **Data structure changed**: See data model above
4. **Recording is built-in**: No custom event creation needed

### Backward Compatibility

- Instruction pages without `questions` work unchanged
- Existing experiments are not affected
- Feature is opt-in per page
- No database schema changes required

## Related Documentation

- [Experimenter Guide](../experimenters/experiment-design/experiment-instructions.md#comprehension-checks)
- [Participant Guide](../participants/getting-started.md#comprehension-checks)
- [Implementation Summary](/COMPREHENSION_CHECK_IMPLEMENTATION_SUMMARY.md)

## Support

For technical questions or issues:
- Check test suite for examples
- Review implementation summary
- See code comments in source files
- Contact development team
