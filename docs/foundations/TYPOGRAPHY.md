# STRATA Typography

STRATA typography follows the discipline of the editorial CVs (XeLaTeX,
`article` 10pt): a small base size, modest weights, generous air between
blocks, a large bold name/title, and careful microtypography. Hierarchy comes
from tone, size and weight — not from containers or color.

## Families by role

| Role           | Family          | Token                 | Used for                                                                                                                 |
| -------------- | --------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Reading / body | Source Serif 4  | `--strata-font-serif` | Body copy, long-form text, article containers (`global.css`, `.strata-prose`, Card/Alert/Accordion/Modal/DataTable text) |
| Interface      | Source Sans 3   | `--strata-font-sans`  | `StrataBase` host, buttons, forms, menus, navigation, dashboard chrome                                                   |
| Machine        | Source Code Pro | `--strata-font-mono`  | Tags, badges, breadcrumbs, pagination, stepper/number values, `DataTable` `.numeric` cells, metadata                     |

Fonts load from Google Fonts via `@strata/tokens/fonts.css` (single URL in
`tokens.json → fontsUrl`). The repository never ships font files or
`@fontsource` packages.

## Type tokens

`tokens.json → typography` emits two custom properties per style in
`@strata/tokens/styles.css`:

- `--strata-type-<name>` — a `font` shorthand fragment
  (`{weight} {size}px/{line-height}px`), family-agnostic. Compose it as
  `font: var(--strata-type-label-large) var(--strata-font-sans);` so the
  family always comes from one of the three role tokens.
- `--strata-type-<name>-tracking` — the letter-spacing value.

Roles: `headline-*`, `title-*`, `body-*`, `label-*`, `numeric-*` and the
`reading-*` scale. There is deliberately **no display scale**: LaTeX-style
titles are modest (max ~24 px), medium weight, often with a hairline filete.

## Reading scale

`reading-body` (14 px / 21 px, ~1.5 leading) is the LaTeX 10 pt body on a
screen. `reading-small` (13/20) covers captions and notes;
`reading-large` (17/26) covers standfirsts. The `.strata-prose` layer
(`@strata/prose/prose.css`) applies `reading-body` and caps the measure at
**70 ch**, inside the 65–75 character window at any size.

## Rules of thumb

- Serif for reading, sans for operating, mono for labeling/measuring.
- Do not introduce one-off font sizes; consume the `--strata-type-*` roles.
- `font-family` may only reference `--strata-font-serif`, `--strata-font-sans`
  or `--strata-font-mono` — enforced by `packages/components/test/fonts.test.ts`.
- Mono is not decorative: it marks tags, identifiers, counts and aligned data.
