# Changelog

## 2.5.1

### Fixed

- Typecheck: corrected global element type map and item-component exports in `packages/components`.
- Removed the redundant theme-aware mixin; components now inherit STRATA CSS tokens directly.
- `@strata/components` emits declaration files via `vite-plugin-dts`.
- Tokens: added missing semantic tokens and standardized gray naming.
- Divider and foundation components use defined scale-border tokens.
- Component unit tests cover registration and baseline behavior.

### Added

- Internal Svelte component catalog with live property controls, surface and viewport selectors.
- Browser and accessibility checks against the Svelte catalog.
- GitHub Actions CI covering audit, lint, typecheck, tests, build and Changesets.
- `.changeset/config.json`.

## 2.5.0

### Added

- Expanded the canonical STRATA catalog to 48 component/element entries.
- Added form, navigation, feedback, overlay, data and content primitives.

### Changed

- `strata-*` is the canonical namespace.
- Carbon via `iconify-icon` remains the only permitted icon collection.
- Components consume STRATA tokens and Scale Law geometry.
