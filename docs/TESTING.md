# STRATA testing

STRATA treats design rules as testable contracts.

## Commands

```bash
pnpm test                 # unit + contract tests
pnpm test:visual          # browser smoke and visual contract checks
pnpm test:a11y            # axe accessibility checks
pnpm run audit          # tokens + design laws + icon policy
```

## Browser tests

Playwright serves the built Svelte catalog (`vite preview`) and verifies its component canvas, responsive viewports, controls and rendered Lit elements. Tests should assert design-system behavior rather than implementation-specific catalog markup where possible.

## Accessibility

Critical axe violations fail CI. Keyboard/focus behavior and accessible labels are tested alongside component contracts.
