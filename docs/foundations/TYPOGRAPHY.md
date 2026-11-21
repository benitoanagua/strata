# STRATA Typography

## Families

- **Source Serif 4** is the reading family for body text (`--strata-font-serif`).
- **Source Sans 3** is the UI sans for dashboards, menus and navigation (`--strata-font-sans`).
- **Source Code Pro** is reserved for tags, numeric/data contexts and similar elements where alignment or machine-like reading improves comprehension (`--strata-font-mono`).
- Fonts load from Google Fonts. Consumers add the `<link>` shown in `catalog/index.html` or import `@strata/tokens/fonts.css`; the repository never ships font files.

## Principle

**Sans communicates. Mono measures.**

The scale is mobile-first and intentionally compact. Headings create hierarchy without requiring a container. Numeric values use tabular figures (`tnum`) where values change in place.

## Roles

Display, Headline, Title, Body, Label and Numeric are semantic roles. Components should consume these roles rather than inventing one-off sizes.
