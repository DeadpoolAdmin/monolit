# Skeleton Component Examples

## Quick Start

```typescript
import { Skeleton, SkeletonList, SkeletonTable, SkeletonCard } from "@shared/components/Skeleton";
```

## Real-World Examples from the Codebase

### Example 1: ServiceReservationList (Loading Time Slots)

```typescript
import { SkeletonList } from "@shared/components/Skeleton";

const ServiceReservationList = ({ data, loading }) => {
  // Show skeleton when loading reservation data
  if (loading && data.availableTimeOptions) {
    return (
      <div className="reject__popup__available__time__options">
        <SkeletonList
          count={6}                    // Show 6 skeleton items
          itemWidth="17rem"            // Each item is 17rem wide
          itemHeight="6rem"            // Each item is 6rem tall
          gap="2rem"                   // 2rem gap between items
          direction="horizontal"       // Arrange horizontally
        />
      </div>
    );
  }

  // Show actual data when loaded
  return (
    <ListView data={availableDate} ... />
  );
};
```

**Result:** Shows 6 animated skeleton rectangles arranged horizontally while time slots are loading.

---

### Example 2: OrderPopupContent (Loading Order Table)

```typescript
import { SkeletonTable } from "@shared/components/Skeleton";

const OrderPopupContent = ({ data }) => {
  const { getDeviceType } = useResolution();
  const deviceType = getDeviceType();

  if (isOrderLoading) {
    return (
      <div className="order-table order-table-skeleton">
        <SkeletonTable
          rows={deviceType === "TV" ? 3 : 5}  // 3 rows on TV, 5 on tablet
          columns={[
            { width: "10rem", height: "10rem" },  // Image column
            { width: "100%", height: "2.5rem" },   // Item name column
            { width: "8rem", height: "2.5rem" },   // Quantity column
            { width: "8rem", height: "2.5rem" },   // Price column
            { width: "8rem", height: "2.5rem" },   // Status column
            { width: "12rem", height: "5rem" },    // Action button column
          ]}
          showHeader={true}
          headers={["", "Item", "Quantity", "Price", "Status", "Action"]}
        />
      </div>
    );
  }

  // Show actual order table when loaded
  return <OrderTable items={items} ... />;
};
```

**Result:** Shows a complete table skeleton with headers and rows that match the actual table structure.

---

## More Examples

### Example 3: Product Card Loading

```typescript
import { SkeletonCard } from "@shared/components/Skeleton";

const ProductCard = ({ product, loading }) => {
  if (loading) {
    return (
      <SkeletonCard
        showImage={true}
        imageHeight="20rem"
        showTitle={true}
        titleWidth="70%"
        showDescription={true}
        descriptionLines={3}
      />
    );
  }

  return (
    <div className="product-card">
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </div>
  );
};
```

**Result:** Shows an animated skeleton matching the product card structure (image, title, 3-line description).

---

### Example 4: Custom Skeleton Layout

```typescript
import { Skeleton } from "@shared/components/Skeleton";

const CustomLoadingState = () => {
  return (
    <div className="custom-layout">
      {/* Header */}
      <Skeleton width="100%" height="8rem" />
      
      {/* Content area */}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Sidebar */}
        <Skeleton width="30rem" height="60rem" />
        
        {/* Main content */}
        <div style={{ flex: 1 }}>
          <Skeleton width="100%" height="4rem" style={{ marginBottom: '2rem' }} />
          <Skeleton width="100%" height="30rem" style={{ marginBottom: '2rem' }} />
          <Skeleton width="80%" height="4rem" />
        </div>
      </div>
    </div>
  );
};
```

**Result:** Creates a custom layout with header, sidebar, and content area using basic `Skeleton` components.

---

### Example 5: Grid of Cards

```typescript
import { SkeletonCard } from "@shared/components/Skeleton";

const MovieGrid = ({ loading, movies }) => {
  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonCard
            key={index}
            showImage={true}
            imageHeight="25rem"
            showTitle={true}
            titleWidth="90%"
            showDescription={false}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  );
};
```

**Result:** Shows a grid of 12 skeleton movie cards (poster + title) while movies are loading.

---

### Example 6: Vertical List

```typescript
import { SkeletonList } from "@shared/components/Skeleton";

const NotificationList = ({ loading, notifications }) => {
  if (loading) {
    return (
      <SkeletonList
        count={5}
        itemWidth="100%"
        itemHeight="12rem"
        gap="1.5rem"
        direction="vertical"  // Vertical layout
      />
    );
  }

  return (
    <div>
      {notifications.map(notif => <NotificationItem key={notif.id} {...notif} />)}
    </div>
  );
};
```

**Result:** Shows 5 vertically stacked skeleton items with gaps between them.

---

## Component Comparison

| Component | Best For | Key Props |
|-----------|----------|-----------|
| `Skeleton` | Single elements, custom layouts | width, height, borderRadius |
| `SkeletonList` | Lists of items (horizontal/vertical) | count, direction, gap |
| `SkeletonTable` | Tables with rows and columns | rows, columns, headers |
| `SkeletonCard` | Cards with image + text | showImage, showTitle, descriptionLines |

---

## Tips

1. **Match Real Content:** Make skeleton dimensions match your actual content for smoother transitions
2. **Device Responsiveness:** Adjust skeleton count/size based on device type (TV vs Tablet)
3. **Combine Components:** Use multiple skeleton types together for complex layouts
4. **Consistent Timing:** All skeletons use the same 1.5s animation for consistency
5. **Accessibility:** Skeletons are visual-only; ensure proper loading state announcements for screen readers

---

## Animation Customization

To customize the skeleton animation globally, edit `app/shared/components/Skeleton/Skeleton.scss`:

```scss
// Change animation speed
@keyframes skeleton-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Adjust timing in the class
.skeleton-pulse {
  animation: skeleton-pulse 2s ease-in-out infinite; // Change from 1.5s to 2s
}

// Adjust colors
.skeleton-pulse {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,    // Lighter start
    rgba(255, 255, 255, 0.20) 50%,   // Brighter middle
    rgba(255, 255, 255, 0.08) 100%   // Lighter end
  );
}
```

