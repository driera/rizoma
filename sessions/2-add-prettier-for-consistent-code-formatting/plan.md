# Plan: Add Prettier for consistent code formatting (#2)

## Context

Prettier is already partially set up in this repo: the package is installed (`prettier ^3.8.1`),
`prettier.config.js` exists with project style rules, and the `format`/`format:check` scripts are
wired in `package.json`. `bun run format:check` already exits 0.

The only missing piece is `eslint-config-prettier`, which disables ESLint rules that conflict with
Prettier's output. Without it, ESLint and Prettier can produce conflicting opinions on formatting
(e.g. spacing, quotes, semicolons), causing `bun run lint` to flag correctly-formatted code.

Files directly involved:

- `package.json` — add `eslint-config-prettier` to devDependencies
- `eslint.config.js` — apply `eslint-config-prettier` as the last entry in the extends chain

Pattern to follow: ESLint uses flat config format (`tseslint.config()`). `eslint-config-prettier`
exports a flat-config-compatible object and must go **last** in the extends array so it wins over
any conflicting formatting rules from `typescript-eslint`, `eslint-plugin-react`, etc.

## Tasks

### [x] 1. Install `eslint-config-prettier` and apply it to the ESLint config

Install `eslint-config-prettier` as a dev dependency. Add it as the final entry in the `extends`
array inside `eslint.config.js` so it overrides any formatting-related rules set by earlier configs.

Use cases to cover:

- `bun run lint` exits 0 with no new errors introduced
- `bun run format:check` still exits 0
- ESLint no longer flags code that Prettier has already formatted correctly

Commit: `chore: add eslint-config-prettier to resolve ESLint/Prettier conflicts`
