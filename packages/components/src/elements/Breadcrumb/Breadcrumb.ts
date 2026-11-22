import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { parseItems, safeHref } from "../../utils/items.js";

@customElement("strata-breadcrumb")
export class StrataBreadcrumb extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      a {
        color: inherit;
      }
      a:hover {
        text-decoration: underline;
      }
      [aria-current="page"] {
        color: var(--strata-color-text-primary);
        font-weight: 700;
      }
    `,
  ];
  /** Pipe-separated labels or a JSON array of `{ label, href }`. */
  @property() items: string | unknown[] = "";
  @property({ type: String }) label = "Breadcrumb";
  render() {
    const items = parseItems(this.items);
    const last = items.length - 1;
    return html`<nav aria-label=${this.label}>
      <ol>
        ${items.map(
          (item, i) =>
            html`<li>
              ${
                item.href && i !== last
                  ? html`<a href=${safeHref(item.href)}>${item.label}</a>`
                  : html`<span aria-current=${i === last ? "page" : nothing}
                      >${item.label}</span
                    >`
              }${i < last ? html`<span aria-hidden="true">/</span>` : ""}
            </li>`,
        )}
      </ol>
    </nav>`;
  }
}
