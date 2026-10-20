# KPI Card

Compact summary card for a key value and its context. It is built on the Nexus panel surface and keeps the existing `.nx-kpi`, `.nx-kpi-value`, `.nx-kpi-title`, `.nx-kpi-description`, `.nx-kpi-trend`, and `.nx-kpi-update` classes compatible.

## Structure

- `.nx-kpi` / `.nx-kpi-card`: card surface and layout.
- `.nx-kpi-header`: title row.
- `.nx-kpi-indicator`: title with a decorative token-colored marker.
- `.nx-kpi-icon`: circular glass icon container; set `aria-hidden="true"` when decorative.
- `.nx-kpi-body`: value and description.
- `.nx-kpi-footer`: update text, trend, or a secondary `.nx-kpi-action` link.

See `kpi.html` for the complete example. All colors come from the existing Nexus design tokens. The card adapts through the Framework tablet and mobile breakpoints and respects reduced-motion preferences.
