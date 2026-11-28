# STRATA component catalog

The canonical component catalog is defined in `STRATA_COMPONENT_CATALOG` and synchronized with the public exports and interactive catalog registry by automated tests. It is deliberately broad enough for mobile product UI and long-form reading while keeping each component small and composable.

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
accessibility, responsive behavior, tokens, examples and tests. The source
implementation, public Lit metadata, `STRATA_COMPONENT_CATALOG`, catalog
registry and executable tests are kept synchronized by automated checks.

## Maturity

Maturity is declared in the interactive catalog registry and is not copied
into a manually maintained count. Components with complex interaction
semantics must complete `docs/COMPONENT-CHECKLIST.md` before being marked
Stable.
