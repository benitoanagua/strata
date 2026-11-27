import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export type StrataBadgeTone =
  "neutral" | "error" | "warning" | "success" | "info";

const TONE_ICONS = {
  error: "carbon:error",
  warning: "carbon:warning-alt",
  success: "carbon:checkmark",
  info: "carbon:information",
} as const;

@customElement("strata-badge")
export class StrataBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .strata-badge {
      font: var(--strata-type-label-medium) var(--strata-font-mono);
      font-weight: 600;
      padding: 4px 7px;
      border-radius: var(--strata-radius-small);
      border: 0;
    }
    .strata-badge--neutral,
    .strata-badge--info {
      background: var(--strata-color-surface-subtle);
      color: var(--strata-color-text-primary);
    }
    .strata-badge--error {
      background: color-mix(
        in srgb,
        var(--strata-color-status-error) 14%,
        transparent
      );
      color: var(--strata-color-status-error);
    }
    .strata-badge--warning {
      background: color-mix(
        in srgb,
        var(--strata-color-status-warning) 16%,
        transparent
      );
      color: var(--strata-color-status-warning);
    }
    .strata-badge--success {
      background: color-mix(
        in srgb,
        var(--strata-color-status-success) 14%,
        transparent
      );
      color: var(--strata-color-status-success);
    }
    .strata-badge iconify-icon {
      font-size: 0.9em;
    }
  `;
  @property({ reflect: true }) tone: StrataBadgeTone = "neutral";
  render() {
    const icon = TONE_ICONS[this.tone as keyof typeof TONE_ICONS];
    return html`<span class="strata-badge strata-badge--${this.tone}">
      ${
        icon
          ? html`<iconify-icon icon=${icon} aria-hidden="true"></iconify-icon>`
          : ""
      }<slot></slot>
    </span>`;
  }
}
