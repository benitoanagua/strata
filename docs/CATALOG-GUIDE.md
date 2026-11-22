# STRATA Catalog — User Guide

The catalog is a live documentation and exploration app for `@strata/components`.
It renders the real Lit custom elements — nothing is mocked or re-implemented.

## Running

```bash
pnpm install
pnpm catalog        # turbo dev --filter=@strata/catalog
```

Then open **http://localhost:5174** (Vite may pick the next free port; the
terminal prints the exact URL).

For a production build of the catalog alone:

```bash
pnpm build:catalog  # outputs apps/catalog/dist
pnpm --filter @strata/catalog preview --port 5174
```

## Layout

- **Left sidebar** — brand, search box, the five editorial _scenarios_, and the
  full library grouped by category (Actions, Forms, Navigation, Feedback,
  Surfaces, Data & Content, Editorial, Article Navigation). Category headers
  collapse/expand their groups.
- **Top bar** — breadcrumb (`Library / Category / Component`), maturity badge
  and the element tag.
- **Center** — component name, description, and the live preview canvas.
- **Details tabs** — `Properties` (interactive controls), `API` (props,
  attributes, defaults, events, slots — all read from Lit metadata),
  `Examples` (copyable HTML snippet) and `Accessibility`.

## Navigation

- Click any entry, or press **`/`** anywhere to jump to search.
- Search matches name, tag, category and description; an empty state appears
  when nothing matches.
- Every route is a hash URL (`#/button`, `#/scenario/forms`), so pages are
  shareable and browser back/forward works.
- On narrow screens the sidebar becomes an off-canvas drawer opened with the
  ☰ button.

## Canvas controls

- **Surface** — Light, Dark or Grid preview background.
- **Viewport** — Desktop, Tablet (680px) or Mobile (360px) frame.

## Property controls

Controls are generated at runtime from the element's Lit `elementProperties`
metadata (`apps/catalog/src/lib/props.ts`), merged with curated labels,
options and fixture defaults from `componentRegistry.ts`.

- Text, boolean, number and select inputs map to the real property types —
  booleans stay booleans, numbers stay numbers.
- Complex props (`items`, `groups`, `columns`, `rows`) get a textarea that
  accepts JSON arrays or STRATA's pipe-delimited format.
- **Reset** restores every control to the declared default.

## Snippets

The _Examples_ tab shows a consumer-ready snippet:

```html
import "@strata/components";

<strata-button label="Continue" variant="outlined"></strata-button>
```

Attributes use the real reflected attribute names; boolean attributes are only
emitted when true; slotted fixture content is included. The copy button writes
the snippet to the clipboard.

## Scenarios

Five composed examples exercise the public APIs together:

| Scenario             | Route                          | Contents                                                                                                                               |
| -------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Artículo editorial   | `#/scenario/editorial-article` | ArticleHeader, Meta, TagList, AuthorBox, SectionHeader, Quote, Gallery, ArticleNav                                                     |
| Artículo wiki        | `#/scenario/wiki-article`      | Hatnote, Toc (scroll-spy rail), ReadingTime, ReadingProgress, Cite, References, HeadingAnchors, BackToTop                              |
| Interacción social   | `#/scenario/social`            | ArticleHeader, Share, AuthorBox, CommentThread with nested replies and a compose form                                                  |
| Componentes de datos | `#/scenario/data`              | FilterBar, DataTable, Pagination, IndexList, RankedList, Grille — all driven by one dataset                                            |
| Formularios          | `#/scenario/forms`             | TextField, SearchField, NumberField, DateField, Select, Checkbox, RadioGroup, Switch, Slider, FileUpload, Stepper with live validation |

## Testing hooks

- `.nav-entry[data-entry-id]` — one per library entry.
- `.preview-stage > *` — the mounted custom element.
- `#prop-<name>` — each property control input.
- `.snippet-block pre` — the generated snippet.
