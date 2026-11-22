---
"@strata/components": minor
"@strata/testing": minor
"@strata/core": minor
---

Component coverage, accessibility and CI hardening.

- New parametrized unit test mounts all 48 catalog components and asserts registration, render and accessible names for interactive content.
- New Playwright spec runs axe per component and theme (light/dark), failing on `critical` and `serious` violations; fragment exceptions (`tab`, `menu-item`, `list-item`) are documented in the spec.
- New `toHaveScreenshot` checks per component and theme. Baselines are versioned under `packages/testing/visual/components.spec.ts-snapshots/` so CI compares real pixels; regenerate them locally with `pnpm test:visual:update` or via the manual `update-visual-baselines` workflow, which opens a PR.
- `strata-tab` no longer emits `aria-controls` (IDREFs cannot cross Shadow DOM boundaries); `strata-progress` exposes an accessible name via a new `label` property.
- `ThemeToggle`, `Carousel`, `Card`, `Progress`, `Skeleton` and `Divider` tolerate missing `localStorage`/`matchMedia`/`ResizeObserver` and zero-intrinsic-width hosts no longer collapse inside flex containers.
- CI installs with `--frozen-lockfile`.
- `docs/AUDIT.md` consolidates the three overlapping audit documents; placeholder `docs/components` and `docs/patterns` removed; `@strata/core` gains README and LICENSE.
