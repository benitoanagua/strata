import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../SectionHeader/SectionHeader.js";

/** Titled region for a list of `<strata-comment>`; `form` slot for composing. */
@customElement("strata-comment-thread")
export class StrataCommentThread extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      section {
        display: grid;
        gap: 20px;
      }
      .list {
        display: grid;
        gap: 24px;
      }
      .count {
        font: var(--strata-type-numeric-small) var(--strata-font-mono);
        font-variant-numeric: tabular-nums;
      }
    `,
  ];
  @property({ type: String }) heading = "Comments";
  @property({ type: Number }) count = 0;

  render() {
    return html`<section aria-label=${this.heading}>
      <strata-section-header heading=${this.heading} size="small">
        ${this.count > 0 ? html`<span class="count">${this.count}</span>` : ""}
      </strata-section-header>
      <div class="list"><slot></slot></div>
      <div><slot name="form"></slot></div>
    </section>`;
  }
}
