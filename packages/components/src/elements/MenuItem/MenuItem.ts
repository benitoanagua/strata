import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";

@customElement("strata-menu-item")
export class StrataMenuItem extends StrataElement {
  static styles = [strataComponentStyles, css`
    :host { display: block; }
    button {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      min-height: 40px;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border: 0;
      border-radius: var(--strata-radius-small);
      background: transparent;
      color: var(--strata-color-text-primary);
      font: var(--strata-type-body-medium) var(--strata-font-sans);
      text-align: left;
      cursor: pointer;
    }
    button:hover { background: var(--strata-color-surface-hover); }
    button:focus-visible {
      outline: 2px solid var(--strata-color-focus-ring);
      outline-offset: -2px;
    }
    button:disabled { color: var(--strata-color-text-disabled); cursor: not-allowed; }
    iconify-icon { flex: 0 0 auto; font-size: 16px; }
  `];
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
