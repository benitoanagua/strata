# STRATA Scale Law

Physical size is the input to structural weight, expressed the LaTeX way:
**filetes and space instead of elevation**.

`micro < small < medium < large < hero`

- **Radius** stays within **0–2 px** and is non-decreasing across the scale.
- **Borders** are filetes of **0, 0.5 or 1 px** (`--strata-border-*`),
  non-decreasing across the scale.
- **Elevation is abolished**: every `--strata-elevation-*` resolves to `none`.
  Separation comes from hairlines, whitespace and tonal surfaces, never
  shadows.
- Circular controls (switches, avatars, spinners, icon buttons, carousel
  dots/arrows) may keep `50%`/`999px` radii — they are circles, not rounded
  rectangles.
- Importance and semantic color cannot override physical scale; once the
  scale saturates at 2 px / 1 px, larger components differ through space and
  typography, not heavier chrome.
