import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../Badge/Badge.js";
import "../Meta/Meta.js";
import { safeHref } from "../../utils/items.js";

/**
 * Article / wiki-page header: kicker (category), headline, deck, byline
 * meta, share slot and an optional lead figure with caption.
 */
@customElement("strata-article-header")
export class StrataArticleHeader extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      header {
        display: grid;
        gap: 12px;
        max-width: 70ch;
      }
      h1 {
        margin: 0;
        font: var(--strata-type-headline-large) var(--strata-font-serif);
        letter-spacing: var(--strata-type-headline-large-tracking);
      }
      .deck {
        margin: 0;
        font: var(--strata-type-reading-large) var(--strata-font-serif);
        font-style: italic;
        color: var(--strata-color-text-secondary);
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
        padding: 8px 0;
        border-top: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
        border-bottom: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
      }
      figure {
        margin: 8px 0 0;
        max-width: none;
      }
      img {
        display: block;
        width: 100%;
        max-height: 60vh;
        object-fit: cover;
        border-radius: var(--strata-radius-small);
      }
      figcaption {
        margin-top: 6px;
        color: var(--strata-color-text-secondary);
        font: var(--strata-type-reading-small) var(--strata-font-serif);
      }
    `,
  ];
  @property({ type: String }) heading = "";
  @property({ type: String }) deck = "";
  @property({ type: String }) category = "";
  @property({ type: String }) author = "";
  @property({ type: String }) date = "";
  /** Extra meta entries, pipe-separated (`Actualizado hoy|5 min`). */
  @property({ type: String }) meta = "";
  @property({ type: String }) image = "";
  @property({ type: String, attribute: "image-alt" }) imageAlt = "";
  @property({ type: String }) caption = "";

  render() {
    const metaItems = [this.date, this.author, ...this.meta.split("|")]
      .map((s) => s.trim())
      .filter(Boolean);
    const src = safeHref(this.image);
    return html`<header>
      ${
        this.category
          ? html`<div>
              <strata-badge label=${this.category} hue="auto"></strata-badge>
            </div>`
          : ""
      }
      <h1>${this.heading}</h1>
      ${this.deck ? html`<p class="deck">${this.deck}</p>` : ""}
      <div class="bar">
        <strata-meta label="Article details" .items=${metaItems}></strata-meta>
        <slot name="share"></slot>
      </div>
      ${
        src
          ? html`<figure>
              <img src=${src} alt=${this.imageAlt} loading="lazy" />
              ${this.caption ? html`<figcaption>${this.caption}</figcaption>` : ""}
            </figure>`
          : ""
      }
    </header>`;
  }
}
