# STRATA MediaWiki skin

`integrations/mediawiki` is a reading-first MediaWiki skin (MediaWiki **1.39+**)
built on the STRATA design tokens. It targets long-form reading — the same
LaTeX-editorial discipline as the rest of the system: serif body, sans chrome,
mono metadata, filetes instead of shadows, grayscale-first with an optional
disabled accent.

The skin is distributed as `dist/Strata/` — the folder name **must** match
the skin name (`Strata`), because `skin.json` registers it as
`ValidSkinNames.strata` with class `SkinMustache`.

## Layout

- **Header**: site name, tagline, search box and top portlets — sans-serif.
- **Sidebar**: remaining navigation portlets — sans-serif.
- **Content**: `.mw-parser-output` gets the platform-agnostic
  `@strata/prose` stylesheet (`.strata-prose`) — Source Serif 4 with a
  `--strata-editorial-measure` (560 px ≈ 65–75 characters) reading measure.
- **Categories**: rendered as mono-spaced tag chips.
- **TOC, wikitable, infobox, references** styled with filete borders and
  generous whitespace (`resources/skin.css` keeps only `.mw-*` rules).
- **Light/dark**: follows `prefers-color-scheme` automatically via the token
  stylesheet (no `data-theme` attribute needed).
- **Print**: chrome, sidebar, TOC and catlinks are hidden; content prints in
  black on white with hairline rules.

## Install

1. Build the packages and the skin:

   ```sh
   pnpm install
   pnpm --filter @strata/tokens build
   pnpm --filter @strata/prose build   # if it has a build step; prose.css is source
   pnpm --filter @strata/integration-mediawiki build
   ```

   `scripts/sync-tokens.mjs` copies `@strata/tokens` `dist/styles.css` and
   `@strata/prose` `prose.css` into `resources/strata-tokens.css` and
   `resources/strata-prose.css`. Those files (and `dist/`) are gitignored
   build artifacts regenerated on every build.

2. Copy `integrations/mediawiki/dist/Strata/` into your MediaWiki
   `skins/` directory as `skins/Strata/` — or, if you use Composer,
   `composer.json` in the dist (`type: mediawiki-skin`,
   `extra.installer-name: Strata`) works with `composer/installers`:

   ```sh
   composer require composer/installers:^2.0 benitoanagua/strata-skin
   ```

   The generated `dist/Strata/composer.json` describes the same package;
   publish it to a Composer repository or pack `dist/` as a zip
   (`pnpm --filter @strata/integration-mediawiki pack:zip`).

3. Enable it in `LocalSettings.php`:

   ```php
   wfLoadSkin( 'Strata' );
   $wgDefaultSkin = 'strata';
   ```

4. **Fonts**: ResourceLoader CSS must be local (remote `@import` inside a
   module is not a supported pattern), and skins cannot edit `<head>`
   directly. The build therefore generates
   `resources/strata-fonts.js` from `tokens.json → fontsUrl` and registers
   it as the `skins.strata.fonts` ResourceLoader module (declared in
   `skin.json` `scripts`); at runtime it appends the `preconnect` and
   stylesheet `<link>` tags. No `LocalSettings.php` configuration is needed.

   If a site prefers server-side injection, an extension can use the
   `BeforePageDisplay`/`OutputPage` hooks to add the same `<link>` tags —
   copy the URLs from `tokens.json`. There is no `$wgHTMLHeadLinks` setting.

5. Visit **Special:Preferences → Appearance** to switch skins per user.

## Customization

- All colors, spacing, radii and fonts come from `--strata-*` custom
  properties emitted by `resources/strata-tokens.css`. To retheme, override
  the variables in `resources/skin.css` (or ship a `common.css` user style).
- The reading styles live in `@strata/prose`; skin-specific tweaks go in
  `resources/skin.css`, not in `prose.css`.
- To enable the single optional accent for links/focus, set
  `accent.enabled: true` in `@strata/tokens` before building — the skin's
  link color already reads `--strata-color-accent-link` with a monochrome
  fallback.
- Fonts come from Google Fonts via the `skins.strata.fonts` JS module
  (see Install §4). If
  your wiki must be fully self-hosted, replace those links with `@font-face`
  rules served by your own asset pipeline — do not commit font binaries to
  this repo.

## CSP

The font `<link>` tags are injected by the `skins.strata.fonts` JS module.
If the wiki sets `$wgCSPDefaultSrc` / a restrictive `style-src`,
`fonts.googleapis.com` must be allowed in `style-src` and
`fonts.gstatic.com` in `font-src`, otherwise the font request is blocked.
ResourceLoader-served CSS itself needs no CSP changes.

## Testing

- `packages/testing/src/mediawiki.test.ts` validates `skin.json`, i18n JSON,
  `skin.json` ↔ `package.json` version sync, and that the synchronized CSS
  artifacts match the token/prose sources; it also runs the dist build.
- `integrations/mediawiki/docker-compose.yml` + `scripts/smoke.mjs` spin up
  an official `mediawiki:1.43` (current LTS) instance with the built skin
  mounted, create an example article (wikitable, infobox, TOC, references,
  categories) and assert the rendered HTML. See the compose file header for
  the exact commands.

## Limits

- **Mustache-only**: the skin ships no PHP. Anything beyond presentation
  (hooks, head tags, extra resource modules) needs an extension or a
  `SkinStrata.php` subclass registered in `ValidSkinNames`.
- **Fonts load via JS**: ResourceLoader modules cannot `@import` remote CSS
  and skins cannot edit `<head>`, so `resources/strata-fonts.js` (generated
  from `fontsUrl`) injects the `<link>` tags at runtime. Sites with strict
  CSP must allow `fonts.googleapis.com`/`fonts.gstatic.com`, or replace the
  module with an extension that injects self-hosted `@font-face` CSS.
  Verified on MediaWiki 1.43.11 (official `mediawiki:1.43` image).
- **Responsive, not app-like**: the layout collapses the sidebar below 960 px
  and the infobox below 640 px; it is not a mobile app shell.
- **Dark mode is OS-driven**: it follows `prefers-color-scheme`; there is no
  per-user toggle.
- **ResourceLoader only**: styles are served through `skins.strata.styles`
  (`strata-tokens.css`, `strata-prose.css`, `skin.css`); if you bypass
  ResourceLoader, include those three files yourself in order.
- The generated `strata-*.css` files and `dist/` are build artifacts —
  regenerate them after changing `@strata/tokens` or `@strata/prose`.

## Adding another integration

See `integrations/README.md` for the contract every integration follows
(tokens + prose in, platform-specific output out).
