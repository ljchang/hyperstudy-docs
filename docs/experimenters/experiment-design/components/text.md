---
title: Text Component
sidebar_position: 2
---

# Text Component

The Text component displays formatted text content to participants. It's one of the most frequently used components, serving for instructions, stories, scenarios, explanations, and more.


## Key Features

- Rich text formatting with HTML tags
- Dynamic content using variables
- Customizable styling and layout
- Automatic scrolling for long content
- Real-time validation of HTML in the editor

## When to Use

Use the Text component when you need to:

- Provide instructions for a task
- Present a story or scenario
- Show explanations or educational content
- Display feedback based on participant actions
- Present static content that doesn't require interaction

## Configuration

### Basic Settings


| Setting | Description | Default |
|---------|-------------|---------|
| **Title** | Heading displayed above the content | *(empty)* |
| **Content** | Main text content with markdown support | *(required)* |
| **Instructions** | Secondary guidance text below the title | *(empty)* |
| **Auto-advance** | Whether to proceed automatically after viewing | `false` |
| **Viewing Time** | Required time to view before advancing (seconds) | `0` |
| **Show Continue Button** | Display a button to proceed to next state | `true` |
| **Continue Button Text** | Label for the continue button | `"Continue"` |

### Styling Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Font Family** | Text font | `"System UI"` |
| **Font Size** | Base text size | `16px` |
| **Text Color** | Color of the main text | `#333333` |
| **Title Color** | Color of the title text | `#000000` |
| **Background Color** | Component background color | `#ffffff` |
| **Width** | Component width (px or %) | `80%` |
| **Height** | Component height (px or %) | `auto` |
| **Alignment** | Text alignment | `left` |
| **Padding** | Space inside the component | `20px` |

## Using HTML Formatting

The text component supports basic HTML tags for rich text formatting. All HTML is sanitized for security - only safe formatting tags are allowed, and attributes are stripped.

### Supported HTML Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `<b>`, `<strong>` | Bold text | `<b>important</b>` |
| `<i>`, `<em>` | Italic text | `<i>emphasis</i>` |
| `<u>` | Underlined text | `<u>underline</u>` |
| `<s>`, `<strike>` | Strikethrough text | `<s>deleted</s>` |
| `<h1>` - `<h6>` | Headings | `<h1>Title</h1>` |
| `<p>` | Paragraph | `<p>A paragraph of text</p>` |
| `<br>` | Line break | `Line 1<br>Line 2` |
| `<span>` | Inline container | `<span>grouped text</span>` |

### Example

```html
<h1>Task Instructions</h1>

<p>In this task, you will see a series of images. For each image:</p>

<p>
1. Look at the image <b>carefully</b><br>
2. Consider how it makes you <i>feel</i><br>
3. Rate your emotional response
</p>

<p><u>Important:</u> Take your time with each response.</p>
```

### What's NOT Allowed

For security, the following are automatically removed:
- **Script tags**: `<script>` tags are stripped
- **Style attributes**: `style="..."` attributes are removed
- **Event handlers**: `onclick`, `onload`, etc. are removed
- **Other tags**: `<div>`, `<iframe>`, `<img>`, etc. are not supported

### Editor Validation

When editing text in the experiment designer, you'll see real-time validation:
- **Green checkmark**: Valid HTML tags detected
- **Orange warning**: Unsupported tags (will be removed) or attributes (will be stripped)
- **Red error**: Unclosed tags that need fixing

## Using Variables in Text

You can insert variable values into text content using single curly braces:

```markdown
Hello, {participantName}!

Your score on the previous task was {score} out of {totalPossible}.

Today's date is {currentDate}.
```

This allows for personalized and dynamic content based on:
- Participant information
- Previous responses
- Experiment state
- Calculated values

## Advanced Features

### Combining HTML and Variables

You can combine HTML formatting with variable substitution:

```html
<h2>Results for {participantName}</h2>

<p>Your score: <b>{score}</b> out of {totalPossible}</p>

<p><i>Thank you for participating!</i></p>
```

The variables are replaced first, then the HTML is rendered.

### Text Timing

Control how participants interact with text:

- **Minimum Time**: Require participants to spend at least this long on the text
- **Auto-Advance**: Automatically proceed after a set time
- **Continue Button Delay**: Only show the continue button after a delay
- **Reading Time Estimation**: Automatically calculate viewing time based on word count

These features ensure participants adequately review the content.

### Scrolling Text

For long content:

- **Auto-Scroll**: Automatically scroll text at a reading pace
- **Scroll Tracking**: Monitor how far participants scroll
- **Completion Detection**: Detect when a participant reaches the end
- **Scroll Position Variables**: Store how far a participant scrolled

These are useful for ensuring participants read all the material.

## Examples

### Basic Instructions

```html
<h1>Task Instructions</h1>

<p>In this task, you will see a series of images. For each image:</p>

<p>
1. Look at the image carefully<br>
2. Consider how it makes you feel<br>
3. Rate your emotional response on the scale provided
</p>

<p>Click <b>"Begin"</b> when you're ready to start.</p>
```

### Dynamic Feedback with Variables

```html
<h1>Results Summary</h1>

<p>You correctly identified <b>{correctAnswers}</b> out of {totalQuestions} emotions.</p>

<p>Your strongest recognition was for <b>{bestEmotion}</b> emotions
({bestScore}% correct).</p>

<p>Your weakest recognition was for <b>{worstEmotion}</b> emotions
({worstScore}% correct).</p>
```

### Scenario Presentation

```html
<h2>The Job Interview Scenario</h2>

<p><i>Imagine you are waiting for an important job interview. You've arrived
15 minutes early and are sitting in the reception area.</i></p>

<p>
• You can see other candidates who appear well-prepared<br>
• The receptionist has informed you the interviewer is running late<br>
• You notice your heart rate increasing<br>
• You're thinking about your qualifications for the role
</p>

<p><b>How would you rate your anxiety in this situation?</b></p>
```

## Best Practices

1. **Keep text concise**: Be clear and direct, avoiding unnecessary words
2. **Use formatting effectively**: Structure content with headings, lists, and emphasis
3. **Consider reading level**: Adapt language to your participant population
4. **Test readability**: Ensure text is legible on various screen sizes
5. **Provide clear instructions**: Be explicit about what participants should do
6. **Use consistent styling**: Maintain the same text format throughout your experiment
7. **Break up long content**: Use headings, paragraphs, and lists for readability
8. **Avoid jargon**: Use plain language unless technical terms are necessary

## Component Combinations

The Text component works well combined with:

- **Multiple Choice**: Text provides context for questions
- **Rating Scales**: Text explains what to rate and why
- **Video/Image**: Text provides introduction or explanation for media
- **Text Input**: Text poses questions for written responses

## Alternatives to Consider

- **Image Component**: When a visual representation would be more effective
- **Video Component**: For demonstrations or when engagement is critical
- **Multiple Choice**: When you need to confirm understanding through questions