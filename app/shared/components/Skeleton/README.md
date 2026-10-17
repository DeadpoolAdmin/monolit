# Skeleton Loading Components

Shared skeleton loading components for displaying loading states with animated placeholders.

## Components

### `Skeleton`
Basic skeleton element with customizable dimensions.

```typescript
import { Skeleton } from "@shared/components/Skeleton";

<Skeleton 
  width="100%" 
  height="2rem" 
  borderRadius="0.5rem" 
/>
```

**Props:**
- `width?: string | number` - Width of skeleton (default: "100%")
- `height?: string | number` - Height of skeleton (default: "2rem")
- `borderRadius?: string | number` - Border radius (default: "0.5rem")
- `className?: string` - Additional CSS classes
- `style?: React.CSSProperties` - Inline styles

---

### `SkeletonList`
Displays a list of skeleton items in horizontal or vertical layout.

```typescript
import { SkeletonList } from "@shared/components/Skeleton";

<SkeletonList
  count={6}
  itemWidth="17rem"
  itemHeight="6rem"
  gap="2rem"
  direction="horizontal"
/>
```

**Props:**
- `count?: number` - Number of skeleton items (default: 3)
- `itemHeight?: string | number` - Height of each item (default: "6rem")
- `itemWidth?: string | number` - Width of each item (default: "17rem")
- `gap?: string | number` - Gap between items (default: "2rem")
- `direction?: "horizontal" | "vertical"` - Layout direction (default: "horizontal")

---

### `SkeletonTable`
Displays a skeleton table with customizable columns and rows.

```typescript
import { SkeletonTable } from "@shared/components/Skeleton";

<SkeletonTable
  rows={3}
  columns={[
    { width: "10rem", height: "10rem" }, // Image column
    { width: "100%", height: "2.5rem" },  // Name column
    { width: "8rem", height: "2.5rem" },  // Quantity column
  ]}
  showHeader={true}
  headers={["Image", "Item", "Quantity"]}
/>
```

**Props:**
- `rows?: number` - Number of skeleton rows (default: 3)
- `columns?: Array<{ width?: string; height?: string }>` - Column configurations
- `showHeader?: boolean` - Show table header (default: true)
- `headers?: string[]` - Header labels

---

### `SkeletonCard`
Displays a skeleton card with optional image, title, and description.

```typescript
import { SkeletonCard } from "@shared/components/Skeleton";

<SkeletonCard
  showImage={true}
  imageHeight="10rem"
  showTitle={true}
  titleWidth="80%"
  showDescription={true}
  descriptionLines={2}
/>
```

**Props:**
- `showImage?: boolean` - Show skeleton image (default: true)
- `imageHeight?: string | number` - Image height (default: "10rem")
- `showTitle?: boolean` - Show skeleton title (default: true)
- `titleWidth?: string | number` - Title width (default: "80%")
- `showDescription?: boolean` - Show skeleton description lines (default: true)
- `descriptionLines?: number` - Number of description lines (default: 2)
- `className?: string` - Additional CSS classes

---

## Usage Examples

### Loading List Items
```typescript
const ServiceReservationList = ({ data, loading }) => {
  if (loading) {
    return (
      <SkeletonList
        count={6}
        itemWidth="17rem"
        itemHeight="6rem"
        gap="2rem"
        direction="horizontal"
      />
    );
  }
  
  return <ListView data={data} />;
};
```

### Loading Table Data
```typescript
const OrderTable = ({ loading }) => {
  if (loading) {
    return (
      <SkeletonTable
        rows={5}
        columns={[
          { width: "10rem", height: "10rem" },
          { width: "100%", height: "2.5rem" },
          { width: "8rem", height: "2.5rem" },
        ]}
        headers={["Image", "Item", "Quantity"]}
      />
    );
  }
  
  return <table>...</table>;
};
```

### Custom Skeleton
```typescript
<div className="custom-loading">
  <Skeleton width="100%" height="20rem" />
  <Skeleton width="80%" height="3rem" style={{ marginTop: "1rem" }} />
  <Skeleton width="60%" height="2rem" style={{ marginTop: "0.5rem" }} />
</div>
```

## Styling

The skeleton components use a pulsing animation defined in `Skeleton.scss`. The animation creates a smooth shimmer effect that moves from left to right.

You can customize the skeleton appearance by:
1. Overriding the `.skeleton-pulse` class
2. Adjusting animation duration in `@keyframes skeleton-pulse`
3. Modifying the gradient colors in the background

## Animation

The skeleton uses a gradient animation that creates a shimmer effect:
- Duration: 1.5s
- Easing: ease-in-out
- Infinite loop
- Gradient colors: rgba(255, 255, 255, 0.05) → 0.15 → 0.05

