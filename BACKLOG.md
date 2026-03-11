# Backlog

> Ordered product backlog. Convert to GitHub issues with `/write-issue` when ready to work.

---

## Engineering tasks

Must be completed before product work starts. Listed in order.

### 1. Bootstrap project

Scaffold the project with Vite, configure TypeScript strict mode, and set up Vite in library mode.

- Run `bun create vite` with React + TypeScript template
- Enable strict mode in `tsconfig.json`
- Convert Vite to library mode; add `vite-plugin-dts`
- Declare `main`, `module`, `types`, and `exports` in `package.json`
- Add all scripts from TECH.md
- AC: `bun run build` produces `dist/` with `.js`, `.cjs`, and `.d.ts`; `bun run typecheck` exits 0; `bun run lint` exits 0

---

### 2. Add Prettier

- Add Prettier config
- Add `eslint-config-prettier` to avoid ESLint conflicts
- AC: `bun run format:check` exits 0

---

### 3. Add Vitest

- Install Vitest + Testing Library + jest-axe
- Write `vitest.config.ts` with jsdom environment and setup file
- Write `src/test/setup.ts` importing jest-dom matchers
- Write one smoke test
- AC: `bun run test:ci` exits 0

---

### 4. Add Storybook

Dev environment for component documentation and the token explorer.

- Install and configure Storybook with React + Vite
- Add `@storybook/addon-a11y` — AAA compliance auditable inline for every story
- Add a minimal story to confirm it runs
- AC: `bun run dev` opens Storybook with the a11y panel active

---

### 5. Set up CI workflow

Validate on every PR and push to main. Deploy Storybook on push to main.

- **Validate job:** `lint` → `format:check` → `typecheck` → `test:ci` → `build`
- **Deploy job** (push to main only, after validate passes): `build:storybook` → deploy to `gh-pages`
- AC: green CI on a passing PR; Storybook published to GitHub Pages on merge to main

---

## MVP — Milestone 1

Items are listed in priority order (top = highest).

### 1. Button component

First interactive component and the vehicle that drives the initial token API into existence.

- Design the token structure (naming, categories, types) against real Button needs
- Implement headless Button with correct ARIA roles and keyboard behavior
- Token-styled via the emerging token API
- AAA-compliant (contrast, focus visibility, interaction states)
- AC: axe audit passes at AAA; keyboard and screen reader behavior verified; token API serves at least focus, color, and spacing

---

### 2. Link component

Navigation primitive that exercises and extends the token API established by Button.

- Implement headless Link with correct ARIA and keyboard behavior
- Token-styled, AAA-compliant
- Extend token API where Link reveals new needs
- AC: axe audit passes at AAA; distinguishable from body text without color alone

---

### 3. Typography component

Text rendering primitive that reveals any remaining gaps in the token API — especially type tokens.

- Implement headless Typography with semantic element mapping
- Token-styled (font family, size, weight, line height)
- AAA-compliant (contrast ratios, minimum text size)
- AC: axe audit passes at AAA; correct heading hierarchy enforced

---

### 4. Stabilize token API

Formalize and harden the token system after three real consumers have proven it. Introduce global tokens as fallback defaults — components use global values unless overridden at the component level (e.g. `global.accent` as default button background, `global.radius` as default border radius). Refactor Button, Link, and Typography to adopt the cascade.

- Define global token shape: primary color, base spacing, base radius
- Implement cascade resolution: component token → global token fallback
- Refactor existing components to use cascade — simplifying their token consumption
- Review naming consistency across all tokens
- Write TypeScript types for the full token surface
- Document the token contract
- AC: global tokens apply by default; component-level overrides work correctly; all three components pass their existing tests after refactor

---

### 5. Token explorer

Storybook page that makes the full token surface visible and auditable.

- Display all tokens (color, typography, spacing) in a structured Storybook page
- Leverage Storybook doc and addon ecosystem
- AC: design system engineers can inspect every token decision without leaving Storybook
