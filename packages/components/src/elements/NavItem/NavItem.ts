import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("strata-nav-item")
export class StrataNavItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }
    .strata-nav-item {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 40px;
      padding: 8px 12px;
      border: 0;
      border-radius: var(--strata-radius-small);
      background: transparent;
      color: var(--strata-color-text-secondary);
      font: var(--strata-type-label-large) var(--strata-font-sans);
      text-align: left;
      text-decoration: none;
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
    @media (max-width: 640px) {
      :host {
        width: 100%;
      }
      .strata-nav-item {
        display: flex;
        width: 100%;
      }
    }
  `;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property() label = "";
  @property() href = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  focus() {
    this.renderRoot.querySelector<HTMLElement>("a,button")?.focus();
  }
  render() {
    const content = html`<slot>${this.label}</slot>`;
    return this.href && !this.disabled
      ? html`<a
          class="strata-nav-item"
          href=${this.href}
          aria-current=${this.selected ? "page" : nothing}
          >${content}</a
        >`
      : html`<button
          class="strata-nav-item"
          type="button"
          ?disabled=${this.disabled}
          aria-current=${this.selected ? "page" : nothing}
        >
          ${content}
        </button>`;
  }
}
