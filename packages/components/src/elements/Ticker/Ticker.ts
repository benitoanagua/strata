import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { parseItems, safeHref } from "../../utils/items.js";

/**
 * Horizontal strip of short headlines ("Últimas noticias", wiki "Cambios
 * recientes"). Scroll-snaps, has previous/next buttons and optional
 * auto-advance (`interval` ms; off by default, paused on hover/focus and
 * never run under `prefers-reduced-motion`).
 */
@customElement("strata-ticker")
export class StrataTicker extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: block;
        border-top: var(--strata-border-medium) solid
          var(--strata-color-border-strong);
        border-bottom: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
      }
      .bar {
        display: flex;
        align-items: stretch;
        gap: 8px;
      }
      .label {
        display: inline-flex;
        align-items: center;
        padding: 0 12px 0 0;
        font: var(--strata-type-label-medium) var(--strata-font-mono);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
      }
      ul {
        display: flex;
        flex: 1;
        gap: 24px;
        margin: 0;
        padding: 10px 0;
        list-style: none;
        overflow-x: auto;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }
      ul::-webkit-scrollbar {
        display: none;
      }
      li {
        flex: 0 0 auto;
        scroll-snap-align: start;
        font: var(--strata-type-body-medium) var(--strata-font-sans);
      }
      a {
        color: var(--strata-color-text-primary);
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      a:focus-visible,
      button:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      button {
        width: 32px;
        border: 0;
        border-radius: var(--strata-radius-small);
        background: transparent;
        color: var(--strata-color-text-secondary);
      }
      button:hover {
        background: var(--strata-color-surface-hover);
        color: var(--strata-color-text-primary);
      }
      @media (prefers-reduced-motion: no-preference) {
        ul {
          scroll-behavior: smooth;
        }
      }
    `,
  ];
  @property({ type: String }) label = "Latest";
  /** `[{"label","href"}]` JSON, or pipe-separated plain headlines. */
  @property() items: string | unknown[] = "";
  /** Auto-advance every N ms. 0 disables it. */
  @property({ type: Number }) interval = 0;
  private timer?: ReturnType<typeof setInterval>;
  private paused = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("pointerenter", () => (this.paused = true));
    this.addEventListener("pointerleave", () => (this.paused = false));
    this.addEventListener("focusin", () => (this.paused = true));
    this.addEventListener("focusout", () => (this.paused = false));
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  updated() {
    this.stop();
    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (this.interval > 0 && !reduce)
      this.timer = setInterval(
        () => !this.paused && this.advance(1, true),
        this.interval,
      );
  }

  private stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private advance(dir: 1 | -1, wrap = false) {
    const list = this.renderRoot.querySelector("ul");
    if (!list) return;
    const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
    if (wrap && dir === 1 && atEnd) list.scrollTo?.({ left: 0 });
    else list.scrollBy?.({ left: dir * list.clientWidth * 0.8 });
  }

  render() {
    const items = parseItems(this.items);
    return html`<div class="bar">
      <span class="label">${this.label}</span>
      <button
        type="button"
        aria-label="Previous"
        @click=${() => this.advance(-1)}
      >
        <iconify-icon icon="carbon:chevron-left"></iconify-icon>
      </button>
      <ul aria-label=${this.label}>
        ${items.map((item) => {
          const href = safeHref(item.href);
          return html`<li>
            ${href ? html`<a href=${href}>${item.label}</a>` : item.label}
          </li>`;
        })}
        <slot></slot>
      </ul>
      <button type="button" aria-label="Next" @click=${() => this.advance(1)}>
        <iconify-icon icon="carbon:chevron-right"></iconify-icon>
      </button>
    </div>`;
  }
}
