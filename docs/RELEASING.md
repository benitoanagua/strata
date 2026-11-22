# Releasing STRATA

Versions are managed by [Changesets](https://github.com/changesets/changesets). CI runs `changeset version` + `changeset publish` on `main` when a PR merges.

## Policy

- **Public packages** — `@strata/tokens`, `@strata/core`, `@strata/components`, `@strata/prose` — form a `fixed` group in `.changeset/config.json`: any changeset that touches one of them bumps all four to the same version, keeping the design system coherent.
- **Private packages** — `@strata/catalog`, `@strata/testing`, `@strata/integration-mediawiki`, `@strata/token-validator` — are `private: true` and excluded from versioning via `privatePackages.version: false`. Their `version` fields are informational only.
- `publishConfig.access: "public"` is set on every publishable package so scoped packages can be published to npm.
- `@strata/integration-mediawiki` is private; its `skin.json` version is injected from `package.json` at build time (`scripts/build.mjs` → `dist/Strata/skin.json`), so the two can never drift.

## Root CHANGELOG

`CHANGELOG.md` at the root is only an index pointing at the per-package changelogs. Do not hand-edit release notes there.

## Adding a changeset

```bash
pnpm changeset
```

List only the public packages you actually changed; the fixed group handles the rest. Private packages must not appear in changesets.
