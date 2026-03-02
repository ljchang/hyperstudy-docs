---
title: Stimulus Display
sidebar_position: 5
---

# Stimulus Display

Stimulus Display lets you show an image alongside any input component, so participants can view a visual stimulus while providing their response. This is useful for tasks like "rate this image," "describe what you see," or "rank these features based on the photo."

## Overview

Seven input components support inline stimulus display:

- [Text Input](./components/text-input.md)
- [Likert Scale](./components/likert-scale.md)
- [VAS Rating](./components/vas-rating.md)
- [Multiple Choice](./components/multiple-choice.md)
- [Ranking](./components/ranking.md)
- [Audio Recording](./components/audio-recording.md)
- [Rapid Rate](./components/rapid-rate.md)

When enabled, an image appears next to the input in one of four layout positions. The image can be a static file from your media library or a dynamic URL that changes per trial using `{variableName}` syntax.

:::tip How is this different from the Image component?
The [Image component](./components/image.md) is a standalone focus component — it occupies the entire state by itself. Stimulus Display embeds an image *within* an input component, so participants see the image and the response interface together in a single state. This avoids the need for a separate "view image" state followed by a "respond" state.
:::

## Enabling Stimulus Display

1. Select a state that uses one of the 7 supported input components
2. Open the component configuration panel
3. Toggle **"Show Stimulus Image"** to on
4. Select an image from the media browser, or enter a dynamic URL
5. Configure the layout, size, and optional caption

## Configuration

### Image Selection

| Setting | Values | Description |
|---------|--------|-------------|
| **Show Stimulus Image** | On / Off | Enables or disables the stimulus display |
| **Stimulus Image** | Static image or dynamic URL | Select from the media browser for a fixed image, or enter a `{variableName}` template for dynamic selection |

You can select an image in two ways:

- **Static**: Click "Select Image" to open the media browser and choose a file. The image URL is stored directly in the component config.
- **Dynamic**: Enter a template expression in the "Or enter dynamic URL" field. For example, `{lookup(chosenCategory, "imageSet")}` resolves to a different image based on the participant's earlier choice. See [Using Dynamic Stimulus URLs](#using-dynamic-stimulus-urls) below.

### Layout Options

| Setting | Values | Description |
|---------|--------|-------------|
| **Stimulus Layout** | `above`, `below`, `left`, `right` | Position of the image relative to the input |

Layout behaviors:

- **above** — Image appears above the input, centered. Good for "view then respond" flows.
- **below** — Image appears below the input, centered. Useful when the question text should be read first.
- **left** — Image and input are side-by-side, with the image on the left. Good when participants need to reference the image while responding.
- **right** — Image and input are side-by-side, with the image on the right.

:::note Responsive behavior
The `left` and `right` layouts automatically collapse to a stacked (above) layout on smaller screens to ensure usability on mobile devices.
:::

### Size Options

| Setting | Values | Description |
|---------|--------|-------------|
| **Stimulus Size** | `small`, `medium`, `large`, `fullwidth` | Maximum width of the displayed image |

Size presets:

| Value | Max Width |
|-------|-----------|
| `small` | 300px |
| `medium` | 500px |
| `large` | 800px |
| `fullwidth` | 100% of container |

The image maintains its aspect ratio within the max width. Choose a size appropriate to your stimuli — small works for icons or thumbnails, large or fullwidth for detailed images that participants need to examine closely.

### Caption

| Setting | Values | Description |
|---------|--------|-------------|
| **Stimulus Caption** | Text (optional) | Caption displayed below the image |

The caption supports `{variableName}` syntax, so you can display dynamic text like `"Image: {trialNumber} of {totalTrials}"` or `"Category: {selectedCategory}"`.

## Using Dynamic Stimulus URLs

Instead of selecting a fixed image, you can use variable templates to show different images across trials or conditions. Enter a template expression in the dynamic URL field:

```
{lookup(userChoice, "imageChoices")}
```

```
{sample("facePool", "without_replacement")}
```

```
{lookupAndSample(emotion, "emotionFolders")}
```

These expressions use the same `lookup()`, `sample()`, and `lookupAndSample()` functions documented in [Stimulus Mappings](./stimulus-mappings.md). The key difference is that Stimulus Mappings describes how to set up the variable-to-image mapping logic, while Stimulus Display controls how and where the resolved image appears alongside the input.

**Typical workflow for dynamic stimuli:**

1. Define your stimulus mapping in the Variables tab (see [Creating Stimulus Mappings](./stimulus-mappings.md#creating-stimulus-mappings))
2. Enable Stimulus Display on your input component
3. Enter the template expression (e.g., `{sample("faces")}`) as the dynamic URL
4. The image resolves at runtime based on the participant's state and variables

## Data Collection

Stimulus metadata is automatically recorded alongside each component response. You don't need to configure anything extra — if a stimulus was displayed, its URL and caption are included in the response data.

### Viewing in Data Management

In the **Data Management > Components** tab:

- The **Content** column shows a `[+stimulus]` indicator for any response that had a stimulus displayed
- The **Stimulus URL** column (optional, add via column selector) shows the resolved image URL
- The **Stimulus Caption** column (optional) shows the resolved caption text

### In Exported Data

When you export component data as CSV, the stimulus URL and caption are included as separate columns for each response row, making it straightforward to analyze which stimulus was paired with which response.

## Examples

### Basic: Image Above a Likert Scale

A simple "rate this image" task:

1. Add a state with a **Likert Scale** component
2. Set the question to "How pleasant is this image?"
3. Toggle **Show Stimulus Image** on
4. Click **Select Image** and choose an image from your media library
5. Set **Stimulus Layout** to `above` (default)
6. Set **Stimulus Size** to `medium`

The participant sees the image centered above the Likert scale and selects their rating.

### Side-by-Side: Image Left of Multiple Choice

An image identification task where participants need to reference the image while choosing:

1. Add a state with a **Multiple Choice** component
2. Set the question to "What emotion is shown in this face?"
3. Add options: "Happy", "Sad", "Angry", "Neutral"
4. Toggle **Show Stimulus Image** on
5. Click **Select Image** and choose a face image
6. Set **Stimulus Layout** to `left`
7. Set **Stimulus Size** to `medium`

The image appears on the left side with the multiple choice options on the right, making it easy to look back and forth.

### Dynamic: Variable-Driven Stimulus with VAS Rating

A multi-trial design where each trial shows a different image from a pool:

1. In the Variables tab, create a **Category** stimulus mapping called `scenePictures` with your images
2. Add a state with a **VAS Rating** component
3. Set the question to "How arousing is this scene?"
4. Toggle **Show Stimulus Image** on
5. In the dynamic URL field, enter: `{sample("scenePictures", "without_replacement")}`
6. Set **Stimulus Layout** to `above`
7. Set **Stimulus Size** to `large`

Each time the participant enters this state (e.g., in a loop), a different image is drawn from the pool without repetition.

## Best Practices

1. **Choose appropriate sizes for your stimuli** — use `large` or `fullwidth` for images with fine detail; `small` or `medium` for simple icons or thumbnails
2. **Use `left` or `right` layout when participants need to reference the image while responding** — this keeps both the stimulus and the input visible without scrolling
3. **Use `above` layout for simple "view then rate" flows** — it provides a natural top-to-bottom reading order
4. **Keep captions brief** — they're meant for context (e.g., trial number), not lengthy descriptions
5. **Test on different screen sizes** — side-by-side layouts collapse to stacked on mobile, so verify your experiment works well in both modes
6. **Use dynamic URLs with stimulus mappings for multi-trial designs** — this avoids creating a separate state for each image

## Related Documentation

- [Stimulus Mappings](./stimulus-mappings.md) — set up dynamic image/video selection with variables, sampling strategies, and lookup functions
- [Component Overview](./components/index.md) — all available focus and global components
- [Text Input](./components/text-input.md) | [Likert Scale](./components/likert-scale.md) | [VAS Rating](./components/vas-rating.md) | [Multiple Choice](./components/multiple-choice.md) | [Ranking](./components/ranking.md) | [Audio Recording](./components/audio-recording.md) | [Rapid Rate](./components/rapid-rate.md) — individual component documentation
