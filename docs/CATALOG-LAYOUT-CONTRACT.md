# STRATA Catalog Layout Contract

Rules for the internal catalog (`apps/catalog`) so demos represent the
real components inside a layout that never lies about them. Component
semantics live in `COMPONENT-UX-CONTRACT.md`; sizing rules in
`COMPONENT-SIZING-CONTRACT.md`.

## 1. Principles

- The catalog shows the component **as consumers will use it** — inside
  realistic containers, not stretched or clipped by the harness.
- Layout must work at any viewport; nothing may depend on the width of a
  particular screenshot.
- No hiding overflow (`overflow: hidden` on a clipping wrapper is allowed
  for radius/border clipping only — never to mask a control that does
  not fit).

## 2. Properties panel

- Every control respects the panel width: `.control-field` is a single
  `minmax(0, 1fr)` grid track and every direct child gets `min-width: 0`.
- Custom-element controls (`strata-text-field`, `strata-select`,
  `strata-number-field`, `strata-checkbox`) size to 100% of the field;
  native `input`/`textarea`/`select` use `width: 100%` +
  `box-sizing: border-box`.
- Labels and attribute names stay visible; long values remain editable
  (textarea for `list` props, single-line inputs otherwise).

## 3. Demo matrices (Variants / States)

- `.demo-grid` uses `repeat(auto-fill, minmax(min(180px, 100%), 1fr))`:
  columns flex with available space and collapse to one usable column in
  narrow containers.
- `.demo-cell` is `min-width: 0` so a wide component cannot force its
  track wider than the container.
- `.demo-stage` centers content with padding; children are capped at
  `max-width: 100%` of the stage's content box.
- `fullWidth` demos must visibly fill the stage — that is the behavior
  under test, so the stage is their honest container.

## 4. Verification

`packages/testing/visual/catalog.spec.ts` asserts:

- no `.controls-panel` descendant escapes the panel horizontally;
- the `Full width` button demo fills its stage (host and inner control);
- single-line field controls render the shared 44px height.

Run `pnpm --filter @strata/testing exec playwright test visual/catalog.spec.ts`
against `pnpm --filter @strata/catalog preview`.
