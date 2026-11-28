# @strata/tokens

## 4.0.0

## 3.1.0

### Minor Changes

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

- 1ca6e99: Release metadata alignment (no runtime changes):

  - `.changeset/config.json` now groups the four publishable packages (`@strata/tokens`, `@strata/core`, `@strata/components`, `@strata/prose`) as `fixed` so they version together, and sets `privatePackages.version: false` so private workspace packages are never bumped by Changesets.
  - `publishConfig.access: "public"` added to all publishable packages; `files`, `exports`, `types` and `sideEffects` audited (`pnpm pack` tarballs verified clean).
  - Root `CHANGELOG.md` is now an index pointing to per-package changelogs; policy documented in `docs/RELEASING.md`.
  - `@strata/integration-mediawiki` build emits `dist/Strata/` with `skin.json` version injected from `package.json` (source `skin.json` aligned to 1.1.0, real repo URL and author).

- 6a942ce: Repository hygiene: root MIT LICENSE, `license` fields on all manifests, `pnpm.onlyBuiltDependencies` for esbuild, and refreshed README / IMPLEMENTATION-REPORT / ARCHITECTURE docs for the apps/packages/integrations/tooling layout.

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
