# Component status

The catalog contains **76 canonical entries** (`STRATA_COMPONENT_CATALOG`),
plus four composition-only elements (`strata-accordion-item`,
`strata-carousel-item`, `strata-grille-item`, `strata-tab-panel`) that are
exported for slot composition but are not standalone catalog entries.

Maturity counts in the interactive registry
(`apps/catalog/src/lib/componentRegistry.ts`):

- **18 stable** — button, icon-button, text-field, checkbox, switch, nav-item,
  alert, badge, progress, skeleton, spinner, surface, theme-toggle, list,
  list-item, avatar, divider, logo.
- **57 beta** — everything else, including the editorial and article
  navigation families.
- **1 experimental** — popover (no trigger/anchor API yet).

The full per-component matrix — properties, reflected attributes, events,
slots, keyboard behavior, accessibility, tests and maturity — lives in
`docs/IMPLEMENTATION-AUDIT.md`; test coverage per component is summarized in
`docs/COMPONENT-COVERAGE.md`.

Before a component is promoted to Stable it must satisfy the checklist in
`docs/COMPONENT-CHECKLIST.md`: API contract, size/state model, token-only
visuals, keyboard/focus, accessible name, light/dark and mobile verification,
contract test, axe check, visual baseline and documentation.
