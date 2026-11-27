# @strata/core

## 3.1.0

### Minor Changes

- 1e9f452: Component coverage, accessibility and CI hardening.

  - New parametrized unit test mounts all 48 catalog components and asserts registration, render and accessible names for interactive content.
  - New Playwright spec runs axe per component and theme (light/dark), failing on `critical` and `serious` violations; fragment exceptions (`tab`, `menu-item`, `list-item`) are documented in the spec.
  - New `toHaveScreenshot` checks per component and theme. Baselines are generated locally under `packages/testing/visual/components.spec.ts-snapshots/` and are gitignored — no images are tracked in the repository.
  - `strata-tab` no longer emits `aria-controls` (IDREFs cannot cross Shadow DOM boundaries); `strata-progress` exposes an accessible name via a new `label` property.
  - `ThemeToggle`, `Carousel`, `Card`, `Progress`, `Skeleton` and `Divider` tolerate missing `localStorage`/`matchMedia`/`ResizeObserver` and zero-intrinsic-width hosts no longer collapse inside flex containers.
  - CI installs with `--frozen-lockfile`.
  - `docs/AUDIT.md` consolidates the three overlapping audit documents; placeholder `docs/components` and `docs/patterns` removed; `@strata/core` gains README and LICENSE.

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
