# STRATA component catalog

STRATA ships a 72-component catalog. The catalog is deliberately broad enough for mobile product UI and long-form reading while keeping each component small and composable.

## Actions

Button · IconButton · ButtonGroup · Stepper

## Forms

TextField · SearchField · NumberField · DateField · Select · Checkbox · Radio · RadioGroup · Switch · Slider · FileUpload

## Navigation

NavItem · Tabs · Breadcrumb · Menu · MenuItem · Tree

(`strata-tab` and `strata-tab-panel` are composition children of Tabs.)

## Feedback

Alert · Badge · Progress · Skeleton · Spinner · Tooltip

## Surfaces

Surface · Card · Dialog · Modal · Drawer · BottomSheet · Popover · Overlay · ThemeToggle

## Data & Content

DataTable · Pagination · List · ListItem · Accordion · Carousel · Grille · Avatar · Divider · Logo · Prose

## Editorial

Meta · TagList · SectionHeader · AuthorBox · Share · Comment · CommentThread · ArticleHeader · Entry · Quote · Ticker · FilterBar · IndexList · RankedList · Gallery · PageLayout

## Article Navigation

Toc · ReadingTime · ReadingProgress · BackToTop · Cite · References · Hatnote · ArticleNav · HeadingAnchors

See `docs/EDITORIAL-COMPONENTS.md` and `docs/ARTICLE-NAVIGATION.md` for the
editorial mapping and wiki uses.

## Interactive catalog

`apps/catalog` renders every entry with live property controls derived from
Lit metadata, copyable snippets, API/accessibility tabs and five composed
editorial scenarios. See `docs/CATALOG-GUIDE.md`.

## Contract

Every component documents: purpose, anatomy, variants, size, states,
accessibility, responsive behavior, tokens, examples and tests — enforced by
`docs/IMPLEMENTATION-AUDIT.md` and `docs/COMPONENT-COVERAGE.md`.

## Maturity

Every component ships as a composable baseline. Components with complex
interaction semantics must complete `docs/COMPONENT-CHECKLIST.md` before
being marked Stable. Current counts: 18 stable, 55 beta, 1 experimental.
