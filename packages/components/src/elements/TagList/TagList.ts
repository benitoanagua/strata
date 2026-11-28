import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../Badge/Badge.js";
import { parseItems, safeHref } from "../../utils/items.js";
import type { TagHueInput } from "../../utils/hue.js";

/**
 * Wrapping group of tags (ex. "Etiquetas" / "Categorías" of an article or
 * wiki page). With `hue="auto"` each label keeps its own stable hue, which
 * is what makes categories distinguishable at a glance.
 */
@customElement("strata-tag-list")
export class StrataTagList extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 8px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
    `,
  ];
  /** Accessible name of the list ("Etiquetas", "Categorías"…). */
  @property({ type: String }) label = "Tags";
  @property() items: string | unknown[] = "";
  @property({ type: String }) hue: TagHueInput = "auto";
  /** Prefix turned into `href` for plain-string items (`/etiqueta/`). */
  @property({ type: String, attribute: "base-href" }) baseHref = "";

  private link(label: string, href?: string) {
    if (href) return href;
    return this.baseHref
      ? safeHref(`${this.baseHref}${encodeURIComponent(label)}`)
      : "";
  }

  render() {
    const items = parseItems(this.items);
    return html`<ul aria-label=${this.label}>
      ${items.map(
        (item) =>
          html`<li>
            <strata-badge
              label=${item.label}
              hue=${this.hue}
              href=${this.link(item.label, item.href)}
            ></strata-badge>
          </li>`,
      )}
      <slot></slot>
    </ul>`;
  }
}
