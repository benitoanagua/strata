# @strata/mediawiki-skin

## 1.1.0

### Minor Changes

- 343fda4: Add `packages/mediawiki-skin`: a MediaWiki 1.39+ skin built on STRATA tokens.

  - `skin.json` + `SkinMustache` templates (header, sidebar, parser output, catlinks, footer).
  - `resources/skin.css` styles `.mw-parser-output` (serif reading column at ~65–75ch), wikitable, infobox, TOC, references, sans sidebar/top menu, mono categories.
  - Fonts via Google Fonts (`strata-fonts.css`), light/dark via `prefers-color-scheme`, responsive breakpoints and `@media print`.
  - `scripts/sync-tokens.mjs` copies the built `@strata/tokens` stylesheets into `resources/` (gitignored artifacts).
  - Install and limits documented in `docs/MEDIAWIKI.md`.

### Patch Changes

- Updated dependencies [f4c602e]
- Updated dependencies [86d9456]
- Updated dependencies [b3695eb]
- Updated dependencies [14acb1b]
- Updated dependencies [4a25a52]
  - @strata/tokens@3.0.0
