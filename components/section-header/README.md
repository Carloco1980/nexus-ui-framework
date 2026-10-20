# Section Header

## Description

Reusable title hierarchy for Nexus pages and component sections.

## Usage

Use `.nx-section-heading` as the composition wrapper. The label badge, title, and description use the same spacing and typography tokens throughout the framework. Add `.nx-section-content` to the following content block to apply the standard 32 px separation.

```html
<header class="nx-section-heading">
    <span class="nx-badge nx-badge-info nx-section-label">Statistics</span>
    <h2 class="nx-section-title">Statistical analysis</h2>
    <p class="nx-section-description">A short description that is easy to scan.</p>
</header>
<div class="nx-section-content">
    <!-- Section content -->
</div>
```

Use `nx-section-title--compact` and `nx-section-description--compact` for card headings. Use `nx-section-title--display` for a Hero headline. The type scale is fluid and token-based; it adds no responsive breakpoints.

## Classes

- `nx-section-header`
- `nx-section-header-left`
- `nx-section-header-center`
- `nx-section-header-right`
- `nx-section-heading`
- `nx-section-label`
- `nx-section-title`
- `nx-section-title--compact`
- `nx-section-title--display`
- `nx-section-description`
- `nx-section-description--compact`

## Status

Stable.
