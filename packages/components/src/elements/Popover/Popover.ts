import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

@customElement("strata-popover")
export class StrataPopover extends StrataElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) label = "Popover";

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.open) this.open = false;
  };

  render() {
    return html`<div
      class="strata-popover"
      role="dialog"
      aria-label=${this.label}
      ?hidden=${!this.open}
      @keydown=${this.handleKeydown}
    >
      <slot></slot>
    </div>`;
  }
}
