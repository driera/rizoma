# 001. Use React as the component model instead of Web Components

**Date:** 2026-03-11
**Status:** Accepted

## Context

Rizoma is a headless component library with WCAG AAA compliance as a hard requirement.
Two viable approaches were considered: React components and Web Components (Custom Elements
+ Shadow DOM). The choice shapes the library's consumer base, testing strategy, and
accessibility implementation surface for the entire project.

## Decision

Build with React. The library targets React product developers and design system engineers
as its primary audience. React's component model supports the headless and compound
component patterns central to Rizoma's design.

## Alternatives Considered

**Web Components** — framework-agnostic and native to the browser. Rejected because
Shadow DOM encapsulation breaks ARIA relationships that cross shadow boundaries
(e.g. `aria-labelledby`, `for`/`id` pairings). These are patterns Rizoma must get
right. Working around them adds complexity that directly conflicts with the AAA
compliance goal. Testing Library and axe integration are also more mature in React.

## Consequences

- Library consumers must be using React — no Vue, Svelte, or vanilla JS support
- Compound component and render prop patterns are idiomatic and well-supported
- Testing with Testing Library and axe-core is straightforward
- Framework-agnostic reach is a future option, not ruled out permanently — a
  Web Components wrapper layer could be added after the React core is stable
