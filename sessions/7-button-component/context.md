# Context: Button component

## Problem

As a React developer, I want a headless Button component with built-in ARIA and keyboard behavior so that I can add accessible buttons to my app without writing any ARIA attributes.

### Problem Space

Button is the first Rizoma component. It establishes the patterns — token API, default styling, AAA compliance, testing conventions — that all subsequent components will follow. The token system does not exist yet; Button drives it into existence.

Key requirements:
- Renders `<button>` by default; overridable via `as` prop
- Three variants: solid, outline, ghost
- Single `color` prop selects a palette key, driving all color-related properties
- `disabled` uses `aria-disabled` (not native `disabled`) to keep element focusable
- Ships sensible default styles; fully overridable through multiple methods
- AAA contrast compliance guaranteed through curated palettes

### Edge Cases

- Invalid `color` palette key — falls back to default palette (`neutral`)
- `disabled` + `onClick` — click and keyboard handlers suppressed, element still focusable
- Consumer passes `style` prop that conflicts with token custom properties — consumer wins
- `as` prop with non-interactive element — TypeScript constrains valid types at compile time
- Ghost variant needs visible but subtle background — uses light/desaturated palette value, not transparent

### Constraints

- Zero runtime styling dependencies — CSS Modules + PostCSS only
- Default styles must be overridable by any method: token props, `style` prop, `className`, Tailwind, CSS-in-JS, plain CSS
- AAA contrast ratios must be provable per palette (no arbitrary color input for now)
- Token API is incremental per ADR #002 — built for Button's needs, extended by future components

## Solution

### Approach

CSS custom properties as the token layer, with CSS Modules for scoped default styles and PostCSS for modern CSS features. The component sets custom properties as inline styles based on token resolution; the CSS Module references those properties for actual styling. Consumers override by any method they prefer — the custom properties are the contract, not the class names.

### Architecture

Three layers:

1. **Token system** (`src/theme/tokens/`) — color palette definitions (scales of primitives mapped to semantic usage per variant), spacing defaults, focus ring defaults. `resolveTokens()` utility merges global defaults → component defaults → instance props into a `CSSProperties` record.

2. **Component** (`src/components/Button/Button.tsx`) — React `forwardRef` component, generic over the `as` element type. Calls `resolveTokens()`, renders element with resolved custom properties on `style`, applies CSS Module class, handles ARIA and keyboard behavior.

3. **Default stylesheet** (`src/components/Button/Button.module.css`) — scoped styles referencing custom properties with fallback values. Low specificity, easily overridden.

### Components

**Button** (`src/components/Button/Button.tsx`)
- `forwardRef` component, generic over `as` element type
- Props:
  - `as` — element type, defaults to `'button'`
  - `variant` — `'solid' | 'outline' | 'ghost'`, defaults to `'solid'`
  - `color` — palette key (e.g. `'blue'`, `'neutral'`), selects color scale
  - `disabled` — sets `aria-disabled="true"`, suppresses click/key handlers
  - `style` — merged with token custom properties, user values win
  - `className` — appended after the module class
  - All remaining native props spread through
- Variant → custom property mapping:
  - `solid` → `--button-bg: palette-600`, `--button-color: white`, `--button-border-color: palette-600`
  - `outline` → `--button-bg: transparent`, `--button-color: palette-600`, `--button-border-color: palette-600`
  - `ghost` → `--button-bg: palette-50`, `--button-color: palette-600`, `--button-border-color: transparent`

**Token module** (`src/theme/tokens/`)
- Color palettes: scales of primitives (50–900) per color key
- Semantic mapping per variant: which scale step maps to bg, color, border
- `resolveTokens()`: merges global → component → instance into `CSSProperties`

### Data Flow

1. Consumer renders `<Button variant="outline" color="blue" style={{ margin: 8 }}>`
2. Button calls `resolveTokens()` with global defaults, component defaults (variant + palette lookup), and instance props
3. `resolveTokens()` returns flat `CSSProperties` — custom properties like `--button-bg`, `--button-color`, `--button-border-color`, plus spacing/focus ring tokens. User's `style` merged last, wins on conflict
4. Button renders `<button style={resolvedTokens} className={cx(styles.button, className)}>`
5. CSS Module reads custom properties; inline style sets them

Override paths (all work):
- Token props on component → step 2
- Global token config → step 2
- `style` prop → step 3
- `className` / Tailwind / CSS-in-JS → CSS specificity
- Plain CSS targeting element → CSS specificity

### Error Handling

- Invalid `color` key: fall back to default palette (`neutral`). No throw.
- Invalid `as` element: TypeScript generics constrain at compile time.
- `disabled` + `onClick`: handlers suppressed. No event leaks.
- Missing `children`: TypeScript marks as required. Lint-time catch.

### Testing

**Rendering & ARIA**
- Renders `<button>` by default
- Renders custom element via `as`
- `disabled` sets `aria-disabled="true"`, not native `disabled`
- Disabled button suppresses click handler
- Disabled button remains focusable

**Keyboard & interaction**
- Space and Enter activate the button
- Space and Enter do nothing when disabled
- Focus ring visible on keyboard focus

**Token resolution**
- Default palette applies when no `color` prop
- `color` prop selects correct palette — custom properties match per variant
- `style` prop merges with tokens, user values win
- `className` appended alongside module class

**Accessibility audit**
- Every variant passes jest-axe at AAA level

**Storybook**
- Story with controls for `variant`, `color`, `disabled`, `children`
- All three variants visible side by side
- a11y addon panel clean

## Resolved Questions

- **Palettes:** Ship one initial palette (`primary`) based on `hsla(195, 100%, 40%, 1)` (#0099CC), scale 50–900 by lightness
- **Global token provider:** Hybrid approach — React context provider that writes a typed JS theme object as CSS custom properties on a wrapper element. Consumers who prefer CSS-only skip the provider and set variables directly. Same underlying mechanism either way.
- **PostCSS:** `postcss-preset-env` at stage 2 — bundles nesting, autoprefixer, and spec-aligned transforms in one package

## Open Questions

None at this time.
