# Article navigation (wiki)

Components for moving around inside one long article. All are light on chrome: the current position is shown by weight and surface (`aria-current="location"`), never a decorative border; motion respects `prefers-reduced-motion`; every control has an accessible name.

| Element                             | Purpose                                                                                                                                                 | Key attributes                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `strata-toc`                        | Table of contents with scroll-spy. Builds itself from a `target` container's headings (ids are added to headings that lack one) or from manual `items`. | `target`, `levels="2-3"`, `numbered`, `collapsible`, `variant="list\|rail"`, `sticky`, `offset` |
| `strata-reading-time`               | "N min read" from the words of `target` (skips references/nav) or `words`.                                                                              | `target`, `wpm`, `show-words`, `exclude`                                                        |
| `strata-reading-progress`           | Progress bar through `target` or the page.                                                                                                              | `target`, `placement="fixed\|inline"`                                                           |
| `strata-back-to-top`                | Scrolls to top and moves focus to `target`/`<h1>`.                                                                                                      | `variant="floating\|inline"`, `threshold`, `show-label`                                         |
| `strata-cite` + `strata-references` | `[n]` markers numbered by first appearance; references listed in that order with lettered back-links and click-to-reveal highlight.                     | cite: `ref`, `note`; references: `items` JSON or child `<li id>`                                |
| `strata-hatnote`                    | "Para otros usos, véase…" line.                                                                                                                         | `lead`, `items`                                                                                 |
| `strata-article-nav`                | Previous / next.                                                                                                                                        | `prev`, `prev-href`, `next`, `next-href`                                                        |
| `strata-heading-anchors`            | Adds `#` permalinks to headings (styled by `@strata/prose`).                                                                                            | `target`, `levels`                                                                              |

`strata-toc` emits `strata-change` with `{ id, text }` when the current section changes, and exposes `refresh()` after you inject content.

## Composition

```html
<strata-reading-progress target="#article"></strata-reading-progress>

<strata-page-layout sticky>
  <strata-toc
    slot="aside-start"
    target="#article"
    levels="2-3"
    numbered
    collapsible
    heading="Contenidos"
  ></strata-toc>

  <article id="article">
    <strata-hatnote
      lead="Para otros usos, véase"
      items="Pilcomayo (desambiguación)"
    ></strata-hatnote>
    <strata-article-header
      heading="Río Pilcomayo"
      category="Geografía"
    ></strata-article-header>
    <strata-reading-time target="#article"></strata-reading-time>
    <strata-prose>
      <h2>Historia</h2>
      <p>… cartografía temprana<strata-cite ref="r1"></strata-cite> …</p>
    </strata-prose>
    <strata-references heading="Referencias">
      <li id="r1">Ríos, A. (2021). <em>Cartografía andina</em>.</li>
    </strata-references>
    <strata-article-nav
      prev="Cuenca del Plata"
      prev-href="/p"
      next="Río Bermejo"
      next-href="/n"
    ></strata-article-nav>
  </article>

  <strata-toc
    slot="aside-end"
    variant="rail"
    target="#article"
    label="Minimap"
  ></strata-toc>
</strata-page-layout>
<strata-back-to-top target="#article"></strata-back-to-top>
<strata-heading-anchors target="#article"></strata-heading-anchors>
```

On narrow screens put the TOC inside `strata-drawer` or `strata-bottom-sheet` instead of the aside.

## Notes and limits

- `target` is resolved in the host's own root, then the document; elements in a different shadow root are not reachable by selector.
- Cites and references must live in the same root: numbering and back-links look up `strata-cite` within it. Back-links and cite→reference jumps are handled by script, because shadow DOM cannot resolve `#id` fragments across its boundary; native `href="#id"` remains as a fallback.
- Rich HTML in references is supported through child `<li>` (cloned, not parsed from strings); `items` JSON accepts plain text with an optional `href`.
- MediaWiki: point `target` at `.mw-parser-output`; its own `<sup class="reference">` markup keeps working with the prose styles, and `strata-reading-time` already skips `.mw-references-wrap`.
