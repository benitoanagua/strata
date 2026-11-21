---
"@strata/prose": minor
---

Restructure the monorepo into `apps/`, `packages/`, `integrations/` and `tooling/`, and add `@strata/prose`.

- `catalog/` moved to `apps/catalog/` (still private, still `@strata/catalog`).
- `packages/mediawiki-skin` moved to `integrations/mediawiki/` and renamed `@strata/integration-mediawiki` (private). It now consumes `@strata/prose` and keeps only MediaWiki-specific chrome.
- New publishable `@strata/prose`: platform-agnostic reading CSS (`.strata-prose`) extracted from the skin's parser-output styles — serif body, editorial measure, filetes, print and dark-mode ready. Exports `@strata/prose/prose.css`.
