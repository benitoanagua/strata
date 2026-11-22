# STRATA Design System — Implementation report

## Current architecture

- pnpm + Turborepo monorepo organized as `apps/` (executables),
  `packages/` (published), `integrations/` (platform adapters) and
  `tooling/` (lint and validators). See `docs/ARCHITECTURE.md`.
- `@strata/tokens` is the source of design tokens and generated CSS.
- `@strata/core` contains shared contracts and theme utilities.
- `@strata/components` contains publishable Lit Web Components and declaration files.
- `@strata/prose` is the platform-agnostic reading layer (`prose.css`,
  `.strata-prose`) consumed by integrations and any site.
- `apps/catalog` (`@strata/catalog`, private) is the internal Svelte playground.
- `integrations/mediawiki` (`@strata/integration-mediawiki`, private) is the
  MediaWiki 1.39+ Mustache skin; `integrations/vitepress` proves the prose
  layer is platform-agnostic.
- `@strata/testing` contains unit, contract, browser and accessibility tests.

## Component catalog

The Svelte app consumes the existing `@strata/components` package and canonical `STRATA_COMPONENT_CATALOG`. Its typed registry describes examples and control metadata; it does not implement component behavior or copy component styles.

The canvas mounts the registered custom element and assigns properties directly to its DOM node. This preserves booleans and typed property values rather than serializing them into attributes. The controls support text, boolean, number and select types, with reset to defaults, background/surface modes and responsive viewports.

## STRATA visual laws

- Monochrome establishes structure; the spectrum was replaced by a grayscale contract, three desaturated status colors (never the only signal — always paired with icon, weight, underline or text) and an optional disabled-by-default accent. A `strict-monochrome` token flag converts statuses to grayscale while preserving WCAG AA contrast.
- Source Serif 4 is the reading family, Source Sans 3 the UI family, and Source Code Pro is reserved for tags, data and numeric alignment. Fonts are loaded from Google Fonts/CDN; no font files or `@fontsource` packages live in the repository.
- Component geometry follows the Scale Law: radii 0–2 px, borders/filetes 0–1 px, no elevation.
- The catalog imports the published token stylesheet and component stylesheet, and uses the existing semantic CSS variables.
- Carbon via `iconify-icon` remains the only permitted icon collection.

## Validation

`pnpm check` runs audit, format check, lint, typecheck, unit/contract tests, build and the catalog build. Browser tests (`pnpm test:visual`, `pnpm test:a11y`) run Playwright against `apps/catalog`; Google Fonts requests are stubbed in tests so rendering does not depend on the network.
