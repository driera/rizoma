# Context: Update CI workflow to use Bun, add format check, and add Storybook deploy

## Problem

The existing `.github/workflows/ci.yml` was bootstrapped with npm and is incomplete. It uses `npm ci` instead of Bun, is missing `format:check`, uses `npm test -- --run` instead of `test:ci`, has a `pull_request` trigger that doesn't match the trunk-based workflow, and has no Storybook deploy job.

Also covered: issue #6 (Configure GitHub Pages) — a one-time repo config prerequisite for the deploy job to be verifiable end-to-end.

### Problem Space

CI runs on every push to main. Without the fixes, the workflow uses the wrong package manager, skips format and typecheck strictness, and never deploys Storybook to GitHub Pages.

### Edge Cases

- `peaceiris/actions-gh-pages` will fail loudly if the `gh-pages` branch doesn't exist or Pages isn't enabled — the deploy job must not run until the branch and Pages config are in place.
- `deploy` must never run if `validate` fails — enforced via `needs: validate`.

### Constraints

- Trunk-based development: no `pull_request` trigger.
- Bun is the project package manager — no npm or Node setup actions.

## Solution

### Approach

Single workflow file (`ci.yml`) with two jobs: `validate` and `deploy`. `deploy` is gated on `validate` via `needs: validate`. This is the standard GitHub Actions pattern — clean, readable, and allows independent re-runs.

### Architecture

Single `ci.yml` triggered on `push` to `main` only. Two jobs:

- `validate` — lint, format check, typecheck, test, build
- `deploy` — build Storybook, push to `gh-pages` branch; runs only if `validate` passes

For #6: create an orphan `gh-pages` branch and enable GitHub Pages in repo settings pointing to that branch. Done once before the first deploy.

### Components

- **`validate` job** — `oven-sh/setup-bun@v2`, `bun install`, then steps: `lint` → `format:check` → `typecheck` → `test:ci` → `build`. Each step uses `if: success()`. No `continue-on-error`.
- **`deploy` job** — same Bun setup, `bun run build:storybook`, then `peaceiris/actions-gh-pages@v4` to push `storybook-static/` to `gh-pages`.
- **`gh-pages` branch** — orphan branch created once via `git switch --orphan gh-pages`.
- **GitHub Pages config** — enabled in repo settings, source: `gh-pages` branch, root folder.

### Data Flow

Push to `main` → `validate` job runs all checks sequentially → if all pass, `deploy` job triggers → `build:storybook` outputs to `storybook-static/` → `peaceiris/actions-gh-pages` force-pushes that directory to `gh-pages` branch → GitHub Pages serves it at `https://driera.github.io/rizoma/`.

### Error Handling

- Any failing step in `validate` short-circuits the job — `deploy` never runs thanks to `needs: validate`.
- `peaceiris/actions-gh-pages` fails loudly if `gh-pages` branch doesn't exist or Pages isn't enabled.
- No `continue-on-error` anywhere — every failure surfaces immediately.

### Testing

CI/tooling issue — no unit tests apply. Verification:

- Push a commit to `main` and confirm both jobs go green in the Actions tab.
- Confirm Storybook is accessible at `https://driera.github.io/rizoma/` after deploy.

## Open Questions

None.
