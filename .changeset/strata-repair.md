---
"@strata/components": patch
"@strata/tokens": patch
---

Fix typecheck, token resolution and Playwright setup.

- Emit declaration files for `@strata/components` via vite-plugin-dts.
- Standardize gray token naming and add missing semantic tokens (`actionPrimary`, `surfaceDefault`, `surfaceSubtle`).
- Correct component export map and legacy bridge imports.
- Remove dead root `.storybook` directory.
- Add component unit tests and establish visual regression baselines.
