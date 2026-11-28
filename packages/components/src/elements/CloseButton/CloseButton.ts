import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";

/** Shared close affordance for floating surfaces. Emits a composed strata-close event. */
@customElement("strata-close-button")
export class StrataCloseButton extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host { display: inline-flex; flex: 0 0 auto; }
      button {
        display: inline-grid; place-items: center; width: 36px; height: 36px;
        padding: 0; border: 1px solid var(--strata-color-border-subtle);
        border-radius: var(--strata-radius-small); background: transparent;
        color: var(--strata-color-text-secondary); cursor: pointer;
      }
      button:hover { background: var(--strata-color-surface-hover); color: var(--strata-color-text-primary); }
      button:focus-visible { outline: 2px solid var(--strata-color-focus-ring); outline-offset: 2px; }
      button:active { transform: scale(.96); }
      iconify-icon { font-size: 16px; }
      @media (prefers-reduced-motion: reduce) { button { transition: none; } }
    `,
  ];
  @property({ type: String }) label = "Close";
  focus() { this.renderRoot.querySelector<HTMLButtonElement>("button")?.focus(); }

  private emitClose = () => {
    this.dispatchEvent(new CustomEvent("strata-close", { bubbles: true, composed: true }));
  };
  render() {
    return html`<button type="button" aria-label=${this.label} @click=${this.emitClose}>
      <iconify-icon icon="carbon:close" aria-hidden="true"></iconify-icon>
    </button>`;
  }
}
