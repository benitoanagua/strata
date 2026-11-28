# STRATA Component UX Contract

Source of truth for how STRATA components express intent, hierarchy, state
and iconography. It complements — never replaces — `DESIGN-LAWS.md` (visual
laws) and `COMPONENT-CONTRACT.md` (structural contract). Component-specific
behavior is defined by its public implementation and executable tests. When
contracts disagree, this contract and the design laws win; fix the
contradiction, do not fork the rule.

## 1. Axes are not interchangeable

Every interactive component separates four independent axes. A prop must
only ever answer to one of them:

| Axis    | Question it answers         | Button example                                    |
| ------- | --------------------------- | ------------------------------------------------- |
| variant | What does it look like?     | `filled`, `outlined`, `text`, `elevated`, `tonal` |
| color   | What does it mean?          | `primary`, `error`, `success`, `warning`          |
| size    | How big is it?              | `small`, `medium`, `large`                        |
| type    | How does it behave in HTML? | `button`, `submit`, `reset`                       |

Never encode hierarchy through `color` (that is what `variant`/`size` are
for), and never encode semantics through `variant`. `color` carries
**semantic intent only**: default action, destructive, success, warning.
Action hierarchy (primary vs. soft emphasis) belongs to `variant`.

## 2. Color law for components

Monochrome establishes structure; semantic color communicates intent.

- Color is **required** when its absence reduces the clarity, hierarchy or
  comprehension of an action: destructive actions, success confirmation,
  warnings, states needing attention.
- Semantic actions may use **solid surfaces** (`variant="filled"` +
  `color="error"`) when the action warrants high emphasis.
- Softer treatments exist on the variant axis: `outlined`, `text`,
  `elevated` (neutral raised surface + filete), `tonal` (chromatic tint of
  the semantic ink at ~18%, hover ~28%).
- The color is never the only signal: destructive actions keep meaningful
  labels (and icons where the anatomy supports them); statuses pair with
  icon/weight/underline per `DESIGN-LAWS.md`.
- All colors come from `--strata-*` tokens. `color-mix()` derivatives
  (tints, hairlines) are allowed; raw colors are not.
- Text and icons must reach WCAG AA contrast against their surface in
  **both** themes. On-accent ink is theme-aware (`surface-page` flips with
  the theme); never assume white text on a status color.
- An active variant must never look accidentally disabled. Disabled is
  communicated by the disabled contract (§4), not by draining the color
  weight of live variants.

## 3. Variant contract

| variant    | Role                                             | Surface                                                                                                                                          |
| ---------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filled`   | High-emphasis solid action                       | `--btn-fill` solid + `--btn-on-fill` ink                                                                                                         |
| `outlined` | Bordered action, transparent background          | `--btn-line` filete + `--btn-accent` ink                                                                                                         |
| `text`     | Lightweight action, no permanent surface         | transparent, `--btn-accent` ink, hover tint                                                                                                      |
| `elevated` | Neutral contained surface (raised step + filete) | `surface-raised` + `border-subtle` filete. **Name is legacy**: STRATA abolishes shadows; this variant is a surface treatment, not CSS elevation. |
| `tonal`    | Chromatic container at moderate intensity        | `--btn-accent` @ ~18% tint + accent ink                                                                                                          |

Rules:

- `filled` is the fallback rendering for unknown variant values.
- Every variant keeps perceptible hover, `focus-visible`, `active`,
  disabled and loading states; hover must change the surface or ink, not
  just opacity.
- Do not add variants to inflate catalog counts. A variant must have a
  distinct visual role (§3 table) that survives side-by-side comparison
  at the same size, label and color.
- `elevated` is kept because it is the only **neutral contained**
  treatment: it differs from `outlined` (has a surface fill), from
  `tonal` (neutral, not chromatic) and carries the filete that
  `tonal`/`text` omit.

## 4. State contract

Shared model for interactive components. A component declares which states
it supports; not every component needs all of them.

- **default / hover / focus-visible / active**: always perceptible.
  `focus-visible` uses `--strata-color-focus-ring` and is never removed for
  aesthetics. `active` communicates press (e.g. `translateY(1px)`).
- **disabled**: communicates unavailability. May use opacity, but never at
  the cost of legibility, and must stay visually distinct from any _active_
  neutral variant (tonal/elevated). Interaction is fully blocked.
- **loading**: communicates work in progress. Keeps the component's visual
  identity and dimensions, exposes `aria-busy`, keeps the accessible name
  (hidden-but-present label or equivalent), and prevents duplicate
  activation where the contract requires it.
- **error / success / warning** (where supported): semantic feedback
  states; always paired with a non-color signal.
- **selected** (navigation/selection components): communicated with
  color/typography/surface — never a decorative border alone
  (`COMPONENT-CONTRACT.md`).

## 5. Icon contract

- Icons render through `iconify-icon` with `@iconify-json/carbon` only;
  names are `carbon:*`. No second icon library, no STRATA icon registry.
- **leading** icon renders before the label, **trailing** after it.
  `trailingIcon`/equivalent props only reposition an existing `icon`; they
  never create one.
- Icons are decorative (`aria-hidden`) whenever the control already has an
  accessible name from visible text or `aria-label`.
- **Icon-only** controls must have an accessible name (`aria-label` or
  `label` mapped to it) and a sufficient target size.
- Invalid icon names (non-`carbon:*` or unknown) must not render a broken
  glyph silently — components validate and omit.
- Catalog demos for icon-related props must supply a real `carbon:*` icon;
  a boolean that only repositions an icon is meaningless without one.

## 6. Catalog contract

The catalog must represent the real component, not an idealized one.

- **Variants vs. combinations**: select-property options generate demo
  cells grouped by property (`Variant`, `Size`, `Color`, `Type`…). The
  count of combinations is not the count of design variants.
- **demoProps**: a control may declare demonstration-only sibling props
  (`PropControl.demoProps`) when an option is only meaningful with a
  non-default sibling — e.g. `color` demos use `variant="filled"`, and
  `trailingIcon` supplies `icon="carbon:arrow-right"`. The varied option
  always wins over `demoProps`.
- Semantic colors are demoed in their meaningful treatment (solid), not
  reduced to a faint tint by an unrelated default.
- States get explicit demos; booleans that need supporting props use
  `demoProps`.
- Controls reflect the real API: types, options and defaults come from the
  element. Removed API values are not offered as demo options.
- Examples must be complete and accessible — never a button without its
  required icon or label.

## 7. Verification

Contracts become tests wherever the infrastructure exists:

- API surface: property/class coverage per declared value
  (`packages/components/test/*.test.ts`).
- Catalog integrity: registry↔element consistency, `demoProps`
  preservation, variant counts (`apps/catalog/test/`).
- Accessibility: axe in both themes plus unit-level ARIA assertions.
- Visual: Playwright baselines; intentional changes update only the
  affected local baselines, never to hide regressions.
- Tokens: `pnpm audit` enforces `--strata-*` usage; no raw colors, no
  `box-shadow` except `none`, radii within the 0–2 px scale.
