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

Black, white and gray build the interface, editorial hierarchy, surfaces, navigation and dividers. The gray scale follows the ink ramp of the editorial CVs: ink `#111111`, mid `#333333`, soft `#666666`, pale `#999999`, divisor `#CCCCCC` — mirrored for dark surfaces. Hierarchy is carried by tone, size and weight, not hue.

## 4. Accent Law

**Color is an exception, never a system.**

STRATA has no spectrum. The seven-color family system was removed; there is no `spectrum` token group and components may not reference it.

- A **single optional accent** may exist for links and focus, defined in `tokens.accent` and **disabled by default**. Enabling it emits `--strata-color-accent-link` / `--strata-color-accent-focus`, which must satisfy the WCAG AA contrast contract.
- **Functional status colors** (`status-error`, `status-warning`, `status-success`) are the only other hues, deliberately desaturated. They are always accompanied by an icon, underline, weight or filete — never color alone.
- If the accent and status colors can be removed without breaking comprehension, the interface is correct.

Decision note: the brief "que deje ser monocromático" was ambiguous between "strictly monochrome" and "monochrome-led". STRATA resolves it as _monochrome-led with a minimal optional exception_: the default theme emits zero chromatic variables.

## 5. Typography Law

**Typography carries hierarchy before containers do.**

Source Serif 4 is the reading family (body text). Source Sans 3 is the interface family (dashboards, menus, navigation). Source Code Pro is reserved for tags, numerical/data contexts and similar machine-like elements where tabular alignment improves scanning. Fonts are loaded from Google Fonts, never bundled in the repository.

## 6. Iconography Law

Iconify is used directly. `@iconify-json/carbon` is the only permitted icon collection.

## 7. Editorial Law

Use whitespace, columns, metadata and simple dividers before adding another container. Dividers may be solid, double or dashed.
