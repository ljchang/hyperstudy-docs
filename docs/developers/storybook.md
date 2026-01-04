---
title: Storybook
sidebar_position: 10
---

# Storybook

HyperStudy uses [Storybook](https://storybook.js.org/) for component development, documentation, and visual testing. Our Storybook is deployed at **[storybook.hyperstudy.io](https://storybook.hyperstudy.io)**.

## Overview

Storybook provides:
- **Live component demos** for all experiment components
- **Interactive controls** to test different configurations
- **Auto-generated documentation** from component schemas
- **Visual regression testing** baseline
- **Design token reference**

## Running Locally

```bash
cd frontend
npm run storybook
```

This starts Storybook at `http://localhost:6006`.

## Story Structure

Stories are located in `frontend/src/stories/` and organized by category:

```
src/stories/
├── experiment/          # Experiment components
│   ├── ShowText.stories.js
│   ├── ShowVideo.stories.js
│   ├── MultipleChoice.stories.js
│   ├── TextInput.stories.js
│   ├── VasRating.stories.js
│   └── ...
├── livekit/             # LiveKit components
│   ├── VideoChat.stories.js
│   └── TextChat.stories.js
├── shared/              # Shared UI components
│   └── MediaDeviceSetup.stories.js
└── utils/               # Story utilities
    └── schemaToArgTypes.js
```

## Creating Stories

### Basic Story Template

```javascript
/**
 * ComponentName Component Stories
 *
 * Brief description of the component.
 */

import MyComponent from '../../components/experiment/MyComponent.svelte';
import { getDefaultConfig, componentTypes } from '../utils/schemaToArgTypes';

const componentType = componentTypes.MYCOMPONENT;
const defaultConfig = getDefaultConfig(componentType);

export default {
  title: 'Experiment/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    config: {
      description: 'Component configuration object',
      control: { type: 'object' }
    }
  },
  parameters: {
    docs: {
      description: {
        component: 'Detailed description for documentation.'
      }
    },
    backgrounds: { default: 'dark' }
  }
};

// Default story
export const Default = {
  args: {
    config: {
      ...defaultConfig,
      // Override specific props
      prompt: 'Example prompt text'
    }
  }
};

// Variation stories
export const WithCustomStyling = {
  args: {
    config: {
      ...defaultConfig,
      backgroundColor: '#1a237e',
      textColor: '#ffffff'
    }
  }
};
```

### Using schemaToArgTypes

The `schemaToArgTypes` utility automatically generates Storybook controls from component config schemas:

```javascript
import {
  schemaToArgTypes,
  getDefaultConfig,
  getComponentInfo,
  componentTypes
} from '../utils/schemaToArgTypes';

const componentType = componentTypes.TEXTINPUT;

// Get component metadata
const info = getComponentInfo(componentType);

// Get default configuration values
const defaultConfig = getDefaultConfig(componentType);

// Generate Storybook argTypes from schema
const argTypes = schemaToArgTypes(componentType);
```

This provides:
- Automatic controls for all config properties
- Correct control types (text, number, boolean, select, etc.)
- Default values from the schema
- Descriptions from schema documentation

## Mock System

Storybook uses mocks to isolate components from runtime dependencies. Mocks are in `frontend/.storybook/mocks/`.

### Available Mocks

| Mock | Purpose |
|------|---------|
| `experimentStore.js` | Experiment state and context |
| `socketClient.js` | WebSocket communication |
| `dataServiceV3.js` | Data collection service |
| `hlsPlayer.js` | HLS video playback |
| `mediaPreloader.js` | Media preloading |
| `firebaseConfig.js` | Firebase services |
| `livekit-client.js` | LiveKit video chat |
| `firebase-firestore.js` | Firestore database |
| `firebase-auth.js` | Firebase authentication |
| `notifications.js` | Notification system |
| `variableManager.js` | Experiment variables |
| `logger.js` | Logging utilities |

### Adding a New Mock

1. Create `frontend/.storybook/mocks/myService.js`:

```javascript
// Mock implementation of myService
export function myFunction() {
  console.log('[Mock] myFunction called');
  return 'mocked value';
}

export default {
  myFunction
};
```

2. Add alias in `frontend/.storybook/main.js`:

```javascript
resolve: {
  alias: {
    '$lib/services/myService': resolve(__dirname, 'mocks/myService.js'),
    '../../lib/services/myService': resolve(__dirname, 'mocks/myService.js'),
  }
}
```

## Storybook Addons

We use the following Storybook addons:

### Essentials
Standard controls, actions, viewport, and docs panels.

### Design Token Addon
Displays CSS custom properties (design tokens) in a dedicated panel:
- Colors
- Spacing
- Typography
- Z-index values

## Embedding in Documentation

Stories can be embedded in Docusaurus docs using the `StorybookEmbed` component:

```jsx
import StorybookEmbed from '@site/src/components/StorybookEmbed';

// Basic embed
<StorybookEmbed story="experiment-textinput--default" height="400px" />

// With controls panel
<StorybookEmbed story="experiment-vasrating--default" showControls height="600px" />
```

### Story ID Format

Story IDs follow the pattern: `category-componentname--storyname`

Examples:
- `experiment-showtext--default`
- `experiment-multiplechoice--with-images`
- `livekit-videochat--default`

## Deployment

Storybook is automatically deployed when changes are pushed to:
- `.storybook/` configuration
- `src/stories/` story files

The deployment workflow is in `.github/workflows/deploy-storybook.yml`.

## Best Practices

1. **One story per variant** - Create separate stories for different configurations
2. **Use defaultConfig** - Start from schema defaults, override only what's needed
3. **Document variations** - Add meaningful descriptions to each story
4. **Test interactions** - Use stories to verify interactive behavior
5. **Keep mocks minimal** - Only mock what's necessary for isolation
6. **Tag with autodocs** - Enable automatic documentation generation

## Troubleshooting

### Component Not Rendering

Check if a required module needs mocking. Look for import errors in the browser console.

### Missing Controls

Ensure the component is using `schemaToArgTypes` or has explicit `argTypes` defined.

### Styles Not Applied

Design tokens are loaded in `preview.js`. Verify the token file is imported correctly.
