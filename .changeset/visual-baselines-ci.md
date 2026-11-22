---
"@strata/testing": patch
---

Make visual tests deterministic and CI-safe:

- Stub Google Fonts requests via `page.route` so screenshots and axe runs use fixed fallback fonts offline.
- Pin `colorScheme`, `reducedMotion: "reduce"` and disabled animations; `toHaveScreenshot` uses `maxDiffPixelRatio: 0.02`.
- Add `pnpm test:visual:update` for local baseline regeneration. Screenshot baselines stay untracked (`*-snapshots/` in `.gitignore`) — images are never committed; Playwright generates them on demand.
- Close axe exceptions: `tab`, `menu-item` and `list-item` are now tested inside their parent components.
