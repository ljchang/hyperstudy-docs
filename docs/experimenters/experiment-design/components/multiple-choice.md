---
title: Multiple Choice Component
sidebar_position: 4
---

import StorybookEmbed from '@site/src/components/StorybookEmbed';

# Multiple Choice Component

The Multiple Choice component presents participants with a question and a set of predefined answer options. It's one of the most versatile components, useful for surveys, quizzes, decision-making tasks, and gathering structured responses.

## Interactive Demo

<StorybookEmbed story="experiment-multiplechoice--default" showControls height="500px" />

## Key Features

- Configurable question text with rich formatting
- Support for single-choice (radio buttons) or multiple-choice (checkboxes)
- Options for randomizing answer order
- Customizable option layout (vertical, horizontal, grid)
- Optional images for answer choices
- Customizable styling for choices
- Required response enforcement
- Data capture in variables
- Dynamic image assignment from stimulus mapping pools (Image Source)

## When to Use

Use the Multiple Choice component when you need to:

- Collect categorical responses to questions
- Present a quiz or knowledge assessment
- Offer a limited set of decision options
- Gather demographic information
- Create branching logic based on selections
- Present Likert-scale questions

## Configuration

### Basic Settings


| Setting | Description | Default |
|---------|-------------|---------|
| **Question Text** | The question or prompt for participants | *(required)* |
| **Selection Type** | Single choice (radio) or multiple choice (checkbox) | `Single` |
| **Options** | List of available answer choices | *(required)* |
| **Randomize Options** | Shuffle the order of options for each participant | `false` |
| **Required** | Whether an answer must be provided | `true` |
| **Submit Button Text** | Label for the submission button | `"Submit"` |
| **Output Variable** | Variable to store the selected answer(s) | *(required)* |

### Answer Choices Configuration

Configure each answer choice with these options:

| Setting | Description | 
|---------|-------------|
| **Value** | Data value stored when selected (not shown to participants) |
| **Label** | Text displayed to participants |
| **Description** | Optional additional explanation |
| **Image** | Optional image to display with the choice |
| **Disabled** | Whether this option can be selected |
| **Default Selected** | Whether this option is pre-selected |

### Layout Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Layout** | How options are arranged (vertical, horizontal, grid) | `Vertical` |
| **Columns** | Number of columns for grid layout | `2` |
| **Option Spacing** | Space between options (px) | `10px` |
| **Label Position** | Position of label relative to selection control | `Right` |

### Style Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Question Font Size** | Size of the question text | `18px` |
| **Option Font Size** | Size of the option text | `16px` |
| **Selected Style** | Visual styling for selected options | *System default* |
| **Hover Style** | Visual styling when hovering over options | *System default* |
| **Option Background** | Background color for options | `transparent` |
| **Border Style** | Border for option containers | `none` |

## Types of Multiple Choice Questions

### Single Choice (Radio Buttons)

The most common type, where participants can select only one option:

```
Question: "What is your primary research interest?"
Type: Single choice
Options:
- Cognitive neuroscience
- Social psychology
- Clinical psychology
- Developmental psychology
- Other
```

### Multiple Choice (Checkboxes)

Allows participants to select multiple applicable options:

```
Question: "Which of the following symptoms have you experienced? (Select all that apply)"
Type: Multiple choice
Options:
- Headache
- Fatigue
- Difficulty concentrating
- Memory problems
- None of the above
```

### Likert Scale

A specialized single-choice format for agreement ratings:

```
Question: "The instructions for this task were clear."
Type: Single choice
Options:
- Strongly disagree
- Disagree
- Neutral
- Agree
- Strongly agree
```

### Image-Based Choices

Using images as the primary choice content:

```
Question: "Which of these images shows a fearful expression?"
Type: Single choice
Options:
- [Image 1] Happy face
- [Image 2] Fearful face
- [Image 3] Angry face
- [Image 4] Neutral face
```

## Advanced Features

### Conditional Display

You can implement follow-up questions:

1. Store the first multiple choice response in a variable
2. Configure different follow-up questions in separate states
3. Configure the next state based on the response

### Scoring and Feedback

For quiz applications:

1. Define correct answers in your configuration
2. Compare participant selections to correct answers
3. Calculate and store scores in variables
4. Provide immediate feedback (optional)

Example configuration:
```
correctAnswers = {
  question1: "optionB",
  question2: ["optionA", "optionC"],
  question3: "optionD"
}
```

### Branching Logic

Create different experiment paths based on responses:

1. Store responses in variables
2. Configure different states for each path
3. Create different experience branches

This is useful for personalized experiment flows.

### Randomization

Beyond randomizing option order, you can:

1. Randomize which questions are shown from a larger pool
2. Use different randomization patterns (block randomization, etc.)
3. Ensure certain options always appear in fixed positions

### Image Source

The Image Source feature automatically assigns images from a [stimulus mapping](../stimulus-mappings.md) pool to each choice button. Instead of manually setting images per choice or writing template functions, you configure the mapping once and the component handles random assignment, consumption tracking, and variable storage.

#### How It Works

1. You create a **Category** or **Key-Category** stimulus mapping containing your image pool
2. In the Multiple Choice component settings, you set the **Image Source** to that mapping name
3. When the component renders, it draws one random image per choice button from the pool
4. After the participant selects a choice, the chosen image's URL is stored in a variable for downstream use

#### Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| **Image Source** | Name of a Category or Key-Category mapping to draw images from | *(empty — disabled)* |
| **Image Source Key Variable** | For Key-Category mappings: variable whose value selects which category to draw from | *(empty)* |
| **Image Consume Mode** | `"all"` = exclude all drawn images from future trials. `"selected"` = only exclude the image the participant chose. | `"all"` |
| **Draw Scope** | `"room"` = all participants see same images. `"participant"` = independent random draws. | `"participant"` |
| **Selected Image Variable** | Variable to store the URL of the image on the chosen button | *(empty)* |

#### Example: Face Selection Task (Category Mapping)

A "pick a face" paradigm where each trial shows different random faces:

1. Create a **Category** mapping called `facesPool` with all face images
2. Configure the Multiple Choice component:
   - **Image Source:** `facesPool`
   - **Image Consume Mode:** `all`
   - **Selected Image Variable:** `chosenFace`
3. Each choice button displays a random face from the pool
4. The chosen face's URL is saved to `chosenFace`
5. Display it later with a ShowImage component using `{chosenFace}` in the dynamic URL field

#### Example: Conditional Image Selection (Key-Category Mapping)

A two-step design where a prior choice determines which image category appears:

1. **State 1:** Multiple Choice asks "Which category?" → saves `"Happy"` to `categoryChoice`
2. **State 2:** Multiple Choice with:
   - **Image Source:** `emotionFolders` (a Key-Category mapping)
   - **Image Source Key Variable:** `categoryChoice`
   - **Selected Image Variable:** `chosenImage`
3. The component reads `categoryChoice`, looks up the matching folder in `emotionFolders`, and draws random images from that folder for each button

#### Pool Exhaustion

When all images in the pool have been consumed (based on the consume mode), the pool resets automatically and images can appear again. To avoid this, ensure your pool has enough images to cover the number of trials in your experiment.

For full details on stimulus mappings, draw scope, and consumption modes, see the [Stimulus Mappings](../stimulus-mappings.md#multiplechoice-image-source) documentation.

## Data Collection

### Stored Values

Configure what gets stored in your output variable:

- **Simple Value**: Just the selected option value(s)
- **Detailed Object**: Values, timestamps, response times
- **History**: Track changes if participants modify their selection

:::note Image Source and Output Variable
When using the [Image Source](#image-source) feature, the **Output Variable** stores the participant's answer value (the choice label/value), while the **Selected Image Variable** stores the URL of the image that was displayed on the chosen button. These are separate variables — the Output Variable does not contain image information.
:::

Example data structure:
```json
{
  "value": "optionB",
  "label": "Agree",
  "responseTime": 4231,
  "timestamps": {
    "displayed": 1621453287000,
    "answered": 1621453291231
  }
}
```

### Multiple Response Handling

For checkbox questions, results are typically stored as an array:

```json
["optionA", "optionC", "optionE"]
```

Or with more details:

```json
[
  {"value": "optionA", "label": "Headache"},
  {"value": "optionC", "label": "Difficulty concentrating"},
  {"value": "optionE", "label": "Memory problems"}
]
```

## Implementation Examples

### Knowledge Quiz Question

```
Question: "Which brain region is primarily responsible for memory formation?"
Type: Single choice
Options:
- Frontal lobe
- Hippocampus (correct)
- Cerebellum
- Occipital lobe
- Brainstem
Randomize: true
Required: true
```

### Demographic Survey Question

```
Question: "What is your highest level of education?"
Type: Single choice
Options:
- High school or equivalent
- Some college
- Bachelor's degree
- Master's degree
- Doctoral degree
- Professional degree
- Prefer not to answer
Randomize: false
Required: false
```

### Symptom Checklist

```
Question: "Which symptoms have you experienced in the past month? (Select all that apply)"
Type: Multiple choice
Options:
- Difficulty falling asleep
- Early morning awakening
- Daytime sleepiness
- Difficulty concentrating
- Irritability
- Loss of interest
- None of the above
Randomize: false
Mutually Exclusive: "None of the above" (selecting this deselects others)
Required: true
```

## Best Practices

1. **Clear Questions**: Write concise, unambiguous questions
2. **Balanced Options**: Provide a complete and balanced set of answer choices
3. **Consistent Format**: Use similar formats for similar question types
4. **Appropriate Length**: Limit answer choices to a reasonable number (typically 3-7)
5. **Logical Order**: Unless randomizing, present options in a logical order
6. **Include All Possibilities**: Consider adding "Other" or "None of the above" options when appropriate
7. **Preview Placement**: Test how options appear on different screen sizes
8. **Validation**: For required questions, provide clear error messages

## Accessibility Considerations

1. **Keyboard Navigation**: Ensure options can be selected with keyboard
2. **Screen Reader Support**: Use appropriate ARIA labels
3. **Text Size**: Make text large enough to read easily
4. **Color Contrast**: Ensure sufficient contrast for readability
5. **Image Alternatives**: Provide alt text for any images in choices

## Component Combinations

The Multiple Choice component works well with:

- **Text Component**: Provide context or instructions before the question
- **Image Component**: Show stimulus that the question refers to
- **Video Component**: Ask questions about viewed content
- **Rating Scales**: Use in conjunction for mixed-method assessment

## Alternatives to Consider

- **VAS Rating Component**: For continuous scale responses
- **Text Input Component**: When free-text responses are needed
- **Likert Scale Component**: For standardized agreement scales