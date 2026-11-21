import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

const ALERT_ICONS = {
  error: "carbon:error",
  warning: "carbon:warning-alt",
  success: "carbon:checkmark",
  info: "carbon:information",
} as const;

@customElement("strata-alert")
export class StrataAlert extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .strata-alert {
      display: flex;
      gap: 12px;
      padding: 12px 14px;
      border-left: var(--strata-border-large) solid currentColor;
      border-radius: var(--strata-radius-small);
      background: var(--strata-color-surface-raised);
      font: 400 14px/1.45 var(--strata-font-sans);
    }
    .strata-alert__icon {
      flex: 0 0 auto;
      font-size: 18px;
      line-height: 1.45;
    }
    .strata-alert__content {
      min-width: 0;
    }
    .strata-alert--error {
      color: var(--strata-color-status-error);
    }
    .strata-alert--warning {
      color: var(--strata-color-status-warning);
    }
    .strata-alert--success {
      color: var(--strata-color-status-success);
    }
    .strata-alert--info {
      color: var(--strata-color-text-primary);
    }
  `;
  @property({ reflect: true }) tone: "error" | "warning" | "success" | "info" =
    "info";
  render() {
    return html`<div
      class="strata-alert strata-alert--${this.tone}"
      role="status"
    >
      <iconify-icon
        class="strata-alert__icon"
        icon=${ALERT_ICONS[this.tone]}
        aria-hidden="true"
      ></iconify-icon>
      <div class="strata-alert__content"><slot></slot></div>
    </div>`;
  }
}
