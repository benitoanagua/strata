import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emitValueEvent } from "../../events.js";

@customElement("strata-switch")
export class StrataSwitch extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      box-sizing: border-box;
      width: 40px;
      height: 24px;
      padding: 2px;
      border: 0;
      border-radius: var(--strata-radius-medium);
      background: var(--strata-color-gray-300);
      cursor: pointer;
    }
    button:focus-visible {
      outline: 2px solid var(--strata-color-focus-ring);
      outline-offset: 3px;
    }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .strata-switch__thumb {
      display: block;
      width: 20px;
      height: 20px;
      border-radius: var(--strata-radius-small);
      background: var(--strata-color-white);
      transition: transform 0.18s ease;
    }
    button[aria-checked="true"] {
      background: var(--strata-color-action-primary);
    }
    button[aria-checked="true"] .strata-switch__thumb {
      transform: translateX(16px);
    }
    @media (prefers-reduced-motion: reduce) {
      .strata-switch__thumb {
        transition: none;
      }
    }
  `;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = "";

  private toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    emitValueEvent(this, "strata-input", this.checked);
    emitValueEvent(this, "strata-change", this.checked);
  }

  render() {
    return html`<button
      type="button"
      role="switch"
      aria-checked=${this.checked}
      aria-label=${this.label || "Toggle"}
      ?disabled=${this.disabled}
      @click=${this.toggle}
    >
      <span class="strata-switch__thumb"></span>
    </button>`;
  }
}
