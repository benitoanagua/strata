import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { resolveHue, tagHueStyles, type TagHueInput } from "../../utils/hue.js";
import { safeHref } from "../../utils/items.js";

export type StrataBadgeTone =
  "neutral" | "error" | "warning" | "success" | "info";

const TONE_ICONS = {
  error: "carbon:error",
  warning: "carbon:warning-alt",
  success: "carbon:checkmark",
  info: "carbon:information",
} as const;

/**
 * Unified compact label for status and content categories.
 * Use tone for semantic status, hue for taxonomy, and optionally href/removable.
 */
@customElement("strata-badge")
export class StrataBadge extends StrataElement {
  static styles = [
    strataComponentStyles,
    tagHueStyles,
    css`
      :host { display: inline-block; }
      .strata-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font: var(--strata-type-label-small) var(--strata-font-mono);
        font-weight: 500;
        padding: 3px 6px;
        border-radius: var(--strata-radius-micro);
        border: var(--strata-border-small) solid transparent;
        background: var(--_tint, var(--strata-color-surface-subtle));
        color: var(--_ink, var(--strata-color-text-primary));
      }
      .strata-badge[data-hue]:not([data-hue="neutral"]) {
        border-color: color-mix(in srgb, var(--_ink) 40%, transparent);
      }
      .strata-badge--error {
        background: color-mix(in srgb, var(--strata-color-status-error) 14%, transparent);
        color: var(--strata-color-status-error);
      }
      .strata-badge--warning {
        background: color-mix(in srgb, var(--strata-color-status-warning) 16%, transparent);
        color: var(--strata-color-status-warning);
      }
      .strata-badge--success {
        background: color-mix(in srgb, var(--strata-color-status-success) 14%, transparent);
        color: var(--strata-color-status-success);
      }
      .strata-badge--info {
        background: var(--strata-color-surface-subtle);
        color: var(--strata-color-text-primary);
      }
      a.strata-badge { text-decoration: none; }
      a.strata-badge:hover { text-decoration: underline; text-underline-offset: 3px; }
      a.strata-badge:focus-visible,
      .strata-badge button:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 1px;
      }
      .strata-badge iconify-icon { font-size: 0.9em; }
      .strata-badge--interactive { cursor: pointer; text-transform: uppercase; letter-spacing: 0.03em; }
      .strata-badge--interactive[aria-pressed="true"] {
        background: var(--_ink, var(--strata-color-action-primary));
        border-color: var(--_ink, var(--strata-color-action-primary));
        color: var(--strata-color-surface-page);
        font-weight: 700;
      }
      .strata-badge--interactive:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      .strata-badge button {
        display: inline-flex;
        align-items: center;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }
    `,
  ];

  @property({ reflect: true }) tone: StrataBadgeTone = "neutral";
  @property({ type: String }) label = "";
  @property({ type: String }) hue: TagHueInput = "neutral";
  @property({ type: String }) href = "";
  @property({ type: Boolean }) removable = false;
  /** Render as an accessible pressed-state control (e.g. a filter chip). */
  @property({ type: Boolean }) interactive = false;
  @property({ type: Boolean }) pressed = false;

  private content() {
    const icon = TONE_ICONS[this.tone as keyof typeof TONE_ICONS];
    return html`${icon ? html`<iconify-icon icon=${icon} aria-hidden="true"></iconify-icon>` : ""}
      ${this.label || html`<slot></slot>`}
      ${this.removable ? html`<button type="button" aria-label="Remove" @click=${() => this.dispatchEvent(new CustomEvent("remove", { bubbles: true, composed: true }))}>
        <iconify-icon icon="carbon:close" aria-hidden="true"></iconify-icon>
      </button>` : ""}`;
  }

  render() {
    const hue = resolveHue(this.hue, this.label || this.textContent || "");
    const href = safeHref(this.href);
    const classes = `strata-badge strata-badge--${this.tone} strata-hue--${hue}`;
    const role = this.tone === "neutral" ? nothing : "status";
    if (this.interactive) {
      return html`<button type="button" class="${classes} strata-badge--interactive" data-hue=${hue} aria-pressed=${String(this.pressed)}>${this.content()}</button>`;
    }
    if (href && !this.removable) {
      return html`<a class=${classes} data-hue=${hue} href=${href} role=${role}>${this.content()}</a>`;
    }
    return html`<span class=${classes} data-hue=${hue} role=${role}>${this.content()}</span>`;
  }
}
