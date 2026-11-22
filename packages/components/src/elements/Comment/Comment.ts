import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../Avatar/Avatar.js";
import "../Tag/Tag.js";
import { emitValueEvent } from "../../events.js";
import { safeHref } from "../../utils/items.js";

/**
 * One comment / talk-page message. The default slot holds the body (plain
 * paragraphs or `<strata-prose>`); nest further `<strata-comment slot="replies">`
 * elements for threading. Nesting is drawn with a filete, never with boxes.
 */
@customElement("strata-comment")
export class StrataComment extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      article {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px 12px;
      }
      header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 2px 10px;
      }
      .author {
        font: var(--strata-type-title-small) var(--strata-font-sans);
        font-weight: 700;
      }
      time,
      .permalink {
        color: var(--strata-color-text-secondary);
        font: var(--strata-type-label-medium) var(--strata-font-mono);
      }
      .permalink {
        text-decoration: none;
      }
      .permalink:hover {
        text-decoration: underline;
      }
      .body {
        font: var(--strata-type-reading-small) var(--strata-font-serif);
        color: var(--strata-color-text-primary);
      }
      .actions {
        display: flex;
        gap: 12px;
        margin-top: 4px;
      }
      button {
        border: 0;
        padding: 2px 0;
        background: transparent;
        color: var(--strata-color-text-secondary);
        font: var(--strata-type-label-medium) var(--strata-font-sans);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      button:hover {
        color: var(--strata-color-text-primary);
      }
      button:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      .replies {
        grid-column: 2;
        margin-top: 12px;
        padding-left: 16px;
        border-left: var(--strata-border-medium) solid
          var(--strata-color-border-subtle);
        display: grid;
        gap: 16px;
      }
      .replies[hidden] {
        display: none;
      }
      @media (max-width: 480px) {
        .replies {
          padding-left: 8px;
        }
      }
    `,
  ];
  @property({ type: String }) author = "";
  @property({ type: String }) avatar = "";
  @property({ type: String }) date = "";
  /** Machine-readable date for `<time datetime>`. */
  @property({ type: String, attribute: "date-time" }) dateTime = "";
  @property({ type: String }) href = "";
  /** Optional role badge ("Autor", "Moderador"). */
  @property({ type: String }) role = "";
  @property({ type: String, attribute: "reply-label" }) replyLabel = "Reply";
  @property({ type: Boolean }) replyable = true;
  @state() private hasReplies = false;

  private onRepliesChange(event: Event) {
    this.hasReplies =
      (event.target as HTMLSlotElement).assignedElements().length > 0;
  }

  private reply() {
    emitValueEvent(this, "strata-change", {
      action: "reply",
      author: this.author,
    });
    this.dispatchEvent(
      new CustomEvent("strata-reply", {
        bubbles: true,
        composed: true,
        detail: { author: this.author },
      }),
    );
  }

  render() {
    const permalink = safeHref(this.href);
    return html`<article
      aria-label=${this.author ? `Comment by ${this.author}` : "Comment"}
    >
      <strata-avatar
        .label=${this.author}
        .src=${this.avatar}
        .alt=${this.author}
      ></strata-avatar>
      <div>
        <header>
          <span class="author">${this.author}</span>
          ${
            this.role
              ? html`<strata-tag
                  size="small"
                  label=${this.role}
                  hue="auto"
                ></strata-tag>`
              : ""
          }
          ${
            this.date
              ? permalink
                ? html`<a class="permalink" href=${permalink}
                    ><time datetime=${this.dateTime || this.date}
                      >${this.date}</time
                    ></a
                  >`
                : html`<time datetime=${this.dateTime || this.date}
                    >${this.date}</time
                  >`
              : ""
          }
        </header>
        <div class="body"><slot></slot></div>
        ${
          this.replyable
            ? html`<div class="actions">
                <button type="button" @click=${this.reply}>
                  ${this.replyLabel}
                </button>
              </div>`
            : ""
        }
      </div>
      <div class="replies" ?hidden=${!this.hasReplies}>
        <slot name="replies" @slotchange=${this.onRepliesChange}></slot>
      </div>
    </article>`;
  }
}
