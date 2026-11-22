---
"@strata/tokens": minor
"@strata/components": minor
"@strata/prose": minor
---

Reading layer: typography tokens, serif content text and the `strata-prose` wrapper.

- `tokens.json → typography` now emits `--strata-type-<name>` font shorthand fragments and `-tracking` vars; the 48/36/30 px display scale is removed (LaTeX-style modest titles) and a `reading-*` scale (14/21 body, ~1.5 leading) is added.
- All literal `font:`/`font-family` declarations in components now compose the three role families (`serif` reading, `sans` chrome, `mono` data) — enforced by a new `fonts.test.ts` contract.
- Content components (Card title/excerpt, Alert, Accordion panel, Modal body, DataTable text cells) render reading text in serif; chrome stays sans.
- New `strata-prose` element adds the `.strata-prose` class so `@strata/prose/prose.css` styles slotted long-form content; the catalog gains a prose demo page (article, table, quote, code, footnotes).
- `prose.css` now uses `reading-body` tokens, a 70 `ch` measure, and system colors (`CanvasText`/`GrayText`) for print instead of raw hex.
