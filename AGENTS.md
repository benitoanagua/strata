# AGENTS.md

Rules for agents working in this repository.

## Never track images or binary artifacts

- **Do not commit images.** No PNG/JPG/SVG screenshots, snapshots, fixtures
  or binary assets in git — anywhere in the repo.
- Playwright screenshot baselines under
  `packages/testing/visual/*-snapshots/` are **local artifacts only**.
  `.gitignore` covers `*-snapshots/`; `git rm --cached` any that slip in.
  Baselines are regenerated with `pnpm test:visual:update`.
- Generated build artifacts (`dist/`, `resources/strata-*.css`,
  `integrations/*/theme/strata-*.css`) are also never committed.

## Design laws

- Grayscale-first; the single accent is optional and disabled by default.
- The rainbow exists only as taxonomy hues (`--strata-tag-*`) for tags/categories; a hue is always paired with its text label.
- Statuses are never color alone (icon, weight, underline or text required).
- No raw colors outside `packages/tokens`; no `box-shadow` except `none`;
  radii stay within the 0–2 px scale except the explicit lint allowlist.
- Fonts come only from Google Fonts/CDN — never font files or `@fontsource`.

## Verification

- `pnpm check` must be green before considering a task done.
- If something cannot be verified (Playwright browsers, Docker, MediaWiki),
  say so explicitly instead of claiming it passed.
