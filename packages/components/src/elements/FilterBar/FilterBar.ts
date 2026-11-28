import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { emitValueEvent } from "../../events.js";
import { parseItems } from "../../utils/items.js";
import "../Badge/Badge.js";

export interface StrataFilterState {
  category: string;
  view: "list" | "grid";
  sort: "asc" | "desc";
}

/**
 * Category chips + view (list/grid) + sort toggles for listing pages.
 * The active chip is marked by inversion and weight, not by a border.
 * Emits `strata-change` with `{ category, view, sort }`.
 */
@customElement("strata-filter-bar")
export class StrataFilterBar extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
      }
      .filters {
        display: flex;
        flex: 1 1 240px;
        min-width: 0;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .tools {
        display: flex;
        gap: 2px;
      }
      .tool {
        display: inline-grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border: 0;
        border-radius: var(--strata-radius-small);
        background: transparent;
        color: var(--strata-color-text-secondary);
      }
      .tool:hover {
        background: var(--strata-color-surface-hover);
      }
      .tool[aria-pressed="true"] {
        background: var(--strata-color-surface-selected);
        color: var(--strata-color-text-primary);
      }
      .tool:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
    `,
  ];
  @property({ type: String }) label = "Filter";
  @property() items: string | unknown[] = "";
  /** Selected category; empty = all. */
  @property({ type: String }) value = "";
  @property({ type: String, reflect: true }) view: "list" | "grid" = "list";
  @property({ type: String }) sort: "asc" | "desc" = "desc";
  @property({ type: String, attribute: "all-label" }) allLabel = "All";
  /** Colour category chips from the taxonomy rainbow. */
  @property({ type: Boolean }) hues = true;
  @property({ type: Boolean, attribute: "hide-tools" }) hideTools = false;

  private set(patch: {
    value?: string;
    view?: "list" | "grid";
    sort?: "asc" | "desc";
  }) {
    Object.assign(this, patch);
    emitValueEvent<StrataFilterState>(this, "strata-change", {
      category: this.value,
      view: this.view,
      sort: this.sort,
    });
  }

  private chip(label: string, value: string) {
    return html`<li>
      <strata-badge
        label=${label}
        hue=${this.hues && value ? "auto" : "neutral"}
        interactive
        pressed=${this.value === value}
        @click=${() => this.set({ value })}
      ></strata-badge>
    </li>`;
  }

  render() {
    const items = parseItems(this.items);
    return html`<div class="filters" role="group" aria-label=${this.label}>
        <ul>
          ${this.chip(this.allLabel, "")}
          ${items.map((item) => this.chip(item.label, item.label))}
        </ul>
      </div>
      ${
        this.hideTools
          ? ""
          : html`<div class="tools" role="group" aria-label="View and order">
              <button
                type="button"
                class="tool"
                aria-label="List view"
                aria-pressed=${String(this.view === "list")}
                @click=${() => this.set({ view: "list" })}
              >
                <iconify-icon icon="carbon:list-bulleted"></iconify-icon>
              </button>
              <button
                type="button"
                class="tool"
                aria-label="Grid view"
                aria-pressed=${String(this.view === "grid")}
                @click=${() => this.set({ view: "grid" })}
              >
                <iconify-icon icon="carbon:grid"></iconify-icon>
              </button>
              <button
                type="button"
                class="tool"
                aria-label="Sort ascending"
                aria-pressed=${String(this.sort === "asc")}
                @click=${() => this.set({ sort: "asc" })}
              >
                <iconify-icon icon="carbon:sort-ascending"></iconify-icon>
              </button>
              <button
                type="button"
                class="tool"
                aria-label="Sort descending"
                aria-pressed=${String(this.sort === "desc")}
                @click=${() => this.set({ sort: "desc" })}
              >
                <iconify-icon icon="carbon:sort-descending"></iconify-icon>
              </button>
            </div>`
      }`;
  }
}
