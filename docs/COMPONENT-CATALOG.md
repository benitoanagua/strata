# STRATA component catalog

STRATA ships a 74-component catalog. The catalog is deliberately broad enough for mobile product UI while keeping each component small and composable.

## Actions

Button · IconButton · ButtonGroup · Stepper

## Forms

TextField · SearchField · NumberField · DateField · Select · Checkbox · Radio · RadioGroup · Switch · Slider · FileUpload

## Navigation

NavItem · Tabs · Tab · TabPanel · Breadcrumb · Menu · MenuItem

## Feedback

Alert · Progress · Skeleton · Snackbar · Spinner · Badge · Tag

## Surfaces / overlays

Surface · Card · Dialog · Modal · Drawer · BottomSheet · Popover · Tooltip · Overlay

## Data / content

DataTable · Pagination · List · ListItem · Accordion · Carousel · Grille · Avatar · Divider · Logo · ThemeToggle

## Editorial (news / wiki)

Meta · TagList · SectionHeader · AuthorBox · Share · Comment · CommentThread · ArticleHeader · Entry · Quote · Ticker · FilterBar · IndexList · RankedList · Gallery · PageLayout

Ported from the Vue/Tailwind _UI Components Library_ news kit. See `docs/EDITORIAL-COMPONENTS.md` for the mapping, wiki uses and what was deliberately left out.

## Article navigation (wiki)

Toc · ReadingTime · ReadingProgress · BackToTop · Cite · References · Hatnote · ArticleNav · HeadingAnchors

See `docs/ARTICLE-NAVIGATION.md`.

## Contract

Every component should document: purpose, anatomy, variants, size, states, accessibility, responsive behavior, tokens, examples, and tests.

## Maturity

Every component is shipped as a composable baseline. Components that gain complex interaction semantics (dialogs, menus, date fields, data tables, etc.) must complete the full checklist before being marked Stable.
