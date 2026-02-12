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
- **Map choices to media categories** and sample from the selected category (e.g., participant picks "Happy" → random image from the happy folder)
- **Display role-specific content** (e.g., Host sees one video, Viewer sees another)
- **Control draw scope** so participants in the same room see the same stimuli or draw independently
- **Create adaptive experiments** where content changes based on previous responses

## Creating Stimulus Mappings

### Accessing Stimulus Mappings

1. Open your experiment in the Experiment Designer
2. Click on the **"Variables"** tab in the settings panel
3. Scroll down to the **"Stimulus Mappings"** section

### Mapping Types

There are three types of mappings:

| Type | Description | Use Case |
|------|-------------|----------|
| **Key-Value** | Maps specific choices to specific URLs | "Option A" → `imageA.jpg` |
| **Category** | Pool of items with sampling strategies | Show random image from "happy faces" pool |
| **Key-Category** | Maps choices to category folders, then samples from them | Participant picks "Happy" → random image from the happy folder |

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

### Creating a Key-Category Mapping

Key-Category mappings combine the best of both worlds: a variable value selects which category to draw from, and a sampling strategy controls how items are drawn from that category. This is ideal for two-step conditional designs.

1. Enter a mapping name (e.g., `emotionFolders`)
2. Select **"Key-Category"** as the type
3. Choose a sampling strategy (applies to all categories in this mapping):
   - **Random (with replacement)**: Any item can be selected multiple times
   - **Random (without replacement)**: Each item selected only once until pool resets
   - **Sequential**: Items selected in order
4. Choose a **Draw Scope** (see [Draw Scope](#draw-scope) below)
5. Click **"Add Mapping"**
6. Add categories by clicking **"+ Add Category"**:
   - Enter a category name (this must match the variable value that will select it — e.g., `"Happy"`)
   - Select a folder from your media library — all files in that folder become the category's item pool
7. Repeat for each category

**Example:**
```
emotionFolders (Key-Category, without_replacement):
  "Happy" → [happy1.jpg, happy2.jpg, happy3.jpg, ...]  (from Happy/ folder)
  "Sad"   → [sad1.jpg, sad2.jpg, sad3.jpg, ...]        (from Sad/ folder)
  "Angry" → [angry1.jpg, angry2.jpg, angry3.jpg, ...]   (from Angry/ folder)
```

:::tip Refresh folder contents
If you add new files to a media folder after creating the mapping, you can refresh the category to pick up the new files. This is useful when you're iterating on your stimulus set.
:::

:::info Why Key-Category instead of multiple Category mappings?
You could create separate Category mappings for each emotion (`happyImages`, `sadImages`, `angryImages`) and use conditional logic to pick the right one. But Key-Category mappings are simpler: one mapping, one template function call, and the system handles the category selection automatically. This also makes it easy to add new categories later — just add a new folder.
:::

### Draw Scope

Draw Scope controls whether participants in the same room share sampling state or draw independently. It applies to both **Category** and **Key-Category** mappings.

| Scope | Behavior |
|-------|----------|
| **Per-Room** (default) | All participants in the same room share sampling state. If Participant A draws `image1.jpg` (without replacement), Participant B won't get it until the pool resets. |
| **Per-Participant** | Each participant has their own independent sampling state. Two participants in the same room may draw the same image. |

:::note
Draw Scope only affects `without_replacement` and `sequential` strategies. With `random` (with replacement), items can repeat regardless of scope.
:::

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

:::tip lookup() works with Key-Category mappings too
If you call `lookup()` on a Key-Category mapping, it automatically delegates to `lookupAndSample()` using the mapping's default strategy. This means `lookup()` is a universal entry point — it works for Key-Value, Key-Category, and will warn you if you accidentally use it on a plain Category mapping.
:::

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

### The `lookupAndSample()` Function

Use `lookupAndSample()` to look up a category in a Key-Category mapping by a variable's value, then sample a random item from that category.

**Syntax:**
```
{lookupAndSample(variableName, "mappingName")}
{lookupAndSample(variableName, "mappingName", "strategy")}
```

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| `variableName` | The variable whose current value selects the category (no quotes — this is a variable reference) |
| `"mappingName"` | Name of the Key-Category mapping (in quotes) |
| `"strategy"` | Optional override: `"random"`, `"without_replacement"`, or `"sequential"`. If omitted, uses the mapping's default strategy. |

**How it works:**

1. The system reads the current value of the variable (e.g., `emotion` = `"Happy"`)
2. It looks up `"Happy"` in the Key-Category mapping to find the matching category folder
3. It samples one item from that folder using the specified strategy
4. The selected URL is returned

**Examples:**
```
{lookupAndSample(emotion, "emotionFolders")}                           // Uses mapping's default strategy
{lookupAndSample(emotion, "emotionFolders", "without_replacement")}    // Override strategy
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

Let's create an experiment where participants choose an emotion category, then see a random image from that category.

### Step 1: Organize Your Media

Upload images into folders in the Media Manager:

```
Images/
  Happy/
    happy1.jpg
    happy2.jpg
    happy3.jpg
  Sad/
    sad1.jpg
    sad2.jpg
    sad3.jpg
  Angry/
    angry1.jpg
    angry2.jpg
    angry3.jpg
```

### Step 2: Create a Variable

In the Variables tab, create a variable called `chosenEmotion`. This will store the participant's category choice.

### Step 3: Create a Key-Category Mapping

In the Stimulus Mappings section:

1. Enter the name `emotionImages`
2. Select **"Key-Category"** as the type
3. Set the strategy to **"Random (without replacement)"** (so participants see different images each trial)
4. Click **"Add Mapping"**
5. Add three categories:
   - **"Happy"** → select the `Happy/` folder
   - **"Sad"** → select the `Sad/` folder
   - **"Angry"** → select the `Angry/` folder

:::important
The category names ("Happy", "Sad", "Angry") must exactly match the values that will be stored in the variable. If your Multiple Choice options use different casing or wording, the lookup won't match.
:::

### Step 4: Create a Multiple Choice State

Add a Multiple Choice component with:
- **Question:** "Which emotion would you like to explore?"
- **Options:** "Happy", "Sad", "Angry"
- **Output Variable:** `chosenEmotion`

### Step 5: Create a ShowImage State

Add a ShowImage component and enter this in the dynamic URL field:

```
{lookupAndSample(chosenEmotion, "emotionImages")}
```

### How It Works

1. The participant sees the Multiple Choice and selects **"Happy"**
2. The value `"Happy"` is saved to the variable `chosenEmotion`
3. The experiment transitions to the ShowImage state
4. `lookupAndSample(chosenEmotion, "emotionImages")` reads `chosenEmotion` → `"Happy"`
5. It looks up `"Happy"` in the `emotionImages` mapping → finds the Happy folder pool
6. It randomly selects one image from that pool (e.g., `happy2.jpg`)
7. The image is displayed

If this ShowImage state is inside a loop, each iteration draws a new image from the same category (without repeats, thanks to `without_replacement`).

## MultipleChoice Image Source

Instead of using template functions to display images, you can have the Multiple Choice component **automatically assign images to each choice button** from a stimulus mapping pool. This is configured directly in the component settings — no template syntax needed.

### When to Use Each Approach

| Approach | Best For |
|----------|----------|
| **Template functions** (`lookup`, `sample`, `lookupAndSample`) | Displaying images in ShowImage/ShowVideo components *after* a choice is made |
| **MultipleChoice Image Source** | Displaying images *on* the choice buttons themselves, so participants choose by selecting an image |

### Configuration

Set these fields in the Multiple Choice component's **Image Source** settings group:

| Setting | Description | Default |
|---------|-------------|---------|
| **Image Source** | Name of a Category or Key-Category mapping to draw images from | *(empty — disabled)* |
| **Image Source Key Variable** | For Key-Category mappings only: variable whose value selects which category to draw from | *(empty)* |
| **Image Consume Mode** | `"all"` = exclude all drawn images from future trials. `"selected"` = exclude only the image the participant chose. | `"all"` |
| **Draw Scope** | `"room"` = all participants see same images. `"participant"` = independent draws. | `"participant"` |
| **Selected Image Variable** | Variable name to store the URL of the image on the chosen button (for use in later components) | *(empty)* |

### Example 1: Flat Pool (Category Mapping)

A "pick a face" task where each trial shows different random faces on the buttons:

1. Create a **Category** mapping called `facesPool` containing all your face images
2. In the Multiple Choice component:
   - **Image Source:** `facesPool`
   - **Image Consume Mode:** `all` (so used faces don't appear again)
   - **Draw Scope:** `participant`
   - **Selected Image Variable:** `chosenFace`
3. Each choice button displays a random face from the pool
4. After the participant picks one, the chosen face's URL is saved to `chosenFace`
5. You can display it later in a ShowImage component using `{chosenFace}`

### Example 2: Key-Category (Conditional Image Selection)

A two-step design where the first choice determines which image category appears:

1. **State 1:** Multiple Choice asks "Which category?" with options "Happy", "Sad" → saves to `categoryChoice`
2. **State 2:** Multiple Choice with Image Source configured:
   - **Image Source:** `emotionFolders` (a Key-Category mapping)
   - **Image Source Key Variable:** `categoryChoice`
   - **Selected Image Variable:** `chosenImage`
3. The component reads `categoryChoice` (e.g., `"Happy"`), looks up the matching folder in `emotionFolders`, and assigns random images from that folder to each button
4. After selection, `chosenImage` stores the chosen image's URL

### How Image Consumption Works

- **`"all"` mode:** Every image drawn for the choice buttons is removed from the pool, whether or not it was selected. This ensures completely fresh images each trial.
- **`"selected"` mode:** Only the image the participant actually chose is removed. Unchosen images may reappear in future trials.
- When the pool is exhausted, it resets automatically.

## Multi-Participant Experiments

### Draw Scope

When running multi-participant experiments, **Draw Scope** determines whether participants share sampling state:

- **Per-Room** (default): All participants in the same room draw from a shared pool. If Participant A gets `image1.jpg` using `without_replacement`, Participant B won't get it until the pool resets. Sequential sampling advances for all participants together.
- **Per-Participant**: Each participant maintains their own independent pool. Two participants may draw the same image.

Draw Scope is configured on the mapping itself (in the Stimulus Mappings panel) and applies whenever `sample()` or `lookupAndSample()` is called for that mapping, as well as when images are drawn for MultipleChoice Image Source.

### Role-Specific Selection

Use `roleValue()` when different roles should see different content:

```
{roleValue("roleVideos")}
```

This ensures the Host and Viewer see their respective content. Note that `roleValue()` uses Key-Value mappings (not Category), so Draw Scope does not apply.

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

6. **Match category names to variable values**: For Key-Category mappings, the category names must exactly match the values stored by the variable (case-sensitive)

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

### `lookupAndSample()` Returns Empty

- Verify the mapping is a **Key-Category** type (not Key-Value or plain Category)
- Check that the variable's current value matches one of the category names exactly (case-sensitive)
- Ensure the matching category folder contains items

### Images Not Appearing on Multiple Choice Buttons

- Verify the **Image Source** field is set to a valid Category or Key-Category mapping name
- For Key-Category mappings, ensure the **Image Source Key Variable** is set and contains a value that matches a category name
- Check that the mapping pool has enough items for the number of choice buttons

### Same Images Appearing Repeatedly

- Check that **Image Consume Mode** is set to `"all"` (not `"selected"`) if you want completely fresh images each trial
- Ensure the pool has enough items — if the pool is smaller than the number of trials, it will reset and repeat
- In preview mode, sampling state may not persist between states the same way it does in a live experiment

### Draw Scope Not Working as Expected

- Draw Scope only affects `without_replacement` and `sequential` strategies — `random` (with replacement) always allows repeats regardless of scope
- In preview mode, there is no room-level shared state, so Per-Room behavior cannot be fully tested in preview

## Next Steps

- [Working with Variables](./variables.md) - Learn more about storing and using participant responses
- [Managing Roles](./roles.md) - Set up role-specific configurations
- [ShowImage Component](./components/image.md) - Detailed image component documentation
- [ShowVideo Component](./components/video.md) - Detailed video component documentation
- [Multiple Choice Component](./components/multiple-choice.md) - Image Source configuration for choice-based image assignment
