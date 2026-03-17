# 005. Default styles shipped over fully headless

**Date:** 2026-03-17
**Status:** Accepted

## Context

Rizoma was initially positioned as a headless library shipping zero styles. During Button
design, we reconsidered: requiring every consumer to write all styles from scratch raises
the barrier to adoption and makes the library harder to evaluate.

## Decision

Rizoma ships sensible default styles for every component. Consumers who don't customize
anything get a usable, accessible UI out of the box. Consumers who need to adapt the
look use the token API (props, provider, or CSS custom properties) or any CSS method
they prefer.

The defaults are implemented via CSS Modules referencing CSS custom properties, so they
are scoped, low-specificity, and trivially overridable.

## Alternatives Considered

**Fully headless (zero styles)** — maximum flexibility, but every consumer must write
all styles before anything renders. Rejected because it slows adoption and makes the
library impossible to evaluate visually without extra work.

**Opinionated styled library** — ships a complete design system with strong opinions.
Rejected because it contradicts the goal of letting consumers own their design. Rizoma's
defaults are intentionally minimal and overridable.

## Consequences

- Lower barrier to adoption — `<Button>` works and looks reasonable with zero config
- AAA compliance is visible out of the box (default palette meets contrast requirements)
- Documentation and messaging should reflect "sensible defaults, fully customizable"
  rather than "headless" or "zero styles"
- GOALS.md language should be updated to match this positioning
