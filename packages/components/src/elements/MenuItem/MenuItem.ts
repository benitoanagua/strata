import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

@customElement("strata-menu-item")
export class StrataMenuItem extends StrataElement {
  @property({ type: String }) label = "";
  @property({ type: String }) icon = "";
  @property({ type: Boolean }) disabled = false;

  /** Delegates focus to the inner menuitem button. */
  focus() {
    this.renderRoot.querySelector<HTMLElement>("button")?.focus();
  }

  render() {
    return html`<button role="menuitem" ?disabled=${this.disabled}>
      ${this.icon ? html`<iconify-icon icon=${this.icon} aria-hidden="true"></iconify-icon>` : ""}<span
        >${this.label || html`<slot></slot>`}</span
      >
    </button>`;
  }
}
