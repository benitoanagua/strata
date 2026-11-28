import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";

/**
 * Floating content associated with an optional trigger. Opens by click or
 * hover/focus, and can also be controlled through the `open` property.
 */
@customElement("strata-popover")
export class StrataPopover extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: inline-block;
      }
      .strata-popover-anchor {
        position: relative;
        display: inline-block;
      }
      .strata-popover {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        z-index: 80;
        min-width: 220px;
        max-width: min(360px, 90vw);
        border: 1px solid var(--strata-color-border-subtle);
        border-radius: var(--strata-radius-medium);
        background: var(--strata-color-surface-raised);
      }
      .strata-popover[hidden] {
        display: none;
      }
      .strata-popover__header { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; border-bottom:1px solid var(--strata-color-border-subtle); }
      .strata-popover__body { padding:12px; }
      .strata-popover__trigger {
        min-height: 36px;
        padding: 7px 12px;
        border: 1px solid var(--strata-color-border-subtle);
        border-radius: var(--strata-radius-small);
        background: var(--strata-color-surface-page);
        color: var(--strata-color-text-primary);
        font: var(--strata-type-label-medium) var(--strata-font-sans);
      }
      .strata-popover__trigger:hover {
        background: var(--strata-color-surface-hover);
      }
      .strata-popover__trigger:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) open = false;
  private hoverCloseTimer: ReturnType<typeof setTimeout> | undefined;
  @property({ type: String }) label = "Popover";
  @property({ type: String }) trigger: "click" | "hover" = "click";
  @property({ type: String, attribute: "trigger-label" }) triggerLabel =
    "Open popover";
  @property({ type: Boolean, attribute: "close-on-outside" }) closeOnOutside =
    true;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.handleOutside, true);
  }

  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.handleOutside, true);
    if (this.hoverCloseTimer) clearTimeout(this.hoverCloseTimer);
    super.disconnectedCallback();
  }

  private toggle = () => {
    this.open = !this.open;
  };

  private handleOutside = (event: Event) => {
    if (!this.open || !this.closeOnOutside) return;
    if (!event.composedPath().includes(this)) this.open = false;
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !this.open) return;
    this.open = false;
    this.renderRoot
      .querySelector<HTMLElement>(".strata-popover__trigger")
      ?.focus();
  };

  private openOnHover = () => {
    if (this.trigger !== "hover") return;
    if (this.hoverCloseTimer) clearTimeout(this.hoverCloseTimer);
    this.open = true;
  };
  private closeOnHover = () => {
    if (this.trigger !== "hover") return;
    if (this.hoverCloseTimer) clearTimeout(this.hoverCloseTimer);
    this.hoverCloseTimer = setTimeout(() => { this.open = false; }, 140);
  };

  render() {
    return html`<div
      class="strata-popover-anchor"
      @keydown=${this.handleKeydown}
      @click=${this.trigger === "click" ? this.toggle : undefined}
      @mouseenter=${this.openOnHover}
      @mouseleave=${this.closeOnHover}
      @focusin=${this.openOnHover}
      @focusout=${this.closeOnHover}
    >
      <slot name="trigger">
        <button
          class="strata-popover__trigger"
          type="button"
          aria-haspopup="dialog"
          aria-expanded=${this.open}
        >
          ${this.triggerLabel}
        </button>
      </slot>
      <div
        class="strata-popover"
        role="dialog"
        aria-label=${this.label}
        @click=${(event: Event) => event.stopPropagation()}
        @strata-close=${() => (this.open = false)}
        @mouseenter=${this.openOnHover}
        @mouseleave=${this.closeOnHover}
        @focusin=${this.openOnHover}
        @focusout=${this.closeOnHover}
        ?hidden=${!this.open}
      >
        <header class="strata-popover__header"><strong>${this.label}</strong><strata-close-button label="Close popover"></strata-close-button></header>
        <div class="strata-popover__body"><slot></slot></div>
      </div>
    </div>`;
  }
}
