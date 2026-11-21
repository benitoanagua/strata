# @strata/tokens

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
