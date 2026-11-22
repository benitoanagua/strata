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

- **Left sidebar** — brand, `strata-search-field`, and a `strata-tree`
  (`apps/catalog/src/lib/treeData.ts`) with two roots: _Scenarios_ (the five
  editorial compositions) and _Library_ (all components grouped by category:
  Actions, Forms, Navigation, Feedback, Surfaces, Data & Content, Editorial,
  Article Navigation). Categories expand/collapse, show entry counts and keep
  the selected node highlighted; ancestors of the current route auto-expand.
- **Top bar** — breadcrumb (`Library / Category / Component`), maturity badge,
  the element tag, and `strata-viewer-settings` (theme / surface / viewport /
  motion).
- **Center** — component name, description, the live preview canvas, and —
  when the API exposes them — **Variants** and **States** galleries that mount
  real elements for every public option and boolean state.
- **Details tabs** — a real `strata-tabs` with `Properties` (interactive
  controls), `API` (props, attributes, defaults, events, slots — all read from
  Lit metadata), `Examples` (copyable HTML snippet) and `Accessibility`.

## Navigation

- Click any tree node, or press **`/`** anywhere to jump to search (the field
  is a `strata-search-field`).
- The tree itself supports the ARIA treeview keyboard model: ArrowUp/Down move,
  ArrowRight/Left expand/collapse or move to the parent, Home/End jump, and
  Enter/Space activates the focused node.
- Search matches name, tag, category and description; the tree shows its empty
  state when nothing matches.
- Every route is a hash URL (`#/button`, `#/scenario/forms`), so pages are
  shareable and browser back/forward works.
- On narrow screens the sidebar becomes an off-canvas drawer opened with the
  ☰ button.

## Viewer settings

`strata-viewer-settings` (top bar) controls four persisted preferences stored
under `strata-catalog-viewer` — never `strata-theme`:

- **Theme** — System / Light / Dark. Applies to the whole catalog chrome via
  `data-theme` on `<html>`; `system` follows `prefers-color-scheme`.
- **Surface** — Auto / Light / Dark / Grid. Scoped to the `.canvas` element
  through its own `data-theme`, so the docs can be dark while the canvas stays
  light; Grid adds the blueprint gridlines.
- **Viewport** — Desktop, Tablet (680px) or Mobile (360px) frame.
- **Motion** — System / Reduced (`data-motion="reduced"` on `<html>`).

## Variants & states

Below the preview, the catalog mounts one real element per public `select`
option (**Variants**) and per boolean property (**States**), each seeded with
the declared defaults. Overlay components are skipped — a closed overlay has
nothing to show and an open one would cover the page.

## Property controls

Controls are generated at runtime from the element's Lit `elementProperties`
metadata (`apps/catalog/src/lib/props.ts`), merged with curated labels,
options and fixture defaults from `componentRegistry.ts`. The panel itself is
built from STRATA components: `strata-text-field`, `strata-number-field`,
`strata-select` (prop-driven `options`) and `strata-checkbox`; list props keep
a plain textarea.

- Text, boolean, number and select inputs map to the real property types —
  booleans stay booleans, numbers stay numbers.
- Complex props (`items`, `groups`, `columns`, `rows`, `nodes`) get a textarea
  that accepts JSON arrays or STRATA's pipe-delimited format.
- **Reset** (a `strata-button`) restores every control to the declared default.

The preview element is mounted by `src/lib/renderer.ts`
(`mountStrataElement`): it waits for `customElements.whenDefined`, assigns
properties with their real JavaScript types (never stringified attributes),
configures slotted fixtures and returns an `update()`/`destroy()` handle so
property edits never recreate the instance. `src/lib/mount.ts` wraps the same
renderer as a Svelte action for the variant/state galleries.

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

- `.sidebar-nav [data-node-id="entry:<id>"]` — one tree node per library
  entry (`scenario:<id>` for scenarios, `cat:<name>` for categories).
- `.preview-stage > *` — the mounted custom element.
- `.demo-cell` — variant/state gallery cells.
- `strata-viewer-settings .vs-toggle` / `.vs-panel` — settings disclosure.
- `.snippet-block pre` — the generated snippet.
