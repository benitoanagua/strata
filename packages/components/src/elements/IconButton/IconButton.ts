import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("strata-icon-button")
export class StrataIconButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      width: 48px;
      height: 48px;
      padding: 0;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: var(--strata-radius-small);
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    button:hover {
      background: var(--strata-color-surface-subtle);
    }
    button[aria-pressed="true"] {
      background: var(--strata-color-surface-selected);
    }
    button:focus-visible {
      outline: 2px solid var(--strata-color-focus-ring);
      outline-offset: 2px;
    }
    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    iconify-icon { font-size: 20px; }
    :host([size="small"]) button {
      width: 36px;
      height: 36px;
      border-radius: var(--strata-radius-small);
    }
    :host([size="small"]) iconify-icon { font-size: 16px; }
    :host([size="large"]) button {
      width: 60px;
      height: 60px;
      border-radius: var(--strata-radius-medium);
    }
    :host([size="large"]) iconify-icon { font-size: 26px; }
  `;
  @property({ type: String }) size: "small" | "medium" | "large" = "medium";
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = "";
  @property({ type: String }) icon = "carbon:add";
  /** Renders `aria-pressed` on the inner button when defined (toggle buttons). */
  @property({ attribute: false }) pressed: boolean | undefined = undefined;
  /** Renders `aria-expanded` on the inner button when defined (disclosure buttons). */
  @property({ attribute: false }) expanded: boolean | undefined = undefined;
  render() {
    return html`<button
      type="button"
      ?disabled=${this.disabled}
      aria-label=${this.label || "Action"}
      aria-pressed=${this.pressed === undefined ? nothing : String(this.pressed)}
      aria-expanded=${this.expanded === undefined ? nothing : String(this.expanded)}
    >
      <iconify-icon icon=${this.icon} aria-hidden="true"></iconify-icon>
    </button>`;
  }
}
