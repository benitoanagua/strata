import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";

/**
 * Masonry gallery of slotted `<figure><img><figcaption>` elements with a
 * built-in lightbox (native `<dialog>`; Esc closes, ←/→ navigate).
 */
@customElement("strata-gallery")
export class StrataGallery extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      .grid {
        column-count: var(--_cols, 3);
        column-gap: 16px;
      }
      ::slotted(figure) {
        break-inside: avoid;
        margin: 0 0 16px;
        cursor: zoom-in;
      }
      ::slotted(figure) img,
      ::slotted(img) {
        max-width: 100%;
      }
      @media (max-width: 640px) {
        .grid {
          column-count: min(var(--_cols, 3), 2);
        }
      }
      dialog {
        width: min(96vw, 1100px);
        max-height: 94vh;
        padding: 12px;
        border: var(--strata-border-medium) solid
          var(--strata-color-border-strong);
        border-radius: var(--strata-radius-small);
        background: var(--strata-color-surface-page);
        color: var(--strata-color-text-primary);
      }
      dialog::backdrop {
        background: var(--strata-color-black);
        opacity: 0.8;
      }
      .stage {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 8px;
      }
      .stage img {
        max-width: 100%;
        max-height: 78vh;
        margin: 0 auto;
        display: block;
      }
      .caption {
        margin: 8px 0 0;
        text-align: center;
        font: var(--strata-type-reading-small) var(--strata-font-serif);
        color: var(--strata-color-text-secondary);
      }
      .counter {
        font: var(--strata-type-numeric-small) var(--strata-font-mono);
      }
      .bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      button {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: var(--strata-radius-small);
        background: transparent;
        color: inherit;
      }
      button:hover {
        background: var(--strata-color-surface-hover);
      }
      button:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
      }
    `,
  ];
  @property({ type: Number }) columns = 3;
  @property({ type: Boolean }) lightbox = true;
  @property({ type: String }) label = "Gallery";
  @state() private index = -1;

  private figures(): HTMLElement[] {
    const slot = this.renderRoot.querySelector("slot");
    return (slot?.assignedElements({ flatten: true }) ?? []) as HTMLElement[];
  }

  private open(event: Event) {
    if (!this.lightbox) return;
    const figs = this.figures();
    const hit = figs.findIndex(
      (f) => f === event.target || f.contains(event.target as Node),
    );
    if (hit < 0 || !figs[hit].querySelector("img")) return;
    this.index = hit;
    this.updateComplete.then(() => {
      const dlg = this.renderRoot.querySelector("dialog");
      if (dlg && !dlg.open)
        typeof dlg.showModal === "function"
          ? dlg.showModal()
          : dlg.setAttribute("open", "");
    });
  }

  private close() {
    const dlg = this.renderRoot.querySelector("dialog");
    if (dlg?.open)
      typeof dlg.close === "function"
        ? dlg.close()
        : dlg.removeAttribute("open");
    this.index = -1;
  }

  private step(dir: 1 | -1) {
    const n = this.figures().length;
    if (n) this.index = (this.index + dir + n) % n;
  }

  private onKey(event: KeyboardEvent) {
    if (event.key === "ArrowRight") this.step(1);
    else if (event.key === "ArrowLeft") this.step(-1);
  }

  render() {
    const figs = this.figures();
    const cur = this.index >= 0 ? figs[this.index] : undefined;
    const img = cur?.querySelector("img");
    const caption = cur?.querySelector("figcaption")?.textContent ?? "";
    const cols = Math.min(6, Math.max(1, Number(this.columns) || 3));
    return html`<div
        class="grid"
        style=${`--_cols:${cols}`}
        role="group"
        aria-label=${this.label}
        @click=${this.open}
      >
        <slot @slotchange=${() => this.requestUpdate()}></slot>
      </div>
      ${
        this.lightbox
          ? html`<dialog
              aria-label=${this.label}
              @close=${() => (this.index = -1)}
              @keydown=${this.onKey}
            >
              <div class="bar">
                <span class="counter">${this.index + 1} / ${figs.length}</span>
                <button type="button" aria-label="Close" @click=${this.close}>
                  <iconify-icon icon="carbon:close"></iconify-icon>
                </button>
              </div>
              <div class="stage">
                <button
                  type="button"
                  aria-label="Previous image"
                  @click=${() => this.step(-1)}
                >
                  <iconify-icon icon="carbon:chevron-left"></iconify-icon>
                </button>
                ${img ? html`<img src=${img.currentSrc || img.src} alt=${img.alt} />` : ""}
                <button
                  type="button"
                  aria-label="Next image"
                  @click=${() => this.step(1)}
                >
                  <iconify-icon icon="carbon:chevron-right"></iconify-icon>
                </button>
              </div>
              ${caption ? html`<p class="caption">${caption}</p>` : ""}
            </dialog>`
          : ""
      }`;
  }
}
