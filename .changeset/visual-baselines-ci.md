---
"@strata/testing": patch
---

Make visual tests deterministic and CI-safe:

- Stub Google Fonts requests via `page.route` so screenshots and axe runs use fixed fallback fonts offline.
- Pin `colorScheme`, `reducedMotion: "reduce"` and disabled animations; `toHaveScreenshot` uses `maxDiffPixelRatio: 0.02`.
- Version screenshot baselines (removed `*-snapshots/` from `.gitignore`) and add `pnpm test:visual:update` plus a manual `update-visual-baselines` workflow that regenerates baselines on the official Playwright image and opens a PR.
- Close axe exceptions: `tab`, `menu-item` and `list-item` are now tested inside their parent components.
