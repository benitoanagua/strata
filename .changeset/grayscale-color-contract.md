---
"@strata/tokens": major
"@strata/components": major
"@strata/core": patch
---

Replace the seven-color spectrum with a grayscale-first color contract.

- Remove the `spectrum` token group and the `status-info|caution|context|special` semantic tokens. Only `status-error`, `status-warning` and `status-success` remain, deliberately desaturated.
- Align the monochrome ramp with the editorial CV ink scale (ink `#111111`, mid `#333333`, soft `#666666`, pale `#999999`, divisor `#CCCCCC`) and mirror it for dark surfaces.
- Add an optional single `accent` (link/focus) that ships disabled; enabling it emits `--strata-color-accent-*` variables.
- Validators now enforce a WCAG AA contrast contract (text ≥ 4.5:1, focus ≥ 3:1) instead of the spectrum contract.
- `strata-badge` tones change from the spectrum names to `neutral | error | warning | success | info`; `strata-alert` gains a per-tone Carbon icon and uses the status tokens. `strata-progress` and `strata-switch` use `action-primary` instead of spectrum colors.
