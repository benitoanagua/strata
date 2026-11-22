import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";

/**
 * Section title with a hairline rule; the part of the rule above the title
 * is drawn heavier. `heading › subheading`, optional trailing slot.
 */
@customElement("strata-section-header")
export class StrataSectionHeader extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
        border-top: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
      }
      .title {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin: calc(-1 * var(--strata-border-medium)) 0 0;
        padding-top: 8px;
        border-top: var(--strata-border-medium) solid
          var(--strata-color-border-strong);
        font: var(--strata-type-title-medium) var(--strata-font-serif);
        color: var(--strata-color-text-primary);
      }
      .title__sub {
        color: var(--strata-color-text-secondary);
        font-weight: 400;
      }
      :host([size="small"]) .title {
        font: var(--strata-type-title-small) var(--strata-font-serif);
      }
      :host([size="large"]) .title,
      :host([size="hero"]) .title {
        font: var(--strata-type-headline-small) var(--strata-font-serif);
      }
      .aside {
        font: var(--strata-type-label-medium) var(--strata-font-sans);
        color: var(--strata-color-text-secondary);
      }
      iconify-icon {
        color: var(--strata-color-text-secondary);
      }
    `,
  ];
  @property({ type: String }) heading = "";
  @property({ type: String }) subheading = "";
  /** ARIA heading level (2–6). */
  @property({ type: Number }) level = 2;

  render() {
    const level = Math.min(6, Math.max(2, Number(this.level) || 2));
    return html`<header>
      <div class="title" role="heading" aria-level=${level}>
        <span>${this.heading}</span>
        ${
          this.subheading
            ? html`<iconify-icon
                  icon="carbon:chevron-right"
                  aria-hidden="true"
                ></iconify-icon>
                <span class="title__sub">${this.subheading}</span>`
            : ""
        }
      </div>
      <div class="aside"><slot></slot></div>
    </header>`;
  }
}
