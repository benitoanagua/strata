# STRATA Design System

STRATA is a contemporary editorial design system for mobile-first interfaces. Its visual language combines classic newspaper discipline with contemporary magazine clarity.

## Core laws

- **Monochrome establishes structure.**
- **Color is an exception, never a system.** STRATA is grayscale-first (the ink ramp of the editorial CVs); a single accent is optional and disabled by default, and only three desaturated status colors exist, always paired with a non-color cue.
- **Typography leads hierarchy.** Source Serif 4 is the reading (body) family, Source Sans 3 is the interface family (dashboards, menus), and Source Code Pro is reserved for tags, data and numeric alignment. Fonts load from Google Fonts, never from the repository (`@strata/tokens/fonts.css`).
- **Physical scale determines structural weight.** `micro → small → medium → large → hero` controls radius, border and elevation monotonically.
- **Semantic importance never overrides physical scale.**
- **Carbon Icons via Iconify is the only icon collection.** Use `iconify-icon` with `carbon:*` names.

## Architecture

```text
catalog
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

The Svelte catalog is a private development tool at the repository root. Published Web Components remain in `@strata/components`.
