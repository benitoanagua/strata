---
"@strata/integration-mediawiki": patch
---

MediaWiki skin compliance with the physical-form laws.

- `design-rules.mjs` now scans `integrations/mediawiki` and rejects raw colors (`#hex`, `rgb()`, `hsl()`) outside token definitions; generated `strata-*.css` sync artifacts are excluded.
- MediaWiki print styles use system colors (`Canvas`/`GrayText`) instead of hex.
