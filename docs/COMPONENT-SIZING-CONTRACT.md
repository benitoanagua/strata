# STRATA Component Sizing Contract

Source of truth for how STRATA components size themselves — width, height,
box model and overflow. Complements `COMPONENT-UX-CONTRACT.md` (semantics)
and `DESIGN-LAWS.md` (visual laws). Per-component specs live in
`IMPLEMENTATION-AUDIT.md`.

## 1. Box model

- **`box-sizing: border-box` is mandatory** for every element a component
  styles. Components extending `StrataElement` inherit the reset through
  `strataComponentStyles`; components that render into **light DOM**
  (e.g. `strata-button`) or manage their own `static styles` must declare
  it explicitly — the host page's global reset cannot be assumed.
- Declared `width`/`height`/`min-height` always include padding and
  borders. A `min-height: 44px` control is 44px tall, not 44px + padding.

## 2. Width

| Mode    | Meaning                                   | Mechanism                                                                                                                                          |
| ------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| natural | shrink-to-fit content                     | default; host stays `inline-block`/`inline-flex`                                                                                                   |
| full    | 100% of the **available** container width | host-level rule (e.g. `strata-button[full-width] { width: 100% }`) — the host participates in parent layout, the inner control only fills the host |
| bounded | `min()`/`max()` against the container     | e.g. `width: min(100%, 560px)`                                                                                                                     |

Rules:

- A "full width" prop stretches the **host element**, never just the inner
  control — the host is what the parent's flex/grid/block layout sees.
- Components must set `min-width: 0` on themselves and on shrinkable
  descendants so they can live inside grid/flex tracks narrower than
  their intrinsic content size.
- Never produce horizontal overflow: content either wraps, scrolls inside
  the component, or truncates — it does not push the page.

## 3 Height scale

Single-line **form fields** share one control height: **44px**
(`.strata-field` metric — `min-height: 44px` including padding). This
covers `strata-text-field`, `strata-select`, `strata-search-field`,
`strata-number-field`, `strata-date-field`. Label-above and
label-inside are both valid anatomies; the _control box_ is identical.

Other families keep their own scales (they are not form fields):

- Buttons: `small` 32px / `medium` 40px / `large` 48px.
- Tabs: 40px; tree rows: 30px; icon buttons: 40/48/56px.

A component may deviate only with a documented functional reason (e.g.
multi-line inputs, icon-only targets) recorded in its audit spec.

## 4. Overflow behavior

- **Wrap** for text content and inline layouts.
- **Scroll inside the component** for bounded surfaces (dialogs,
  tables) — never scroll the page because one component is too wide.
- **Truncate** (`ellipsis`) only for single-line metadata where the full
  value remains reachable (tooltip, title, or detail view).
- **Grow** up to the container limit; never beyond it.
- `min-width: 0` / `minmax(0, 1fr)` wherever content could otherwise
  force a track wider than its container.

## 5. Verification

- Unit tests assert API/reflection; real geometry is verified in the
  catalog Playwright suite (`catalog.spec.ts`): panel overflow, demo
  stage fit and the shared 44px field height are covered there.
- Visual baselines catch unintended size changes per component.
