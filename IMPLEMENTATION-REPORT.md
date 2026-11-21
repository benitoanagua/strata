# STRATA Design System — Implementation report

## Current architecture

- pnpm + Turborepo monorepo.
- `@strata/tokens` is the source of design tokens and generated CSS.
- `@strata/core` contains shared contracts and theme utilities.
- `@strata/components` contains publishable Lit Web Components and declaration files.
- `catalog` is the internal Svelte playground.
- `@strata/testing` contains unit, contract, browser and accessibility tests.

## Component catalog

The Svelte app consumes the existing `@strata/components` package and canonical `STRATA_COMPONENT_CATALOG`. Its typed registry describes examples and control metadata; it does not implement component behavior or copy component styles.

The canvas mounts the registered custom element and assigns properties directly to its DOM node. This preserves booleans and typed property values rather than serializing them into attributes. The controls support text, boolean, number and select types, with reset to defaults, background/surface modes and responsive viewports.

## STRATA visual laws

- Monochrome establishes structure; spectrum colors remain semantic.
- Source Sans 3 is the UI family; Source Code Pro is reserved for data and numeric alignment.
- Component geometry follows the Scale Law.
- The catalog imports the published token stylesheet and component stylesheet, and uses the existing semantic CSS variables.
- Carbon via `iconify-icon` remains the only permitted icon collection.

## Validation

The repository has CI tasks for audit, lint, typecheck, unit/contract tests, build, browser checks and accessibility. The full local validation has not been executed in this environment because outbound access to the package registry is unavailable; the CI run is the verification gate.
