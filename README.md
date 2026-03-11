# rizoma

> Composable, accessible React primitives with a token-based style API — no visual opinions included.

## What it is

Accessibility in React is not hard to understand, but it is hard to maintain. Every project
that needs a dropdown, a dialog, or a combobox ends up reimplementing the same ARIA patterns,
keyboard navigation logic, and focus management from scratch — often getting it subtly wrong,
and always paying the cost again.

Rizoma is a headless component library that handles the hard parts: ARIA roles, keyboard
interactions, focus trapping, screen reader announcements. It ships zero styles. You bring
the design; rizoma brings the behaviour.

Rizoma is built around a token-based style API. Tokens define colour, typography, and
spacing as structured design decisions — not arbitrary values. This makes theming explicit,
consistent, and auditable. A token explorer in Storybook makes the system inspectable at
a glance.

Rizoma targets WCAG AAA compliance across all components. Not as a checkbox — as a
minimum bar that makes the library trustworthy for real products.

## What's built here

- Composable ARIA pattern implementation (roles, states, relationships)
- Keyboard navigation and focus management — correct across browsers and assistive technology
- Token-based design API — colour, typography, spacing as first-class structured decisions
- Headless and compound component patterns — maximum flexibility, zero style lock-in
- TDD with accessibility-specific testing (axe, Testing Library, keyboard simulation)
- Documentation as a product — Storybook stories, token explorer, usage guides, ADRs

## Status

Current milestone: `MVP — in progress`
[Goals →](GOALS.md) · [Tech →](TECH.md) · [Roadmap →](https://github.com/users/driera/projects/1)

## Development

```bash
bun install
bun run dev        # Storybook
bun test           # Vitest (watch)
bun run build      # Library build
```

> Setup instructions will expand as the stack is established.
