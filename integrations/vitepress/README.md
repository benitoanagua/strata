# @strata/integration-vitepress

Minimal proof that `@strata/prose` is platform-agnostic: it consumes
`@strata/tokens` + `@strata/prose` and emits a VitePress theme directory
(`theme/`) with the synced stylesheets and a thin chrome override
(sans for nav/sidebar, serif for `.vp-doc`, mono for code).

## Use

```sh
pnpm --filter @strata/integration-vitepress build   # syncs theme/*.css
# copy theme/ into your site's .vitepress/theme/
```

`theme/strata-*.css` are generated artifacts (gitignored); regenerate after
changing tokens or prose.
