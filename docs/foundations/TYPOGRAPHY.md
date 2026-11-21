# STRATA Typography

STRATA typography follows the discipline of the editorial CVs (XeLaTeX,
`article` 10pt): a small base size, modest weights, generous air between
blocks, a large bold name/title, and careful microtypography. Hierarchy comes
from tone, size and weight — not from containers or color.

## Families by role

| Role           | Family          | Token                 | Used for                                                                                             |
| -------------- | --------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| Reading / body | Source Serif 4  | `--strata-font-serif` | Body copy, long-form text, page base (`global.css`, catalog reading areas)                           |
| Interface      | Source Sans 3   | `--strata-font-sans`  | `StrataBase` host, buttons, forms, menus, navigation, dashboard chrome                               |
| Machine        | Source Code Pro | `--strata-font-mono`  | Tags, badges, breadcrumbs, pagination, stepper/number values, `DataTable` `.numeric` cells, metadata |

Fonts load from Google Fonts via `@strata/tokens/fonts.css` (single URL in
`tokens.json → fontsUrl`). The repository never ships font files or
`@fontsource` packages.

## Scale and measure

The scale is mobile-first and intentionally compact (see `tokens.json →
typography`). Body text sits at 14–16 px with a line-height near 1.4 — the
screen equivalent of LaTeX's 10 pt body on a 12 pt baseline. Reading columns
should cap at `--strata-editorial-measure` (560 px), which lands in the
**65–75 character** range at body sizes.

- Section titles are lowercase-friendly, modest weight (500), often with a
  hairline filete beneath — mirror this with `strata-title` + `strata-divider`.
- The document title/name may go large and bold (`display*` roles).
- Numeric values that change in place or align in columns use `tnum` /
  monospace.

## Rules of thumb

- Serif for reading, sans for operating, mono for labeling/measuring.
- Do not introduce one-off font sizes; consume the semantic roles
  (Display, Headline, Title, Body, Label, Numeric).
- Mono is not decorative: it marks tags, identifiers, counts and aligned data.
