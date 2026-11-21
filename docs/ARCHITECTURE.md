# STRATA architecture

STRATA is a pnpm + Turborepo monorepo. The design system is deliberately layered without unnecessary abstraction.

```text
@strata/tokens
      ↓
@strata/core
      ↓
@strata/components
      ↓
@strata/prose ──→ integrations/*
      ↓
apps/catalog
      ↓
@strata/testing
```

## Repository layout convention

- `apps/` — executables or deployables. Only `apps/catalog` (the internal Svelte playground) lives here.
- `packages/` — what gets published to npm: `@strata/tokens`, `@strata/core`, `@strata/components`, `@strata/prose`.
- `integrations/` — platform adapters that consume `packages/*` and translate STRATA into a foreign system's conventions. Currently `@strata/integration-mediawiki`.
- `tooling/` — lint rules, token validation and shared configuration.

## Packages

- `@strata/tokens`: primitive and semantic design tokens, CSS output, typography and a grayscale-first color contract with optional accent.
- `@strata/core`: shared type contracts, theme utilities and the Scale Law.
- `@strata/components`: publishable Lit Web Components and their public TypeScript contracts.
- `@strata/prose`: platform-agnostic reading layer (serif body, editorial measure, filetes) exported as `prose.css`. Any site can consume it on top of `@strata/tokens`.
- `@strata/integration-mediawiki` (private): MediaWiki 1.39+ skin; keeps only `.mw-*` chrome and delegates article styling to `@strata/prose`.
- `@strata/testing`: component contract, accessibility and visual tests.
- `@strata/catalog` (private, `apps/catalog`): internal Svelte playground that consumes the component package.

## Icons

There is intentionally no `@strata/icons` abstraction. Components use `iconify-icon` directly. `@iconify-json/carbon` is the only permitted collection.

## Component source of truth

`packages/components/src/elements/index.ts` is the public export boundary and `ComponentCatalog.ts` is the canonical inventory. The Svelte catalog uses a typed registry (`apps/catalog/src/lib/componentRegistry.ts`) that mirrors the canonical inventory and describes interactive property controls; it does not duplicate component implementations or styles.

Shared behavior belongs in `StrataElement` only when it is genuinely common. Component-specific behavior and styles stay with the component. CSS is split into `component-base.css` plus component-local styles so each shadow-root component does not receive the full system stylesheet. There is no compatibility layer or migration bridge in the production package.
