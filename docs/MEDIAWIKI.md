# STRATA MediaWiki skin

`packages/mediawiki-skin` is a reading-first MediaWiki skin (MediaWiki **1.39+**)
built on the STRATA design tokens. It targets long-form reading — the same
LaTeX-editorial discipline as the rest of the system: serif body, sans chrome,
mono metadata, filetes instead of shadows, grayscale-first with an optional
disabled accent.

## Layout

- **Header**: site name, tagline, search box and top portlets — sans-serif.
- **Sidebar**: remaining navigation portlets — sans-serif.
- **Content**: `.mw-parser-output` set in Source Serif 4 with a
  `--strata-editorial-measure` (560 px ≈ 65–75 characters) reading measure.
- **Categories**: rendered as mono-spaced tag chips.
- **TOC, wikitable, infobox, references** styled with filete borders and
  generous whitespace.
- **Light/dark**: follows `prefers-color-scheme` automatically via the token
  stylesheet (no `data-theme` attribute needed).
- **Print**: chrome, sidebar, TOC and catlinks are hidden; content prints in
  black on white with hairline rules.

## Install

1. Build the workspace so the token stylesheets exist:

   ```sh
   pnpm install
   pnpm --filter @strata/tokens build
   pnpm --filter @strata/mediawiki-skin build
   ```

   `scripts/sync-tokens.mjs` copies `@strata/tokens` `dist/fonts.css` and
   `dist/styles.css` into `resources/strata-fonts.css` and
   `resources/strata-tokens.css` (gitignored, regenerated on build).

2. Copy `packages/mediawiki-skin/` into your MediaWiki `skins/` directory as
   `skins/Strata/`.

3. Enable it in `LocalSettings.php`:

   ```php
   wfLoadSkin( 'Strata' );
   $wgDefaultSkin = 'strata';
   ```

4. Visit **Special:Preferences → Appearance** to switch skins per user.

## Customization

- All colors, spacing, radii and fonts come from `--strata-*` custom
  properties emitted by `resources/strata-tokens.css`. To retheme, override
  the variables in `resources/skin.css` (or ship a `common.css` user style).
- To enable the single optional accent for links/focus, set
  `accent.enabled: true` in `@strata/tokens` before building — the skin's
  link color already reads `--strata-color-accent-link` with a monochrome
  fallback.
- Fonts are loaded from Google Fonts through `resources/strata-fonts.css`
  (the `@import` generated from `tokens.json → fontsUrl`). If your wiki must
  be fully self-hosted, replace that file with `@font-face` rules or a
  different provider — do not commit font binaries to this repo.

## Limits

- **Mustache-only**: the skin ships no PHP. Anything beyond presentation
  (hooks, head tags, extra resource modules) needs an extension or a
  `SkinStrata.php` subclass registered in `ValidSkinNames`.
- **Responsive, not app-like**: the layout collapses the sidebar below 960 px
  and the infobox below 640 px; it is not a mobile app shell.
- **Dark mode is OS-driven**: it follows `prefers-color-scheme`; there is no
  per-user toggle.
- **ResourceLoader only**: styles are served through `skins.strata.styles`;
  if you bypass ResourceLoader (`$wgResourceLoaderEnableJSModuleLoader` off
  or manual `<link>`), include the three CSS files yourself in order:
  `strata-fonts.css`, `strata-tokens.css`, `skin.css`.
- The generated `strata-*.css` files are build artifacts — regenerate them
  after changing `@strata/tokens`.
