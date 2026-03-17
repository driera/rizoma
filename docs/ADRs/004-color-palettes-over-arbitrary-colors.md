# 004. Color palettes over arbitrary color input

**Date:** 2026-03-17
**Status:** Accepted

## Context

The Button `color` prop needs to drive all color-related properties (background, foreground,
border) across three variants (solid, outline, ghost). The question: should consumers pass
any CSS color value, or select from predefined palettes?

## Decision

The `color` prop accepts a palette key (e.g. `"primary"`). Each palette is a scale of HSLA
primitives (50–900esi) mapped to semantic usage per variant. AAA contrast ratios are guaranteed
per palette by dgn. No arbitrary color input is supported initially.

The initial palette is based on `hsla(195, 100%, 40%, 1)` (#0099CC), shipped as the
`primary` palette.

## Alternatives Considered

**Arbitrary CSS color input** — maximum flexibility, but AAA compliance becomes unprovable
without runtime contrast computation. A color utility would be needed to derive variant
shades, adding complexity and fragility. Rejected because provable accessibility is a core
goal.

**Both palettes and arbitrary colors** — possible, but premature. If a real need for
arbitrary colors arises, a color utility can be added later without breaking the palette
API. Rejected for now to keep the API surface small.

## Consequences

- AAA contrast is provable and guaranteed per shipped palette
- No runtime color computation needed — variant colors are pure lookups
- Consumers cannot use arbitrary colors without defining a new palette
- New palettes can be added incrementally (by the library or by consumers)
