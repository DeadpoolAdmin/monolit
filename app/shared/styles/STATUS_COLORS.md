# Status Color Variables

This file documents the shared status color variables available throughout the application. These colors ensure consistency across all modules for displaying order statuses, notifications, and other status indicators.

## Location

All status color variables are defined in:
```
app/shared/styles/_variables.scss
```

## Available Status Colors

### Finished Status
- **Background**: `$finished` - `#60ba62` (green)
- **Text**: `$finished-text` - `#238f45` (dark green)
- **Usage**: For completed or finished orders/tasks

### Canceled Status
- **Background**: `$canceled` - `#9db3ce` (blue-gray)
- **Text**: `$canceled-text` - `#091842` (dark blue)
- **Usage**: For canceled orders/tasks

### Ready/Accepted Status
- **Background**: `$ready` - `#ccf1eb` (light teal)
- **Text**: `$ready-text` - `#34b69b` (teal)
- **Usage**: For orders ready for pickup or accepted items
- **Aliases**: `$accepted` and `$accepted-text` (same colors)

### Confirmed Status
- **Background**: `$confirmed` - `#d1e9da` (light green)
- **Text**: `$confirmed-text` - `#238f45` (dark green)
- **Usage**: For confirmed orders/reservations

### Rejected Status
- **Background**: `$rejected` - `#e45954` (red)
- **Text**: `$rejected-text` - `#650400` (dark red)
- **Usage**: For rejected orders/requests

### Pending Status
- **Background**: `$pending` - `#e0d4fc` (light purple)
- **Text**: `$pending-text` - `#5c48cd` (purple)
- **Usage**: For pending/awaiting confirmation items

### In Progress Status
- **Background**: `$in_progress` - `#e0d4fc` (light purple)
- **Text**: `$in_progress-text` - `#5c48cd` (purple)
- **Usage**: For items currently being processed

## How to Use

### 1. Import in SCSS Files

At the top of your module's SCSS file, import the variables using the modern `@use` syntax:

```scss
@use "@shared/styles/variables" as *;
```

Note: The `as *` allows you to use variables directly without a namespace prefix.

### 2. Use the Variables

```scss
.status-badge {
  &.pending {
    background-color: $pending;
    color: $pending-text;
  }
  
  &.finished {
    background-color: $finished;
    color: $finished-text;
  }
  
  &.rejected {
    background-color: $rejected;
    color: $rejected-text;
  }
}
```

### 3. Status Classes

For quick status styling, you can use the global utility classes defined in `app/modules/Settings/styles/global.scss`:

```tsx
<span className="pending">Pending</span>
<span className="finished">Finished</span>
<span className="rejected">Rejected</span>
<span className="ready">Ready</span>
```

## Current Usage

These variables are currently used in:

- **MyOrders Module** - Order list items and status badges
- **Notifications Module** - Notification status indicators and order table
- **Settings Module** - Global status utility classes
- **Toast/Alert System** - Toast notification status colors

## Migration Notes

If you find hardcoded status colors in your code (e.g., `#e45954`, `#5c48cd`), please replace them with the appropriate status color variables to maintain consistency.

## Adding New Status Colors

If you need to add a new status color:

1. Add the variables to `app/shared/styles/_variables.scss`
2. Follow the naming convention: `$status-name` and `$status-name-text`
3. Add documentation here
4. Add utility class in `app/modules/Settings/styles/global.scss` if needed

