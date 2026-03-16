# Context: Add Vitest with Testing Library and jest-axe (#3)

## Problem

The test infrastructure is half-bootstrapped. Vitest runs and the smoke test passes, but two
packages are missing (`@testing-library/user-event`, `jest-axe`), the test config lives inside
`vite.config.ts` mixing build and test concerns, and there is no setup file wiring matchers.

### Problem Space

Every component in Rizoma must meet AAA accessibility compliance. `jest-axe` provides programmatic
axe audits that make this verifiable in tests. `@testing-library/user-event` simulates real browser
interactions (keyboard, pointer) rather than synthetic events, which is required for accurate
behaviour and a11y testing. Neither is installed yet.

The test config being embedded in `vite.config.ts` will cause friction as both configs grow — build
exclusions, coverage settings, and reporters belong in the test config, not the build config.

### Edge Cases

- `setupFiles` in `vitest.config.ts` must not reference `src/setupTests.ts` until that file exists,
  or Vitest will error at startup.

### Constraints

- Trunk-based development — no PRs, commits go straight to main.
- TDD — tests before or alongside implementation.
- All tooling must work with Bun as the package manager and script runner.

## Solution

### Approach

Standalone `vitest.config.ts` — extract test configuration into its own file using `defineConfig`
from `vitest/config`. Vitest picks it up automatically. This cleanly separates build and test
concerns, which will diverge as the project adds coverage, reporters, and setup files.

### Architecture

Three targeted changes:
1. Install `@testing-library/user-event` and `jest-axe` as dev dependencies.
2. Create `vitest.config.ts` with jsdom environment and the React plugin.
3. Remove the `test` block from `vite.config.ts`.

`src/setupTests.ts` is intentionally deferred — it will be created alongside the first component
test (issue #7) when jest-dom and jest-axe matchers are actually needed.

### Components

- `vitest.config.ts` — new file. Uses `defineConfig` from `vitest/config`, includes
  `@vitejs/plugin-react` for JSX transform, sets `environment: 'jsdom'`. No `setupFiles` entry
  until `src/setupTests.ts` exists.
- `vite.config.ts` — `test` block removed, otherwise unchanged.
- `package.json` / `bun.lock` — `@testing-library/user-event` and `jest-axe` added as dev deps.

### Data Flow

Pure tooling — no runtime data flow. Execution path: `bun run test:ci` → Vitest reads
`vitest.config.ts` → spins up jsdom environment → runs `src/index.test.ts` → exits 0.

### Error Handling

Only realistic failure: `setupFiles` referencing a non-existent file causes Vitest to error at
startup. Avoided by omitting `setupFiles` from `vitest.config.ts` until `src/setupTests.ts` is
created.

### Testing

Existing smoke test (`expect(true).toBe(true)`) in `src/index.test.ts` is sufficient — it confirms
the runner is wired correctly and `bun run test:ci` exits 0. No additional tests needed for a
config-only change.

## Open Questions

None.
