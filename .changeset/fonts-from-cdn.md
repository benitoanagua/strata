---
"@strata/tokens": minor
"@strata/components": minor
---

Load fonts from Google Fonts instead of bundling them.

- Remove `@fontsource/*` dependencies; `styles.css` no longer embeds fonts, so `@strata/components` drops ~1.4 MB of base64 `woff` data.
- Add `--strata-font-serif` (Source Serif 4) for reading text; sans stays the UI family and mono is reserved for tags and data.
- Add `@strata/tokens/fonts.css` and a `fontsUrl` token as the single source for the Google Fonts URL. Consumers must import `fonts.css` or add the `<link>` themselves.
- Token validator now enforces the Google Fonts contract.
