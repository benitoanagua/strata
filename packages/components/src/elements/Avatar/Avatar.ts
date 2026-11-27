import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

@customElement("strata-avatar")
export class StrataAvatar extends StrataElement {
  @property({ type: String }) label = "";
  @property({ type: String }) src = "";
  @property({ type: String }) alt = "";
  @property({ type: String, reflect: true }) variant: "initials" | "photo" = "initials";
  render() {
    return html`<div
      class="strata-avatar"
      role=${this.alt || this.label ? "img" : "presentation"}
      aria-label=${this.alt || this.label || undefined}
    >
      ${this.variant === "photo" && this.src ? html`<img src=${this.src} alt="" />` : html`<span>${this.label.trim().split(/\\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "?"}</span>`}
    </div>`;
  }
}
