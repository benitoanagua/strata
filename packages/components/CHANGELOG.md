# @strata/components

## Unreleased

### Breaking changes

- Consolidate Snackbar into Alert and remove the standalone `strata-snackbar` custom element. Migrate to `strata-alert mode="snackbar"`; Alert now supports optional close, duration, placement, and a shared `strata-dismiss` event.


## 3.1.0

### Minor Changes

- afa46e6: Accessibility and interaction fixes found by the component audit.

  - `strata-comment`: the role badge attribute is now `role-label` (the `role` attribute is the global ARIA role and produced invalid values such as `role="Autor"`). The `role` property is unchanged; set `el.role` or use `role-label` in markup.
  - `strata-filter-bar`: the chip group moved from `<ul role="group">` to a wrapping `role="group"` container so `<li>` children keep valid list semantics (axe `listitem`).
  - `strata-ticker`: the scrollable list is now keyboard-focusable (`tabindex="0"`, axe `scrollable-region-focusable`).
  - `strata-data-table`: replaced the unusable slotted `<thead>/<tbody>` API with `columns`/`rows` props (JSON or pipe-delimited).
  - `strata-file-upload`: emits `strata-change`, lists selected files and supports drag & drop.
  - Overlays (`dialog`, `modal`, `drawer`, `bottom-sheet`, `popover`): Escape handling, focus management and accessible-name fallbacks.
  - `strata-text-field`: label association and error semantics; `strata-breadcrumb`, `strata-menu`, `strata-pagination`, `strata-tooltip`, `strata-tab`, `strata-menu-item`, `strata-accordion-item` interaction fixes.

- 1e9f452: Component coverage, accessibility and CI hardening.

  - New parametrized unit test mounts all 48 catalog components and asserts registration, render and accessible names for interactive content.
  - New Playwright spec runs axe per component and theme (light/dark), failing on `critical` and `serious` violations; fragment exceptions (`tab`, `menu-item`, `list-item`) are documented in the spec.
  - New `toHaveScreenshot` checks per component and theme. Baselines are generated locally under `packages/testing/visual/components.spec.ts-snapshots/` and are gitignored — no images are tracked in the repository.
  - `strata-tab` no longer emits `aria-controls` (IDREFs cannot cross Shadow DOM boundaries); `strata-progress` exposes an accessible name via a new `label` property.
  - `ThemeToggle`, `Carousel`, `Card`, `Progress`, `Skeleton` and `Divider` tolerate missing `localStorage`/`matchMedia`/`ResizeObserver` and zero-intrinsic-width hosts no longer collapse inside flex containers.
  - CI installs with `--frozen-lockfile`.
  - `docs/AUDIT.md` consolidates the three overlapping audit documents; placeholder `docs/components` and `docs/patterns` removed; `@strata/core` gains README and LICENSE.

- 49a4d73: Add 16 editorial components for news and wiki sites (meta, tag-list, section-header, author-box, share, comment, comment-thread, article-header, entry, quote, ticker, filter-bar, index-list, ranked-list, gallery, page-layout), taxonomy hue tokens (`tagHue`, `data-tag-hues="mono"` opt-out), a `hue`/`href` API on `strata-tag`, and editorial prose styles (cite, drop cap, mark, zebra tables).

  Also adds nine article-navigation components for wiki pages: toc (scroll-spy, list/rail), reading-time, reading-progress, back-to-top, cite, references, hatnote, article-nav, heading-anchors.

- 5bed575: Reading layer: typography tokens, serif content text and the `strata-prose` wrapper.

  - `tokens.json → typography` now emits `--strata-type-<name>` font shorthand fragments and `-tracking` vars; the 48/36/30 px display scale is removed (LaTeX-style modest titles) and a `reading-*` scale (14/21 body, ~1.5 leading) is added.
  - All literal `font:`/`font-family` declarations in components now compose the three role families (`serif` reading, `sans` chrome, `mono` data) — enforced by a new `fonts.test.ts` contract.
  - Content components (Card title/excerpt, Alert, Accordion panel, Modal body, DataTable text cells) render reading text in serif; chrome stays sans.
  - New `strata-prose` element adds the `.strata-prose` class so `@strata/prose/prose.css` styles slotted long-form content; the catalog gains a prose demo page (article, table, quote, code, footnotes).
  - `prose.css` now uses `reading-body` tokens, a 70 `ch` measure, and system colors (`CanvasText`/`GrayText`) for print instead of raw hex.

- 81b47a8: Status colors are never the sole signal, plus an opt-in strict-monochrome mode.

  - `strata-badge` status tones now render a distinct Carbon icon; `strata-text-field` gains `error`/`errorMessage` with `aria-invalid`, `aria-describedby`, a `role="alert"` message and an icon.
  - New `status.test.ts` proves Alert, Badge and error fields carry non-chromatic cues.
  - `tokens.json` adds `strictMonochrome` (default `false`) and `monochromeStatus`: when enabled, `build-css.mjs` emits grayscale status colors that still pass WCAG AA 4.5:1 (verified by `strict-monochrome.test.ts`).
  - Docs: `COLOR.md` and `DESIGN-LAWS.md` state the never-color-alone contract.

### Patch Changes

- 2460c33: Physical-form law enforcement and dead elevation cleanup.

  - Squared the pill/circle radii outside the allowlist: switch track, carousel nav buttons and counter, overlay category chip, theme toggle, modal close button and scrollbar thumb now use `--strata-radius-*` (0–2 px). Kept circular only where geometry requires it — switch thumb, carousel dots, spinners/ripple, avatars — via an explicit allowlist in `design-rules.mjs`.
  - Removed all dead `--strata-elevation-*`/`--strata-component-elevation` references (Button, Card, Dialog, Surface, StrataBase); `box-shadow` is now lint-forbidden except `none`.

- 1ca6e99: Release metadata alignment (no runtime changes):

  - `.changeset/config.json` now groups the four publishable packages (`@strata/tokens`, `@strata/core`, `@strata/components`, `@strata/prose`) as `fixed` so they version together, and sets `privatePackages.version: false` so private workspace packages are never bumped by Changesets.
  - `publishConfig.access: "public"` added to all publishable packages; `files`, `exports`, `types` and `sideEffects` audited (`pnpm pack` tarballs verified clean).
  - Root `CHANGELOG.md` is now an index pointing to per-package changelogs; policy documented in `docs/RELEASING.md`.
  - `@strata/integration-mediawiki` build emits `dist/Strata/` with `skin.json` version injected from `package.json` (source `skin.json` aligned to 1.1.0, real repo URL and author).

- 6a942ce: Repository hygiene: root MIT LICENSE, `license` fields on all manifests, `pnpm.onlyBuiltDependencies` for esbuild, and refreshed README / IMPLEMENTATION-REPORT / ARCHITECTURE docs for the apps/packages/integrations/tooling layout.
- Updated dependencies [1e9f452]
- Updated dependencies [49a4d73]
- Updated dependencies [5bed575]
- Updated dependencies [1ca6e99]
- Updated dependencies [6a942ce]
- Updated dependencies [81b47a8]
  - @strata/core@3.1.0
  - @strata/tokens@3.1.0

## 3.0.0

### Major Changes

- f4c602e: Replace elevation with the LaTeX filete law.

  - Scale tokens now cap radius at 0–2 px, restrict borders to 0/0.5/1 px filetes, and set every `--strata-elevation-*` to `none` — separation comes from hairlines, whitespace and tonal surfaces.
  - `assertStrataScaleLaw` and both token validators enforce the new contract; the design-rule lint now rejects border widths above 1 px (focus/spinner `currentColor` borders exempt).
  - Hardcoded 2–4 px borders in Modal, ThemeToggle, Carousel, Accordion and DataTable were migrated to border tokens.

- b3695eb: Replace the seven-color spectrum with a grayscale-first color contract.

  - Remove the `spectrum` token group and the `status-info|caution|context|special` semantic tokens. Only `status-error`, `status-warning` and `status-success` remain, deliberately desaturated.
  - Align the monochrome ramp with the editorial CV ink scale (ink `#111111`, mid `#333333`, soft `#666666`, pale `#999999`, divisor `#CCCCCC`) and mirror it for dark surfaces.
  - Add an optional single `accent` (link/focus) that ships disabled; enabling it emits `--strata-color-accent-*` variables.
  - Validators now enforce a WCAG AA contrast contract (text ≥ 4.5:1, focus ≥ 3:1) instead of the spectrum contract.
  - `strata-badge` tones change from the spectrum names to `neutral | error | warning | success | info`; `strata-alert` gains a per-tone Carbon icon and uses the status tokens. `strata-progress` and `strata-switch` use `action-primary` instead of spectrum colors.

- 73ae47f: Bundle only the Carbon icons STRATA actually uses.

  - `iconify.ts` now registers the explicit allowlist in `src/carbon-icons.json` (~15 icons, ~4 KB) instead of the full `@iconify-json/carbon` collection (~1.2 MB). Catalog JS drops from ~1.48 MB to ~294 kB (gzip ~392 kB → ~72 kB).
  - Dynamic icon props (`strata-button[icon]`, `strata-icon-button[icon]`, `strata-menu-item[icon]`) still accept any `carbon:*` name, but consumers must register extra icons at runtime via `addIcon`/`addCollection` from `iconify-icon`.
  - `icon-rules.mjs` now fails if a component references a `carbon:*` icon missing from the bundled allowlist.

### Minor Changes

- 86d9456: Load fonts from Google Fonts instead of bundling them.

  - Remove `@fontsource/*` dependencies; `styles.css` no longer embeds fonts, so `@strata/components` drops ~1.4 MB of base64 `woff` data.
  - Add `--strata-font-serif` (Source Serif 4) for reading text; sans stays the UI family and mono is reserved for tags and data.
  - Add `@strata/tokens/fonts.css` and a `fontsUrl` token as the single source for the Google Fonts URL. Consumers must import `fonts.css` or add the `<link>` themselves.
  - Token validator now enforces the Google Fonts contract.

- 4a25a52: Assign type families by role, aligned with the LaTeX CV reference.

  - `global.css` and the catalog now set Source Serif 4 as the reading/body base; sans remains the interface family for `StrataBase`, buttons, forms, menus and navigation chrome.
  - Monospace (Source Code Pro) now covers tags, badges, breadcrumbs, pagination, stepper/number values and `DataTable` `.numeric` cells.
  - `editorial.measure` tightened to 560 px (~65–75 characters) and body line-heights adjusted toward LaTeX metrics; see `docs/foundations/TYPOGRAPHY.md`.

### Patch Changes

- 14acb1b: Fix typecheck, token resolution and Playwright setup.

  - Emit declaration files for `@strata/components` via vite-plugin-dts.
  - Standardize gray token naming and add missing semantic tokens (`actionPrimary`, `surfaceDefault`, `surfaceSubtle`).
  - Correct component export map and legacy bridge imports.
  - Remove dead root `.storybook` directory.
  - Add component unit tests and establish visual regression baselines.

- 9aca5f6: Stabilize the workspace catalog and package publish metadata.

  - Include `catalog/` in the pnpm workspace so `@strata/catalog` builds, lints and previews like every other package.
  - Cover all 48 canonical components in the catalog registry, including typed property controls and composed slot previews.
  - Update controls on `input` so the preview reacts while typing.
  - Serve the built catalog with `vite preview` in Playwright to remove dev-server cold-start flakiness.
  - Add a `./styles.css` export to `@strata/components` and an export map + `files` allowlist to `@strata/core`.
  - Upgrade `vitest` to 4.x to resolve critical `tinypool` advisories.

- Updated dependencies [f4c602e]
- Updated dependencies [86d9456]
- Updated dependencies [b3695eb]
- Updated dependencies [14acb1b]
- Updated dependencies [9aca5f6]
- Updated dependencies [4a25a52]
  - @strata/tokens@3.0.0
  - @strata/core@3.0.0
