# Backlog

> Ordered product backlog. Convert to GitHub issues with `/write-issue` when ready to work.

---

## Engineering tasks

Must be completed before product work starts. Listed in order.

### [#1 Bootstrap project](https://github.com/driera/rizoma/issues/1)

Scaffold the project with Vite, configure TypeScript strict mode, and set up Vite in library mode.

- Run `bun create vite` with React + TypeScript template
- Enable strict mode in `tsconfig.json`
- Convert Vite to library mode; add `vite-plugin-dts`
- Declare `main`, `module`, `types`, and `exports` in `package.json`
- Add all scripts from TECH.md
- AC: `bun run build` produces `dist/` with `.js`, `.cjs`, and `.d.ts`; `bun run typecheck` exits 0; `bun run lint` exits 0

---

### [#2 Add Prettier](https://github.com/driera/rizoma/issues/2)

- Add Prettier config
- Add `eslint-config-prettier` to avoid ESLint conflicts
- AC: `bun run format:check` exits 0

---

### [#3 Add Vitest](https://github.com/driera/rizoma/issues/3)

- Install Vitest + Testing Library + jest-axe
- Write `vitest.config.ts` with jsdom environment and setup file
- Write `src/test/setup.ts` importing jest-dom matchers
- Write one smoke test
- AC: `bun run test:ci` exits 0

---

### [#4 Add Storybook](https://github.com/driera/rizoma/issues/4)

Dev environment for component documentation and the token explorer.

- Install and configure Storybook 8 with React + Vite
- Add `@storybook/addon-a11y` — AAA compliance auditable inline for every story
- Add a minimal story to confirm it runs
- AC: `bun run dev` opens Storybook with the a11y panel active

---

### [#6 Configure GitHub Pages](https://github.com/driera/rizoma/issues/6)

- Create `gh-pages` orphan branch
- Enable GitHub Pages on the repo, source set to `gh-pages` branch

---

### [#5 Update CI workflow](https://github.com/driera/rizoma/issues/5)

Validate on every push to main. Deploy Storybook on push to main. Depends on #1–#4 and #6.

- **Validate job:** `lint` → `format:check` → `typecheck` → `test:ci` → `build`
- **Deploy job** (after validate passes): `build:storybook` → deploy to `gh-pages`
- AC: green CI on push to main; Storybook published to GitHub Pages

---

## MVP — Milestone 1

Items are listed in priority order (top = highest).

### [#7 Button component](https://github.com/driera/rizoma/issues/7)

First interactive component and the vehicle that drives the initial token API into existence.

- Design the token structure (naming, categories, types) against real Button needs
- Implement headless Button with correct ARIA roles and keyboard behavior
- Token-styled via the emerging token API
- AAA-compliant (contrast, focus visibility, interaction states)
- AC: axe audit passes at AAA; keyboard and screen reader behavior verified; token API serves at least focus, color, and spacing

---

### [#8 Text component](https://github.com/driera/rizoma/issues/8)

Text rendering primitive that reveals remaining gaps in the token API — especially type tokens.

- Implement headless Text with semantic element mapping via `variant` prop
- Token-styled (font family, size, weight, line height)
- AAA-compliant (contrast ratios, minimum text size)
- AC: axe audit passes at AAA; correct heading hierarchy enforced

---

### [#9 Stabilize token API](https://github.com/driera/rizoma/issues/9)

Formalize and harden the token system after real consumers have proven it. Introduce global tokens as fallback defaults. Refactor Button and Text to adopt the cascade.

- Define global token shape: primary color, base spacing, base radius
- Implement cascade resolution: component token → global token fallback
- Refactor existing components to use cascade
- AC: global tokens apply by default; component-level overrides work correctly; all tests pass after refactor

---

### [#10 Token explorer](https://github.com/driera/rizoma/issues/10)

Storybook page that makes the full token surface visible and auditable. Read-only for MVP.

- Display all tokens (color, typography, spacing) in a structured Storybook page
- Global tokens and component-level overrides visually distinguished
- AC: design system engineers can inspect every token decision without leaving Storybook

---

## Future

Not committed to a milestone. Revisit after MVP.

### Token editor

Design system engineers can tweak token values live, switch between predefined palettes,
and see all components update in real time across the entire component library. Scoped out
of MVP due to complexity around state propagation, persistence, and override scope.
