import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

/**
 * Brief, non-blocking feedback after an action (for example, "Item saved").
 * Set duration to 0 to keep it open until the host closes it.
 */
@customElement("strata-snackbar")
export class StrataSnackbar extends StrataElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) message = "";
  @property({ type: Number }) duration = 3000;
  private dismissTimer?: ReturnType<typeof setTimeout>;

  protected updated(changed: Map<string, unknown>) {
    if (!changed.has("open") && !changed.has("duration")) return;
    this.clearDismissTimer();
    if (this.open && this.duration > 0) {
      this.dismissTimer = setTimeout(() => {
        this.open = false;
        this.dispatchEvent(
          new CustomEvent("strata-dismiss", {
            bubbles: true,
            composed: true,
          }),
        );
      }, this.duration);
    }
  }

  disconnectedCallback() {
    this.clearDismissTimer();
    super.disconnectedCallback();
  }

  private clearDismissTimer() {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    this.dismissTimer = undefined;
  }

  render() {
    return html`<div
      class="strata-snackbar"
      ?hidden=${!this.open}
      role="status"
      aria-live="polite"
    >
      <span>${this.message}</span><slot></slot>
    </div>`;
  }
}
