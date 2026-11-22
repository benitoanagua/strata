import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

@customElement("strata-tooltip")
export class StrataTooltip extends StrataElement {
  @property({ type: String }) text = "";
  @state() private visible = false;

  private show = () => (this.visible = true);
  private hide = () => (this.visible = false);
  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") this.visible = false;
  };

  render() {
    return html`<span
      class="strata-tooltip"
      @mouseenter=${this.show}
      @mouseleave=${this.hide}
      @focusin=${this.show}
      @focusout=${this.hide}
      @keydown=${this.handleKeydown}
      ><slot></slot
      ><span role="tooltip" aria-hidden=${String(!this.visible)}
        >${this.text}</span
      ></span
    >`;
  }
}
