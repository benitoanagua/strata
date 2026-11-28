---
"@strata/components": patch
"@strata/testing": patch
---

Harden public URL handling and browser test reliability. `strata-card`, `strata-overlay` and `strata-button` now route link props through the shared `safeHref` sanitizer used by the rest of the library, so `javascript:` and other unsafe schemes can no longer reach `href` attributes; `strata-overlay` also quotes its `background-image` URL so `feature-image` cannot break out of the inline style declaration. Playwright screenshot coverage now asserts rendered DOM instead of a PNG byte-size threshold that sparse previews could not satisfy, and component navigation uses `domcontentloaded` to avoid `load`-event timeouts.
