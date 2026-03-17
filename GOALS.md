# Goals

> Product source of truth. Goals express outcomes, not solutions.
> Updated as the product evolves.

**Milestone 1 (MVP):** A deployed Storybook with Button, Link, and Typography
components — all AAA-compliant and token-styled — alongside a live token explorer
covering color, typography, and spacing.

## Active

### Developers can add accessible components to their React app without writing a single ARIA attribute

- **Subject**: React product developers and design system engineers
- **Context**: ARIA patterns, keyboard navigation, and focus management are
  reimplemented project after project — always at risk of subtle errors that
  hurt real users with assistive technology. Rizoma absorbs that complexity.

### Developers can apply their own design system without overrides or workarounds

- **Subject**: React product developers and design system engineers
- **Context**: Accessible libraries often constrain style, forcing teams to
  choose between correctness and design ownership. Rizoma ships sensible
  defaults fully customizable through token props or any styling method the
  consumer prefers.

### Design system engineers can inspect and audit the full token surface at a glance

- **Subject**: Design system engineers
- **Context**: Tokens are only trustworthy if they're visible. The token
  explorer is built as a Storybook page — leveraging its doc and addon
  ecosystem — making color, typography, and spacing decisions explicit and
  auditable without leaving the development environment.

### Teams can ship UIs knowing every component meets WCAG AAA compliance

- **Subject**: React product developers and design system engineers
- **Context**: AAA is the minimum bar, not a stretch goal. This makes Rizoma
  trustworthy for products with real accessibility requirements.
