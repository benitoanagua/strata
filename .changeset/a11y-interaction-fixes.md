---
"@strata/components": minor
---

Accessibility and interaction fixes found by the component audit.

- `strata-comment`: the role badge attribute is now `role-label` (the `role` attribute is the global ARIA role and produced invalid values such as `role="Autor"`). The `role` property is unchanged; set `el.role` or use `role-label` in markup.
- `strata-filter-bar`: the chip group moved from `<ul role="group">` to a wrapping `role="group"` container so `<li>` children keep valid list semantics (axe `listitem`).
- `strata-ticker`: the scrollable list is now keyboard-focusable (`tabindex="0"`, axe `scrollable-region-focusable`).
- `strata-data-table`: replaced the unusable slotted `<thead>/<tbody>` API with `columns`/`rows` props (JSON or pipe-delimited).
- `strata-file-upload`: emits `strata-change`, lists selected files and supports drag & drop.
- Overlays (`dialog`, `modal`, `drawer`, `bottom-sheet`, `popover`): Escape handling, focus management and accessible-name fallbacks.
- `strata-text-field`: label association and error semantics; `strata-breadcrumb`, `strata-menu`, `strata-pagination`, `strata-tooltip`, `strata-tab`, `strata-menu-item`, `strata-accordion-item` interaction fixes.
