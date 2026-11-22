import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { onScrollFrame, resolveTarget } from "../../utils/headings.js";

/** Thin progress bar: how far the reader is through `target` (or the page). */
@customElement("strata-reading-progress")
export class StrataReadingProgress extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host([placement="fixed"]) {
        position: fixed;
        inset: 0 0 auto 0;
        z-index: 50;
      }
      .track {
        height: 2px;
        background: var(--strata-color-border-subtle);
      }
      .bar {
        height: 100%;
        background: var(--strata-color-action-primary);
        transform-origin: left center;
        transition: transform var(--strata-motion-fast) linear;
      }
      @media (prefers-reduced-motion: reduce) {
        .bar {
          transition: none;
        }
      }
    `,
  ];
  @property({ type: String }) target = "";
  @property({ type: String }) label = "Reading progress";
  @property({ type: String, reflect: true }) placement: "fixed" | "inline" =
    "fixed";
  @state() private progress = 0;
  private stop?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.stop = onScrollFrame(() => this.measure());
    queueMicrotask(() => this.measure());
  }

  disconnectedCallback() {
    this.stop?.();
    super.disconnectedCallback();
  }

  private measure() {
    const el = resolveTarget(this, this.target);
    let p: number;
    if (el) {
      const r = el.getBoundingClientRect();
      p = -r.top / Math.max(1, r.height - window.innerHeight);
    } else {
      const doc = document.documentElement;
      p = window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight);
    }
    this.progress = Math.min(1, Math.max(0, Number.isFinite(p) ? p : 0));
  }

  render() {
    return html`<div
      class="track"
      role="progressbar"
      aria-label=${this.label}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${Math.round(this.progress * 100)}
    >
      <div class="bar" style=${`transform:scaleX(${this.progress})`}></div>
    </div>`;
  }
}
