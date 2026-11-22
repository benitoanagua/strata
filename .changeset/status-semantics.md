---
"@strata/tokens": minor
"@strata/components": minor
---

Status colors are never the sole signal, plus an opt-in strict-monochrome mode.

- `strata-badge` status tones now render a distinct Carbon icon; `strata-text-field` gains `error`/`errorMessage` with `aria-invalid`, `aria-describedby`, a `role="alert"` message and an icon.
- New `status.test.ts` proves Alert, Badge and error fields carry non-chromatic cues.
- `tokens.json` adds `strictMonochrome` (default `false`) and `monochromeStatus`: when enabled, `build-css.mjs` emits grayscale status colors that still pass WCAG AA 4.5:1 (verified by `strict-monochrome.test.ts`).
- Docs: `COLOR.md` and `DESIGN-LAWS.md` state the never-color-alone contract.
