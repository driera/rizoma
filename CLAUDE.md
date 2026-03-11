# CLAUDE.md

> Read this at the start of every session.

## Project

**Rizoma** — Accessible headless component library with a token-based style API and AAA a11y compliance.

`WORKFLOW_VERSION: forge@v1.1.0`

---

## Session start

1. Read this file
2. Check [GitHub Projects](https://github.com/users/driera/projects/1) for the current sprint
3. Pick the next issue, run `/explore-issue <NNN>`

---

## Workflow loop

```
explore-issue → plan → implement → review
```

Work artifacts per issue live in `sessions/NNN-issue-title/`:
- `exploration.md` — problem space and edge cases
- `design.md` — architecture, components, data flow
- `plan.md` — ordered, testable tasks

---

## Commit convention

```
type: short imperative description
```

Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `a11y`, `dx`

Examples:
```
feat: add loading state with aria-busy
a11y: implement keyboard navigation for listbox
docs: document token system approach
```

---

## Principles

- **TDD** — tests before or alongside implementation, always
- **Documentation-first** — README and issues written before code
- **Short, intentional commits** — each commit tells a story
- **Clean code + functional patterns** — no shortcuts for speed
- **Trunk-based development** — no PRs; commits go straight to main
