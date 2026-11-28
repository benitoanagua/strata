# STRATA — Implementation Audit

Audit of all 73 canonical entries in `STRATA_COMPONENT_CATALOG`, cross-checked against public exports, Lit property metadata, event dispatch sites, slot usage and the interactive catalog registry.

## Summary

- **73 canonical entries**, all registered as custom elements (`strata-*`).
- **77 registered elements**: the four extra tags (`strata-accordion-item`, `strata-carousel-item`, `strata-grille-item`, `strata-tab-panel`) are composition-only children, not catalog entries.
- Catalog registry, public exports and `STRATA_COMPONENT_CATALOG` are synchronized (verified by `apps/catalog/test/catalog-registry.test.ts`).
- Every entry mounts a real element in the catalog canvas; controls are derived from Lit `elementProperties` metadata (`apps/catalog/src/lib/props.ts`).

## Defects found and fixed during this audit

| Component                        | Defect                                                                                                                              | Fix                                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `strata-bottom-sheet`            | Duplicate `role="dialog"` attribute                                                                                                 | Removed duplicate; added Escape close, focus-in on open, focus restore, fallback `aria-label`             |
| `strata-drawer`                  | No focus management; missing accessible name                                                                                        | Focus moves inside on open, restores on close; Escape already handled; fallback `aria-label`              |
| `strata-modal`                   | No accessible name without title                                                                                                    | `aria-label` fallback                                                                                     |
| `strata-data-table`              | Slotted `<thead>/<tr>` markup is dropped by the HTML parser inside a custom element — the component could never render real content | Replaced slot API with `columns`/`rows` props (JSON or pipe-delimited), renders a native `<table>` itself |
| `strata-file-upload`             | No `strata-change` event, no selected-file list, drop target without drop handling                                                  | Emits `strata-change` with file names, renders selected files, drag & drop assigns files                  |
| `strata-breadcrumb`              | Pipe-only items, no links, no `aria-current`                                                                                        | `parseItems` JSON/pipe support, safe `href`s, `aria-current="page"` on last item                          |
| `strata-menu`                    | No keyboard navigation, no accessible name                                                                                          | ArrowUp/Down/Home/End roving focus, Escape closes, `aria-label`                                           |
| `strata-tooltip`                 | Tooltip always in a11y tree                                                                                                         | `aria-hidden` synced to hover/focus visibility, Escape hides                                              |
| `strata-text-field`              | `<label>` not associated with input                                                                                                 | `for`/`id` association added                                                                              |
| `strata-pagination`              | Buttons not grouped in a landmark                                                                                                   | Wrapped in `<nav aria-label>`                                                                             |
| `strata-accordion-item`          | Crash when used without `strata-accordion` parent                                                                                   | Standalone toggle fallback                                                                                |
| `strata-popover`                 | No Escape, no dialog semantics                                                                                                      | `role="dialog"`, `aria-label`, Escape closes                                                              |
| `strata-tab`, `strata-menu-item` | Host elements not focusable for roving tabindex                                                                                     | `focus()` delegates to inner control                                                                      |
| `strata-comment`                 | `role` property collided with the global ARIA `role` attribute — `role="Autor"` is an invalid ARIA role                             | Attribute renamed to `role-label`; property `role` kept for the badge                                     |
| `strata-filter-bar`              | `<ul role="group">` stripped list semantics, orphaning `<li>` children (axe `listitem`)                                             | Group moved to a wrapping `div`; `<ul>` keeps native list semantics                                       |
| `strata-ticker`                  | Horizontally scrollable `<ul>` not keyboard-focusable (axe `scrollable-region-focusable`)                                           | `tabindex="0"` on the scrollable list                                                                     |

## Actions

| Entry                        | Tag                   | Class               | Props                                                                                                                                              | Reflected            | Events | Slots     | Maturity |
| ---------------------------- | --------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------ | --------- | -------- |
| Button (`button`)            | `strata-button`       | `StrataButton`      | `label`<br>`ariaLabel`<br>`variant`<br>`size`<br>`color`<br>`disabled`<br>`loading`<br>`href`<br>`type`<br>`icon`<br>`trailingIcon`<br>`fullWidth` | —                    | —      | —         | stable   |
| IconButton (`icon-button`)   | `strata-icon-button`  | `StrataIconButton`  | `size`<br>`disabled`<br>`label`<br>`icon`                                                                                                          | —                    | —      | —         | stable   |
| Stepper (`stepper`)          | `strata-stepper`      | `StrataStepper`     | `size`<br>`tone`<br>`value`<br>`disabled`<br>`min`<br>`max`                                                                                        | `size`<br>`disabled` | —      | —         | beta     |

### Button — `strata-button`

- **Purpose:** A clear action with semantic variants and states. Variant/color/size/type are independent axes per `COMPONENT-UX-CONTRACT.md`.
- **Implementation:** `StrataButton` in `packages/components/src/elements/Button`
- **Properties (12):** `label` (String), `ariaLabel` (String, `aria-label` attribute), `variant` (String: `filled`/`outlined`/`text`/`elevated`/`tonal`), `size` (String: `small`/`medium`/`large`), `color` (String: `primary`/`error`/`success`/`warning`), `disabled` (Boolean), `loading` (Boolean), `href` (String), `type` (String: `button`/`submit`/`reset`), `icon` (String, `carbon:*`), `trailingIcon` (Boolean — repositions `icon`, never creates one), `fullWidth` (Boolean)
- **Variant roles:** `filled` = solid high-emphasis (semantic fills via `--btn-fill`/`--btn-on-fill`); `outlined` = filete + transparent; `text` = chromeless; `elevated` = neutral raised surface + `border-subtle` filete (legacy name — STRATA has no shadows); `tonal` = semantic ink tint ~18%/28% hover.
- **Sizing:** light-DOM component with its own `box-sizing` reset; `fullWidth` reflects to the host (`strata-button[full-width]`) so the host — not just the inner control — fills the container, per `COMPONENT-SIZING-CONTRACT.md`.
- **Accessibility:** Renders a native <button> (or <a role=button> when href is set); the visible label names it, `ariaLabel` covers icon-only usage; `aria-busy` while loading; ripple suppressed on keyboard activation.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### IconButton — `strata-icon-button`

- **Purpose:** A compact action identified by a Carbon icon.
- **Implementation:** `StrataIconButton` in `packages/components/src/elements/IconButton`
- **Properties (4):** `size` (String), `disabled` (Boolean), `label` (String), `icon` (String)
- **Accessibility:** Icon is decorative; the button is named by `label` via `aria-label` (fallback "Action"); `:disabled` dims to 0.45 and blocks interaction; focus ring uses `--strata-color-focus-ring`.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Stepper — `strata-stepper`

- **Purpose:** Increments or decrements a bounded numeric value.
- **Implementation:** `StrataStepper` in `packages/components/src/elements/Stepper`
- **Properties (6):** `size` (String, reflected), `tone` (String), `value` (Number), `disabled` (Boolean, reflected), `min` (Number), `max` (Number)
- **Accessibility:** Minus/plus buttons carry aria-labels; the value uses tabular mono numerals.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

## Forms

| Entry                        | Tag                   | Class               | Props                                                                            | Reflected                         | Events                            | Slots     | Maturity |
| ---------------------------- | --------------------- | ------------------- | -------------------------------------------------------------------------------- | --------------------------------- | --------------------------------- | --------- | -------- |
| TextField (`text-field`)     | `strata-text-field`   | `StrataTextField`   | `label`<br>`placeholder`<br>`value`<br>`disabled`<br>`error`<br>`errorMessage`   | `disabled`<br>`error`             | `strata-input`<br>`strata-change` | —         | stable   |
| SearchField (`search-field`) | `strata-search-field` | `StrataSearchField` | `size`<br>`tone`<br>`value`<br>`label`<br>`placeholder`<br>`disabled`            | `size`<br>`disabled`              | `strata-input`<br>`strata-change` | —         | beta     |
| NumberField (`number-field`) | `strata-number-field` | `StrataNumberField` | `size`<br>`tone`<br>`value`<br>`min`<br>`max`<br>`step`<br>`disabled`<br>`label` | `size`<br>`disabled`              | `strata-input`<br>`strata-change` | —         | beta     |
| DateField (`date-field`)     | `strata-date-field`   | `StrataDateField`   | `size`<br>`tone`<br>`value`<br>`label`<br>`disabled`                             | `size`<br>`disabled`              | `strata-input`<br>`strata-change` | —         | beta     |
| Select (`select`)            | `strata-select`       | `StrataSelect`      | `label`<br>`value`<br>`disabled`<br>`options`                                    | `disabled`                        | `strata-input`<br>`strata-change` | —         | beta     |
| Checkbox (`checkbox`)        | `strata-checkbox`     | `StrataCheckbox`    | `checked`<br>`disabled`<br>`label`                                               | `checked`<br>`disabled`           | `strata-input`<br>`strata-change` | `default` | stable   |
| Radio (`radio`)              | `strata-radio`        | `StrataRadio`       | `size`<br>`tone`<br>`label`<br>`checked`<br>`disabled`<br>`name`<br>`value`      | `size`<br>`checked`<br>`disabled` | `strata-input`<br>`strata-change` | `default` | beta     |
| RadioGroup (`radio-group`)   | `strata-radio-group`  | `StrataRadioGroup`  | `size`<br>`tone`<br>`label`                                                      | `size`                            | —                                 | `default` | beta     |
| Switch (`switch`)            | `strata-switch`       | `StrataSwitch`      | `checked`<br>`disabled`<br>`label`                                               | `checked`<br>`disabled`           | `strata-input`<br>`strata-change` | —         | stable   |
| Slider (`slider`)            | `strata-slider`       | `StrataSlider`      | `size`<br>`tone`<br>`value`<br>`min`<br>`max`<br>`step`<br>`disabled`            | `size`<br>`disabled`              | `strata-input`<br>`strata-change` | —         | beta     |
| FileUpload (`file-upload`)   | `strata-file-upload`  | `StrataFileUpload`  | `size`<br>`tone`<br>`accept`<br>`multiple`<br>`label`                            | `size`                            | `strata-change`                   | `default` | beta     |

### TextField — `strata-text-field`

- **Purpose:** A labelled single-line text input with error state.
- **Implementation:** `StrataTextField` in `packages/components/src/elements/TextField`
- **Properties (6):** `label` (String), `placeholder` (String), `value` (String), `disabled` (Boolean, reflected), `error` (Boolean, reflected), `errorMessage` (String)
- **Sizing:** extends `StrataElement` (shared `box-sizing`/host base); control box is the shared 44px single-line field height per `COMPONENT-SIZING-CONTRACT.md`; `minmax(0,1fr)` grid + `min-width:0` keep it inside narrow containers.
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Accessibility:** Label is associated via for/id; errors use aria-invalid, aria-describedby and role=alert.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### SearchField — `strata-search-field`

- **Purpose:** A text input specialised for search queries.
- **Implementation:** `StrataSearchField` in `packages/components/src/elements/SearchField`
- **Properties (6):** `size` (String, reflected), `tone` (String), `value` (String), `label` (String), `placeholder` (String), `disabled` (Boolean, reflected)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Accessibility:** Wrapping label names the input; decorative search icon is aria-hidden.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### NumberField — `strata-number-field`

- **Purpose:** A numeric input with step control.
- **Implementation:** `StrataNumberField` in `packages/components/src/elements/NumberField`
- **Properties (8):** `size` (String, reflected), `tone` (String), `value` (Number), `min` (Number), `max` (Number), `step` (Number), `disabled` (Boolean, reflected), `label` (String)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### DateField — `strata-date-field`

- **Purpose:** A labelled native date input.
- **Implementation:** `StrataDateField` in `packages/components/src/elements/DateField`
- **Properties (5):** `size` (String, reflected), `tone` (String), `value` (String), `label` (String), `disabled` (Boolean, reflected)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Select — `strata-select`

- **Purpose:** A labelled select control with a prop-driven options API.
- **Implementation:** `StrataSelect` in `packages/components/src/elements/Select`
- **Properties (4):** `label` (String), `value` (String), `disabled` (Boolean, reflected), `options` (Array of strings or `{ value, label }`, JSON via attribute)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Notes:** Options are rendered as real `<option>` children of the inner `<select>`. Slotted `<option>` elements never registered as options inside shadow DOM, so the `options` prop (or JSON `options` attribute) is the supported API.
- **Sizing:** extends `StrataElement`; control box is the shared 44px single-line field height per `COMPONENT-SIZING-CONTRACT.md`; `select` is `width:100%` + `min-width:0` inside a `minmax(0,1fr)` grid so it cannot overflow its container.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Checkbox — `strata-checkbox`

- **Purpose:** A binary choice with an accessible label.
- **Implementation:** `StrataCheckbox` in `packages/components/src/elements/Checkbox`
- **Properties (3):** `checked` (Boolean, reflected), `disabled` (Boolean, reflected), `label` (String)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Slots:** `default`
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Radio — `strata-radio`

- **Purpose:** A single option inside a radio group.
- **Implementation:** `StrataRadio` in `packages/components/src/elements/Radio`
- **Properties (7):** `size` (String, reflected), `tone` (String), `label` (String), `checked` (Boolean, reflected), `disabled` (Boolean, reflected), `name` (String), `value` (String)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Slots:** `default`
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### RadioGroup — `strata-radio-group`

- **Purpose:** Groups related radio options under one fieldset legend.
- **Implementation:** `StrataRadioGroup` in `packages/components/src/elements/RadioGroup`
- **Properties (3):** `size` (String, reflected), `tone` (String), `label` (String)
- **Slots:** `default` — strata-radio children.
- **Accessibility:** Uses a real <fieldset>/<legend> grouping.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Switch — `strata-switch`

- **Purpose:** A toggle for an immediate on/off setting.
- **Implementation:** `StrataSwitch` in `packages/components/src/elements/Switch`
- **Properties (3):** `checked` (Boolean, reflected), `disabled` (Boolean, reflected), `label` (String)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Accessibility:** role=switch with aria-checked; Space/Enter toggles.
- **Sizing:** track is `box-sizing: border-box` 40×24px including padding (was rendering 44×28px before the fix).
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Slider — `strata-slider`

- **Purpose:** A continuous value selector within a range.
- **Implementation:** `StrataSlider` in `packages/components/src/elements/Slider`
- **Properties (7):** `size` (String, reflected), `tone` (String), `value` (Number), `min` (Number), `max` (Number), `step` (Number), `disabled` (Boolean, reflected)
- **Events:** `strata-input` — Fired on every value change while interacting.; `strata-change` — Fired when the value is committed.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### FileUpload — `strata-file-upload`

- **Purpose:** A file picker with drag & drop; lists selected file names and emits strata-change.
- **Implementation:** `StrataFileUpload` in `packages/components/src/elements/FileUpload`
- **Properties (5):** `size` (String, reflected), `tone` (String), `accept` (String), `multiple` (Boolean), `label` (String)
- **Events:** `strata-change` — Fired with the selected file names.
- **Slots:** `default`
- **Accessibility:** Native file input inside a label; selected names are listed for review.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

## Navigation

| Entry                     | Tag                 | Class              | Props                                                             | Reflected              | Events                                                          | Slots                           | Maturity |
| ------------------------- | ------------------- | ------------------ | ----------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------- | ------------------------------- | -------- |
| NavItem (`nav-item`)      | `strata-nav-item`   | `StrataNavItem`    | `selected`<br>`label`                                             | `selected`             | —                                                               | `default`                       | stable   |
| Tabs (`tabs`)             | `strata-tabs`       | `StrataTabs`       | `activeTab`<br>`disabled`                                         | `disabled`             | `tab-change`                                                    | `tabs`<br>`panels`              | beta     |
| Tab (`tab`)               | `strata-tab`        | `StrataTab`        | `disabled`<br>`active`<br>`panelId`                               | `disabled`<br>`active` | `tab-change`                                                    | `default`<br>`tabs`<br>`panels` | beta     |
| Breadcrumb (`breadcrumb`) | `strata-breadcrumb` | `StrataBreadcrumb` | `size`<br>`tone`<br>`items`<br>`label`                            | `size`                 | —                                                               | —                               | beta     |
| Menu (`menu`)             | `strata-menu`       | `StrataMenu`       | `size`<br>`tone`<br>`open`<br>`label`                             | `size`                 | —                                                               | `default`                       | beta     |
| MenuItem (`menu-item`)    | `strata-menu-item`  | `StrataMenuItem`   | `size`<br>`tone`<br>`label`<br>`icon`<br>`disabled`               | `size`                 | —                                                               | `default`                       | beta     |
| Tree (`tree`)             | `strata-tree`       | `StrataTree`       | `label`<br>`nodes`<br>`selectedIds`<br>`multiple`<br>`emptyLabel` | —                      | `strata-select`<br>`strata-selection-change`<br>`strata-toggle` | —                               | beta     |

### NavItem — `strata-nav-item`

- **Purpose:** A labelled navigation entry with selected state.
- **Implementation:** `StrataNavItem` in `packages/components/src/elements/NavItem`
- **Properties (2):** `selected` (Boolean, reflected), `label` (String)
- **Slots:** `default`
- **Accessibility:** Selection is exposed via aria-current=page, not color alone.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Tabs — `strata-tabs`

- **Purpose:** Organises content into switchable panels with arrow-key nav.
- **Implementation:** `StrataTabs` in `packages/components/src/elements/Tab` (`Tabs.ts`)
- **Properties (2):** `activeTab` (Number), `disabled` (Boolean, reflected)
- **Events:** `tab-change` — Fired when the active tab changes.
- **Slots:** `tabs` — strata-tab children.; `panels` — strata-tab-panel children.
- **Accessibility:** role=tablist/tab/tabpanel with roving tabindex; arrows, Home and End move between tabs.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Tab — `strata-tab`

- **Purpose:** A single tab inside a tabs container.
- **Implementation:** `StrataTab` in `packages/components/src/elements/Tab`
- **Properties (3):** `disabled` (Boolean, reflected), `active` (Boolean, reflected), `panelId` (String)
- **Events:** `tab-change`
- **Slots:** `default`; `tabs`; `panels`
- **Keyboard:** ArrowLeft, ArrowRight, Home, End, @keydown, Tab
- **Notes:** Managed by strata-tabs; standalone use is not supported.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Breadcrumb — `strata-breadcrumb`

- **Purpose:** Shows the path to the current location; supports links and marks the last item.
- **Implementation:** `StrataBreadcrumb` in `packages/components/src/elements/Breadcrumb`
- **Properties (4):** `size` (String, reflected), `tone` (String), `items` (String), `label` (String)
- **Accessibility:** nav landmark; last item carries aria-current=page.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Menu — `strata-menu`

- **Purpose:** A menu of actionable items with arrow-key navigation.
- **Implementation:** `StrataMenu` in `packages/components/src/elements/Menu`
- **Properties (4):** `size` (String, reflected), `tone` (String), `open` (Boolean), `label` (String)
- **Slots:** `default` — strata-menu-item children.
- **Keyboard:** Escape, ArrowDown, ArrowUp, Home, End, @keydown
- **Accessibility:** role=menu/menuitem; ArrowUp/Down, Home and End move focus; Escape closes.
- **Notes:** No trigger/anchor API yet — control open state from the host page.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### MenuItem — `strata-menu-item`

- **Purpose:** A single actionable entry inside a menu.
- **Implementation:** `StrataMenuItem` in `packages/components/src/elements/MenuItem`
- **Properties (5):** `size` (String, reflected), `tone` (String), `label` (String), `icon` (String), `disabled` (Boolean)
- **Slots:** `default`
- **Notes:** Used inside strata-menu; emits no events of its own yet.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

## Feedback

| Entry                 | Tag               | Class            | Props                                                         | Reflected        | Events   | Slots     | Maturity |
| --------------------- | ----------------- | ---------------- | ------------------------------------------------------------- | ---------------- | -------- | --------- | -------- |
| Alert (`alert`)       | `strata-alert`    | `StrataAlert`    | `tone`                                                        | `tone`           | —        | `default` | stable   |
| Badge (`badge`)       | `strata-badge`    | `StrataBadge`    | `tone`<br>`label`<br>`hue`<br>`href`<br>`removable` | `tone`           | `remove` | `default` | stable   |
| Progress (`progress`) | `strata-progress` | `StrataProgress` | `value`<br>`label`                                            | —                | —        | —         | stable   |
| Skeleton (`skeleton`) | `strata-skeleton` | `StrataSkeleton` | `width`                                                       | —                | —        | —         | stable   |
| Spinner (`spinner`)   | `strata-spinner`  | `StrataSpinner`  | `size`<br>`tone`<br>`label`                                   | `size`           | —        | —         | stable   |
| Snackbar (`snackbar`) | `strata-snackbar` | `StrataSnackbar` | `size`<br>`tone`<br>`open`<br>`message`                       | `size`<br>`open` | —        | `default` | beta     |
| Tooltip (`tooltip`)   | `strata-tooltip`  | `StrataTooltip`  | `size`<br>`tone`<br>`text`                                    | `size`           | —        | `default` | beta     |

### Alert — `strata-alert`

- **Purpose:** A semantic message that communicates feedback and status.
- **Implementation:** `StrataAlert` in `packages/components/src/elements/Alert`
- **Properties (1):** `tone` (any, reflected)
- **Slots:** `default`
- **Accessibility:** role=status; tone is paired with an icon, never color alone.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Badge — `strata-badge`

- **Purpose:** A compact label for status or category, supporting semantic tones, taxonomy hues, links and removal.
- **Implementation:** `StrataBadge` in `packages/components/src/elements/Badge`
- **Properties (7):** `tone` (String, reflected), `label` (String), `hue` (String), `href` (String), `removable` (Boolean), `interactive` (Boolean), `pressed` (Boolean)
- **Sizing:** compact taxonomy label with shared interactive pressed-state styling for filter chips.
- **Slots:** `default`
- **Accessibility:** Status tones render a distinct Carbon icon alongside the text.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Progress — `strata-progress`

- **Purpose:** Determinate progress along a 0–100 scale.
- **Implementation:** `StrataProgress` in `packages/components/src/elements/Progress`
- **Properties (2):** `value` (Number), `label` (String)
- **Accessibility:** role=progressbar with aria-valuemin/max/now and a label.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Skeleton — `strata-skeleton`

- **Purpose:** A placeholder shape shown while content loads.
- **Implementation:** `StrataSkeleton` in `packages/components/src/elements/Skeleton`
- **Properties (1):** `width` (String)
- **Accessibility:** aria-hidden; purely decorative loading affordance.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Spinner — `strata-spinner`

- **Purpose:** An indeterminate loading indicator.
- **Implementation:** `StrataSpinner` in `packages/components/src/elements/Spinner`
- **Properties (3):** `size` (String, reflected), `tone` (String), `label` (String)
- **Accessibility:** role=status with an accessible label.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Snackbar — `strata-snackbar`

- **Purpose:** A transient confirmation message.
- **Implementation:** `StrataSnackbar` in `packages/components/src/elements/Snackbar`
- **Properties (4):** `size` (String, reflected), `tone` (String), `open` (Boolean, reflected), `message` (String)
- **Slots:** `default`
- **Accessibility:** role=status announces the message politely.
- **Notes:** No auto-dismiss timer; control open state from the host.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Tooltip — `strata-tooltip`

- **Purpose:** Reveals helper text on hover or focus; Escape dismisses.
- **Implementation:** `StrataTooltip` in `packages/components/src/elements/Tooltip`
- **Properties (3):** `size` (String, reflected), `tone` (String), `text` (String)
- **Slots:** `default` — The trigger element.
- **Keyboard:** Escape, @keydown
- **Accessibility:** role=tooltip shown on hover/focus-within; aria-hidden toggles with visibility. For full AT support prefer visible text or aria-describedby on the trigger.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

## Surfaces

| Entry                              | Tag                      | Class                  | Props                                                                                                                                                                                                                                                                            | Reflected                                                | Events                                                | Slots                             | Maturity     |
| ---------------------------------- | ------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- | --------------------------------- | ------------ |
| Surface (`surface`)                | `strata-surface`         | `StrataSurface`        | `size`<br>`outlined`                                                                                                                                                                                                                                                             | `outlined`                                               | —                                                     | `default`                         | stable       |
| Card (`card`)                      | `strata-card`            | `StrataCard`           | `title`<br>`url`<br>`excerpt`<br>`feature_image`<br>`tag_name`<br>`tag_url`<br>`author_name`<br>`author_url`<br>`author_profile_image`<br>`media_align`<br>`media_width`<br>`heading`<br>`density`<br>`size`<br>`aspect_ratio`<br>`reading_time`<br>`published_at`<br>`bordered` | `heading`<br>`size`<br>`bordered`                        | —                                                     | —                                 | beta         |
| Modal (`modal`)                    | `strata-modal`           | `StrataModal`          | `open`<br>`title`<br>`size`<br>`position`<br>`variant`<br>`animation`<br>`closeOnOverlay`<br>`closeOnEscape`<br>`showClose`<br>`preventScroll`                                                                                                                                   | `open`                                                   | `modal-open`<br>`modal-before-close`<br>`modal-close` | `header`<br>`default`<br>`actions` | beta         |
| Drawer (`drawer`)                  | `strata-drawer`          | `StrataDrawer`         | `size`<br>`tone`<br>`open`<br>`title`                                                                                                                                                                                                                                            | `size`<br>`open`                                         | —                                                     | `default`                         | beta         |
| BottomSheet (`bottom-sheet`)       | `strata-bottom-sheet`    | `StrataBottomSheet`    | `size`<br>`tone`<br>`open`<br>`title`                                                                                                                                                                                                                                            | `size`<br>`open`                                         | —                                                     | `default`                         | beta         |
| Popover (`popover`)                | `strata-popover`         | `StrataPopover`        | `size`<br>`tone`<br>`open`<br>`label`                                                                                                                                                                                                                                            | `size`<br>`open`                                         | —                                                     | `default`                         | experimental |
| Overlay (`overlay`)                | `strata-overlay`         | `StrataOverlay`        | `title`<br>`url`<br>`feature_image`<br>`tag_name`<br>`author_name`<br>`published_at`<br>`reading_time`<br>`aspect_ratio`<br>`heading`<br>`show_meta`<br>`align`<br>`position`<br>`box`<br>`fill`                                                                                 | `heading`                                                | —                                                     | —                                 | beta         |
| ThemeToggle (`theme-toggle`)       | `strata-theme-toggle`    | `StrataThemeToggle`    | —                                                                                                                                                                                                                                                                                | —                                                        | `theme-change`                                        | —                                 | stable       |
| ViewerSettings (`viewer-settings`) | `strata-viewer-settings` | `StrataViewerSettings` | `theme`<br>`surface`<br>`viewport`<br>`motion`<br>`label`<br>`open`                                                                                                                                                                                                              | `theme`<br>`surface`<br>`viewport`<br>`motion`<br>`open` | `strata-change`                                       | —                                 | beta         |

### Surface — `strata-surface`

- **Purpose:** A foundational container at a physical scale step.
- **Implementation:** `StrataSurface` in `packages/components/src/elements/Surface`
- **Properties (2):** `size` (String), `outlined` (Boolean, reflected)
- **Slots:** `default`
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Card — `strata-card`

- **Purpose:** A content container for editorial material and media.
- **Implementation:** `StrataCard` in `packages/components/src/elements/Card`
- **Properties (18):** `title` (String), `url` (String), `excerpt` (String), `feature_image` (String), `tag_name` (String), `tag_url` (String), `author_name` (String), `author_url` (String), `author_profile_image` (String), `media_align` (String), `media_width` (String), `heading` (Number, reflected), `density` (String), `size` (String, reflected), `aspect_ratio` (String), `reading_time` (String), `published_at` (String), `bordered` (Boolean, reflected)
- **Keyboard:** is-one-fifth, is-one-quarter, is-one-third, is-two-fifths
- **Accessibility:** Title renders as a configurable heading level (h2–h6).
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Modal — `strata-modal`

- **Purpose:** An overlay dialog with size, position and animation.
- **Implementation:** `StrataModal` in `packages/components/src/elements/Modal`
- **Properties (10):** `open` (Boolean, reflected), `title` (String), `size` (String), `position` (String), `variant` (String), `animation` (String), `closeOnOverlay` (Boolean), `closeOnEscape` (Boolean), `showClose` (Boolean), `preventScroll` (Boolean)
- **Events:** `modal-open` — Fired after the modal opens.; `modal-before-close` — Fired before closing; preventDefault cancels.; `modal-close` — Fired after the modal closes.
- **Slots:** `header` — Replaces the generated title header.; `default` — Body content.; `actions` — Footer actions.
- **Keyboard:** Escape, Tab, @keydown
- **Accessibility:** role=dialog aria-modal; scroll lock, focus trap and Escape handling; focus restored on close.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Drawer — `strata-drawer`

- **Purpose:** A side panel that slides in from the edge.
- **Implementation:** `StrataDrawer` in `packages/components/src/elements/Drawer`
- **Properties (4):** `size` (String, reflected), `tone` (String), `open` (Boolean, reflected), `title` (String)
- **Slots:** `default`
- **Keyboard:** Escape
- **Accessibility:** role=dialog aria-modal; Escape closes, focus moves to the close button and is restored.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### BottomSheet — `strata-bottom-sheet`

- **Purpose:** A sheet anchored to the bottom edge.
- **Implementation:** `StrataBottomSheet` in `packages/components/src/elements/BottomSheet`
- **Properties (4):** `size` (String, reflected), `tone` (String), `open` (Boolean, reflected), `title` (String)
- **Slots:** `default`
- **Keyboard:** Escape
- **Accessibility:** role=dialog aria-modal; Escape closes, focus moves to the close button and is restored.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Popover — `strata-popover`

- **Purpose:** A floating panel toggled by the open property.
- **Implementation:** `StrataPopover` in `packages/components/src/elements/Popover`
- **Properties (4):** `size` (String, reflected), `tone` (String), `open` (Boolean, reflected), `label` (String)
- **Slots:** `default`
- **Keyboard:** Escape, @keydown
- **Accessibility:** role=dialog with aria-label; Escape closes. No anchor positioning yet.
- **Notes:** Experimental: no trigger/anchor API; position it from the host page.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** experimental

### Overlay — `strata-overlay`

- **Purpose:** Text and metadata layered over media.
- **Implementation:** `StrataOverlay` in `packages/components/src/elements/Overlay`
- **Properties (14):** `title` (String), `url` (String), `feature_image` (String), `tag_name` (String), `author_name` (String), `published_at` (String), `reading_time` (String), `aspect_ratio` (String), `heading` (Number, reflected), `show_meta` (Boolean), `align` (String), `position` (String), `box` (String), `fill` (String)
- **Accessibility:** Title renders at a configurable heading level over the media.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### ThemeToggle — `strata-theme-toggle`

- **Purpose:** Switches between light and dark themes.
- **Implementation:** `StrataThemeToggle` in `packages/components/src/elements/ThemeToggle`
- **Properties (0):** none
- **Events:** `theme-change` — Window event with the new theme (light|dark).
- **Accessibility:** Button with an accessible label describing the action.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

## Data & Content

| Entry                     | Tag                 | Class              | Props                                                                                    | Reflected  | Events                                     | Slots                 | Maturity |
| ------------------------- | ------------------- | ------------------ | ---------------------------------------------------------------------------------------- | ---------- | ------------------------------------------ | --------------------- | -------- |
| DataTable (`data-table`)  | `strata-data-table` | `StrataDataTable`  | `columns`<br>`rows`                                                                      | —          | —                                          | —                     | beta     |
| Pagination (`pagination`) | `strata-pagination` | `StrataPagination` | `page`<br>`pages`<br>`label`                                                             | —          | `pagination-change`                        | —                     | beta     |
| List (`list`)             | `strata-list`       | `StrataList`       | `size`<br>`tone`<br>`divided`                                                            | `size`     | —                                          | `default`             | stable   |
| ListItem (`list-item`)    | `strata-list-item`  | `StrataListItem`   | `size`<br>`tone`<br>`title`<br>`description`<br>`href`                                   | `size`     | —                                          | `default`             | stable   |
| Accordion (`accordion`)   | `strata-accordion`  | `StrataAccordion`  | `multiple`<br>`variant`                                                                  | `multiple` | `accordion-toggle`                         | `default`<br>`header` | beta     |
| Carousel (`carousel`)     | `strata-carousel`   | `StrataCarousel`   | `desktop`<br>`mobile`<br>`gap`<br>`interval`<br>`autoPlay`<br>`showArrows`<br>`showDots` | —          | `carousel-change`<br>`carousel-navigation` | `default`             | beta     |
| Grille (`grille`)         | `strata-grille`     | `StrataGrille`     | `desktop`<br>`mobile`<br>`gap`                                                           | —          | —                                          | `default`             | beta     |
| Avatar (`avatar`)         | `strata-avatar`     | `StrataAvatar`     | `size`<br>`tone`<br>`label`<br>`src`<br>`alt`                                            | `size`     | —                                          | —                     | stable   |
| Divider (`divider`)       | `strata-divider`    | `StrataDivider`    | `variant`                                                                                | `variant`  | —                                          | —                     | stable   |
| Logo (`logo`)             | `strata-logo`       | `StrataLogo`       | —                                                                                        | —          | —                                          | —                     | stable   |
| Prose (`prose`)           | `strata-prose`      | `StrataProse`      | —                                                                                        | —          | —                                          | `default`             | beta     |

### DataTable — `strata-data-table`

- **Purpose:** A semantic table for tabular data.
- **Implementation:** `StrataDataTable` in `packages/components/src/elements/DataTable`
- **Properties (2):** `columns` (String), `rows` (String)
- **Accessibility:** Renders a native <table>; mark numeric columns with {"numeric":true} for mono/tabular figures.
- **Notes:** Columns/rows accept JSON or pipe-delimited strings; there is no slotted markup API.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Pagination — `strata-pagination`

- **Purpose:** Navigates between pages of content (up to 7 buttons).
- **Implementation:** `StrataPagination` in `packages/components/src/elements/Pagination`
- **Properties (3):** `page` (Number), `pages` (Number), `label` (String)
- **Events:** `pagination-change` — Fired when a page button is activated.
- **Accessibility:** nav landmark; current page carries aria-current=page.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### List — `strata-list`

- **Purpose:** A vertical stack of list items.
- **Implementation:** `StrataList` in `packages/components/src/elements/List`
- **Properties (3):** `size` (String, reflected), `tone` (String), `divided` (Boolean)
- **Slots:** `default` — strata-list-item children.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### ListItem — `strata-list-item`

- **Purpose:** A titled row inside a list.
- **Implementation:** `StrataListItem` in `packages/components/src/elements/ListItem`
- **Properties (5):** `size` (String, reflected), `tone` (String), `title` (String), `description` (String), `href` (String)
- **Slots:** `default`
- **Accessibility:** Renders as article role=listitem inside strata-list.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Accordion — `strata-accordion`

- **Purpose:** Expands and collapses grouped content.
- **Implementation:** `StrataAccordion` in `packages/components/src/elements/Accordion`
- **Properties (2):** `multiple` (Boolean, reflected), `variant` (String)
- **Events:** `accordion-toggle`
- **Slots:** `default` — strata-accordion-item children.; `header`
- **Keyboard:** Enter, , @keydown
- **Accessibility:** Header buttons expose aria-expanded; Enter/Space toggles; single-open by default.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Carousel — `strata-carousel`

- **Purpose:** Cycles through a set of slides with arrows, dots and swipe.
- **Implementation:** `StrataCarousel` in `packages/components/src/elements/Carousel`
- **Properties (7):** `desktop` (Number), `mobile` (Number), `gap` (String), `interval` (Number), `autoPlay` (Boolean), `showArrows` (Boolean), `showDots` (Boolean)
- **Events:** `carousel-change` — Fired when the slide changes.; `carousel-navigation` — Fired on arrow/dDot navigation.
- **Slots:** `default` — strata-carousel-item children.
- **Keyboard:** Tab
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Grille — `strata-grille`

- **Purpose:** A responsive grid for content tiles.
- **Implementation:** `StrataGrille` in `packages/components/src/elements/Grille`
- **Properties (3):** `desktop` (Number), `mobile` (Number), `gap` (String)
- **Slots:** `default` — strata-grille-item children.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Avatar — `strata-avatar`

- **Purpose:** Represents a user with initials or an image.
- **Implementation:** `StrataAvatar` in `packages/components/src/elements/Avatar`
- **Properties (5):** `size` (String, reflected), `tone` (String), `label` (String), `src` (String), `alt` (String)
- **Accessibility:** role=img with aria-label, or presentation when unnamed.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Divider — `strata-divider`

- **Purpose:** A horizontal rule separating content.
- **Implementation:** `StrataDivider` in `packages/components/src/elements/Divider`
- **Properties (1):** `variant` (any, reflected)
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Logo — `strata-logo`

- **Purpose:** The STRATA brand mark.
- **Implementation:** `StrataLogo` in `packages/components/src/elements/Logo`
- **Properties (0):** none
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** stable

### Prose — `strata-prose`

- **Purpose:** Reading wrapper for long-form content. Requires @strata/prose/prose.css.
- **Implementation:** `StrataProse` in `packages/components/src/elements/Prose`
- **Properties (0):** none
- **Slots:** `default`
- **Notes:** Import '@strata/prose/prose.css' in the host page; the element only adds the .strata-prose class.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

## Editorial

| Entry                            | Tag                     | Class                 | Props                                                                                                                                                           | Reflected                                     | Events                            | Slots                                     | Maturity |
| -------------------------------- | ----------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------- | ----------------------------------------- | -------- |
| Meta (`meta`)                    | `strata-meta`           | `StrataMeta`          | `size`<br>`tone`<br>`label`<br>`items`                                                                                                                          | `size`                                        | —                                 | `default`                                 | beta     |
| SectionHeader (`section-header`) | `strata-section-header` | `StrataSectionHeader` | `size`<br>`tone`<br>`heading`<br>`subheading`<br>`level`                                                                                                        | `size`                                        | —                                 | `default`                                 | beta     |
| AuthorBox (`author-box`)         | `strata-author-box`     | `StrataAuthorBox`     | `size`<br>`tone`<br>`name`<br>`avatar`<br>`description`<br>`meta`<br>`href`<br>`eyebrow`                                                                        | `size`                                        | —                                 | `default`<br>`links`                      | beta     |
| Share (`share`)                  | `strata-share`          | `StrataShare`         | `size`<br>`tone`<br>`label`<br>`networks`<br>`url`<br>`text`<br>`direction`                                                                                     | `size`<br>`direction`                         | `strata-change`                   | —                                         | beta     |
| Comment (`comment`)              | `strata-comment`        | `StrataComment`       | `size`<br>`tone`<br>`author`<br>`avatar`<br>`date`<br>`dateTime`<br>`href`<br>`role-label`→`role`<br>`replyLabel`<br>`replyable`                                | `size`                                        | `strata-reply`<br>`strata-change` | `default`<br>`replies`<br>`form`          | beta     |
| CommentThread (`comment-thread`) | `strata-comment-thread` | `StrataCommentThread` | `size`<br>`tone`<br>`heading`<br>`count`                                                                                                                        | `size`                                        | —                                 | `default`<br>`form`                       | beta     |
| ArticleHeader (`article-header`) | `strata-article-header` | `StrataArticleHeader` | `size`<br>`tone`<br>`heading`<br>`deck`<br>`category`<br>`author`<br>`date`<br>`meta`<br>`image`<br>`imageAlt`<br>`caption`                                     | `size`                                        | —                                 | `share`                                   | beta     |
| Entry (`entry`)                  | `strata-entry`          | `StrataEntry`         | `size`<br>`tone`<br>`heading`<br>`href`<br>`excerpt`<br>`category`<br>`author`<br>`date`<br>`meta`<br>`tags`<br>`image`<br>`imageAlt`<br>`layout`<br>`mediaEnd` | `size`<br>`layout`<br>`media-end`             | —                                 | `default`                                 | beta     |
| Quote (`quote`)                  | `strata-quote`          | `StrataQuote`         | `size`<br>`tone`<br>`variant`<br>`cite`<br>`source`                                                                                                             | `size`<br>`variant`                           | —                                 | `default`                                 | beta     |
| Ticker (`ticker`)                | `strata-ticker`         | `StrataTicker`        | `size`<br>`tone`<br>`label`<br>`items`<br>`interval`                                                                                                            | `size`                                        | —                                 | `default`                                 | beta     |
| FilterBar (`filter-bar`)         | `strata-filter-bar`     | `StrataFilterBar`     | `size`<br>`tone`<br>`label`<br>`items`<br>`value`<br>`view`<br>`sort`<br>`allLabel`<br>`hues`<br>`hideTools`                                                    | `size`<br>`view`                              | `strata-change`                   | —                                         | beta     |
| IndexList (`index-list`)         | `strata-index-list`     | `StrataIndexList`     | `size`<br>`tone`<br>`groups`<br>`columns`                                                                                                                       | `size`                                        | —                                 | —                                         | beta     |
| RankedList (`ranked-list`)       | `strata-ranked-list`    | `StrataRankedList`    | `size`<br>`tone`<br>`label`<br>`items`<br>`variant`<br>`divider`<br>`striped`                                                                                   | `size`<br>`variant`<br>`divider`<br>`striped` | —                                 | —                                         | beta     |
| Gallery (`gallery`)              | `strata-gallery`        | `StrataGallery`       | `size`<br>`tone`<br>`columns`<br>`lightbox`<br>`label`                                                                                                          | `size`                                        | —                                 | `default`                                 | beta     |
| PageLayout (`page-layout`)       | `strata-page-layout`    | `StrataPageLayout`    | `size`<br>`tone`<br>`sticky`                                                                                                                                    | `size`<br>`sticky`                            | —                                 | `aside-start`<br>`default`<br>`aside-end` | beta     |

### Meta — `strata-meta`

- **Purpose:** Metadata line (date, category, author) with slanted filete separators.
- **Implementation:** `StrataMeta` in `packages/components/src/elements/Meta`
- **Properties (4):** `size` (String, reflected), `tone` (String), `label` (String), `items` (String)
- **Slots:** `default`
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### SectionHeader — `strata-section-header`

- **Purpose:** Title with a hairline rule and an emphasised segment over the title.
- **Implementation:** `StrataSectionHeader` in `packages/components/src/elements/SectionHeader`
- **Properties (5):** `size` (String, reflected), `tone` (String), `heading` (String), `subheading` (String), `level` (Number)
- **Slots:** `default`
- **Accessibility:** Renders role=heading with aria-level matching the level prop.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### AuthorBox — `strata-author-box`

- **Purpose:** Contributor card: avatar, name, role line, bio and links slot.
- **Implementation:** `StrataAuthorBox` in `packages/components/src/elements/AuthorBox`
- **Properties (8):** `size` (String, reflected), `tone` (String), `name` (String), `avatar` (String), `description` (String), `meta` (String), `href` (String), `eyebrow` (String)
- **Slots:** `default`; `links` — Share links or profile actions.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Share — `strata-share`

- **Purpose:** Share actions as monochrome glyphs: x, facebook, linkedin, whatsapp, telegram, email, copy.
- **Implementation:** `StrataShare` in `packages/components/src/elements/Share`
- **Properties (7):** `size` (String, reflected), `tone` (String), `label` (String), `networks` (String), `url` (String), `text` (String), `direction` (String, reflected)
- **Events:** `strata-change`
- **Keyboard:** email
- **Accessibility:** ul with per-network aria-labels; copy feedback via role=status.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Comment — `strata-comment`

- **Purpose:** A comment or talk-page message with role badge, permalink, reply action and nested replies.
- **Implementation:** `StrataComment` in `packages/components/src/elements/Comment`
- **Properties (10):** `size` (String, reflected), `tone` (String), `author` (String), `avatar` (String), `date` (String), `dateTime` (String), `href` (String), `role` (String, attribute `role-label` — `role` is reserved for ARIA), `replyLabel` (String), `replyable` (Boolean)
- **Events:** `strata-reply` — Fired when the reply action is activated.; `strata-change`
- **Slots:** `default` — Comment body (prose HTML).; `replies` — Nested strata-comment children.; `form`
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### CommentThread — `strata-comment-thread`

- **Purpose:** Titled region holding comments, with a form slot.
- **Implementation:** `StrataCommentThread` in `packages/components/src/elements/Comment` (`CommentThread.ts`)
- **Properties (4):** `size` (String, reflected), `tone` (String), `heading` (String), `count` (Number)
- **Slots:** `default` — strata-comment children.; `form` — Comment submission form.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### ArticleHeader — `strata-article-header`

- **Purpose:** Kicker, headline, deck, byline meta, share slot and optional lead figure.
- **Implementation:** `StrataArticleHeader` in `packages/components/src/elements/ArticleHeader`
- **Properties (11):** `size` (String, reflected), `tone` (String), `heading` (String), `deck` (String), `category` (String), `author` (String), `date` (String), `meta` (String), `image` (String), `imageAlt` (String), `caption` (String)
- **Slots:** `share` — Share actions row.
- **Accessibility:** Header landmark with h1 headline and metadata list.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Entry — `strata-entry`

- **Purpose:** Listing row for articles, search results and recent changes.
- **Implementation:** `StrataEntry` in `packages/components/src/elements/Entry`
- **Properties (14):** `size` (String, reflected), `tone` (String), `heading` (String), `href` (String), `excerpt` (String), `category` (String), `author` (String), `date` (String), `meta` (String), `tags` (String, parsed into Badge instances), `image` (String), `imageAlt` (String), `layout` (String, reflected), `mediaEnd` (Boolean, reflected)
- **Notes:** Category and tags use `strata-badge`; use repeated Badge elements for a tag group as a wrapping group.
- **Slots:** `default`
- **Accessibility:** Article element with configurable heading level.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Quote — `strata-quote`

- **Purpose:** Block quote with left filete, or pull quote framed by double rules.
- **Implementation:** `StrataQuote` in `packages/components/src/elements/Quote`
- **Properties (5):** `size` (String, reflected), `tone` (String), `variant` (String, reflected), `cite` (String), `source` (String)
- **Slots:** `default`
- **Accessibility:** figure > blockquote > figcaption > cite semantics.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Ticker — `strata-ticker`

- **Purpose:** Scroll-snapping strip of short headlines; optional auto-advance.
- **Implementation:** `StrataTicker` in `packages/components/src/elements/Ticker`
- **Properties (5):** `size` (String, reflected), `tone` (String), `label` (String), `items` (String), `interval` (Number)
- **Slots:** `default`
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### FilterBar — `strata-filter-bar`

- **Purpose:** Badge-based category chips with view and sort toggles; emits strata-change.
- **Implementation:** `StrataFilterBar` in `packages/components/src/elements/FilterBar`
- **Properties (10):** `size` (String, reflected), `tone` (String), `label` (String), `items` (String), `value` (String), `view` (String, reflected), `sort` (String), `allLabel` (String), `hues` (Boolean), `hideTools` (Boolean)
- **Events:** `strata-change` — Fired when a chip or tool toggles.
- **Accessibility:** Interactive Badge chips expose `aria-pressed`; view/sort tools are toggle buttons.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### IndexList — `strata-index-list`

- **Purpose:** Grouped index of links: site map, category index, alphabetical wiki index.
- **Implementation:** `StrataIndexList` in `packages/components/src/elements/IndexList`
- **Properties (4):** `size` (String, reflected), `tone` (String), `groups` (String), `columns` (Number)
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### RankedList — `strata-ranked-list`

- **Purpose:** Numbered list with tabular numerals: most read, most edited.
- **Implementation:** `StrataRankedList` in `packages/components/src/elements/RankedList`
- **Properties (7):** `size` (String, reflected), `tone` (String), `label` (String), `items` (String), `variant` (String, reflected), `divider` (Boolean, reflected), `striped` (Boolean, reflected)
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Gallery — `strata-gallery`

- **Purpose:** Masonry columns of figures with a keyboard-friendly lightbox.
- **Implementation:** `StrataGallery` in `packages/components/src/elements/Gallery`
- **Properties (5):** `size` (String, reflected), `tone` (String), `columns` (Number), `lightbox` (Boolean), `label` (String)
- **Slots:** `default` — figure children.
- **Keyboard:** ArrowRight, ArrowLeft, @keydown
- **Accessibility:** Lightbox is a dialog with Close/Previous/Next buttons and Escape support.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### PageLayout — `strata-page-layout`

- **Purpose:** Start aside (TOC) · article · end aside (infobox); empty asides collapse.
- **Implementation:** `StrataPageLayout` in `packages/components/src/elements/PageLayout`
- **Properties (3):** `size` (String, reflected), `tone` (String), `sticky` (Boolean, reflected)
- **Slots:** `aside-start` — Left rail (TOC, index).; `default` — Article body.; `aside-end` — Right rail (infobox, tags).
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

## Article Navigation

| Entry                                | Tag                       | Class                   | Props                                                                                                                                                            | Reflected                       | Events          | Slots     | Maturity |
| ------------------------------------ | ------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------- | --------- | -------- |
| TableOfContents (`toc`)              | `strata-toc`              | `StrataToc`             | `size`<br>`tone`<br>`label`<br>`heading`<br>`target`<br>`levels`<br>`items`<br>`numbered`<br>`collapsible`<br>`offset`<br>`variant`<br>`sticky`<br>`expandLabel` | `size`<br>`variant`<br>`sticky` | `strata-change` | —         | beta     |
| ReadingTime (`reading-time`)         | `strata-reading-time`     | `StrataReadingTime`     | `size`<br>`tone`<br>`target`<br>`wpm`<br>`words`<br>`label`<br>`wordsLabel`<br>`showWords`<br>`exclude`                                                          | `size`                          | —               | —         | beta     |
| ReadingProgress (`reading-progress`) | `strata-reading-progress` | `StrataReadingProgress` | `size`<br>`tone`<br>`target`<br>`label`<br>`placement`                                                                                                           | `size`<br>`placement`           | —               | —         | beta     |
| BackToTop (`back-to-top`)            | `strata-back-to-top`      | `StrataBackToTop`       | `size`<br>`tone`<br>`label`<br>`threshold`<br>`variant`<br>`showLabel`<br>`target`                                                                               | `size`<br>`variant`             | `strata-change` | —         | beta     |
| Cite (`cite`)                        | `strata-cite`             | `StrataCite`            | `size`<br>`tone`<br>`ref`<br>`label`<br>`note`                                                                                                                   | `size`                          | —               | —         | beta     |
| References (`references`)            | `strata-references`       | `StrataReferences`      | `size`<br>`tone`<br>`heading`<br>`items`                                                                                                                         | `size`                          | —               | `default` | beta     |
| Hatnote (`hatnote`)                  | `strata-hatnote`          | `StrataHatnote`         | `size`<br>`tone`<br>`lead`<br>`items`<br>`separator`                                                                                                             | `size`                          | —               | `default` | beta     |
| ArticleNav (`article-nav`)           | `strata-article-nav`      | `StrataArticleNav`      | `size`<br>`tone`<br>`label`<br>`prev`<br>`prevHref`<br>`prevLabel`<br>`next`<br>`nextHref`<br>`nextLabel`                                                        | `size`                          | —               | —         | beta     |
| HeadingAnchors (`heading-anchors`)   | `strata-heading-anchors`  | `StrataHeadingAnchors`  | `size`<br>`tone`<br>`target`<br>`levels`<br>`label`                                                                                                              | `size`                          | —               | `default` | beta     |

### TableOfContents — `strata-toc`

- **Purpose:** Scroll-spy TOC built from a target's headings (or a manual list); list or rail variant, numbering, collapsible groups.
- **Implementation:** `StrataToc` in `packages/components/src/elements/Toc`
- **Properties (13):** `size` (String, reflected), `tone` (String), `label` (String), `heading` (String), `target` (String), `levels` (String), `items` (String), `numbered` (Boolean), `collapsible` (Boolean), `offset` (Number), `variant` (String, reflected), `sticky` (Boolean, reflected), `expandLabel` (String)
- **Events:** `strata-change`
- **Keyboard:** Tab
- **Accessibility:** nav landmark; current section marked with aria-current=location.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### ReadingTime — `strata-reading-time`

- **Purpose:** Estimated reading time from a target's words (skipping references) or a fixed count.
- **Implementation:** `StrataReadingTime` in `packages/components/src/elements/ReadingTime`
- **Properties (9):** `size` (String, reflected), `tone` (String), `target` (String), `wpm` (Number), `words` (Number), `label` (String), `wordsLabel` (String), `showWords` (Boolean), `exclude` (String)
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### ReadingProgress — `strata-reading-progress`

- **Purpose:** Thin progress bar showing how far the reader is through the article.
- **Implementation:** `StrataReadingProgress` in `packages/components/src/elements/ReadingProgress`
- **Properties (5):** `size` (String, reflected), `tone` (String), `target` (String), `label` (String), `placement` (String, reflected)
- **Accessibility:** role=progressbar with aria-valuenow updated on scroll.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### BackToTop — `strata-back-to-top`

- **Purpose:** Returns to the top and moves focus there; floating after a scroll threshold, or inline.
- **Implementation:** `StrataBackToTop` in `packages/components/src/elements/BackToTop`
- **Properties (7):** `size` (String, reflected), `tone` (String), `label` (String), `threshold` (Number), `variant` (String, reflected), `showLabel` (Boolean), `target` (String)
- **Events:** `strata-change`
- **Keyboard:** Tab
- **Accessibility:** After scrolling, focus moves to the target heading for keyboard users.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Cite — `strata-cite`

- **Purpose:** Inline [n] citation marker, numbered by first appearance; pairs with References.
- **Implementation:** `StrataCite` in `packages/components/src/elements/Cite`
- **Properties (5):** `size` (String, reflected), `tone` (String), `ref` (String), `label` (String), `note` (String)
- **Notes:** Numbers are assigned globally by order of first appearance in the document.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### References — `strata-references`

- **Purpose:** Numbered references in citation order, with lettered back-links to each citation.
- **Implementation:** `StrataReferences` in `packages/components/src/elements/References`
- **Properties (4):** `size` (String, reflected), `tone` (String), `heading` (String), `items` (String)
- **Slots:** `default` — Fallback manual entries.
- **Keyboard:** Tab
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Hatnote — `strata-hatnote`

- **Purpose:** Disambiguation / see-also line above an article.
- **Implementation:** `StrataHatnote` in `packages/components/src/elements/Hatnote`
- **Properties (5):** `size` (String, reflected), `tone` (String), `lead` (String), `items` (String), `separator` (String)
- **Slots:** `default`
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### ArticleNav — `strata-article-nav`

- **Purpose:** Previous / next links at the end of an article or series.
- **Implementation:** `StrataArticleNav` in `packages/components/src/elements/ArticleNav`
- **Properties (9):** `size` (String, reflected), `tone` (String), `label` (String), `prev` (String), `prevHref` (String), `prevLabel` (String), `next` (String), `nextHref` (String), `nextLabel` (String)
- **Accessibility:** nav landmark with rel=prev/next semantics.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### HeadingAnchors — `strata-heading-anchors`

- **Purpose:** Adds permalink anchors to a target's headings (renders nothing itself).
- **Implementation:** `StrataHeadingAnchors` in `packages/components/src/elements/HeadingAnchors`
- **Properties (5):** `size` (String, reflected), `tone` (String), `target` (String), `levels` (String), `label` (String)
- **Slots:** `default`
- **Notes:** Progressive enhancement: appends a.strata-anchor links to headings in the target subtree. Pair with @strata/prose for styling.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** catalog mount + axe (both themes) + visual baseline (both themes) in `packages/testing/visual/components.spec.ts`; unit/contract coverage in `packages/components/test/`.
- **Maturity:** beta

### Tree — `strata-tree`

- **Purpose:** Accessible, data-driven tree for hierarchical navigation and selection.
- **Implementation:** `StrataTree` in `packages/components/src/elements/Tree`
- **Properties (6):** `label` (String), `nodes` (`StrataTreeNode[]` or JSON string), `selectedIds` (string array or JSON string), `multiple` (Boolean), `expandMode` (`"multiple"` default | `"single"`), `emptyLabel` (String)
- **Node shape:** `id`, `label`, `children?`, `disabled?`, `icon?` (Carbon), `href?`, `meta?`, `expanded?`
- **Events:** `strata-select` (`{ id, node, selected }`), `strata-selection-change` (`{ ids }`), `strata-toggle` (`{ id, expanded }`)
- **Accessibility:** `role=tree/treeitem/group` with `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded`, `aria-selected`, `aria-disabled`; roving tabindex; ArrowUp/Down/Left/Right, Home, End, Enter, Space. `setNodeExpanded(id, expanded)` offers programmatic expansion; ancestors of the selection auto-expand.
- **Expansion modes:** `expandMode="multiple"` (default) keeps the original behaviour — any number of siblings may stay expanded. `expandMode="single"` applies accordion semantics per sibling group: expanding a node collapses its expanded siblings while ancestors of the selection always remain open. `expanded: true` node flags are honoured on data load (used by the catalog while searching); expansion state for removed nodes is pruned, selection survives filtering and re-expands its ancestors when the data returns.
- **Notes:** Router-agnostic — consumers read `node.href` from `strata-select` and navigate themselves. Disabled nodes cannot be selected; nested clicks do not bubble into ancestor selection.
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** `packages/components/test/tree.test.ts` (rendering, expansion, selection, disabled, keyboard, events, JSON input); catalog mount + axe + visual baseline in `packages/testing/visual/components.spec.ts`.
- **Maturity:** beta

### ViewerSettings — `strata-viewer-settings`

- **Purpose:** Compact disclosure panel with theme, surface, viewport and motion preferences for viewers and playgrounds.
- **Implementation:** `StrataViewerSettings` in `packages/components/src/elements/ViewerSettings`
- **Properties (6):** `theme`, `surface`, `viewport`, `motion` (all reflected strings), `label` (String), `open` (Boolean, reflected)
- **Events:** `strata-change` — `detail.value` is the full `ViewerSettingsValue` object; inner `strata-select` events are stopped so consumers see one normalized event.
- **Accessibility:** Toggle button exposes `aria-expanded`/`aria-controls`; the panel is a labelled group of labelled selects; Escape closes and focus returns to the toggle; outside pointerdown dismisses.
- **Notes:** Fully controlled — persistence and theme resolution stay in the consumer. The catalog persists preferences under `strata-catalog-viewer` (never `strata-theme`).
- **Responsive:** fluid layout verified at mobile (390px) and desktop (1280px) catalog widths.
- **Theme:** rendered and axe-scanned in light and dark themes by the visual suite.
- **Tokens:** styles consume `--strata-*` tokens only; enforced by `pnpm audit`.
- **Tests:** `packages/components/test/viewer-settings.test.ts` (panel, normalized event, Escape, outside dismiss); catalog mount + axe + visual baseline in `packages/testing/visual/components.spec.ts`.
- **Maturity:** beta
