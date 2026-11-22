import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { safeHref } from "../../utils/items.js";

/** Previous / next links at the end of an article or series. */
@customElement("strata-article-nav")
export class StrataArticleNav extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      nav {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        padding-top: 12px;
        border-top: var(--strata-border-medium) solid
          var(--strata-color-border-strong);
      }
      a {
        display: grid;
        gap: 2px;
        padding: 8px;
        border-radius: var(--strata-radius-small);
        color: var(--strata-color-text-primary);
        text-decoration: none;
      }
      a:hover {
        background: var(--strata-color-surface-hover);
      }
      a:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 1px;
      }
      .next {
        grid-column: 2;
        text-align: right;
      }
      .dir {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--strata-color-text-secondary);
        font: var(--strata-type-label-medium) var(--strata-font-sans);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .next .dir {
        justify-content: flex-end;
      }
      .title {
        font: var(--strata-type-title-medium) var(--strata-font-serif);
      }
      @media (max-width: 480px) {
        nav {
          grid-template-columns: 1fr;
        }
        .next {
          grid-column: 1;
        }
      }
    `,
  ];
  @property({ type: String }) label = "Article navigation";
  @property({ type: String }) prev = "";
  @property({ type: String, attribute: "prev-href" }) prevHref = "";
  @property({ type: String, attribute: "prev-label" }) prevLabel = "Previous";
  @property({ type: String }) next = "";
  @property({ type: String, attribute: "next-href" }) nextHref = "";
  @property({ type: String, attribute: "next-label" }) nextLabel = "Next";

  render() {
    const prev = safeHref(this.prevHref);
    const next = safeHref(this.nextHref);
    return html`<nav aria-label=${this.label}>
      ${
        this.prev && prev
          ? html`<a class="prev" href=${prev} rel="prev">
              <span class="dir"
                ><iconify-icon
                  icon="carbon:arrow-left"
                  aria-hidden="true"
                ></iconify-icon
                >${this.prevLabel}</span
              >
              <span class="title">${this.prev}</span>
            </a>`
          : ""
      }
      ${
        this.next && next
          ? html`<a class="next" href=${next} rel="next">
              <span class="dir"
                >${this.nextLabel}<iconify-icon
                  icon="carbon:arrow-right"
                  aria-hidden="true"
                ></iconify-icon
              ></span>
              <span class="title">${this.next}</span>
            </a>`
          : ""
      }
    </nav>`;
  }
}
