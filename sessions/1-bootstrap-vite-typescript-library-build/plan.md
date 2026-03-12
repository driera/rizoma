# Plan: Bootstrap project with Vite, TypeScript strict mode, and library build

## Context

Rizoma is a headless React component library. This issue creates the entire project foundation from scratch — there is no `package.json`, no source code, and no toolchain yet. The repo contains only git config, CI workflow, and documentation.

The approach is: scaffold with `bun create vite` (React + TypeScript template), strip out the app shell, then harden each config file one at a time.

**Files involved:**

- `package.json` — created by scaffold, then rewritten for library distribution
- `vite.config.ts` — created by scaffold, then converted to library mode + Vitest config
- `tsconfig.json` — created by scaffold, then hardened to strict mode
- `eslint.config.js` — written fresh for ESLint 9 flat config
- `prettier.config.js` — new file; formatter config
- `src/index.ts` — replaces the scaffold app entry; minimal library barrel
- `src/index.test.ts` — trivial test to prove Vitest pipeline works

**Conventions:**

- Package manager: Bun (`bun install`, `bun run <script>`)
- All scripts defined in TECH.md must be present in `package.json`
- ESLint 9 uses flat config (`eslint.config.js`) — not `.eslintrc`
- Vitest config lives inside `vite.config.ts`, not a separate file
- `vite-plugin-dts` must have `include: ['src']` to emit `.d.ts` correctly

---

## Tasks

### [x] 1. Scaffold the project with `bun create vite`

Run `bun create vite . --template react-ts` in the repo root to generate the baseline. This gives us a valid React + TypeScript setup to convert step by step.

Use cases to cover:

- Scaffold completes without errors
- `package.json`, `vite.config.ts`, `tsconfig.json`, and `src/` are generated

---

### [x] 2. Strip the app shell and add the library entry point

Delete all scaffold app files (`src/main.tsx`, `src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/`, `public/`, `index.html`). Replace with a minimal `src/index.ts` that is valid TypeScript (empty export or trivial placeholder).

Use cases to cover:

- `src/index.ts` exists and is valid TypeScript
- No app shell files remain

---

### [x] 3. Harden `tsconfig.json` to strict mode

Update `tsconfig.json`: `strict: true`, `jsx: react-jsx`, `moduleResolution: bundler`, `include: ['src']`. Remove conflicting scaffold settings.

Use cases to cover:

- `tsc --noEmit` exits 0 against `src/index.ts`
- `strict: true` is present and active

---

### [x] 4. Convert Vite to library mode and add vite-plugin-dts

Install `vite-plugin-dts`. Rewrite `vite.config.ts`: `build.lib` with `entry: 'src/index.ts'`, `formats: ['es', 'cjs']`, `fileName: 'rizoma'`. Add `vite-plugin-dts` with `include: ['src']`. Externalize React and React-DOM. Add Vitest `test` config with `environment: 'jsdom'`.

Use cases to cover:

- `bun run build` exits 0
- `dist/` contains `rizoma.js` (ESM), `rizoma.cjs` (CJS), and `rizoma.d.ts`
- React is not bundled into the output

---

### [x] 5. Update `package.json` for library distribution

Set `name: "rizoma"`, `version: "0.0.0"`, `type: "module"`. Add `main`, `module`, `types`, and `exports` pointing at `dist/`. Move React to `peerDependencies`. Wire all scripts from TECH.md: `dev`, `build`, `build:storybook`, `lint`, `format`, `format:check`, `typecheck`, `typecheck:watch`, `test`, `test:ci`. (`dev` and `build:storybook` will fail until issue #4 — expected.)

Use cases to cover:

- All required scripts are present
- `main`, `module`, `types`, `exports` resolve to correct `dist/` paths
- React is in `peerDependencies`, not `dependencies`

---

### [x] 6. Add ESLint 9 flat config

Install `eslint`, `typescript-eslint`, `eslint-plugin-react`. Write `eslint.config.js` using ESLint 9 flat config format with `typescript-eslint` recommended rules and React plugin rules for `src/**/*.{ts,tsx}`.

Use cases to cover:

- `bun run lint` exits 0
- TypeScript-aware rules are active
- React rules are active

---

### [x] 7. Add Prettier config

Create `prettier.config.js`: `semi: true`, `singleQuote: true`, `trailingComma: "none"`, `endOfLine: "auto"`. Install `prettier`.

Use cases to cover:

- `bun run format:check` exits 0
- `bun run format` runs without error

---

### [x] 8. Wire Vitest and write the smoke test

Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`. Write `src/index.test.ts` with a single `expect(true).toBe(true)` test.

Use cases to cover:

- `bun run test:ci` exits 0
- `bun run typecheck` exits 0 across all source files including the test
