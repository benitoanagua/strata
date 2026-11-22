import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { safeHref } from "../../utils/items.js";

/**
 * Quotation. `block` is an inline quote with a left filete; `pull` is an
 * editorial pull quote framed by double rules (the LaTeX divider).
 */
@customElement("strata-quote")
export class StrataQuote extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      figure {
        margin: 0;
        padding: 12px 0 12px 16px;
        border-left: var(--strata-border-medium) solid
          var(--strata-color-border-strong);
      }
      :host([variant="pull"]) figure {
        padding: 16px 0;
        border-left: 0;
        border-top-style: double;
        border-top-width: var(--strata-editorial-divider-double);
        border-bottom-style: double;
        border-bottom-width: var(--strata-editorial-divider-double);
        border-top-color: var(--strata-color-border-strong);
        border-bottom-color: var(--strata-color-border-strong);
        text-align: center;
      }
      blockquote {
        margin: 0;
        font: var(--strata-type-reading-large) var(--strata-font-serif);
        font-style: italic;
        color: var(--strata-color-text-primary);
      }
      :host([variant="pull"]) blockquote {
        font: var(--strata-type-headline-medium) var(--strata-font-serif);
        font-style: italic;
      }
      figcaption {
        margin-top: 8px;
        font: var(--strata-type-label-medium) var(--strata-font-sans);
        color: var(--strata-color-text-secondary);
      }
      cite {
        font-style: normal;
      }
      cite::before {
        content: "— ";
      }
      cite a {
        color: inherit;
      }
    `,
  ];
  @property({ type: String, reflect: true }) variant: "block" | "pull" =
    "block";
  /** Who said it. */
  @property({ type: String }) cite = "";
  /** Source URL (`<blockquote cite>`), also linked from the attribution. */
  @property({ type: String }) source = "";

  render() {
    const source = safeHref(this.source);
    return html`<figure>
      <blockquote cite=${source || undefined}><slot></slot></blockquote>
      ${
        this.cite
          ? html`<figcaption>
              <cite
                >${source ? html`<a href=${source}>${this.cite}</a>` : this.cite}</cite
              >
            </figcaption>`
          : ""
      }
    </figure>`;
  }
}
