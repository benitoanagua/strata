# @strata/core

## 3.0.0

### Major Changes

- f4c602e: Replace elevation with the LaTeX filete law.

  - Scale tokens now cap radius at 0–2 px, restrict borders to 0/0.5/1 px filetes, and set every `--strata-elevation-*` to `none` — separation comes from hairlines, whitespace and tonal surfaces.
  - `assertStrataScaleLaw` and both token validators enforce the new contract; the design-rule lint now rejects border widths above 1 px (focus/spinner `currentColor` borders exempt).
  - Hardcoded 2–4 px borders in Modal, ThemeToggle, Carousel, Accordion and DataTable were migrated to border tokens.

### Patch Changes

- b3695eb: Replace the seven-color spectrum with a grayscale-first color contract.

  - Remove the `spectrum` token group and the `status-info|caution|context|special` semantic tokens. Only `status-error`, `status-warning` and `status-success` remain, deliberately desaturated.
  - Align the monochrome ramp with the editorial CV ink scale (ink `#111111`, mid `#333333`, soft `#666666`, pale `#999999`, divisor `#CCCCCC`) and mirror it for dark surfaces.
  - Add an optional single `accent` (link/focus) that ships disabled; enabling it emits `--strata-color-accent-*` variables.
  - Validators now enforce a WCAG AA contrast contract (text ≥ 4.5:1, focus ≥ 3:1) instead of the spectrum contract.
  - `strata-badge` tones change from the spectrum names to `neutral | error | warning | success | info`; `strata-alert` gains a per-tone Carbon icon and uses the status tokens. `strata-progress` and `strata-switch` use `action-primary` instead of spectrum colors.

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
- Updated dependencies [4a25a52]
  - @strata/tokens@3.0.0
