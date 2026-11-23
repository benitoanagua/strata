# STRATA Design Laws

## 1. Scale Law

**Physical scale determines structural weight — through filetes and space, never elevation.**

`micro → small → medium → large → hero`

Radius stays within 0–2 px and borders are filetes of 0, 0.5 or 1 px; both are monotonic across the scale. Elevation is abolished (`--strata-elevation-*` always resolves to `none`): separation comes from hairlines, whitespace and tonal surfaces, in the manner of the LaTeX CVs. Circular shapes are allowed only where geometry demands it, via an explicit allowlist enforced by `tooling/lint/design-rules.mjs`: the switch thumb (`.strata-switch__thumb`), carousel pagination dots (`.strata-carousel__dot`), button ripple and spinner effects, `.strata-spinner`, and card author avatars. Everything else — carousel nav buttons, modal close, overlay chips, theme toggle, switch track — uses the 0–2 px scale like any other control. Once the scale saturates, larger components differ through space and typography, not heavier chrome.

## 2. Emphasis Law

**Semantic importance does not override physical scale.**

Primary actions use typography, contrast and semantic color before adding structural weight. A small button does not become a card because it is important.

## 3. Monochrome Law

**Monochrome establishes structure.**

Black, white and gray build the interface, editorial hierarchy, surfaces, navigation and dividers. The gray scale follows the ink ramp of the editorial CVs: ink `#111111`, mid `#333333`, soft `#666666`, pale `#999999`, divisor `#CCCCCC` — mirrored for dark surfaces. Hierarchy is carried by tone, size and weight, not hue.

## 4. Accent Law

**Color is an exception, never a system.**

STRATA has no general-purpose spectrum. The seven-color family system was removed; there is no `spectrum` token group and components may not reference it. The only rainbow is the scoped **taxonomy exception** below.

- A **single optional accent** may exist for links and focus, defined in `tokens.accent` and **disabled by default**. Enabling it emits `--strata-color-accent-link` / `--strata-color-accent-focus`, which must satisfy the WCAG AA contrast contract.
- **Functional status colors** (`status-error`, `status-warning`, `status-success`) are the only other hues, deliberately desaturated. They are always accompanied by an icon, underline, weight or filete — never color alone.
- **Color is obligatory when its absence reduces clarity.** Semantic color must be used for destructive actions, success confirmation, warnings and states needing attention — including solid surfaces when the action warrants high emphasis. It is never decoration, never the sole signal, and never a reason to drain the weight of active variants into disabled-looking treatments. The full component-level rules live in `COMPONENT-UX-CONTRACT.md`.
- **Taxonomy exception (`tokens.tagHue`)**: seven hues (red, orange, yellow, green, blue, indigo, violet) plus `neutral` exist solely to tell tags, categories and labels apart. They are exposed as `--strata-tag-<hue>-ink` / `-tint`, consumed only by tag-like components (`strata-tag`, `strata-tag-list`, `strata-filter-bar`, comment role badges, entry/article kickers), and every ink must reach 4.5:1 on its tint and on both surfaces (enforced by `tooling/token-validator`). A hue never carries meaning alone: the label text is always rendered. `hue="auto"` derives a stable hue from the label. Set `<html data-tag-hues="mono">` (or `tagHue.enabled: false`) to collapse them to the ink ramp.
- If the accent, status and taxonomy colors can be removed without breaking comprehension, the interface is correct.
- **Syntax highlighting stays inside the ink ramp.** Code samples use `--strata-color-syntax-*` tokens (keyword/attr/string/comment) drawn from the same grayscale ramp as text; token types are distinguished by shade, weight and style — never by hue.

Decision note: the brief "que deje ser monocromático" was ambiguous between "strictly monochrome" and "monochrome-led". STRATA resolves it as _monochrome-led with a minimal optional exception_: the default theme emits zero chromatic variables.

## 5. Typography Law

**Typography carries hierarchy before containers do.**

Source Serif 4 is the reading family (body text). Source Sans 3 is the interface family (dashboards, menus, navigation). Source Code Pro is reserved for tags, numerical/data contexts and similar machine-like elements where tabular alignment improves scanning. Fonts are loaded from Google Fonts, never bundled in the repository.

Sizes come from `--strata-type-*` tokens only; there is no display scale — headings are modest (≤24 px), medium weight, and may carry a hairline filete, mirroring the section titles of the LaTeX CVs. Reading measure is capped near 70 `ch`.

## 6. Iconography Law

Iconify is used directly. `@iconify-json/carbon` is the only permitted icon collection.

## 7. Editorial Law

Use whitespace, columns, metadata and simple dividers before adding another container. Dividers may be solid, double or dashed.
