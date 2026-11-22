---
"@strata/components": patch
---

Physical-form law enforcement and dead elevation cleanup.

- Squared the pill/circle radii outside the allowlist: switch track, carousel nav buttons and counter, overlay category chip, theme toggle, modal close button and scrollbar thumb now use `--strata-radius-*` (0–2 px). Kept circular only where geometry requires it — switch thumb, carousel dots, spinners/ripple, avatars — via an explicit allowlist in `design-rules.mjs`.
- Removed all dead `--strata-elevation-*`/`--strata-component-elevation` references (Button, Card, Dialog, Surface, StrataBase); `box-shadow` is now lint-forbidden except `none`.
