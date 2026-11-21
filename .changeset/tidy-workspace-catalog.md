---
"@strata/components": patch
"@strata/core": patch
---

Stabilize the workspace catalog and package publish metadata.

- Include `catalog/` in the pnpm workspace so `@strata/catalog` builds, lints and previews like every other package.
- Cover all 48 canonical components in the catalog registry, including typed property controls and composed slot previews.
- Update controls on `input` so the preview reacts while typing.
- Serve the built catalog with `vite preview` in Playwright to remove dev-server cold-start flakiness.
- Add a `./styles.css` export to `@strata/components` and an export map + `files` allowlist to `@strata/core`.
- Upgrade `vitest` to 4.x to resolve critical `tinypool` advisories.
