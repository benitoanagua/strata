# STRATA Design Laws

## 1. Scale Law

**Physical scale determines structural weight.**

`micro → small → medium → large → hero`

As a component becomes physically larger, its permitted structural weight increases: radius, border thickness and elevation are monotonic across the scale. Small components may have no border or elevation.

## 2. Emphasis Law

**Semantic importance does not override physical scale.**

Primary actions use typography, contrast and semantic color before adding structural weight. A small button does not become a card because it is important.

## 3. Monochrome Law

**Monochrome establishes structure.**

Black, white and gray build the interface, editorial hierarchy, surfaces, navigation and dividers.

## 4. Spectrum Law

**Color establishes meaning.**

STRATA has seven semantic spectrum families: red, orange, yellow, green, blue, indigo and violet. They are used with restraint for state, information, emphasis and categorization.

## 5. Typography Law

**Typography carries hierarchy before containers do.**

Source Serif 4 is the reading family (body text). Source Sans 3 is the interface family (dashboards, menus, navigation). Source Code Pro is reserved for tags, numerical/data contexts and similar machine-like elements where tabular alignment improves scanning. Fonts are loaded from Google Fonts, never bundled in the repository.

## 6. Iconography Law

Iconify is used directly. `@iconify-json/carbon` is the only permitted icon collection.

## 7. Editorial Law

Use whitespace, columns, metadata and simple dividers before adding another container. Dividers may be solid, double or dashed.
