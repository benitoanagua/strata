# STRATA Iconography

STRATA deliberately does not invent an icon abstraction.

- Renderer: `iconify-icon`.
- Allowed collection: `@iconify-json/carbon`, used as `carbon:*` names.
- No Material, Lucide, Font Awesome, Tabler, Fluent or other collection is
  permitted.
- **Only the icons STRATA actually uses are bundled.** `src/iconify.ts`
  registers the explicit allowlist in `src/carbon-icons.json` (~15 icons,
  a few KB) instead of the full Carbon collection (~1.2 MB). `icon-rules.mjs`
  fails the build if a component references a `carbon:*` icon missing from
  the allowlist.
- Dynamic icon props (`strata-button[icon]`, `strata-icon-button[icon]`,
  `strata-menu-item[icon]`) accept any `carbon:*` name, but consumers must
  register extra icons at runtime with `addIcon`/`addCollection` from
  `iconify-icon` — they are not in the bundle.
- Icons use `currentColor` and inherit semantic text/status color.
- Decorative icons must be `aria-hidden="true"`.
- Interactive icons require an accessible label.
- Mobile interactive icon targets default to 48px; the glyph itself remains
  visually proportional to the component size.
- STRATA components should not expose arbitrary stroke-width, path or color
  controls.

To add an icon: add its `carbon:*` name to the component, then regenerate or
extend `carbon-icons.json` from `@iconify-json/carbon` (the package remains
a dependency as the canonical source).
