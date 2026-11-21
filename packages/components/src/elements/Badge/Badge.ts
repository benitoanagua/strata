import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export type StrataBadgeTone =
  "neutral" | "error" | "warning" | "success" | "info";

@customElement("strata-badge")
export class StrataBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .strata-badge {
      font: 600 12px/1 var(--strata-font-mono);
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
  `;
  @property({ reflect: true }) tone: StrataBadgeTone = "neutral";
  render() {
    return html`<span class="strata-badge strata-badge--${this.tone}"
      ><slot></slot
    ></span>`;
  }
}
