# Tech

> Technical source of truth. Decisions made before any code was written.
> Updated as the stack evolves.

## Stack

| Area            | Decision     | Notes                                                               |
| --------------- | ------------ | ------------------------------------------------------------------- |
| Language        | TypeScript   | Strict mode                                                         |
| Runtime         | Browser      | No Node runtime concerns beyond tooling                             |
| Framework       | React + Vite | Component library                                                   |
| Package manager | Bun          | Faster installs and script execution; `bun publish` to npm registry |

## Toolchain

| Tool         | Decision                                 | Notes                                             |
| ------------ | ---------------------------------------- | ------------------------------------------------- |
| Linter       | ESLint 9 flat config + typescript-eslint | `eslint.config.js` flat config format             |
| Formatter    | Prettier                                 | Format-on-save in editor; `format:check` in CI    |
| Type checker | tsc strict                               | `--noEmit`; watch mode available for dev          |
| Test runner  | Vitest + Testing Library + jest-axe      | Vitest in watch mode for dev, `vitest run` for CI |
| Build        | Vite library mode + vite-plugin-dts      | ESM + CJS + `.d.ts` output                        |

## Scripts

| Script            | Command                | When                            |
| ----------------- | ---------------------- | ------------------------------- |
| `dev`             | `storybook dev`        | Dev — Storybook                 |
| `build`           | `vite build`           | CI + release — library build    |
| `build:storybook` | `storybook build`      | CI deploy                       |
| `lint`            | `eslint src`           | CI + manual                     |
| `format:check`    | `prettier --check .`   | CI                              |
| `format`          | `prettier --write .`   | Manual / contributor onboarding |
| `typecheck`       | `tsc --noEmit`         | CI + manual                     |
| `typecheck:watch` | `tsc --noEmit --watch` | Dev (watch)                     |
| `test`            | `vitest`               | Dev (watch)                     |
| `test:ci`         | `vitest run`           | CI (single pass)                |

## Deploy

| Target                           | Notes                                    |
| -------------------------------- | ---------------------------------------- |
| GitHub Pages (`gh-pages` branch) | Storybook build deployed on push to main |
| npm registry                     | Library published via `bun publish`      |

## CI

Runs on every PR and push to `main`.

**Validate job:** `lint` → `format:check` → `typecheck` → `test:ci` → `build`

**Deploy job** (push to `main` only, after validate passes): `build:storybook` → deploy to `gh-pages`
