---
"@strata/tokens": patch
"@strata/core": patch
"@strata/components": patch
"@strata/prose": patch
---

Release metadata alignment (no runtime changes):

- `.changeset/config.json` now groups the four publishable packages (`@strata/tokens`, `@strata/core`, `@strata/components`, `@strata/prose`) as `fixed` so they version together, and sets `privatePackages.version: false` so private workspace packages are never bumped by Changesets.
- `publishConfig.access: "public"` added to all publishable packages; `files`, `exports`, `types` and `sideEffects` audited (`pnpm pack` tarballs verified clean).
- Root `CHANGELOG.md` is now an index pointing to per-package changelogs; policy documented in `docs/RELEASING.md`.
- `@strata/integration-mediawiki` build emits `dist/Strata/` with `skin.json` version injected from `package.json` (source `skin.json` aligned to 1.1.0, real repo URL and author).
