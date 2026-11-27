import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";

/**
 * Reading layout: `aside-start` (TOC, navigation), default slot (the
 * article, capped at the reading measure) and `aside-end` (infobox, related,
 * ranked lists). Empty asides collapse; on narrow screens the article comes
 * first and the asides stack below it.
 */
@customElement("strata-page-layout")
export class StrataPageLayout extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      .layout {
        display: grid;
        gap: 24px 40px;
        grid-template-columns: minmax(0, 1fr);
      }
      .main {
        order: -1;
        min-width: 0;
        max-width: var(--strata-editorial-measure, 65ch);
        margin-inline: auto;
      }
      .start:not([data-filled]),
      .end:not([data-filled]) {
        display: none;
      }
      @media (min-width: 900px) {
        .layout[data-start][data-end] {
          grid-template-columns:
            minmax(180px, var(--strata-layout-start, 220px))
            minmax(0, 1fr) minmax(200px, var(--strata-layout-end, 280px));
        }
      }
      @media (min-width: 1200px) {
        .layout {
          grid-template-columns:
            var(--_start, 0) minmax(0, 1fr)
            var(--_end, 0);
        }
        .layout[data-start] {
          --_start: minmax(0, var(--strata-layout-start, 220px));
        }
        .layout[data-end] {
          --_end: minmax(0, var(--strata-layout-end, 280px));
        }
        .main {
          order: 0;
        }
        :host([sticky]) .start,
        :host([sticky]) .end {
          position: sticky;
          top: 16px;
          align-self: start;
        }
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) sticky = false;
  @state() private hasStart = false;
  @state() private hasEnd = false;

  private track(name: "hasStart" | "hasEnd") {
    return (event: Event) => {
      this[name] = (event.target as HTMLSlotElement).assignedNodes().length > 0;
    };
  }

  render() {
    return html`<div
      class="layout"
      ?data-start=${this.hasStart}
      ?data-end=${this.hasEnd}
    >
      <aside class="start" ?data-filled=${this.hasStart} aria-label="Contents">
        <slot name="aside-start" @slotchange=${this.track("hasStart")}></slot>
      </aside>
      <div class="main"><slot></slot></div>
      <aside class="end" ?data-filled=${this.hasEnd} aria-label="Related">
        <slot name="aside-end" @slotchange=${this.track("hasEnd")}></slot>
      </aside>
    </div>`;
  }
}
