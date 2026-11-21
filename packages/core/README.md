# @strata/core

Shared STRATA design-system primitives: type contracts, the Scale Law geometry table and theme helpers.

## Contents

- `StrataSize`, `StrataEmphasis`, `StrataSurface`, `StrataState` — the semantic type vocabulary used across tokens and components.
- `STRATA_SCALE_LAW` / `strataGeometry(size)` — physical scale contract (`micro → small → medium → large → hero`) controlling radius, border width and elevation. Elevation is always `0`: hierarchy comes from filetes and whitespace, never shadows.
- `assertStrataScaleLaw()` — runtime assertion that the scale table stays internally consistent.
- `setStrataTheme(theme)` / `getStrataTheme()` — light/dark helpers that read and write `data-theme` on `<html>`.

## Usage

```ts
import { strataGeometry, setStrataTheme } from "@strata/core";

const { radius, border, elevation } = strataGeometry("medium");
setStrataTheme("dark");
```

Components should prefer CSS custom properties (`--strata-*`) emitted by `@strata/tokens`; this package is for logic that needs the values in TypeScript.
