# STRATA Design System

STRATA is a contemporary editorial design system for mobile-first interfaces. Its visual language combines classic newspaper discipline with contemporary magazine clarity.

## Core laws

- **Monochrome establishes structure.**
- **Color establishes meaning.** Spectrum is reserved for semantic contrast: red, orange, yellow, green, blue, indigo and violet.
- **Typography leads hierarchy.** Source Sans 3 is the interface family; Source Code Pro is reserved for data and numeric alignment.
- **Physical scale determines structural weight.** `micro → small → medium → large → hero` controls radius, border and elevation monotonically.
- **Semantic importance never overrides physical scale.**
- **Carbon Icons via Iconify is the only icon collection.** Use `iconify-icon` with `carbon:*` names.

## Architecture

```text
apps/catalog-svelte
packages/tokens
packages/core
packages/components
packages/testing
tooling
docs
```

## Commands

```bash
pnpm install
pnpm catalog
pnpm check
pnpm test:visual
pnpm test:a11y
```

The Svelte catalog is a development-only workspace app. Published Web Components remain in `@strata/components`.
