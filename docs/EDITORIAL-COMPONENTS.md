# Editorial components (news + wiki)

Ported from the Vue 3 / Tailwind _UI Components Library_ (a Spanish-language news kit) into Lit elements that follow STRATA's laws: tokens only, 0–2 px radii, filetes instead of shadows, Carbon icons, serif for reading, sans for chrome, mono for tags and numbers.

| STRATA element                                                           | Origin (library)                | Wiki use                                               |
| ------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------ |
| `strata-tag` (+ `hue`, `href`) / `strata-tag-list`                       | InlineList, `meta.accent`       | Categories, templates, namespaces                      |
| `strata-meta`                                                            | `meta` pattern                  | Last edited · author · reading time                    |
| `strata-section-header`                                                  | BlockHeader                     | Section titles, sidebar blocks                         |
| `strata-author-box`                                                      | AuthorBox                       | Contributor / user page header                         |
| `strata-share`                                                           | SocialShare                     | Share / copy permalink (mono glyphs, no brand colours) |
| `strata-comment`, `strata-comment-thread`                                | Comment                         | Talk pages with nested replies, role badges            |
| `strata-article-header`                                                  | Article / Post header           | Page title, deck, lead figure                          |
| `strata-entry`                                                           | Ticket, SingleCard, Filter rows | Search results, category listings, recent changes      |
| `strata-quote`                                                           | BlockQuotes story               | Quotation / pull quote (double rules)                  |
| `strata-ticker`                                                          | Flash                           | Recent changes strip                                   |
| `strata-filter-bar`                                                      | Filter                          | Category + view + sort for listings                    |
| `strata-index-list`                                                      | Sitemap                         | Category index, A–Z index                              |
| `strata-ranked-list`                                                     | List (ordered)                  | Most read / most edited                                |
| `strata-gallery`                                                         | Masonry + Lightbox              | Image gallery with lightbox                            |
| `strata-page-layout`                                                     | Sidebar / Content / LayoutGrid  | TOC · article · infobox                                |
| prose: `.strata-dropcap`, `cite`, `mark`, `.strata-zebra`, `.strata-u-*` | Style stories                   | Article body                                           |

Already covered by existing STRATA components (not duplicated): Alert boxes → `strata-alert`, Pagination, Breadcrumbs, Tabs, Modal/Overlay, Carousel/Slideshow, Search, Forms, Tables.

## Rainbow taxonomy hues

`hue="auto"` hashes the label to one of seven hues, so a category always has the same colour everywhere. Tokens: `--strata-tag-{red,orange,yellow,green,blue,indigo,violet}-{ink,tint}` (light and dark). Selected chips in `strata-filter-bar` are shown by inversion and weight, not border. Use `<html data-tag-hues="mono">` for a grayscale site.

## Deliberately not ported

Radio player, horoscope, pricing table, classifieds, and the site-specific pages (Tribunales, Péndulo Político): news-vertical content with no wiki analogue. Brand-coloured share icons, shadows and pill radii were replaced to respect the Scale and Monochrome laws. WhatsApp/Telegram have no Carbon logo, so they use `carbon:chat` / `carbon:send-alt`.

## Usage

```html
<strata-page-layout sticky>
  <strata-ranked-list
    slot="aside-start"
    label="Contenido"
    variant="none"
    items="Intro|Historia"
  ></strata-ranked-list>
  <article>
    <strata-article-header
      heading="Cuenca del Pilcomayo"
      category="Geografía"
      date="21 nov 2026"
    ></strata-article-header>
    <strata-prose>…</strata-prose>
    <strata-comment-thread heading="Discusión" count="2"
      >…</strata-comment-thread
    >
  </article>
  <strata-tag-list
    slot="aside-end"
    items="Hidrografía|Bolivia"
  ></strata-tag-list>
</strata-page-layout>
```
