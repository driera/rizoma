# Plan: Button component

## Context

Button is the first Rizoma component. It establishes the patterns every future component will follow: token resolution, default styling via CSS Modules, ARIA behavior, and testing conventions.

The token system does not exist yet — Button drives it into existence. This means the plan includes foundational work (PostCSS config, color palettes, token resolution utility, test setup) alongside the component itself.

### Files involved

- `src/theme/palettes.ts` — color palette definitions (OKLCH scales mapped to semantic usage per variant)
- `src/theme/resolveTokens.ts` — utility that merges global defaults → component defaults → instance props into a `CSSProperties` record of CSS custom properties
- `src/theme/types.ts` — `RizomaTheme` type definition for the theme object consumers pass to the provider
- `src/theme/RizomaProvider.tsx` — React context provider that writes a typed theme object as CSS custom properties on a wrapper element
- `src/theme/index.ts` — barrel export for the theme system
- `src/components/Button/Button.tsx` — the component: forwardRef, polymorphic `as` prop, variant/color/disabled handling, ARIA behavior
- `src/components/Button/Button.module.css` — scoped default styles referencing CSS custom properties
- `src/components/Button/Button.test.tsx` — rendering, ARIA, keyboard, token resolution, axe audit
- `src/components/Button/Button.stories.tsx` — Storybook controls for all props, all variants visible
- `src/components/Button/index.ts` — barrel export for the component
- `src/index.ts` — library barrel, currently empty
- `postcss.config.js` — PostCSS preset-env at stage 2
- `src/setupTests.ts` — jest-axe and jest-dom matchers for Vitest

### Conventions

- TDD: tests specify behavior before implementation makes them pass
- Commit convention: `type: short message (#7)`
- CSS Modules for scoped styles, CSS custom properties as the customization surface
- `aria-disabled` instead of native `disabled` — keeps element focusable for assistive technology
- Single `color` prop selects a palette key; variant determines which palette steps map to bg/color/border
- Invalid palette key falls back to `primary` (the only palette shipped initially)
- `radius` is a global token (set via `RizomaProvider` or CSS variable), applied to all components
- `size` (`'s' | 'm'`) is a component-level prop that maps to padding, font-size, and related dimensions

### Non-obvious details

- The `primary` palette is based on `oklch(0.59 0.14 220)` (#0099CC). The scale runs 50–900 by shifting lightness. Ghost variant uses step 50 for background (subtle, desaturated), solid/outline use step 600 as base.
- `resolveTokens()` is designed as a shared utility for all future components, not Button-specific. It takes global defaults, component defaults, and instance props, and returns a flat `CSSProperties` object.
- The consumer's `style` prop is merged last and wins on conflict with token-generated custom properties.
- `className` is appended after the CSS Module class, not replaced.

## Tasks

### 1. Configure PostCSS and test setup ✅

Add `postcss-preset-env` (stage 2) so CSS Modules can use modern CSS features like nesting. Create `src/setupTests.ts` wiring `@testing-library/jest-dom` matchers and `jest-axe` into Vitest. Reference the setup file in `vitest.config.ts`.

Use cases to cover:
- CSS nesting syntax works inside `.module.css` files
- `toBeInTheDocument()` and `toHaveAttribute()` matchers available in tests
- `toHaveNoViolations()` from jest-axe available in tests

Commit: `chore: add postcss and test setup (#7)`

---

### 2. Define the primary color palette ✅

Create `src/theme/palettes.ts` with the primary palette: an OKLCH scale from 50 to 900, keyed by step number. Export a type for palette keys and palette shape. Create the barrel `src/theme/index.ts`.

Use cases to cover:
- Palette has steps 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Each step is a valid OKLCH string
- Step 600 matches the base color `oklch(0.59 0.14 220)`
- Requesting a nonexistent palette key returns the primary palette

Commit: `feat: add primary color palette (#7)`

---

### 3. Create the RizomaProvider ✅

Create `src/theme/RizomaProvider.tsx`. A React context provider that accepts a typed `theme` object and writes its values as CSS custom properties on a wrapper `<div>`. Components read these variables via `resolveTokens()`. Consumers who prefer CSS-only skip the provider and set the variables directly on `:root`.

Use cases to cover:
- Provider renders children inside a wrapper element
- Theme values appear as CSS custom properties on the wrapper
- Nested providers override parent values
- Components outside any provider still work (fall back to hardcoded defaults)
- Theme object is type-safe — autocomplete for valid token keys

Commit: `feat: add RizomaProvider (#7)`

---

### 4. Build the token resolution utility ✅

Create `src/theme/resolveTokens.ts`. The function accepts global token defaults, component-level defaults (derived from variant + palette lookup), and instance-level overrides. It returns a flat `CSSProperties` record of CSS custom properties. The consumer's `style` prop merges last and wins on conflict.

Use cases to cover:
- Returns expected custom properties for each variant (solid, outline, ghost) with the primary palette
- Instance overrides replace component defaults for the same property
- Properties from all three layers are present in the output when they don't conflict
- Unknown palette key triggers fallback to primary

Commit: `feat: add token resolution utility (#7)`

---

### 5. Implement the Button component ✅

Create `src/components/Button/Button.tsx`, `Button.module.css`, and `src/components/Button/index.ts`. The component is a `forwardRef` that renders a `<button>` by default (overridable via `as`), calls `resolveTokens()` to compute inline custom properties, and applies CSS Module styles.

Use cases to cover:
- Renders a `<button>` element by default with the CSS Module class
- `as` prop changes the rendered element
- `variant` defaults to `'solid'`; `'outline'` and `'ghost'` apply their respective token mappings
- `color` selects a palette; defaults to `'primary'`
- `size` prop (`'s' | 'm'`, defaults to `'m'`) drives padding, font-size, and related dimensions via custom properties
- `disabled` sets `aria-disabled="true"`, does not set native `disabled`, suppresses `onClick`
- Space and Enter activate the button; both are suppressed when disabled
- `style` prop merges with token custom properties, consumer values win
- `className` is appended after the module class
- Focus ring is always visible (not suppressed on mouse click)
- Remaining native button props are spread through
- Ref forwarding works

Commit: `feat: add Button component (#7)`

---

### 6. Add accessibility audit and finalize tests ✅

Ensure every variant passes jest-axe with zero violations. Verify the full test suite covers rendering, ARIA, keyboard interaction, token resolution, and accessibility.

Use cases to cover:
- `solid` variant passes axe audit
- `outline` variant passes axe audit
- `ghost` variant passes axe audit
- Disabled state passes axe audit

Commit: `a11y: add axe audit for Button (#7)`

---

### 7. Add Storybook stories ✅

Create `src/components/Button/Button.stories.tsx` with controls for `variant`, `color`, `size`, `disabled`, and `children`. Include a story showing all three variants side by side.

Use cases to cover:
- Default story renders with controls
- Each variant is selectable via control
- Disabled state is togglable
- All-variants story shows solid, outline, and ghost together
- a11y addon panel shows zero violations

Commit: `docs: add Button stories (#7)`

---

### 8. Export Button from the library barrel ✅

Update `src/index.ts` to export `Button` and `ButtonProps`. Remove the placeholder story if it still exists.

Use cases to cover:
- `import { Button } from 'rizoma'` resolves correctly
- `ButtonProps` type is importable
- `RizomaProvider` and `RizomaTheme` are importable
- Library builds without errors

Commit: `feat: export Button from library barrel (#7)`

---

### 9. Add hover state to Button ✅

Button shipped without `:hover` visual feedback. WCAG 2.1 SC 1.4.11 requires interactive states to be visually perceivable. The CSS Module already has `transition` on `background` and `border-color` — there was nothing to transition to.

Hover tokens are derived from the same palette the consumer already passes — no new prop needed. `resolveTokens` gains two new output properties (`--button-hover-bg`, `--button-hover-border-color`) and the CSS Module gains a single `:hover:not([aria-disabled='true'])` rule.

Token mapping:

| Variant | `--button-hover-bg` | `--button-hover-border-color` |
|---------|---------------------|-------------------------------|
| solid   | `palette[700]`      | `palette[700]`                |
| outline | `palette[50]`       | `palette[700]`                |
| ghost   | `palette[100]`      | `palette[200]`                |

For outline and ghost, fill alone (light on white) fails 3:1 non-text contrast regardless of step. Darkening the border is the primary contrast lever.

Use cases to cover:
- `resolveTokens` returns correct `--button-hover-bg` and `--button-hover-border-color` for `solid`, `outline`, and `ghost` variants
- Rendered Button has both hover custom properties in its inline style for each variant
- Disabled Button (`aria-disabled="true"`) does not visually respond to hover (CSS rule excludes it)

Commit: `feat: add hover state to Button (#7)`

---

### 10. Add fontFamily as a global theme token ✅

`Button.module.css` currently uses `font-family: inherit`, which falls back to the browser default (serif) when no ancestor sets a font. Font family should be a first-class global token in `RizomaTheme`, written as `--rizoma-font-family` by `RizomaProvider` and consumed by the Button. The CSS fallback value is `sans-serif`, so the component looks correct even without a provider.

Files involved:
- `src/theme/types.ts` — add `fontFamily?: string` to `RizomaTheme`
- `src/theme/RizomaProvider.tsx` — add `fontFamily` → `--rizoma-font-family` mapping to `themeKeyToVar`
- `src/components/Button/Button.module.css` — change `font-family: inherit` → `font-family: var(--rizoma-font-family, sans-serif)`
- `src/theme/RizomaProvider.test.tsx` — add test case

Use cases to cover:
- `RizomaProvider` with `fontFamily: 'Georgia'` writes `--rizoma-font-family: Georgia` on the wrapper element
- Button rendered without a provider uses `var(--rizoma-font-family, sans-serif)` (CSS fallback applies automatically — no test needed)

Commit: `feat: add fontFamily global token (#7)`

---

### 11. Recalibrate primary palette for AAA contrast compliance

The current palette anchors step 600 at `oklch(0.59 0.14 220)`, which produces ~3.6:1 contrast against white — below WCAG AA (4.5:1). For a library claiming AAA compliance, step 600 must guarantee 7:1 against white. The entire scale rebuilds around a new anchor at approximately `oklch(0.45 0.15 220)`, with lighter steps proportionally lighter and darker steps proportionally darker.

A contrast-ratio test must assert that `palettes.primary[600]` achieves ≥ 7:1 against white. Since browsers don't expose contrast calculation natively in tests, implement a minimal `relativeLuminance` utility (sRGB conversion from OKLCH) and use the WCAG formula directly.

Files involved:
- `src/theme/palettes.ts` — recalibrate the primary scale
- `src/theme/palettes.test.ts` — add contrast ratio assertion for step 600 vs white

Use cases to cover:
- `palettes.primary[600]` achieves ≥ 7:1 contrast ratio against white (`#ffffff`)
- All existing palette tests still pass (steps exist, step 600 is a valid OKLCH string)

Commit: `a11y: recalibrate primary palette for AAA contrast (#7)`
