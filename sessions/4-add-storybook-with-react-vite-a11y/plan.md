# Plan: Add Storybook with React, Vite, and a11y addon (#4)

## Context

Storybook is the primary dev environment for Rizoma — every component will be built and documented
here. The a11y addon runs axe audits inline on every story, making AAA compliance visible during
development rather than discovered after the fact.

The `dev` and `build:storybook` scripts are already wired in `package.json` but Storybook itself
is not installed. There is no `.storybook/` directory and no Storybook packages in devDependencies.
No real components exist yet, so the smoke story uses a minimal inline placeholder.

Files that will be created:
- `.storybook/main.ts` — Storybook core config: framework, addons, story glob
- `.storybook/preview.ts` — global decorators/parameters applied to every story
- `src/stories/Placeholder.stories.tsx` — minimal smoke story to confirm setup works

Existing pattern: the project uses `@vitejs/plugin-react` (not SWC). The correct Storybook
framework package is `@storybook/react-vite` — not `@storybook/react-webpack5` or the SWC variant.

## Tasks

### [x] 1. Install Storybook packages

Install `storybook`, `@storybook/react-vite`, and `@storybook/addon-a11y` as dev dependencies.
These are the only packages needed — `@storybook/react-vite` bundles the renderer and builder.

Use cases to cover:
- All three packages appear in `package.json` devDependencies after install

Commit: `chore: install storybook with react-vite framework and a11y addon (#4)`

---

### [x] 2. Configure Storybook

Create `.storybook/main.ts` pointing to the `@storybook/react-vite` framework and registering
`@storybook/addon-a11y`. Create `.storybook/preview.ts` enabling the a11y addon parameters so the
accessibility panel is active on every story.

Use cases to cover:
- `.storybook/main.ts` references the correct framework and addon
- `.storybook/preview.ts` is present (even if minimal)
- `bun run build:storybook` exits 0

Commit: `chore: add storybook config with a11y addon (#4)`

---

### [x] 3. Add smoke story

Create `src/stories/Placeholder.stories.tsx` with a minimal inline React component and one story.
This confirms the full pipeline works end-to-end. The placeholder component exists only to verify
Storybook renders — it will be replaced when real components land.

Use cases to cover:
- `bun run build:storybook` exits 0 with the story included
- Story renders without errors in the a11y panel

Commit: `chore: add placeholder smoke story to verify storybook setup (#4)`
