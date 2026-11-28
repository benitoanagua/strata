# @strata/prose

## 5.0.0

### Patch Changes

- @strata/tokens@5.0.0

## 4.1.0

### Patch Changes

- @strata/tokens@4.1.0

## 4.0.0

### Patch Changes

- @strata/tokens@4.0.0

## 3.1.0

### Minor Changes

- 5bed575: Reading layer: typography tokens, serif content text and the `strata-prose` wrapper.

  - `tokens.json → typography` now emits `--strata-type-<name>` font shorthand fragments and `-tracking` vars; the 48/36/30 px display scale is removed (LaTeX-style modest titles) and a `reading-*` scale (14/21 body, ~1.5 leading) is added.
  - All literal `font:`/`font-family` declarations in components now compose the three role families (`serif` reading, `sans` chrome, `mono` data) — enforced by a new `fonts.test.ts` contract.
  - Content components (Card title/excerpt, Alert, Accordion panel, Modal body, DataTable text cells) render reading text in serif; chrome stays sans.
  - New `strata-prose` element adds the `.strata-prose` class so `@strata/prose/prose.css` styles slotted long-form content; the catalog gains a prose demo page (article, table, quote, code, footnotes).
  - `prose.css` now uses `reading-body` tokens, a 70 `ch` measure, and system colors (`CanvasText`/`GrayText`) for print instead of raw hex.

- 9a5e20d: Restructure the monorepo into `apps/`, `packages/`, `integrations/` and `tooling/`, and add `@strata/prose`.

  - `catalog/` moved to `apps/catalog/` (still private, still `@strata/catalog`).
  - `packages/mediawiki-skin` moved to `integrations/mediawiki/` and renamed `@strata/integration-mediawiki` (private). It now consumes `@strata/prose` and keeps only MediaWiki-specific chrome.
  - New publishable `@strata/prose`: platform-agnostic reading CSS (`.strata-prose`) extracted from the skin's parser-output styles — serif body, editorial measure, filetes, print and dark-mode ready. Exports `@strata/prose/prose.css`.

### Patch Changes

- 1ca6e99: Release metadata alignment (no runtime changes):

  - `.changeset/config.json` now groups the four publishable packages (`@strata/tokens`, `@strata/core`, `@strata/components`, `@strata/prose`) as `fixed` so they version together, and sets `privatePackages.version: false` so private workspace packages are never bumped by Changesets.
  - `publishConfig.access: "public"` added to all publishable packages; `files`, `exports`, `types` and `sideEffects` audited (`pnpm pack` tarballs verified clean).
  - Root `CHANGELOG.md` is now an index pointing to per-package changelogs; policy documented in `docs/RELEASING.md`.
  - `@strata/integration-mediawiki` build emits `dist/Strata/` with `skin.json` version injected from `package.json` (source `skin.json` aligned to 1.1.0, real repo URL and author).

- 6a942ce: Repository hygiene: root MIT LICENSE, `license` fields on all manifests, `pnpm.onlyBuiltDependencies` for esbuild, and refreshed README / IMPLEMENTATION-REPORT / ARCHITECTURE docs for the apps/packages/integrations/tooling layout.
- Updated dependencies [49a4d73]
- Updated dependencies [5bed575]
- Updated dependencies [1ca6e99]
- Updated dependencies [6a942ce]
- Updated dependencies [81b47a8]
  - @strata/tokens@3.1.0
