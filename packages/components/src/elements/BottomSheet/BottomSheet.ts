import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

@customElement("strata-bottom-sheet")
export class StrataBottomSheet extends StrataElement {
  @property({ type: Boolean, reflect: true }) open = false;
  private previouslyFocused: HTMLElement | null = null;
  private handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.open) this.open = false;
  };
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.handleEscape);
  }
  disconnectedCallback() {
    window.removeEventListener("keydown", this.handleEscape);
    this.restoreFocus();
    super.disconnectedCallback();
  }
  @property({ type: String }) title = "";
  protected updated(changed: Map<string, unknown>) {
    if (!changed.has("open")) return;
    if (this.open) {
      this.previouslyFocused =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      queueMicrotask(() =>
        this.renderRoot
          .querySelector<HTMLElement>(".strata-bottom-sheet button")
          ?.focus(),
      );
    } else {
      this.restoreFocus();
    }
  }
  private restoreFocus() {
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }
  render() {
    return html`<section
      class="strata-bottom-sheet"
      @strata-close=${() => (this.open = false)}
      ?hidden=${!this.open}
      role="dialog"
      aria-modal="true"
      aria-label=${this.title || "Bottom sheet"}
    >
      <header>
        <strong>${this.title}</strong
        ><strata-close-button label="Close bottom sheet"></strata-close-button>
      </header>
      <slot></slot>
    </section>`;
  }
}
