import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { resolveTarget } from "../../utils/headings.js";

/**
 * Estimated reading time. Counts the words of `target` (references,
 * navigation and anything matching `exclude` are skipped) or uses `words`.
 */
@customElement("strata-reading-time")
export class StrataReadingTime extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: inline-block;
      }
      .rt {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--strata-color-text-secondary);
        font: var(--strata-type-label-medium) var(--strata-font-mono);
        font-variant-numeric: tabular-nums;
      }
    `,
  ];
  @property({ type: String }) target = "";
  /** Words per minute. */
  @property({ type: Number }) wpm = 220;
  /** Fixed word count, used when there is no `target`. */
  @property({ type: Number }) words = 0;
  @property({ type: String }) label = "min read";
  @property({ type: String, attribute: "words-label" }) wordsLabel = "words";
  @property({ type: Boolean, attribute: "show-words" }) showWords = false;
  @property({ type: String }) exclude =
    "strata-references, .references, .mw-references-wrap, nav, [data-reading-skip]";
  @state() private count = 0;
  private mo?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    const start = () => this.refresh();
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", start, { once: true })
      : queueMicrotask(start);
  }

  disconnectedCallback() {
    this.mo?.disconnect();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if ((changed.has("target") || changed.has("words")) && this.isConnected)
      this.refresh();
  }

  /** Recount (call after the article changes). */
  refresh() {
    const el = resolveTarget(this, this.target);
    if (!el) {
      this.count = Math.max(0, Number(this.words) || 0);
      return;
    }
    const measure = () => {
      const clone = el.cloneNode(true) as HTMLElement;
      try {
        clone.querySelectorAll(this.exclude).forEach((n) => n.remove());
      } catch {
        /* invalid selector: count everything */
      }
      this.count = (clone.textContent ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    };
    measure();
    this.mo?.disconnect();
    this.mo = new MutationObserver(measure);
    this.mo.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  render() {
    const minutes = Math.max(1, Math.ceil(this.count / Math.max(1, this.wpm)));
    return html`<span class="rt">
      <iconify-icon icon="carbon:time" aria-hidden="true"></iconify-icon>
      <span>${minutes} ${this.label}</span>
      ${
        this.showWords && this.count
          ? html`<span aria-hidden="true">·</span
              ><span>${this.count.toLocaleString()} ${this.wordsLabel}</span>`
          : nothing
      }
    </span>`;
  }
}
