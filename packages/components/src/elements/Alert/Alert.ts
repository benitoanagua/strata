import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

const ALERT_ICONS = {
  error: "carbon:error",
  warning: "carbon:warning-alt",
  success: "carbon:checkmark",
  info: "carbon:information",
} as const;

type AlertTone = keyof typeof ALERT_ICONS;
type AlertMode = "inline" | "snackbar";
type AlertPlacement =
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

/** One feedback component for persistent inline alerts and transient notifications. */
@customElement("strata-alert")
export class StrataAlert extends StrataElement {
  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }
    :host([mode="snackbar"]) {
      position: fixed;
      z-index: 1000;
      width: min(480px, calc(100vw - 32px));
      max-width: calc(100vw - 32px);
      pointer-events: none;
    }
    :host([mode="snackbar"]:not([open])) {
      display: none;
    }
    :host([mode="snackbar"][placement^="top"]) {
      top: 16px;
    }
    :host([mode="snackbar"][placement^="bottom"]) {
      bottom: 16px;
    }
    :host([mode="snackbar"][placement$="start"]) {
      left: 16px;
    }
    :host([mode="snackbar"][placement$="end"]) {
      right: 16px;
    }
    :host([mode="snackbar"][placement$="center"]) {
      left: 50%;
      transform: translateX(-50%);
    }
    .strata-alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid var(--strata-color-border-subtle);
      border-left: var(--strata-border-large) solid currentColor;
      border-radius: var(--strata-radius-small);
      background: var(--strata-color-surface-raised);
      color: var(--strata-color-text-primary);
      font: var(--strata-type-reading-body) var(--strata-font-serif);
    }
    :host([mode="snackbar"]) .strata-alert {
      align-items: center;
      padding: 12px 16px;
      background: var(--strata-color-surface-raised);
      pointer-events: auto;
    }
    .strata-alert__icon {
      flex: 0 0 auto;
      font-size: 18px;
      line-height: 1.45;
    }
    .strata-alert__content {
      min-width: 0;
      flex: 1;
    }
    .strata-alert__message {
      overflow-wrap: anywhere;
    }
    .strata-alert--error {
      color: var(--strata-color-status-error);
      background: color-mix(in srgb, var(--strata-color-status-error) 8%, var(--strata-color-surface-raised));
    }
    .strata-alert--warning {
      color: var(--strata-color-status-warning);
      background: color-mix(in srgb, var(--strata-color-status-warning) 9%, var(--strata-color-surface-raised));
    }
    .strata-alert--success {
      color: var(--strata-color-status-success);
      background: color-mix(in srgb, var(--strata-color-status-success) 9%, var(--strata-color-surface-raised));
    }
    .strata-alert--info {
      color: var(--strata-color-text-primary);
      background: var(--strata-color-surface-subtle);
    }
    .strata-alert__close {
      display: inline-grid;
      place-items: center;
      flex: 0 0 auto;
      width: 28px;
      height: 28px;
      margin: -2px -4px -2px 0;
      border: 0;
      border-radius: var(--strata-radius-small);
      background: transparent;
      color: inherit;
    }
    .strata-alert__close:hover {
      background: var(--strata-color-surface-hover);
    }
    .strata-alert__close:focus-visible {
      outline: 2px solid var(--strata-color-focus-ring);
      outline-offset: 2px;
    }
    .strata-alert__close iconify-icon {
      font-size: 16px;
    }
  `;

  @property({ reflect: true }) tone: AlertTone = "info";
  @property({ type: String, reflect: true }) mode: AlertMode = "inline";
  @property({ type: Boolean, reflect: true }) open = true;
  @property({ type: String }) message = "";
  @property({ type: Boolean, reflect: true }) closable = false;
  @property({ type: Number }) duration = 3000;
  @property({ type: String, reflect: true }) placement: AlertPlacement = "bottom-center";

  private dismissTimer?: ReturnType<typeof setTimeout>;

  protected updated(changed: Map<string, unknown>) {
    if (!changed.has("open") && !changed.has("mode") && !changed.has("duration")) return;
    this.clearDismissTimer();
    if (this.open && this.mode === "snackbar" && this.duration > 0) {
      this.dismissTimer = setTimeout(() => this.dismiss("timeout"), this.duration);
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

  private dismiss(reason: "manual" | "timeout") {
    if (!this.open) return;
    this.clearDismissTimer();
    this.open = false;
    this.dispatchEvent(new CustomEvent("strata-dismiss", {
      bubbles: true,
      composed: true,
      detail: { reason },
    }));
  }

  render() {
    const icon = ALERT_ICONS[this.tone] ?? ALERT_ICONS.info;
    return html`<div
      class="strata-alert strata-alert--${this.tone} strata-alert--${this.mode}"
      role="status"
      aria-live=${this.tone === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      ?hidden=${!this.open}
    >
      <iconify-icon class="strata-alert__icon" icon=${icon} aria-hidden="true"></iconify-icon>
      <div class="strata-alert__content">
        ${this.message ? html`<span class="strata-alert__message">${this.message}</span>` : ""}
        <slot></slot>
      </div>
      ${this.closable ? html`<button class="strata-alert__close" type="button" aria-label="Dismiss alert" @click=${() => this.dismiss("manual")}>
        <iconify-icon icon="carbon:close" aria-hidden="true"></iconify-icon>
      </button>` : ""}
    </div>`;
  }
}
