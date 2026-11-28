# Alert and Snackbar migration

`strata-alert` is now the single STRATA feedback component. The standalone
`strata-snackbar` custom element and `StrataSnackbar` export have been removed;
there is no compatibility alias.

## Migrate Snackbar

Before:

```html
<strata-snackbar open message="Item saved." duration="3000"></strata-snackbar>
```

After:

```html
<strata-alert
  mode="snackbar"
  tone="success"
  open
  message="Item saved."
  duration="3000"
></strata-alert>
```

| Former Snackbar API | Unified Alert API |
| --- | --- |
| `strata-snackbar` | `strata-alert mode="snackbar"` |
| `message` | `message` |
| `open` | `open` |
| `duration` | `duration` |
| auto-dismiss event | `strata-dismiss` with `detail.reason = "timeout"` |

## Optional close button

Set `closable` to enable the accessible close button. It is disabled by
default. Manual and timed dismissal emit the same `strata-dismiss` event;
`detail.reason` is `"manual"` or `"timeout"`.

## Duration and placement

- `duration` defaults to 3000 milliseconds in snackbar mode.
- Set `duration="0"` to disable auto-dismiss.
- `placement` supports `top-start`, `top-center`, `top-end`,
  `bottom-start`, `bottom-center` (default), and `bottom-end`.

## Inline Alert

The default `mode="inline"` stays in document flow. Use `tone`
(`info`, `success`, `warning`, or `error`) for semantic status. The default
slot remains available for supplementary markup; `message` supplies the
primary text.
