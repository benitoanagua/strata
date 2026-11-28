import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../Badge/Badge.js";
import "../Meta/Meta.js";
import { parseItems, safeHref } from "../../utils/items.js";

/**
 * Listing row for articles, search results, category pages and recent
 * changes. Lighter than `strata-card`: no frame, only a bottom filete.
 */
@customElement("strata-entry")
export class StrataEntry extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      article {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 16px 0;
        border-bottom: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
      }
      :host([layout="inline"]) article {
        grid-template-columns: minmax(96px, 30%) 1fr;
        align-items: start;
      }
      :host([layout="inline"][media-end]) article {
        grid-template-columns: 1fr minmax(96px, 30%);
      }
      :host([layout="inline"][media-end]) .media {
        order: 2;
      }
      .media img {
        display: block;
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: var(--strata-radius-small);
      }
      .body {
        display: grid;
        gap: 6px;
        min-width: 0;
      }
      h3 {
        margin: 0;
        font: var(--strata-type-title-large) var(--strata-font-serif);
      }
      h3 a {
        color: inherit;
        text-decoration: none;
      }
      h3 a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      h3 a:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      .excerpt {
        margin: 0;
        font: var(--strata-type-reading-small) var(--strata-font-serif);
        color: var(--strata-color-text-secondary);
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 6px;
      }
    `,
  ];
  @property({ type: String }) heading = "";
  @property({ type: String }) href = "";
  @property({ type: String }) excerpt = "";
  @property({ type: String }) category = "";
  @property({ type: String }) author = "";
  @property({ type: String }) date = "";
  @property({ type: String }) meta = "";
  @property({ type: String }) tags = "";
  @property({ type: String }) image = "";
  @property({ type: String, attribute: "image-alt" }) imageAlt = "";
  @property({ type: String, reflect: true }) layout: "inline" | "stacked" =
    "stacked";
  @property({ type: Boolean, reflect: true, attribute: "media-end" })
  mediaEnd = false;

  render() {
    const href = safeHref(this.href);
    const src = safeHref(this.image);
    const metaItems = [this.date, this.author, ...this.meta.split("|")]
      .map((s) => s.trim())
      .filter(Boolean);
    const tagItems = parseItems(this.tags);
    return html`<article>
      ${
        src
          ? html`<div class="media">
              <img src=${src} alt=${this.imageAlt} loading="lazy" />
            </div>`
          : ""
      }
      <div class="body">
        ${
          this.category
            ? html`<div class="kicker">
                <strata-badge label=${this.category} hue="auto"></strata-badge>
              </div>`
            : ""
        }
        <h3>
          ${href ? html`<a href=${href}>${this.heading}</a>` : this.heading}
        </h3>
        ${this.excerpt ? html`<p class="excerpt">${this.excerpt}</p>` : ""}
        ${
          metaItems.length
            ? html`<strata-meta
                label="Details"
                .items=${metaItems}
              ></strata-meta>`
            : ""
        }
        ${
          tagItems.length
            ? html`<div class="tags" role="group" aria-label="Tags">
                ${tagItems.map((item) => html`<strata-badge label=${item.label} hue="auto" href=${item.href || ""}></strata-badge>`)}
              </div>`
            : ""
        }
        <slot></slot>
      </div>
    </article>`;
  }
}
