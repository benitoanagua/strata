import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import {
  CITE_EVENT,
  listCites,
  notifyCitesChanged,
  type CiteLike,
} from "../../utils/cites.js";
import { slugify } from "../../utils/headings.js";

/**
 * Inline citation marker `[n]`, numbered by order of first appearance. Pair
 * with `<strata-references>` (same `ref` id). Hover/focus shows `note`, or
 * the reference text, as a native tooltip; click jumps to the reference.
 */
@customElement("strata-cite")
export class StrataCite extends StrataElement implements CiteLike {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: inline;
      }
      sup {
        line-height: 0;
        font: var(--strata-type-label-small) var(--strata-font-sans);
      }
      a {
        padding: 0 1px;
        color: var(--strata-color-text-secondary);
        text-decoration: none;
      }
      a:hover {
        color: var(--strata-color-text-primary);
        text-decoration: underline;
      }
      a:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 1px;
      }
    `,
  ];
  /** Id of the matching reference. */
  @property({ type: String }) ref = "";
  /** Overrides the number (e.g. `a`, `nota 1`). */
  @property({ type: String }) label = "";
  /** Tooltip text; defaults to the referenced entry's text. */
  @property({ type: String }) note = "";
  @state() private n = 0;
  private autoId = false;
  private renumber = () => this.compute();

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(CITE_EVENT, this.renumber);
    notifyCitesChanged();
  }

  disconnectedCallback() {
    window.removeEventListener(CITE_EVENT, this.renumber);
    notifyCitesChanged();
    super.disconnectedCallback();
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("ref")) notifyCitesChanged();
  }

  private compute() {
    const all = listCites(this.getRootNode());
    const order: string[] = [];
    for (const c of all) if (c.ref && !order.includes(c.ref)) order.push(c.ref);
    this.n = order.indexOf(this.ref) + 1;
    const same = all.filter((c) => c.ref === this.ref);
    if (!this.id || this.autoId) {
      this.id = `cite-${slugify(this.ref || "x")}-${same.indexOf(this) + 1}`;
      this.autoId = true;
    }
  }

  focusLink() {
    this.renderRoot.querySelector<HTMLElement>("a")?.focus();
  }

  private lookupText(): string {
    if (this.note) return this.note;
    const refs = (this.getRootNode() as ParentNode).querySelector?.(
      "strata-references",
    ) as (HTMLElement & { textFor?: (id: string) => string }) | null;
    return refs?.textFor?.(this.ref) ?? "";
  }

  private jump(event: Event) {
    const refs = (this.getRootNode() as ParentNode).querySelector?.(
      "strata-references",
    ) as (HTMLElement & { reveal?: (id: string) => boolean }) | null;
    if (refs?.reveal?.(this.ref)) event.preventDefault();
  }

  render() {
    const text = this.label || (this.n ? String(this.n) : "?");
    return html`<sup
      ><a
        href=${`#${this.ref}`}
        aria-label=${`Reference ${text}`}
        @mouseenter=${(e: Event) =>
          (e.currentTarget as HTMLElement).setAttribute(
            "title",
            this.lookupText(),
          )}
        @click=${this.jump}
        >[${text}]</a
      ></sup
    >`;
  }
}
