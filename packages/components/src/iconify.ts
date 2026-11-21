/**
 * STRATA icon policy: use Iconify directly and Carbon is the only collection.
 * Only the icons actually used by STRATA components are bundled, via the
 * explicit `carbon-icons.json` allowlist — the full `@iconify-json/carbon`
 * collection (~1.2 MB) is never shipped. Dynamic icon props
 * (`strata-button[icon]`, `strata-icon-button[icon]`, `strata-menu-item[icon]`)
 * accept any `carbon:*` name, but consumers must register additional icons
 * themselves with `addIcon`/`addCollection` from `iconify-icon`.
 */
import { addCollection } from "iconify-icon";
import carbonIcons from "./carbon-icons.json";

addCollection(carbonIcons);
