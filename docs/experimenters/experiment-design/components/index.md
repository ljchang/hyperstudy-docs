---
title: Component Overview
sidebar_position: 1
---

# Component Overview

Components are the building blocks of interactive experiments in the HyperStudy platform. They provide the interface elements that participants see and interact with. This guide provides an overview of all available components and their uses.

## Understanding Components

Components serve different functions in your experiment:

1. **Experiment States**: The main interactive element in each state
2. **Global States**: Elements that can persist across multiple states


## Component Types

### Experiment States

Experiment States are the main interactive elements in each state. Only one focus component can be active per state.

| Component                                   | Description                                 | Common Uses                         |
| ------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| [Text Display](./text.md)                   | Shows formatted text content                | Instructions, stories, scenarios    |
| [Image](./image.md)                         | Displays static images                      | Visual stimuli, diagrams, photos    |
| [Synchronized Video](./video.md)            | Plays video with precise synchronization    | Stimuli, demonstrations, scenarios  |
| [Multiple Choice](./multiple-choice.md)     | Presents a question with selectable options | Quizzes, surveys, decision tasks    |
| [VAS Rating](./vas-rating.md)               | Visual analog scale for continuous ratings  | Subjective ratings, evaluations     |
| Text Input                                   | Field for free text entry                   | Open questions, form fields         |
| [Audio Recording](./audio-recording.md)     | Records participant audio responses         | Voice responses, think-aloud tasks  |
| [Continuous Rating](./continuous-rating.md) | Real-time continuous rating during stimuli  | Moment-by-moment evaluations        |
| [Trigger](./trigger.md)                     | Hardware trigger send/receive               | fMRI sync, equipment time-locking   |
| Code Component                               | Custom component with JavaScript            | Complex interactive tasks           |
| Waiting                                      | Empty state with optional message           | Transitions, synchronization points |

### Global States

Global states can persist across multiple experiment states, providing consistent functionality throughout the experiment.

| Component                                       | Description                         | Common Uses                           |
| ----------------------------------------------- | ----------------------------------- | ------------------------------------- |
| [Video Chat](./videochat.md)                    | Real-time audio/video communication | Participant interactions, interviews  |
| Text Chat                                        | Text messaging between participants | Text-based communication              |
| [Continuous Rating Bar](./continuous-rating.md) | Persistent rating component         | Ongoing evaluations during activities |
| [Sparse Rating](./sparse-rating.md)             | Time-based rating prompts           | Moment-specific evaluations           |
| [Scanner Pulse Recorder](./scanner-pulse-recorder.md) | Records fMRI scanner TR pulses | fMRI hyperscanning synchronization    |

## Component Configuration

Each component has its own set of configurable properties, but they share some common elements:

### Common Properties

- **Title**: Optional heading text for the component
- **Instructions**: Optional guidance text for participants
- **Width/Height**: Size settings (percentage or pixels)
- **Position**: Placement within the state (if supported)
- **Styling**: Visual appearance options
- **Data Collection**: Variables to store participant responses
- **Visibility**: Which roles can see this component

### Component-Specific Properties

Each component type has unique properties related to its function:

- **Text Component**: Text content, formatting, font options
- **Video Component**: Video source, playback controls, synchronization settings
- **Rating Scales**: Min/max values, labels, step size, orientation
- **Multiple Choice**: Questions, answer options, selection type (single/multiple)

### Text Formatting

All text fields in components support:
- **Variables**: Insert dynamic values using `{variableName}` syntax
- **HTML Tags**: Format text with `<b>`, `<i>`, `<u>`, `<s>`, `<h1>`-`<h6>`, `<br>`, `<p>`

See [Text Component - HTML Formatting](./text.md#using-html-formatting) for details.

## Using Components

### Adding Components to States

To add a focus component to a state:

1. Select a state in the States panel
2. In the Properties panel, find "Focus Component"
3. Select a component type from the dropdown
4. Configure the component properties

{/* Screenshot placeholder: Adding a component to a state */}

### Configuring Global Components

To set up global components:

1. Go to the "Global Components" tab
2. Enable the components you want to use
3. Configure their properties
4. Use the matrix view to set which states show which components

### Component Interactions

Components can interact with each other and with experiment variables:

- Use variables to pass data between components
- Configure component visibility based on interactions with other components
- Use component output to control experiment flow

## Component Layout and Styling

### Basic Layout Options

Control how components appear:

- **Size**: Set width and height
- **Position**: Top, bottom, left, right, or center
- **Margins**: Space around the component
- **Padding**: Space inside the component
- **Alignment**: Text and content alignment

### Advanced Styling

For more control over appearance:

- **Colors**: Background, text, borders
- **Fonts**: Family, size, weight, style
- **Borders**: Width, style, radius
- **Shadows**: Box and text shadows
- **Transitions**: Animation effects

Use the style panel to configure these options.

## Data Collection with Components

Most interactive components can capture participant responses:

1. In the component properties, find "Data Collection"
2. Specify a variable to store the response
3. Configure what data to capture and when

For example:

- Rating scales store the selected rating value
- Multiple choice stores the selected option(s)
- Text input stores the entered text
- Video components can track viewing time and interactions

## Component Best Practices

### General Guidelines

1. **Consistency**: Use similar components consistently throughout your experiment
2. **Simplicity**: Keep components focused on a single task or purpose
3. **Clear Instructions**: Provide clear guidance on how to use each component
4. **Responsiveness**: Test components on different screen sizes
5. **Accessibility**: Ensure components are usable by all participants

### Component-Specific Tips

- **Text**: Keep text concise and scannable
- **Video**: Ensure videos are high quality and properly compressed
- **Rating Scales**: Provide clear labels and appropriate scale ranges
- **Multiple Choice**: Write clear, unambiguous questions and answers
- **Input Fields**: Validate user input when necessary

## Available Components

Explore detailed documentation for each component:

- [Text Display](./text.md)
- [Image Component](./image.md)
- [Synchronized Video](./video.md)
- [Multiple Choice](./multiple-choice.md)
- [VAS Rating Scales](./vas-rating.md)
- [Audio Recording](./audio-recording.md)
- [Video Chat](./videochat.md)
- [Continuous Rating](./continuous-rating.md)
- [Sparse Rating](./sparse-rating.md)
- [Trigger](./trigger.md)
- [Scanner Pulse Recorder](./scanner-pulse-recorder.md)
