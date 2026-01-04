---
title: Design System
sidebar_position: 11
---

# Design System

HyperStudy uses a design system based on CSS custom properties (design tokens) and reusable Svelte components. This ensures visual consistency across the application.

## Design Tokens

Design tokens are CSS custom properties that define our visual language. They're located in `frontend/src/lib/styles/design-tokens.css`.

### Token Categories

#### Colors

```css
/* Primary colors */
--color-primary: #2196f3;
--color-primary-dark: #1976d2;
--color-primary-light: #64b5f6;

/* Status colors */
--color-success: #4caf50;
--color-warning: #ff9800;
--color-error: #f44336;

/* Neutral colors */
--color-background: #121212;
--color-surface: #1e1e1e;
--color-text: #ffffff;
--color-text-secondary: #b0b0b0;
```

#### Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

#### Typography

```css
--font-family: 'Inter', system-ui, sans-serif;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
```

#### Borders & Radius

```css
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-full: 9999px;
--border-width: 1px;
--border-color: #333333;
```

#### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
```

### Using Tokens

Always use tokens instead of hardcoded values:

```css
/* Good */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
}

/* Avoid */
.button {
  background-color: #2196f3;
  padding: 8px 16px;
  border-radius: 8px;
}
```

## Z-Index Management

Z-index values are defined in `frontend/src/lib/styles/z-index.css`:

```css
--z-dropdown: 100;
--z-sticky: 200;
--z-modal-backdrop: 300;
--z-modal: 400;
--z-popover: 500;
--z-tooltip: 600;
--z-toast: 700;
```

Use these to ensure consistent layering:

```css
.modal {
  z-index: var(--z-modal);
}

.tooltip {
  z-index: var(--z-tooltip);
}
```

## Shared Components

Reusable UI components are in `frontend/src/components/shared/`.

### Button

```svelte
<script>
  import Button from '$lib/components/shared/Button.svelte';
</script>

<Button variant="primary" onclick={handleClick}>
  Click Me
</Button>

<Button variant="secondary" disabled>
  Disabled
</Button>

<Button variant="danger" size="small">
  Delete
</Button>
```

**Props:**
- `variant`: `primary` | `secondary` | `danger` | `ghost`
- `size`: `small` | `medium` | `large`
- `disabled`: boolean
- `type`: `button` | `submit` | `reset`

### Modal

```svelte
<script>
  import Modal from '$lib/components/shared/Modal.svelte';
  let showModal = $state(false);
</script>

<Modal
  bind:open={showModal}
  title="Confirm Action"
  onclose={() => showModal = false}
>
  <p>Are you sure you want to proceed?</p>

  <svelte:fragment slot="footer">
    <Button variant="secondary" onclick={() => showModal = false}>
      Cancel
    </Button>
    <Button variant="primary" onclick={handleConfirm}>
      Confirm
    </Button>
  </svelte:fragment>
</Modal>
```

### Input

```svelte
<script>
  import Input from '$lib/components/shared/Input.svelte';
  let value = $state('');
</script>

<Input
  bind:value
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={!isValid ? 'Invalid email' : ''}
/>
```

**Props:**
- `value`: string
- `label`: string
- `type`: `text` | `email` | `password` | `number`
- `placeholder`: string
- `error`: string (displays error message)
- `disabled`: boolean

### SimpleTable

```svelte
<script>
  import SimpleTable from '$lib/components/shared/SimpleTable.svelte';

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ];

  const data = [
    { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob', email: 'bob@example.com', role: 'Member' }
  ];
</script>

<SimpleTable {columns} {data} />
```

### Icon

```svelte
<script>
  import Icon from '$lib/components/shared/Icon.svelte';
</script>

<Icon name="check" size={24} color="var(--color-success)" />
<Icon name="warning" size={16} />
<Icon name="close" />
```

**Available Icons:**
- Navigation: `arrow-left`, `arrow-right`, `chevron-down`, `chevron-up`
- Actions: `check`, `close`, `edit`, `delete`, `add`, `search`
- Status: `warning`, `error`, `info`, `success`
- UI: `menu`, `settings`, `user`, `help`

## Creating New Components

### Component Template

```svelte
<script>
  /**
   * ComponentName - Brief description
   * @component
   */

  /** @type {string} */
  export let variant = 'default';

  /** @type {boolean} */
  export let disabled = false;
</script>

<div
  class="component"
  class:component--disabled={disabled}
  class:component--{variant}
>
  <slot />
</div>

<style>
  .component {
    /* Use design tokens */
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--border-radius-md);
  }

  .component--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .component--primary {
    background: var(--color-primary);
  }
</style>
```

### Guidelines

1. **Use design tokens** - Never hardcode colors, spacing, or typography
2. **Support variants** - Provide props for common variations
3. **Accessibility** - Include ARIA attributes and keyboard support
4. **Documentation** - Add JSDoc comments for props
5. **Slots** - Use slots for flexible content
6. **BEM naming** - Use Block__Element--Modifier pattern for classes

## Storybook Integration

Design tokens are automatically documented in Storybook:

1. **Design Tokens addon** displays all tokens in a panel
2. **Stories** showcase component variants
3. **Controls** let users experiment with props

See [Storybook documentation](./storybook.md) for details.

## Migration Guide

When updating existing components to use the design system:

### Before

```svelte
<style>
  .card {
    background: #1e1e1e;
    padding: 16px;
    border-radius: 8px;
    color: white;
  }
</style>
```

### After

```svelte
<style>
  .card {
    background: var(--color-surface);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    color: var(--color-text);
  }
</style>
```

## Best Practices

1. **Consistent spacing** - Use spacing tokens for all margins and padding
2. **Color semantics** - Use semantic color names (success, error) not literal (green, red)
3. **Responsive tokens** - Consider breakpoint-specific token values
4. **Dark mode ready** - Tokens make theme switching straightforward
5. **Component composition** - Build complex UIs from simple shared components
