import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import "../SectionHeader/SectionHeader.js";
import {
  CITE_EVENT,
  citeOrder,
  listCites,
  type CiteLike,
} from "../../utils/cites.js";
import { safeHref } from "../../utils/items.js";
import { prefersReducedMotion } from "../../utils/headings.js";

interface Entry {
  id: string;
  nodes?: Node[];
  text: string;
  href?: string;
}

/**
 * Numbered reference list. Entries come from `items`
 * (`[{id,label,href}]`) or from child `<li id="…">` elements (their rich
 * content is cloned, so links and emphasis survive). Entries are numbered in
 * order of first `<strata-cite>`, and each gets back-links to its citations.
 */
@customElement("strata-references")
export class StrataReferences extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      ol {
        margin: 12px 0 0;
        padding-left: 3ch;
        font: var(--strata-type-reading-small) var(--strata-font-serif);
      }
      li {
        padding: 4px 6px;
        margin: 0 0 2px;
        border-radius: var(--strata-radius-small);
      }
      li::marker {
        font: var(--strata-type-numeric-small) var(--strata-font-mono);
        color: var(--strata-color-text-secondary);
      }
      li[data-hit] {
        background: var(--strata-color-surface-selected);
      }
      li:focus-visible,
      a:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 1px;
      }
      .back {
        margin-right: 6px;
        color: var(--strata-color-text-secondary);
        font: var(--strata-type-label-small) var(--strata-font-sans);
        white-space: nowrap;
      }
      .back a {
        color: inherit;
        text-decoration: none;
      }
      .back a:hover {
        text-decoration: underline;
      }
      .src {
        color: var(--strata-color-text-primary);
      }
    `,
  ];
  @property({ type: String }) heading = "References";
  @property() items: string | unknown[] = "";
  @state() private slotted: Entry[] = [];
  @state() private hit = "";
  private renumber = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(CITE_EVENT, this.renumber);
    this.readSlot();
  }

  disconnectedCallback() {
    window.removeEventListener(CITE_EVENT, this.renumber);
    super.disconnectedCallback();
  }

  private readSlot() {
    const lis = Array.from(
      this.querySelectorAll<HTMLElement>(
        ":scope > li, :scope > ol > li, :scope > ul > li",
      ),
    );
    this.slotted = lis.map((li, i) => ({
      id: li.id || `ref-${i + 1}`,
      text: (li.textContent ?? "").trim(),
      nodes: Array.from(li.childNodes).map((n) => n.cloneNode(true)),
    }));
  }

  private entries(): Entry[] {
    let raw: unknown = this.items;
    if (typeof raw === "string" && raw.trim().startsWith("[")) {
      try {
        raw = JSON.parse(raw);
      } catch {
        raw = [];
      }
    } else if (typeof raw === "string") {
      raw = raw
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const given: Entry[] = Array.isArray(raw)
      ? raw.flatMap((e, i) => {
          const o =
            typeof e === "string"
              ? { label: e }
              : (e as Record<string, unknown>);
          const text = String(o?.label ?? o?.text ?? "").trim();
          if (!text) return [];
          return [
            {
              id: String(o.id ?? `ref-${i + 1}`),
              text,
              href: safeHref(o.href ?? o.url),
            },
          ];
        })
      : [];
    const all = [...given, ...this.slotted];
    const order = citeOrder(this.getRootNode());
    const rank = (id: string) => {
      const i = order.indexOf(id);
      return i < 0 ? order.length : i;
    };
    return all
      .map((e, i) => ({ e, i }))
      .sort((a, b) => rank(a.e.id) - rank(b.e.id) || a.i - b.i)
      .map((x) => x.e);
  }

  /** Plain text of an entry (used for cite tooltips). */
  textFor(id: string): string {
    return this.entries().find((e) => e.id === id)?.text ?? "";
  }

  /** Scroll to and highlight an entry. Returns false if it does not exist. */
  reveal(id: string): boolean {
    const li = Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>("li[data-ref]"),
    ).find((x) => x.dataset.ref === id);
    if (!li) return false;
    li.scrollIntoView?.({
      block: "center",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    li.focus?.({ preventScroll: true });
    this.hit = id;
    setTimeout(() => (this.hit === id ? (this.hit = "") : null), 2500);
    return true;
  }

  private back(c: CiteLike, e: Event) {
    e.preventDefault();
    c.scrollIntoView?.({
      block: "center",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    (c as CiteLike & { focusLink?: () => void }).focusLink?.();
  }

  private backlinks(id: string) {
    const cites = listCites(this.getRootNode()).filter((c) => c.ref === id);
    if (!cites.length) return nothing;
    return html`<span class="back">
      <iconify-icon icon="carbon:arrow-up" aria-hidden="true"></iconify-icon>
      ${cites.map((c, i) => {
        const letter = String.fromCharCode(97 + (i % 26));
        const label =
          cites.length > 1 ? `Back to citation ${letter}` : "Back to text";
        return html`<a
            href=${`#${c.id}`}
            aria-label=${label}
            @click=${(e: Event) => this.back(c, e)}
            >${cites.length > 1 ? letter : ""}</a
          >${" "}`;
      })}
    </span>`;
  }

  render() {
    const entries = this.entries();
    return html`<section aria-label=${this.heading}>
      <strata-section-header
        heading=${this.heading}
        size="small"
      ></strata-section-header>
      <ol>
        ${entries.map(
          (e) =>
            html`<li
              data-ref=${e.id}
              tabindex="-1"
              ?data-hit=${this.hit === e.id}
            >
              ${this.backlinks(e.id)}
              <span class="src">
                ${
                  e.nodes ??
                  (e.href ? html`<a href=${e.href}>${e.text}</a>` : e.text)
                }
              </span>
            </li>`,
        )}
      </ol>
      <slot hidden @slotchange=${() => this.readSlot()}></slot>
    </section>`;
  }
}
