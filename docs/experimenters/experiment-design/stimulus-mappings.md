---
title: Stimulus Mappings
sidebar_position: 4
---

# Stimulus Mappings

Stimulus Mappings allow you to conditionally display images or videos based on participant responses. Instead of showing the same media to everyone, you can dynamically select what to display based on choices participants make during the experiment.

## Overview

With Stimulus Mappings, you can:

- **Show different images/videos based on participant choices** (e.g., "Option A" shows `imageA.jpg`)
- **Randomly sample from a pool of stimuli** with or without replacement
- **Display role-specific content** (e.g., Host sees one video, Viewer sees another)
- **Create adaptive experiments** where content changes based on previous responses

## Creating Stimulus Mappings

### Accessing Stimulus Mappings

1. Open your experiment in the Experiment Designer
2. Click on the **"Variables"** tab in the settings panel
3. Scroll down to the **"Stimulus Mappings"** section

### Mapping Types

There are two types of mappings:

| Type | Description | Use Case |
|------|-------------|----------|
| **Key-Value** | Maps specific choices to specific URLs | "Option A" → `imageA.jpg` |
| **Category** | Pool of items with sampling strategies | Show random image from "happy faces" pool |

### Creating a Key-Value Mapping

Key-value mappings are perfect when you know exactly which stimulus should appear for each choice.

1. Enter a mapping name (e.g., `imageChoices`)
2. Select **"Key-Value"** as the type
3. Click **"Add Mapping"**
4. For each entry:
   - Click **"+ Add Entry"**
   - Enter the key (the value that will be matched, e.g., `"Option A"`)
   - Select the image or video from your media library

**Example:**
```
imageChoices:
  "Option A" → https://example.com/imageA.jpg
  "Option B" → https://example.com/imageB.jpg
  "Option C" → https://example.com/imageC.jpg
```

### Creating a Category Mapping

Category mappings let you define a pool of stimuli and sample from them using different strategies.

1. Enter a mapping name (e.g., `happyFaces`)
2. Select **"Category"** as the type
3. Click **"Add Mapping"**
4. Choose a sampling strategy:
   - **Random (with replacement)**: Any item can be selected multiple times
   - **Random (without replacement)**: Each item selected only once until pool resets
   - **Sequential**: Items selected in order (1st, 2nd, 3rd, ...)
5. Add items to the pool by clicking **"+ Add Item"** and selecting media

**Example:**
```
happyFaces (Category, without_replacement):
  - https://example.com/happy1.jpg
  - https://example.com/happy2.jpg
  - https://example.com/happy3.jpg
```

### Naming Rules

Mapping names must:
- Start with a letter
- Contain only letters, numbers, and underscores
- Have no spaces

**Good names:** `imageChoices`, `happy_faces`, `videoSet1`
**Invalid names:** `1stChoice`, `my choices`, `image-set`

### Editing Names and Keys

You can edit mapping names and entry keys after creation:
- **Double-click** on a mapping name or key to edit it inline
- Press **Enter** or click away to save
- Press **Escape** to cancel

## Using Stimulus Mappings in Components

Once you've defined mappings, you can use them in ShowImage or ShowVideo components.

### Entering Dynamic URLs

In the ShowImage or ShowVideo component configuration, you'll find a **"Or enter dynamic URL"** input field below the media selector. Enter your dynamic syntax here:

1. Select the ShowImage or ShowVideo component in your state
2. In the component configuration panel, scroll down to find the dynamic URL input
3. Enter the syntax (e.g., `{lookup(userChoice, "imageChoices")}`)
4. The field auto-saves as you type

You can also use the **copy buttons** in the Variables tab's Stimulus Mappings help section to quickly copy the syntax.

### The `lookup()` Function

Use `lookup()` to retrieve a URL from a key-value mapping based on a variable value.

**Syntax:**
```
{lookup(variableValue, "mappingName")}
```

**Example:**
If you have a Multiple Choice component that stores the selection to a variable called `userChoice`, and a mapping called `imageChoices`:

```
{lookup(userChoice, "imageChoices")}
```

When `userChoice = "Option A"`, this resolves to `https://example.com/imageA.jpg`.

### The `sample()` Function

Use `sample()` to get an item from a category mapping.

**Syntax:**
```
{sample("categoryName")}
{sample("categoryName", "strategy")}
```

**Strategies:**
- `"random"` - Random with replacement (default)
- `"without_replacement"` - Each item used once before pool resets
- `"sequential"` - Items in order

**Examples:**
```
{sample("happyFaces")}                           // Random with replacement
{sample("happyFaces", "without_replacement")}    // Each image shown once
{sample("happyFaces", "sequential")}             // 1st, 2nd, 3rd, ...
```

### The `roleValue()` Function

Use `roleValue()` to show different content based on the participant's role.

**Syntax:**
```
{roleValue("mappingName")}
{roleValue("mappingName", "defaultUrl")}
```

**Example:**
Create a key-value mapping called `roleVideos`:
```
roleVideos:
  "Host" → https://example.com/host_intro.mp4
  "Viewer" → https://example.com/viewer_intro.mp4
```

Then in your ShowVideo component:
```
{roleValue("roleVideos")}
```

The Host participant sees `host_intro.mp4`, while Viewers see `viewer_intro.mp4`.

## Step-by-Step Example

Let's create an experiment where participants choose a category, then see an image from that category.

### Step 1: Create the Category Mappings

In the Variables tab under Stimulus Mappings, create two category mappings:

**`animalImages`** (Category, random):
- cat1.jpg, cat2.jpg, cat3.jpg, dog1.jpg, dog2.jpg

**`natureImages`** (Category, random):
- forest1.jpg, ocean1.jpg, mountain1.jpg

### Step 2: Create a Choice-to-Category Mapping

Create a key-value mapping that maps choices to category names:

**`categoryChoice`**:
- "Animals" → (we'll handle this differently)
- "Nature" → (we'll handle this differently)

Actually, for this use case, we need a simpler approach:

### Alternative: Direct Key-Value Mapping

Create a key-value mapping with all possible images:

**`selectedImage`**:
- "Animals" → `{sample("animalImages")}`  *(Note: nested sampling not supported)*

For the category selection use case, the recommended approach is:

### Step 2 (Revised): Use Conditional Logic

1. Create a Multiple Choice component asking "Animals or Nature?"
2. Set the `outputVariable` to `userCategory`
3. Create separate states for each category, or use a key-value mapping where each choice maps directly to a specific image

### Step 3: Configure ShowImage

In your ShowImage component's URL field, enter:
```
{lookup(userCategory, "categoryImages")}
```

Where `categoryImages` is:
```
categoryImages:
  "Animals" → https://example.com/cat1.jpg
  "Nature" → https://example.com/forest1.jpg
```

## Multi-Participant Experiments

### Shared Sampling State

When using `sample()` with `without_replacement` or `sequential` strategies in multi-participant experiments, **all participants in the same room share the sampling state**.

This means:
- If Participant A gets `image1.jpg`, Participant B won't get it (until pool resets)
- Sequential sampling advances for all participants together

### Role-Specific Selection

Use `roleValue()` when different roles should see different content:

```
{roleValue("roleVideos")}
```

This ensures the Host and Viewer see their respective content.

## Preloading

All URLs defined in stimulus mappings are automatically preloaded when the experiment starts. This ensures:
- No loading delays when displaying conditional content
- Smooth transitions between states
- All possible stimuli are ready regardless of participant choices

## Best Practices

1. **Use descriptive mapping names**: `emotionalFaces` is better than `set1`

2. **Test all paths**: Make sure every possible choice leads to a valid image/video

3. **Keep pools balanced**: For `without_replacement`, ensure enough items for your experiment flow

4. **Document your mappings**: Use the description field to note what each mapping is for

5. **Validate before running**: Check that all URLs in your mappings are accessible

## Troubleshooting

### Image/Video Not Showing

- Verify the mapping name is spelled correctly
- Check that the variable contains the expected value
- Ensure the URL is valid and accessible

### Wrong Image Displayed

- Confirm the variable value matches a key in your mapping exactly (case-sensitive)
- Check for extra spaces in keys or values

### Sampling Not Working as Expected

- Verify you're using a category-type mapping (not key-value)
- Check that items were added to the category
- For `without_replacement`, the pool resets when all items are used

## Next Steps

- [Working with Variables](./variables.md) - Learn more about storing and using participant responses
- [Managing Roles](./roles.md) - Set up role-specific configurations
- [ShowImage Component](./components/image.md) - Detailed image component documentation
- [ShowVideo Component](./components/video.md) - Detailed video component documentation
