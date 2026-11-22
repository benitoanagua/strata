# STRATA integrations

`integrations/` holds **platform adapters**: thin packages that consume the
publishable STRATA packages and emit whatever the target platform needs.
They are private workspace packages (`@strata/integration-*`), not published
to npm.

## The contract

Every integration follows the same shape:

1. **Consume** `@strata/tokens` (CSS custom properties, `styles.css`,
   `fontsUrl`) and `@strata/prose` (the platform-agnostic reading layer,
   `.strata-prose`). Never duplicate token values or prose rules — import or
   copy them at build time so they stay in sync.
2. **Build** a platform-specific artifact:
   - a skin directory matching the platform's naming rules
     (`integrations/mediawiki` → `dist/Strata/`),
   - a theme/config bundle for static-site generators,
   - or whatever the platform's packaging format requires.
3. **Test** what the platform actually renders: JSON/metadata validity,
   freshness of synchronized CSS, smoke tests against a real instance
   (Docker for MediaWiki), and visual/a11y checks where a browser exists.
4. **Distribute** through the platform's native channel: Composer
   (`mediawiki-skin` + `installer-name`), a theme package, a release zip —
   not through npm unless the platform consumes npm packages directly.

## Current integrations

| Directory    | Package                         | Target                          | Artifact           |
| ------------ | ------------------------------- | ------------------------------- | ------------------ |
| `mediawiki/` | `@strata/integration-mediawiki` | MediaWiki 1.39+ (Mustache skin) | `dist/Strata/`     |
| `vitepress/` | `@strata/integration-vitepress` | VitePress docs sites            | theme CSS + config |

Platform-specific code stays here. Anything reusable across platforms
(reading styles, tokens, prose components) belongs in `packages/`.

See `docs/MEDIAWIKI.md` for the MediaWiki installation guide.
