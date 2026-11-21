# STRATA Color

STRATA is grayscale first. The palette follows the ink scale of the editorial
CVs: `ink #111111`, `mid #333333`, `soft #666666`, `pale #999999` and
`divisor #CCCCCC`, mirrored for dark surfaces.

## Monochrome

Black, white and gray establish structure, hierarchy and reading order.
Hierarchy is carried by tone, size and weight — almost never by hue.

- `--strata-color-text-primary` / `text-secondary` — body and supporting text.
- `--strata-color-surface-page|default|raised|subtle` — paper and card surfaces.
- `--strata-color-action-primary` — primary actions (ink on paper, paper on ink).
- `--strata-color-border-subtle|strong` — hairlines and emphasis borders.
- `--strata-color-focus-ring` — focus indicator (grayscale by default).
- `--strata-color-gray-*` — the primitive ramp for one-off surfaces.

## Contrast contract

Both `packages/tokens/validate.mjs` and `tooling/token-validator/check.mjs`
enforce WCAG contrast on the token pairs:

- Text (`textPrimary`, `textSecondary`) on every surface: **≥ 4.5:1**.
- Status colors on `surfaceDefault`/`surfaceRaised`: **≥ 4.5:1**.
- `focusRing` on `surfacePage`: **≥ 3:1**.
- Label text on `actionPrimary`: **≥ 4.5:1**.

If the accent is enabled, `accent.*.link` must reach **≥ 4.5:1** on all
surfaces and `accent.*.focus` **≥ 3:1** on the page surface.

## Functional status (minimal, optional)

Only three desaturated status colors exist, and they are never the sole signal:
an icon, underline, weight or filete must accompany them.

- `--strata-color-status-error`
- `--strata-color-status-warning`
- `--strata-color-status-success`

## Accent (off by default)

A single optional accent for links and focus lives in `tokens.json` under
`accent`. It ships **disabled**: no `--strata-color-accent-*` variables are
emitted until `accent.enabled` is set to `true`. When enabled it must still
satisfy the contrast contract above. Components never reference accent tokens
directly; consumers opt in.

**If a screen stays coherent with every non-gray pixel removed, it is behaving
correctly.**
