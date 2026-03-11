# 002. Token cascade: global defaults with component-level overrides

**Date:** 2026-03-11
**Status:** Accepted

## Context

Rizoma ships zero styles. Consumers apply design via a token API. Two questions arose:
should tokens have global defaults that apply across all components, and when should
the token API be designed — upfront or driven by real component needs?

## Decision

Tokens follow a cascade: global tokens define design-wide defaults (primary color, base
spacing, base radius...) ; component-level tokens override them when passed directly. The
token API is built incrementally — each component drives it into existence rather than
being designed in isolation upfront.

## Alternatives Considered

**Upfront token API design** — define the full token surface before writing any component.
Rejected because without real consumers, the API risks being over-engineered or missing
actual needs. Components are cheap to refactor early; a bad API contract is not.

**No global tokens** — each component manages its own tokens independently. Rejected
because it forces consumers to repeat the same values across every component and makes
theme-wide changes expensive.

## Consequences

- Global tokens give consumers a single place to apply theme-wide decisions
- Component-level overrides preserve flexibility for one-off exceptions
