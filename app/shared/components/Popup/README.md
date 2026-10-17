# Shared Popup Component

A unified, reusable popup/modal component system for the application.

## Components

### `Popup`
The main wrapper component that provides the overlay and container structure.

### `PopupContent`
A helper component for structured popup content with consistent layout.

## Features

- ✅ Consistent overlay and styling across all popups
- ✅ Keyboard navigation support (built-in back button handler)
- ✅ Customizable dimensions, opacity, and z-index
- ✅ Flexible content structure (use `PopupContent` or custom layout)
- ✅ TypeScript support with full type definitions
- ✅ Theme-aware styling using CSS variables

## Basic Usage

### Simple Popup with PopupContent

```tsx
import { Popup, PopupContent } from '@shared/components/Popup';

const MyPopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <PopupContent
        title="Hello World"
        subtitle="This is a simple popup"
        buttons={
          <Button onClick={onClose}>
            Close
          </Button>
        }
      />
    </Popup>
  );
};
```

### Popup with Icon

```tsx
import { Popup, PopupContent } from '@shared/components/Popup';

const SuccessPopup = ({ isOpen, onClose }) => {
  const icon = <img src={successIcon} alt="Success" />;
  
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <PopupContent
        icon={icon}
        title="Success!"
        subtitle="Your action was completed successfully"
        buttons={<Button onClick={onClose}>OK</Button>}
      />
    </Popup>
  );
};
```

### Popup with Custom Keyboard Controls

```tsx
import { Popup, PopupContent } from '@shared/components/Popup';
import { useMemo } from 'react';

const AlarmPopup = ({ isOpen, onStop }) => {
  const keyboardControls = useMemo(() => ({
    isActive: isOpen,
    id: 'alarm-popup',
    ok: onStop,
    back: () => {} // Prevent closing with back button
  }), [isOpen, onStop]);

  return (
    <Popup
      isOpen={isOpen}
      closable={false}
      keyboardControls={keyboardControls}
    >
      <PopupContent
        title="Alarm Ringing"
        buttons={<Button onClick={onStop}>Stop</Button>}
      />
    </Popup>
  );
};
```

### Popup with Multiple Buttons

```tsx
import { Popup, PopupContent } from '@shared/components/Popup';

const ConfirmPopup = ({ isOpen, onConfirm, onCancel }) => {
  const buttons = (
    <>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </>
  );

  return (
    <Popup isOpen={isOpen} onClose={onCancel}>
      <PopupContent
        title="Are you sure?"
        subtitle="This action cannot be undone"
        buttons={buttons}
      />
    </Popup>
  );
};
```

### Popup with Custom Content

```tsx
import { Popup, PopupContent } from '@shared/components/Popup';

const CustomPopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose} width="200rem">
      <PopupContent title="Settings">
        <div className="custom-content">
          {/* Your custom content here */}
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
          </form>
        </div>
      </PopupContent>
    </Popup>
  );
};
```

### Popup with Fully Custom Layout

If `PopupContent` doesn't fit your needs, you can provide your own layout:

```tsx
import { Popup } from '@shared/components/Popup';

const FullyCustomPopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="my-custom-layout">
        <h1>Custom Header</h1>
        <div className="my-content">
          {/* Anything you want */}
        </div>
      </div>
    </Popup>
  );
};
```

## Props

### Popup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Whether the popup is visible |
| `children` | `ReactNode` | required | Content to display inside the popup |
| `onClose` | `() => void` | optional | Callback when popup should close |
| `closable` | `boolean` | `true` | Whether the popup can be closed by clicking overlay or back button |
| `width` | `string` | `'150rem'` | Width of the popup content |
| `height` | `string` | `'auto'` | Height of the popup content |
| `showOverlay` | `boolean` | `true` | Whether to show background overlay |
| `overlayOpacity` | `number` | `0.5` | Opacity of the overlay (0-1) |
| `zIndex` | `number` | `9999` | Z-index for the popup |
| `className` | `string` | `''` | Custom class name for the popup wrapper |
| `contentClassName` | `string` | `''` | Custom class name for the popup content |
| `contentStyle` | `CSSProperties` | `{}` | Custom inline styles for the popup content |
| `keyboardControls` | `object` | auto | Custom keyboard controls configuration |

### PopupContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | optional | Title text or element |
| `subtitle` | `ReactNode` | optional | Subtitle text or element |
| `icon` | `ReactNode` | optional | Icon element to display above title |
| `children` | `ReactNode` | optional | Body content |
| `buttons` | `ReactNode` | optional | Button(s) to display in footer |
| `customContent` | `ReactNode` | optional | Completely custom content (overrides all other props) |

## Size Variants

The popup supports different size presets via className:

```tsx
// Small popup
<Popup className="shared-popup--small" isOpen={true}>
  {/* content */}
</Popup>

// Medium popup (default size)
<Popup className="shared-popup--medium" isOpen={true}>
  {/* content */}
</Popup>

// Large popup
<Popup className="shared-popup--large" isOpen={true}>
  {/* content */}
</Popup>

// Full width
<Popup className="shared-popup--full-width" isOpen={true}>
  {/* content */}
</Popup>
```

## Styling

The popup uses BEM-like naming and CSS variables for theming:

- `.shared-popup` - Main wrapper
- `.shared-popup__overlay` - Background overlay
- `.shared-popup__content` - Content container
- `.shared-popup__header` - Header section
- `.shared-popup__title` - Title element
- `.shared-popup__subtitle` - Subtitle element
- `.shared-popup__icon` - Icon container
- `.shared-popup__body` - Body content
- `.shared-popup__footer` - Footer with buttons

### CSS Variables Used

- `--heading-font-family`
- `--paragraph-font-family`
- `--card-text-color`
- `--screen-height`

## Migration Examples

### Before (Old Pattern)

```tsx
const OldPopup = ({ onClose }) => {
  return (
    <div className="my-popup">
      <div className="background"></div>
      <div className="popup__content">
        <div className="title">Hello</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

### After (New Pattern)

```tsx
import { Popup, PopupContent } from '@shared/components/Popup';

const NewPopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <PopupContent
        title="Hello"
        buttons={<Button onClick={onClose}>Close</Button>}
      />
    </Popup>
  );
};
```

## Benefits

1. **Consistency**: All popups share the same base structure and styling
2. **Maintainability**: Changes to popup behavior apply everywhere
3. **Accessibility**: Built-in keyboard navigation support
4. **Flexibility**: Can use structured content or fully custom layouts
5. **TypeScript**: Full type safety and IntelliSense support
6. **Performance**: Memoized keyboard controls and optimized rendering

