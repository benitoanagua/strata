# STRATA agent guardrails

These rules are constraints, not suggestions.

1. Do not invent visual values when a STRATA token exists.
2. Do not add decorative borders to every component.
3. Apply the Scale Law to physical component size: larger components may carry more radius, border and elevation; smaller components must not use heavier structural treatment than their scale permits.
4. Do not use semantic importance to bypass the Scale Law.
5. Selected navigation is expressed with color/typography, not a decorative border.
6. Monochrome is the default visual language. There is no spectrum; the only hues are the optional disabled-by-default accent and the three desaturated status colors, always paired with a non-color cue.
7. The only permitted icon collection is `@iconify-json/carbon`, used as `carbon:*` through `iconify-icon`.
8. Source Serif 4 is the reading typeface, Source Sans 3 the UI typeface, Source Code Pro is reserved for tags and numeric/data contexts. Never add font files or `@fontsource` packages; fonts load from Google Fonts.
9. Prefer editorial hierarchy, whitespace and dividers before adding another container.
10. Every new component requires a catalog example and tests appropriate to its behavior.
