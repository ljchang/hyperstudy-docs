---
title: Image Component
sidebar_position: 3
---

# Image Component

The Image component displays static images to participants. It's useful for presenting visual stimuli, diagrams, photos, or any visual content that doesn't require animation.


## Key Features

- Display images from the media library or external URLs
- Support for common image formats (JPG, PNG, GIF, SVG)
- Optional title and description text
- Adjustable sizing and positioning
- Zoom and pan capabilities (optional)
- Timed display with auto-advance option
- Response tracking for image viewing

## When to Use

Use the Image component when you need to:

- Present visual stimuli for recognition or memory tasks
- Show diagrams, charts, or graphs for information presentation
- Display photographs for emotional or perceptual studies
- Create visual choice sets or comparison arrays
- Provide visual instructions or examples

## Configuration

### Basic Settings


| Setting | Description | Default |
|---------|-------------|---------|
| **Title** | Optional heading above the image | *(empty)* |
| **Image Source** | The image file or URL to display | *(required)* |
| **Description** | Caption or description text | *(empty)* |
| **Alt Text** | Accessibility text describing the image | *(empty)* |
| **Auto-advance** | Whether to proceed automatically after viewing | `false` |
| **Viewing Time** | Time in seconds before auto-advancing | `0` |
| **Show Continue Button** | Display a button to proceed | `true` |
| **Continue Button Text** | Label for the continue button | `"Continue"` |

### Image Selection

You can source images in several ways:

1. **Media Library**: Select from previously uploaded images
   - Click "Browse Library" to see available images
   - Filter by tags or search by name
   - Preview images before selecting

2. **Upload New Image**: Add a new image directly
   - Click "Upload New" to open the upload dialog
   - Select an image file from your computer
   - Add metadata and tags for organization

3. **External URL**: Link to an externally hosted image
   - Enter the full URL to the image
   - Note: External images may load more slowly

### Display Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Width** | Image width (px, %, or auto) | `auto` |
| **Height** | Image height (px, %, or auto) | `auto` |
| **Max Width** | Maximum width constraint | `100%` |
| **Alignment** | Horizontal positioning | `center` |
| **Border** | Border style and width | `none` |
| **Border Radius** | Corner rounding (px or %) | `0px` |
| **Box Shadow** | Shadow effect | `none` |
| **Background Color** | Color behind the image | `transparent` |

### Interactive Features

| Setting | Description | Default |
|---------|-------------|---------|
| **Enable Zoom** | Allow participants to zoom in on the image | `false` |
| **Enable Pan** | Allow moving around when zoomed in | `false` |
| **Initial Zoom** | Starting zoom level (1.0 = 100%) | `1.0` |
| **Max Zoom** | Maximum allowed zoom level | `3.0` |
| **Clickable Areas** | Define interactive regions on the image | `none` |

## Advanced Features

### Clickable Areas

You can define regions on the image that participants can click on:

1. Enable "Clickable Areas" in the configuration
2. Use the area editor to draw regions on the image
3. For each area, configure:
   - Region name (for data collection)
   - Action when clicked (store value, show message, advance state)
   - Visual highlight on hover (optional)

This is useful for anatomy identification, visual search tasks, or interactive diagrams.

### Timed Display

Control how long images are displayed:

- **Fixed Duration**: Show the image for a precise time period
- **Minimum Viewing Time**: Require participants to view for at least this long
- **Automatic Advancement**: Proceed to the next state after the time expires
- **Timer Display**: Show or hide the countdown/up timer

### Image Sequences

For sequential image presentation:

1. Create an array of image sources
2. Use state variables to track the current index
3. Configure state transitions to advance through the sequence
4. Use timing controls for standardized exposure durations

### Response Tracking

Collect data about participant interaction with images:

- **Viewing Time**: How long they looked at the image
- **Zoom Actions**: Whether and how much they zoomed
- **Click Areas**: Which regions they clicked and in what order
- **Scroll Tracking**: How they scrolled through larger images

## Image Preparation Best Practices

### File Formats

- **JPG/JPEG**: Best for photographs and complex images with many colors
- **PNG**: Best for images with transparency or text
- **SVG**: Best for diagrams, icons, or any image that needs scaling
- **GIF**: Use only for simple animations (consider Video component for complex animations)

### Image Optimization

Before uploading:

1. **Size Appropriately**: Resize images to the display size you need
2. **Compress Files**: Optimize file size while maintaining quality
3. **Standardize Dimensions**: Use consistent sizes for similar images
4. **Consider Bandwidth**: Keep total size under 1MB when possible
5. **Check Resolution**: Ensure text in images is readable

### Accessibility Considerations

Make your images accessible:

1. **Always Add Alt Text**: Provide descriptive alternative text
2. **Consider Color Blind Users**: Don't rely solely on color to convey information
3. **Text Contrast**: Ensure any text on images has sufficient contrast
4. **Don't Embed Critical Text**: Put important instructions in the component text, not in the image

## Examples

### Visual Stimulus Presentation

```
Title: "Facial Expression Recognition"
Image: [facial_expression.jpg]
Description: "Look at this facial expression carefully."
Auto-advance: After 5 seconds
```

### Diagram With Explanation

```
Title: "Human Brain Regions"
Image: [brain_diagram.png]
Description: "This diagram shows the major regions of the human brain. In the next screen, you'll be asked to identify these regions."
Continue Button Text: "I understand"
```

### Interactive Image Map

```
Title: "Identify the Capital City"
Image: [country_map.png]
Clickable Areas: Enabled
- Region 1: "Capital" (correct)
- Region 2-5: "Not the capital" (incorrect)
Data Recording: Store selected region
```

## Component Combinations

The Image component works well combined with:

- **Text Component**: Provide context or instructions for the image
- **Multiple Choice**: Ask questions about the image
- **Rating Scales**: Get responses about the image (e.g., emotional impact)
- **Text Input**: Ask for written descriptions or identifications

## Best Practices

1. **Image Quality**: Use high-quality, clear images appropriate for the task
2. **Consistent Sizing**: Maintain consistent dimensions for image sets
3. **Loading Indicators**: For large images, consider enabling loading indicators
4. **Preview**: Test how images appear on different screen sizes
5. **Alternative Text**: Always include descriptive alt text for accessibility
6. **File Management**: Tag and categorize images for easy reuse
7. **Legal Compliance**: Ensure you have rights to use all images

## Alternatives to Consider

- **Video Component**: When you need animation or motion
- **Multiple Images**: When you need to present several images at once
- **Image Sequence**: When you need timed presentation of multiple images