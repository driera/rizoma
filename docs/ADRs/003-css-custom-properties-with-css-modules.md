# 003. CSS custom properties with CSS Modules for component styling

**Date:** 2026-03-17
**Status:** Accepted

## Context

Rizoma needs a styling mechanism that ships sensible defaults while remaining fully
overridable by any method the consumer prefers — token props, inline styles, Tailwind,
CSS-in-JS, or plain CSS. The mechanism must have zero runtime dependencies and work
with SSR.

## Decision

Components use CSS Modules for scoped default styles and CSS custom properties as the
customization surface. The component sets custom properties as inline styles based on
token resolution; the CSS Module references those properties for actual styling. PostCSS
(via postcss-preset-env at stage 2) enables modern CSS features.

## Alternatives Considered

**CSS-in-JS (styled-components, Emotion)** — adds a runtime dependency, couples consumers
to a specific styling solution, and complicates SSR. Rejected because it contradicts the
goal of letting consumers use any styling method.

**Plain CSS with BEM conventions** — no scoping, class name collisions are possible, and
consumers must know internal class names to override. Rejected because CSS Modules solve
scoping for free.

**Utility-first (Tailwind-only)** — couples the library to Tailwind. Consumers who don't
use Tailwind would need it as a dependency. Rejected because it narrows the audience.

## Consequences

- Default styles are scoped and collision-free via CSS Modules
- Consumers override through CSS custom properties — any styling method works
- PostCSS preset-env keeps CSS modern without manual plugin management
- Class names are hashed — consumers who want to target elements directly use the
  `className` prop pass-through, not internal classes
