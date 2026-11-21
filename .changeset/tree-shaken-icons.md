---
"@strata/components": major
---

Bundle only the Carbon icons STRATA actually uses.

- `iconify.ts` now registers the explicit allowlist in `src/carbon-icons.json` (~15 icons, ~4 KB) instead of the full `@iconify-json/carbon` collection (~1.2 MB). Catalog JS drops from ~1.48 MB to ~294 kB (gzip ~392 kB → ~72 kB).
- Dynamic icon props (`strata-button[icon]`, `strata-icon-button[icon]`, `strata-menu-item[icon]`) still accept any `carbon:*` name, but consumers must register extra icons at runtime via `addIcon`/`addCollection` from `iconify-icon`.
- `icon-rules.mjs` now fails if a component references a `carbon:*` icon missing from the bundled allowlist.
