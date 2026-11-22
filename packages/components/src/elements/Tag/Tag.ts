import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { resolveHue, tagHueStyles, type TagHueInput } from "../../utils/hue.js";
import { safeHref } from "../../utils/items.js";

/**
 * Label / category chip. `hue` colours it from the taxonomy rainbow
 * (`neutral` by default; `auto` derives a stable hue from the label).
 * The label text is always rendered, so hue is never the only cue.
 */
@customElement("strata-tag")
export class StrataTag extends StrataElement {
  static styles = [
    strataComponentStyles,
    tagHueStyles,
    css`
      :host {
        display: inline-block;
      }
      .strata-tag {
        border: var(--strata-border-medium) solid transparent;
        background: var(--_tint, var(--strata-color-surface-subtle));
        color: var(--_ink, var(--strata-color-text-primary));
      }
      .strata-tag[data-hue]:not([data-hue="neutral"]) {
        border-color: color-mix(in srgb, var(--_ink) 40%, transparent);
      }
      a.strata-tag {
        text-decoration: none;
      }
      a.strata-tag:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      a.strata-tag:focus-visible,
      .strata-tag button:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 1px;
      }
    `,
  ];
  @property({ type: String }) label = "";
  @property({ type: Boolean }) removable = false;
  @property({ type: String }) hue: TagHueInput = "neutral";
  @property({ type: String }) href = "";

  render() {
    const hue = resolveHue(this.hue, this.label || this.textContent || "");
    const href = safeHref(this.href);
    const content = this.label || html`<slot></slot>`;
    if (href && !this.removable)
      return html`<a
        class="strata-tag strata-hue--${hue}"
        data-hue=${hue}
        href=${href}
        >${content}</a
      >`;
    return html`<span class="strata-tag strata-hue--${hue}" data-hue=${hue}
      >${content}${
        this.removable
          ? html`<button
              aria-label="Remove"
              @click=${() => this.dispatchEvent(new CustomEvent("remove"))}
            >
              <iconify-icon icon="carbon:close"></iconify-icon>
            </button>`
          : ""
      }</span
    >`;
  }
}
