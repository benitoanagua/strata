import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { parseItems, safeHref } from "../../utils/items.js";

/**
 * Numbered list with large tabular numerals ("Lo más leído", most-viewed or
 * most-edited pages). `variant="none"` drops the numerals.
 */
@customElement("strata-ranked-list")
export class StrataRankedList extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      ol,
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      li {
        display: grid;
        grid-template-columns: 3ch 1fr;
        align-items: baseline;
        gap: 12px;
        padding: 10px 0;
      }
      :host([divider]) li {
        border-bottom: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
      }
      :host([striped]) li:nth-child(odd) {
        background: var(--strata-color-surface-subtle);
      }
      :host([variant="none"]) li {
        grid-template-columns: 1fr;
      }
      .rank {
        font: var(--strata-type-numeric-large) var(--strata-font-mono);
        font-variant-numeric: tabular-nums;
        color: var(--strata-color-text-secondary);
        text-align: right;
      }
      a {
        color: var(--strata-color-text-primary);
        font: var(--strata-type-title-small) var(--strata-font-serif);
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      a:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
    `,
  ];
  @property({ type: String }) label = "Ranking";
  @property() items: string | unknown[] = "";
  @property({ type: String, reflect: true }) variant: "ordered" | "none" =
    "ordered";
  @property({ type: Boolean, reflect: true }) divider = false;
  @property({ type: Boolean, reflect: true }) striped = false;

  render() {
    const items = parseItems(this.items);
    const ordered = this.variant !== "none";
    const rows = items.map((item, i) => {
      const href = safeHref(item.href);
      return html`<li>
        ${
          ordered
            ? html`<span class="rank" aria-hidden="true">${i + 1}</span>`
            : ""
        }
        <span
          >${href ? html`<a href=${href}>${item.label}</a>` : item.label}</span
        >
      </li>`;
    });
    return ordered
      ? html`<ol aria-label=${this.label}>
          ${rows}
        </ol>`
      : html`<ul aria-label=${this.label}>
          ${rows}
        </ul>`;
  }
}
