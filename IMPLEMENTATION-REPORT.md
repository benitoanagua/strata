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

The Svelte app (`apps/catalog`) consumes the existing `@strata/components`
package and canonical `STRATA_COMPONENT_CATALOG` through a typed registry
(`src/lib/componentRegistry.ts`) that mirrors all 74 entries with maturity,
events, slots, accessibility notes and curated control metadata.

The canvas mounts the registered custom element and assigns properties
directly to its DOM node. Property controls are derived at runtime from Lit
`elementProperties` metadata (`src/lib/props.ts`) merged with curated
labels/options/fixture defaults — booleans, numbers, selects and
JSON/pipe-delimited list props keep their real types. The UI adds search,
collapsible category navigation, hash-based routing, surface (light/dark/grid)
and viewport (desktop/tablet/mobile) controls, reset-to-defaults, API and
accessibility tabs, and copyable consumer snippets (`src/lib/Snippet.svelte`).

Five composed scenarios (`src/lib/scenarios/`) demonstrate real pages: an
editorial article, a wiki article with TOC/reading chrome, social comments,
a data dashboard and a full form suite — all built only from public component
APIs. See `docs/CATALOG-GUIDE.md`.

## STRATA visual laws

- Monochrome establishes structure; the spectrum was replaced by a grayscale contract, three desaturated status colors (never the only signal — always paired with icon, weight, underline or text) and an optional disabled-by-default accent. A `strict-monochrome` token flag converts statuses to grayscale while preserving WCAG AA contrast.
- Source Serif 4 is the reading family, Source Sans 3 the UI family, and Source Code Pro is reserved for tags, data and numeric alignment. Fonts are loaded from Google Fonts/CDN; no font files or `@fontsource` packages live in the repository.
- Component geometry follows the Scale Law: radii 0–2 px, borders/filetes 0–1 px, no elevation.
- The catalog imports the published token stylesheet and component stylesheet, and uses the existing semantic CSS variables.
- Carbon via `iconify-icon` remains the only permitted icon collection.

## Component audit fixes

A full audit of the 74 canonical entries (`docs/IMPLEMENTATION-AUDIT.md`)
found and fixed real defects: duplicate `role` and missing focus/Escape
handling in the overlay family (dialog, modal, drawer, bottom-sheet), a
DataTable slot API that could never render (table internals are dropped by
the HTML parser inside custom elements — replaced with `columns`/`rows`
props), a FileUpload with no events or drop handling, a Breadcrumb without
links or `aria-current`, a Menu without keyboard navigation, an unassociated
TextField label, an ungrouped Pagination landmark, and smaller semantic gaps
in Tooltip, Popover, Tab, MenuItem and AccordionItem. The axe sweep then
surfaced three further defects, also fixed: `strata-comment`'s `role`
property collided with the global ARIA `role` attribute (badge attribute is
now `role-label`), `strata-filter-bar`'s `<ul role="group">` broke list
semantics, and `strata-ticker`'s scrollable list was not keyboard-focusable.
Regression coverage lives in `packages/components/test/fixes.test.ts`.

## Validation

`pnpm check` runs audit, format check, lint, typecheck, unit/contract tests, build and the catalog build. Browser tests (`pnpm test:visual`, `pnpm test:a11y`) run Playwright against `apps/catalog`; Google Fonts requests are stubbed in tests so rendering does not depend on the network. The catalog suite (`packages/testing/visual/catalog.spec.ts`) verifies inventory counts, search, categories, selection of all 74 entries, typed controls, reset, snippets, clipboard copy, scenarios and canvas controls; `apps/catalog/test/catalog-registry.test.ts` verifies registry/canonical/export synchronization.
