import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../Avatar/Avatar.js";
import "../Meta/Meta.js";
import { safeHref } from "../../utils/items.js";

/**
 * Author / contributor card: avatar, name, role line, bio and an optional
 * `links` slot (share, social, "ver todas sus ediciones"…).
 */
@customElement("strata-author-box")
export class StrataAuthorBox extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: block;
      }
      article {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px 16px;
        padding: 16px 0;
        border-top: var(--strata-border-medium) solid
          var(--strata-color-border-subtle);
        border-bottom: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
      }
      strata-avatar {
        grid-row: span 3;
      }
      .name {
        margin: 0;
        font: var(--strata-type-title-large) var(--strata-font-serif);
      }
      .name a {
        color: inherit;
        text-decoration: none;
      }
      .name a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .bio {
        margin: 4px 0 0;
        font: var(--strata-type-reading-small) var(--strata-font-serif);
        color: var(--strata-color-text-secondary);
      }
      .links {
        margin-top: 8px;
      }
      @media (max-width: 480px) {
        article {
          grid-template-columns: 1fr;
        }
        strata-avatar {
          grid-row: auto;
        }
      }
    `,
  ];
  @property({ type: String }) name = "";
  @property({ type: String }) avatar = "";
  @property({ type: String }) description = "";
  /** Pipe-separated role line: `Editora|Desde 2021|128 artículos`. */
  @property({ type: String }) meta = "";
  @property({ type: String }) href = "";
  @property({ type: String }) eyebrow = "Autor";

  render() {
    const href = safeHref(this.href);
    return html`<article aria-label=${`${this.eyebrow}: ${this.name}`}>
      <strata-avatar
        .label=${this.name}
        .src=${this.avatar}
        .alt=${this.name}
      ></strata-avatar>
      <h3 class="name">
        ${href ? html`<a href=${href}>${this.name}</a>` : this.name}
      </h3>
      ${
        this.meta
          ? html`<strata-meta label="Perfil" .items=${this.meta}></strata-meta>`
          : ""
      }
      <div>
        ${this.description ? html`<p class="bio">${this.description}</p>` : ""}
        <div class="bio"><slot></slot></div>
        <div class="links"><slot name="links"></slot></div>
      </div>
    </article>`;
  }
}
