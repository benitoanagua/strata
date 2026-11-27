import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { emitValueEvent } from "../../events.js";

@customElement("strata-radio")
export class StrataRadio extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: inline-block;
      }
      label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font: var(--strata-type-body-medium) var(--strata-font-sans);
        cursor: pointer;
      }
      input {
        accent-color: var(--strata-color-action-primary);
        width: 16px;
        height: 16px;
        margin: 0;
      }
      input:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      input:disabled {
        cursor: not-allowed;
      }
      :host([disabled]) label {
        cursor: not-allowed;
      }
    `,
  ];
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = "";
  @property({ type: String }) value = "";

  private handleChange() {
    if (this.disabled) return;
    this.checked = true;
    emitValueEvent(this, "strata-input", this.value);
    emitValueEvent(this, "strata-change", this.value);
  }

  render() {
    return html`<label
      ><input
        type="radio"
        .checked=${this.checked}
        ?disabled=${this.disabled}
        name=${this.name}
        value=${this.value}
        @change=${this.handleChange} /><span>${this.label}<slot></slot></span
    ></label>`;
  }
}
