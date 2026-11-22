import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../SectionHeader/SectionHeader.js";
import { parseItems, safeHref } from "../../utils/items.js";

export interface StrataIndexGroup {
  heading: string;
  items: Array<string | { label: string; href?: string }>;
}

/**
 * Grouped index of links: site map, category index, alphabetical wiki index.
 * `groups` is a JSON array of `{ heading, items }`.
 */
@customElement("strata-index-list")
export class StrataIndexList extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: block;
      }
      .groups {
        display: grid;
        grid-template-columns: repeat(var(--_cols, 1), minmax(0, 1fr));
        gap: 24px 32px;
      }
      ul {
        margin: 8px 0 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 4px;
      }
      a {
        color: var(--strata-color-text-primary);
        font: var(--strata-type-reading-small) var(--strata-font-serif);
        text-decoration: underline;
        text-decoration-color: var(--strata-color-border-subtle);
        text-underline-offset: 3px;
      }
      a:hover {
        text-decoration-color: currentColor;
      }
      a:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      @media (max-width: 640px) {
        .groups {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
  @property() groups: string | StrataIndexGroup[] = "";
  @property({ type: Number }) columns = 2;

  private parse(): StrataIndexGroup[] {
    const raw = this.groups;
    let list: unknown = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [];
      }
    }
    return Array.isArray(list)
      ? (list as StrataIndexGroup[]).filter(
          (g) => g && typeof g.heading === "string",
        )
      : [];
  }

  render() {
    const cols = Math.min(4, Math.max(1, Number(this.columns) || 1));
    return html`<div class="groups" style=${`--_cols:${cols}`}>
      ${this.parse().map(
        (group) =>
          html`<section>
            <strata-section-header
              size="small"
              level="3"
              heading=${group.heading}
            ></strata-section-header>
            <ul>
              ${parseItems(group.items).map((item) => {
                const href = safeHref(item.href);
                return html`<li>
                  ${href ? html`<a href=${href}>${item.label}</a>` : item.label}
                </li>`;
              })}
            </ul>
          </section>`,
      )}
    </div>`;
  }
}
