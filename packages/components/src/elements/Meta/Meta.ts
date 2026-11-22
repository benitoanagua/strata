import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { parseItems } from "../../utils/items.js";

/**
 * Metadata line (date · category · author · reading time). Items are
 * separated by a slanted filete — typography, not chrome.
 */
@customElement("strata-meta")
export class StrataMeta extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: block;
        color: var(--strata-color-text-secondary);
        font: var(--strata-type-label-medium) var(--strata-font-sans);
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      li,
      ::slotted(*) {
        display: inline-flex;
        align-items: center;
      }
      li:not(:last-child)::after,
      ::slotted(:not(:last-child))::after {
        content: "";
        display: inline-block;
        width: var(--strata-border-medium);
        height: 0.9em;
        margin: 0 10px;
        background: var(--strata-color-border-subtle);
        transform: skewX(-12deg);
      }
      li:first-child {
        color: var(--strata-color-text-primary);
        font-weight: 600;
      }
    `,
  ];
  @property({ type: String }) label = "Metadata";
  @property() items: string | unknown[] = "";

  render() {
    const items = parseItems(this.items);
    return html`<ul aria-label=${this.label}>
      ${items.map((item) => html`<li>${item.label}</li>`)}
      <slot></slot>
    </ul>`;
  }
}
