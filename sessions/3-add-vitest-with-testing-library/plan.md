# Plan: Add Vitest with Testing Library and jest-axe (#3)

## Context

This issue completes the test infrastructure bootstrapping. Vitest is already installed and the
smoke test passes, but two packages are missing, and the test config is embedded inside
`vite.config.ts` mixing build and test concerns.

The goal is to install the missing packages, extract the test config into its own
`vitest.config.ts`, and clean the build config. `src/setupTests.ts` is intentionally deferred
to issue #7 — it will be created when the first component test actually needs jest-dom or
jest-axe matchers.

Files directly involved:
- `vite.config.ts` — has a `test` block to remove; otherwise unchanged
- `vitest.config.ts` — new file; owns all test configuration
- `package.json` / `bun.lock` — two new dev deps added

Key constraint: do **not** add a `setupFiles` entry to `vitest.config.ts` — the file it would
reference (`src/setupTests.ts`) doesn't exist yet and Vitest errors at startup if a `setupFiles`
path doesn't resolve.

## Tasks

### [x] 1. Install missing test packages

Install `@testing-library/user-event` and `jest-axe` as dev dependencies. These are required for
component interaction tests and AAA a11y audits respectively — every Rizoma component will use them.

Use cases to cover:
- Both packages appear in `package.json` devDependencies after install
- `bun run test:ci` still exits 0

Commit: `chore: install user-event and jest-axe (#3)`

---

### [x] 2. Extract test config into `vitest.config.ts`

Create `vitest.config.ts` using `defineConfig` from `vitest/config`. Include the React plugin for
JSX transform and set `environment: 'jsdom'`. Then remove the `test` block from `vite.config.ts`
so it is purely a build config.

Use cases to cover:
- `bun run test:ci` exits 0 with Vitest reading the new config file
- `vite.config.ts` contains no `test` block
- No `setupFiles` entry in `vitest.config.ts`

Commit: `chore: extract vitest config into standalone file (#3)`
