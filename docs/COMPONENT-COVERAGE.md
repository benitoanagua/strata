# STRATA — Component Coverage

Coverage matrix for the 74 canonical components. `Mount` = `catalog-components.test.ts` mounts every entry and checks accessible names; `Axe` + `Visual` = `packages/testing/visual/components.spec.ts` scans and screenshots every entry in light and dark themes; `Focused` = dedicated unit/contract tests found by tag reference.

## Actions

| Component   | Tag                   | Mount | Axe | Visual | Focused tests | Maturity |
| ----------- | --------------------- | ----- | --- | ------ | ------------- | -------- |
| Button      | `strata-button`       | ✓     | ✓   | ✓      | `components`  | stable   |
| IconButton  | `strata-icon-button`  | ✓     | ✓   | ✓      | —             | stable   |
| ButtonGroup | `strata-button-group` | ✓     | ✓   | ✓      | —             | beta     |
| Stepper     | `strata-stepper`      | ✓     | ✓   | ✓      | —             | beta     |

## Forms

| Component   | Tag                   | Mount | Axe | Visual | Focused tests                         | Maturity |
| ----------- | --------------------- | ----- | --- | ------ | ------------------------------------- | -------- |
| TextField   | `strata-text-field`   | ✓     | ✓   | ✓      | `api-contracts` `components` `status` | stable   |
| SearchField | `strata-search-field` | ✓     | ✓   | ✓      | —                                     | beta     |
| NumberField | `strata-number-field` | ✓     | ✓   | ✓      | —                                     | beta     |
| DateField   | `strata-date-field`   | ✓     | ✓   | ✓      | —                                     | beta     |
| Select      | `strata-select`       | ✓     | ✓   | ✓      | —                                     | beta     |
| Checkbox    | `strata-checkbox`     | ✓     | ✓   | ✓      | `components`                          | stable   |
| Radio       | `strata-radio`        | ✓     | ✓   | ✓      | —                                     | beta     |
| RadioGroup  | `strata-radio-group`  | ✓     | ✓   | ✓      | —                                     | beta     |
| Switch      | `strata-switch`       | ✓     | ✓   | ✓      | `api-contracts` `components`          | stable   |
| Slider      | `strata-slider`       | ✓     | ✓   | ✓      | —                                     | beta     |
| FileUpload  | `strata-file-upload`  | ✓     | ✓   | ✓      | `fixes`                               | beta     |

## Navigation

| Component  | Tag                 | Mount | Axe | Visual | Focused tests                 | Maturity |
| ---------- | ------------------- | ----- | --- | ------ | ----------------------------- | -------- |
| NavItem    | `strata-nav-item`   | ✓     | ✓   | ✓      | `components`                  | stable   |
| Tabs       | `strata-tabs`       | ✓     | ✓   | ✓      | `components`                  | beta     |
| Tab        | `strata-tab`        | ✓     | ✓   | ✓      | `__gen_coverage` `components` | beta     |
| Breadcrumb | `strata-breadcrumb` | ✓     | ✓   | ✓      | —                             | beta     |
| Menu       | `strata-menu`       | ✓     | ✓   | ✓      | `__gen_coverage`              | beta     |
| MenuItem   | `strata-menu-item`  | ✓     | ✓   | ✓      | `__gen_coverage`              | beta     |

## Feedback

| Component | Tag               | Mount | Axe | Visual | Focused tests         | Maturity |
| --------- | ----------------- | ----- | --- | ------ | --------------------- | -------- |
| Alert     | `strata-alert`    | ✓     | ✓   | ✓      | `components` `status` | stable   |
| Badge     | `strata-badge`    | ✓     | ✓   | ✓      | `status`              | stable   |
| Tag       | `strata-tag`      | ✓     | ✓   | ✓      | `editorial`           | beta     |
| Progress  | `strata-progress` | ✓     | ✓   | ✓      | —                     | stable   |
| Skeleton  | `strata-skeleton` | ✓     | ✓   | ✓      | —                     | stable   |
| Spinner   | `strata-spinner`  | ✓     | ✓   | ✓      | —                     | stable   |
| Snackbar  | `strata-snackbar` | ✓     | ✓   | ✓      | —                     | beta     |
| Tooltip   | `strata-tooltip`  | ✓     | ✓   | ✓      | —                     | beta     |

## Surfaces

| Component   | Tag                   | Mount | Axe | Visual | Focused tests                        | Maturity     |
| ----------- | --------------------- | ----- | --- | ------ | ------------------------------------ | ------------ |
| Surface     | `strata-surface`      | ✓     | ✓   | ✓      | —                                    | stable       |
| Card        | `strata-card`         | ✓     | ✓   | ✓      | `components`                         | beta         |
| Dialog      | `strata-dialog`       | ✓     | ✓   | ✓      | `components` `fixes`                 | beta         |
| Modal       | `strata-modal`        | ✓     | ✓   | ✓      | `api-contracts` `components` `fixes` | beta         |
| Drawer      | `strata-drawer`       | ✓     | ✓   | ✓      | `fixes`                              | beta         |
| BottomSheet | `strata-bottom-sheet` | ✓     | ✓   | ✓      | `fixes`                              | beta         |
| Popover     | `strata-popover`      | ✓     | ✓   | ✓      | —                                    | experimental |
| Overlay     | `strata-overlay`      | ✓     | ✓   | ✓      | —                                    | beta         |
| ThemeToggle | `strata-theme-toggle` | ✓     | ✓   | ✓      | `__gen_coverage`                     | stable       |

## Data & Content

| Component  | Tag                 | Mount | Axe | Visual | Focused tests                 | Maturity |
| ---------- | ------------------- | ----- | --- | ------ | ----------------------------- | -------- |
| DataTable  | `strata-data-table` | ✓     | ✓   | ✓      | `__gen_coverage` `fixes`      | beta     |
| Pagination | `strata-pagination` | ✓     | ✓   | ✓      | —                             | beta     |
| List       | `strata-list`       | ✓     | ✓   | ✓      | `__gen_coverage`              | stable   |
| ListItem   | `strata-list-item`  | ✓     | ✓   | ✓      | `__gen_coverage`              | stable   |
| Accordion  | `strata-accordion`  | ✓     | ✓   | ✓      | `__gen_coverage` `components` | beta     |
| Carousel   | `strata-carousel`   | ✓     | ✓   | ✓      | `__gen_coverage`              | beta     |
| Grille     | `strata-grille`     | ✓     | ✓   | ✓      | `__gen_coverage`              | beta     |
| Avatar     | `strata-avatar`     | ✓     | ✓   | ✓      | —                             | stable   |
| Divider    | `strata-divider`    | ✓     | ✓   | ✓      | —                             | stable   |
| Logo       | `strata-logo`       | ✓     | ✓   | ✓      | `__gen_coverage`              | stable   |
| Prose      | `strata-prose`      | ✓     | ✓   | ✓      | `__gen_coverage`              | beta     |

## Editorial

| Component     | Tag                     | Mount | Axe | Visual | Focused tests | Maturity |
| ------------- | ----------------------- | ----- | --- | ------ | ------------- | -------- |
| Meta          | `strata-meta`           | ✓     | ✓   | ✓      | —             | beta     |
| TagList       | `strata-tag-list`       | ✓     | ✓   | ✓      | `editorial`   | beta     |
| SectionHeader | `strata-section-header` | ✓     | ✓   | ✓      | —             | beta     |
| AuthorBox     | `strata-author-box`     | ✓     | ✓   | ✓      | —             | beta     |
| Share         | `strata-share`          | ✓     | ✓   | ✓      | `editorial`   | beta     |
| Comment       | `strata-comment`        | ✓     | ✓   | ✓      | `editorial`   | beta     |
| CommentThread | `strata-comment-thread` | ✓     | ✓   | ✓      | —             | beta     |
| ArticleHeader | `strata-article-header` | ✓     | ✓   | ✓      | `editorial`   | beta     |
| Entry         | `strata-entry`          | ✓     | ✓   | ✓      | `editorial`   | beta     |
| Quote         | `strata-quote`          | ✓     | ✓   | ✓      | `editorial`   | beta     |
| Ticker        | `strata-ticker`         | ✓     | ✓   | ✓      | `editorial`   | beta     |
| FilterBar     | `strata-filter-bar`     | ✓     | ✓   | ✓      | `editorial`   | beta     |
| IndexList     | `strata-index-list`     | ✓     | ✓   | ✓      | `editorial`   | beta     |
| RankedList    | `strata-ranked-list`    | ✓     | ✓   | ✓      | `editorial`   | beta     |
| Gallery       | `strata-gallery`        | ✓     | ✓   | ✓      | —             | beta     |
| PageLayout    | `strata-page-layout`    | ✓     | ✓   | ✓      | —             | beta     |

## Article Navigation

| Component       | Tag                       | Mount | Axe | Visual | Focused tests | Maturity |
| --------------- | ------------------------- | ----- | --- | ------ | ------------- | -------- |
| TableOfContents | `strata-toc`              | ✓     | ✓   | ✓      | `article-nav` | beta     |
| ReadingTime     | `strata-reading-time`     | ✓     | ✓   | ✓      | `article-nav` | beta     |
| ReadingProgress | `strata-reading-progress` | ✓     | ✓   | ✓      | —             | beta     |
| BackToTop       | `strata-back-to-top`      | ✓     | ✓   | ✓      | `article-nav` | beta     |
| Cite            | `strata-cite`             | ✓     | ✓   | ✓      | `article-nav` | beta     |
| References      | `strata-references`       | ✓     | ✓   | ✓      | `article-nav` | beta     |
| Hatnote         | `strata-hatnote`          | ✓     | ✓   | ✓      | `article-nav` | beta     |
| ArticleNav      | `strata-article-nav`      | ✓     | ✓   | ✓      | `article-nav` | beta     |
| HeadingAnchors  | `strata-heading-anchors`  | ✓     | ✓   | ✓      | `article-nav` | beta     |

## Notes

- `strata-data-table`, `strata-logo`, `strata-prose` and `strata-theme-toggle` expose no public reactive properties; they are covered by mount/axe/visual only.
- Fragment components (`strata-tab`, `strata-menu-item`, `strata-list-item`, `strata-accordion-item`, `strata-carousel-item`, `strata-grille-item`, `strata-tab-panel`) are axe-tested inside parent fixtures.
- Playwright baselines are local artifacts (gitignored); regenerate with `pnpm test:visual:update`.
