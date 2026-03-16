# Plan: Update CI workflow to use Bun, add format check, and add Storybook deploy

## Context

The CI workflow at `.github/workflows/ci.yml` was bootstrapped with npm and is stale. It needs to be rewritten to use Bun, run all validation scripts correctly, and deploy Storybook to GitHub Pages on every successful push to `main`.

This plan also covers issue #6 (Configure GitHub Pages), which is a one-time repo config prerequisite — the `gh-pages` orphan branch must exist and Pages must be enabled before the deploy job can be verified.

**Files involved:**
- `.github/workflows/ci.yml` — the only file being changed; currently uses npm, is missing steps, and has the wrong trigger

**Conventions:**
- Trunk-based: only `push` to `main` triggers CI — no `pull_request` trigger
- Bun is the package manager — use `oven-sh/setup-bun@v2`, never `actions/setup-node`
- Scripts to use: `lint`, `format:check`, `typecheck`, `test:ci`, `build`, `build:storybook` (all defined in `package.json`)
- No `continue-on-error` on any step

## Tasks

### ✓1. Create the `gh-pages` orphan branch and enable GitHub Pages (#6)

Before the deploy job can be verified, the `gh-pages` branch must exist as an orphan (no history) and GitHub Pages must be configured to serve from it.

Use cases to cover:
- `gh-pages` branch exists in the remote repo
- GitHub Pages is enabled in repo settings with source: `gh-pages` branch, root folder
- A push to `main` after the workflow is updated results in Storybook being served at `https://driera.github.io/rizoma/`

Commit: `chore: create gh-pages orphan branch (#6)`

---

### ✓2. Rewrite `ci.yml` with a `validate` job using Bun (#5)

Replace the existing workflow with a clean `validate` job that uses Bun and runs all checks in the correct order. Remove the `pull_request` trigger and `continue-on-error`.

Use cases to cover:
- Workflow triggers only on `push` to `main` — no `pull_request` trigger
- `oven-sh/setup-bun@v2` is used; no `actions/setup-node`
- `bun install` installs dependencies
- Steps run in order: `lint` → `format:check` → `typecheck` → `test:ci` → `build`
- Each step has `if: success()` — a failure stops the job immediately
- No `continue-on-error` on any step

Commit: `chore: migrate validate job to Bun with full check suite (#5)`

---

### ✓3. Add `deploy` job to push Storybook to `gh-pages` (#5)

Add a second job that builds Storybook and deploys the static output to the `gh-pages` branch using `peaceiris/actions-gh-pages@v4`. This job must only run after `validate` passes.

Use cases to cover:
- `deploy` job has `needs: validate` — never runs if validate fails
- `bun run build:storybook` produces output in `storybook-static/`
- `peaceiris/actions-gh-pages@v4` pushes `storybook-static/` to `gh-pages` branch
- Workflow requires `contents: write` permission for the deploy step
- After a successful push to `main`, Storybook is accessible at `https://driera.github.io/rizoma/`

Commit: `chore: add Storybook deploy job to CI (#5)`

## Dependencies

Task 1 (GitHub Pages setup) must be done before task 3 can be verified end-to-end, but tasks 2 and 3 can be written and committed independently of it.
