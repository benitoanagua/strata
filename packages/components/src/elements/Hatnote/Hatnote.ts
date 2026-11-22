import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { parseItems, safeHref } from "../../utils/items.js";

/** Disambiguation / "see also" line above an article ("Para otros usos, véase…"). */
@customElement("strata-hatnote")
export class StrataHatnote extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      aside {
        padding-left: 1.5em;
        font: var(--strata-type-reading-small) var(--strata-font-serif);
        font-style: italic;
        color: var(--strata-color-text-secondary);
      }
      a {
        color: var(--strata-color-text-primary);
        text-underline-offset: 3px;
      }
      a:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
    `,
  ];
  @property({ type: String }) lead = "";
  @property() items: string | unknown[] = "";
  @property({ type: String }) separator = ", ";

  render() {
    const items = parseItems(this.items);
    return html`<aside role="note">
      ${this.lead ? html`<span>${this.lead} </span>` : ""}${items.map(
        (item, i) => {
          const href = safeHref(item.href);
          return html`${i ? this.separator : ""}${href ? html`<a href=${href}>${item.label}</a>` : item.label}`;
        },
      )}<slot></slot>
    </aside>`;
  }
}
