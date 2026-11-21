---
"@strata/mediawiki-skin": minor
---

Add `packages/mediawiki-skin`: a MediaWiki 1.39+ skin built on STRATA tokens.

- `skin.json` + `SkinMustache` templates (header, sidebar, parser output, catlinks, footer).
- `resources/skin.css` styles `.mw-parser-output` (serif reading column at ~65–75ch), wikitable, infobox, TOC, references, sans sidebar/top menu, mono categories.
- Fonts via Google Fonts (`strata-fonts.css`), light/dark via `prefers-color-scheme`, responsive breakpoints and `@media print`.
- `scripts/sync-tokens.mjs` copies the built `@strata/tokens` stylesheets into `resources/` (gitignored artifacts).
- Install and limits documented in `docs/MEDIAWIKI.md`.
