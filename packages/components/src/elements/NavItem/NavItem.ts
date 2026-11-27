import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
@customElement("strata-nav-item")
export class StrataNavItem extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .strata-nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 8px 10px;
      border: 0;
      border-radius: var(--strata-radius-small);
      background: transparent;
      color: var(--strata-color-text-secondary);
      font: var(--strata-type-label-large) var(--strata-font-sans);
      text-align: left;
      cursor: pointer;
    }
    .strata-nav-item:hover {
      background: var(--strata-color-surface-hover);
      color: var(--strata-color-text-primary);
    }
    .strata-nav-item:focus-visible {
      outline: 2px solid var(--strata-color-focus-ring);
      outline-offset: 2px;
    }
    :host([selected]) .strata-nav-item {
      background: var(--strata-color-surface-selected);
      color: var(--strata-color-text-primary);
      font-weight: 700;
    }
  `;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property() label = "";
  /** Delegates focus to the inner button (used by strata-nav arrow-key nav). */
  focus() {
    this.renderRoot.querySelector<HTMLElement>("button")?.focus();
  }
  render() {
    return html`<button
      class="strata-nav-item"
      aria-current=${this.selected ? "page" : "false"}
    >
      <slot>${this.label}</slot>
    </button>`;
  }
}
