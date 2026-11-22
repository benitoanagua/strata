import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { emitValueEvent } from "../../events.js";
import {
  onScrollFrame,
  prefersReducedMotion,
  resolveTarget,
} from "../../utils/headings.js";

/**
 * "Back to top". `floating` appears after `threshold` px of scrolling;
 * `inline` is always shown (article footer). After scrolling, focus moves to
 * `target` (or the first <h1>) so keyboard users restart at the top.
 */
@customElement("strata-back-to-top")
export class StrataBackToTop extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host([variant="floating"]) {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 40;
      }
      :host([variant="inline"]) {
        display: inline-block;
      }
      button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 44px;
        min-height: 44px;
        padding: 0 12px;
        justify-content: center;
        border: var(--strata-border-medium) solid
          var(--strata-color-border-strong);
        border-radius: var(--strata-radius-small);
        background: var(--strata-color-surface-page);
        color: var(--strata-color-text-primary);
        font: var(--strata-type-label-large) var(--strata-font-sans);
      }
      button:hover {
        background: var(--strata-color-action-primary);
        color: var(--strata-color-surface-page);
      }
      button:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      button[hidden] {
        display: none;
      }
    `,
  ];
  @property({ type: String }) label = "Back to top";
  @property({ type: Number }) threshold = 400;
  @property({ type: String, reflect: true }) variant: "floating" | "inline" =
    "floating";
  @property({ type: Boolean, attribute: "show-label" }) showLabel = false;
  /** Selector of the element that receives focus after scrolling. */
  @property({ type: String }) target = "";
  @state() private scrolled = false;
  private stop?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.stop = onScrollFrame(() => this.check());
    queueMicrotask(() => this.check());
  }

  disconnectedCallback() {
    this.stop?.();
    super.disconnectedCallback();
  }

  private check() {
    this.scrolled = window.scrollY > this.threshold;
  }

  private go() {
    window.scrollTo?.({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    const dest =
      resolveTarget(this, this.target) ??
      document.querySelector<HTMLElement>("h1");
    if (dest) {
      if (!dest.hasAttribute("tabindex")) dest.setAttribute("tabindex", "-1");
      dest.focus({ preventScroll: true });
    }
    emitValueEvent(this, "strata-change", { action: "top" });
  }

  render() {
    const visible = this.variant === "inline" || this.scrolled;
    return html`<button
      type="button"
      aria-label=${this.label}
      ?hidden=${!visible}
      @click=${this.go}
    >
      <iconify-icon icon="carbon:arrow-up" aria-hidden="true"></iconify-icon>
      ${this.showLabel ? html`<span>${this.label}</span>` : nothing}
    </button>`;
  }
}
