---
"@strata/tokens": major
"@strata/components": major
"@strata/core": major
---

Replace elevation with the LaTeX filete law.

- Scale tokens now cap radius at 0–2 px, restrict borders to 0/0.5/1 px filetes, and set every `--strata-elevation-*` to `none` — separation comes from hairlines, whitespace and tonal surfaces.
- `assertStrataScaleLaw` and both token validators enforce the new contract; the design-rule lint now rejects border widths above 1 px (focus/spinner `currentColor` borders exempt).
- Hardcoded 2–4 px borders in Modal, ThemeToggle, Carousel, Accordion and DataTable were migrated to border tokens.
