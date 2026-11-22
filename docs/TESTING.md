# STRATA testing

STRATA treats design rules as testable contracts.

## Commands

```bash
pnpm test                 # unit + contract tests (turbo)
pnpm test:visual          # Playwright: smoke, catalog, component screenshots
pnpm test:a11y           # axe accessibility checks
pnpm run audit          # tokens + design laws + icon policy
pnpm changeset status   # changeset validity (run before releases)
```

## Layers

- `packages/components/test/` — Vitest + jsdom unit and contract tests:
  element registration, mount/a11y-name sweep over all 74 catalog entries
  (`catalog-components.test.ts`), value-event contracts (`api-contracts`),
  editorial/article-nav behavior, font and status-semantics rules, and
  regression tests for audit fixes (`fixes.test.ts`).
- `packages/testing/src/` — cross-package Vitest suites: catalog inventory
  (`catalog.test.ts`), registry/canonical/export synchronization and Lit
  metadata-derived controls (`catalog-registry.test.ts`), scale-law,
  strict-monochrome and MediaWiki contract checks.
- `packages/testing/visual/` — Playwright against the built catalog
  (`vite preview` on port 5174):
  - `smoke.spec.ts` — catalog loads, property updates, reset.
  - `catalog.spec.ts` — inventory counts, search, category collapse,
    selection of all 74 entries, typed controls (boolean/number), reset,
    snippet generation + clipboard copy, API/a11y tabs, compound fixtures,
    all five scenarios, surface/viewport controls.
  - `components.spec.ts` — axe scan (critical+serious) and visual baseline
    for every catalog entry in light and dark themes.
  - `design-system.spec.ts`, `regression.spec.ts` — catalog contract and
    responsive layout checks.
  - `a11y.spec.ts` — critical axe violations on the catalog shell.

## Browser tests

Playwright serves the built Svelte catalog (`vite preview`) and verifies its
component canvas, responsive viewports, controls and rendered Lit elements.
Tests assert design-system behavior rather than implementation-specific
catalog markup where possible. Google Fonts requests are stubbed
(`font-stub.ts`) so rendering does not depend on the network.

## Accessibility

Critical axe violations fail CI. Keyboard/focus behavior and accessible
labels are tested alongside component contracts; the overlay family
(Escape, focus trap/restore) is covered in `fixes.test.ts`.

## Visual baselines

Screenshot baselines under `packages/testing/visual/*-snapshots/` are local
artifacts only (gitignored — see `AGENTS.md`). Regenerate with
`pnpm test:visual:update` after intentional visual changes.
