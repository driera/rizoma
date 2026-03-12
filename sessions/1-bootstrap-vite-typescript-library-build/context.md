# Context: Bootstrap project with Vite, TypeScript strict mode, and library build

## Problem

The repo has no package.json, no source, and no toolchain. Nothing can be built, tested, or linted. All subsequent component work is blocked until this foundation exists.

### Problem Space

The repo is bootstrapped (git, CI, docs) but has no source code. Stack decisions are fully locked in TECH.md: Bun, React + Vite library mode, TypeScript strict, ESLint 9 flat config, Prettier, Vitest + Testing Library + jest-axe, vite-plugin-dts, Storybook (added in issue #4).

Success: `bun run build` produces `dist/` with `.js`, `.cjs`, and `.d.ts`; `typecheck`, `lint`, and `test:ci` all exit 0 on a minimal entry point. The `dev` and `build:storybook` scripts are included in package.json but will fail until issue #4.

### Edge Cases

- `bun create vite` scaffolds an app — must be converted to library mode manually
- ESLint 9 flat config differs significantly from v8; app shell files may not pass rules and need cleanup or deletion
- `vite-plugin-dts` requires `include: ['src']` in both tsconfig and plugin config to emit correctly
- `package.json` needs `exports`, `main`, `module`, `types` fields for consumers

### Constraints

- Stack fully locked in TECH.md — no deviation
- Storybook not available until issue #4; `dev` and `build:storybook` scripts included but expected to fail

## Solution

### Approach

`bun create vite` with the React + TypeScript template, then harden manually. Scaffolding gives a valid React + TS baseline; every subsequent step is a deliberate, reviewable change. Full control over the final shape without mystery files.

### Architecture

Single-package library repo. The scaffold app shell is replaced with a library entry:

1. Replace `src/main.tsx` with `src/index.ts` (minimal barrel, proves build works)
2. Configure Vite in library mode pointing at `src/index.ts`, outputting ESM + CJS to `dist/`
3. Add `vite-plugin-dts` to emit `.d.ts` alongside JS outputs
4. Set `package.json` `main`, `module`, `types`, and `exports` to point at `dist/`

No `index.html`, no app shell.

### Components

- **`vite.config.ts`** — library mode, `entry: src/index.ts`, `formats: ['es', 'cjs']`, `fileName: 'rizoma'`, `vite-plugin-dts`, React externalized; also contains Vitest `test` config
- **`tsconfig.json`** — strict mode, `jsx: react-jsx`, `moduleResolution: bundler`, `include: ['src']`
- **`eslint.config.js`** — ESLint 9 flat config with `typescript-eslint` recommended + React rules
- **`prettier.config.js`** — `semi: true`, `singleQuote: true`, `trailingComma: "none"`, `endOfLine: "auto"`
- **`src/index.ts`** — minimal barrel entry (empty or trivial export)
- **`src/index.test.ts`** — single trivial test to prove Vitest pipeline works
- **`package.json`** — all scripts wired, `peerDependencies` for React, `exports` map pointing at `dist/`

### Data Flow

Library build pipeline only:

```
src/index.ts → Vite (library mode) → dist/rizoma.js    (ESM)
                                    → dist/rizoma.cjs   (CJS)
                                    → dist/rizoma.d.ts  (vite-plugin-dts)
```

Consumers import from the `exports` map; TypeScript resolves types from `dist/rizoma.d.ts`.

### Error Handling

- **Build fails** — mitigated by setting `include: ['src']` in both tsconfig and `dts({ include: ['src'] })` in Vite plugin config
- **Lint fails on scaffold files** — mitigated by deleting the app shell (`App.tsx`, `main.tsx`, etc.) and replacing with minimal `src/index.ts`
- **Type errors on scaffold** — same mitigation; clean entry point sidesteps generated app types

### Testing

- `src/index.test.ts` — single `expect(true).toBe(true)` test; proves Vitest + config are wired correctly
- No `setupTests.ts` yet — jest-axe matchers added when component work begins (issue #3+)
- Vitest config lives inside `vite.config.ts` to avoid a separate config file

## Open Questions

- None
