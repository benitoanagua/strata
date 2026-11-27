import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { emitValueEvent } from "../../events.js";
import { safeHref } from "../../utils/items.js";
import {
  activeHeadingId,
  collectHeadings,
  onScrollFrame,
  parseLevels,
  resolveTarget,
  scrollToElement,
  slugify,
  type HeadingInfo,
} from "../../utils/headings.js";

interface TocNode {
  h: HeadingInfo;
  num: string;
  children: TocNode[];
}

function buildTree(list: HeadingInfo[]): TocNode[] {
  const root: TocNode[] = [];
  const stack: { level: number; children: TocNode[]; num: string }[] = [
    { level: 0, children: root, num: "" },
  ];
  for (const h of list) {
    while (stack.length > 1 && stack[stack.length - 1].level >= h.level)
      stack.pop();
    const parent = stack[stack.length - 1];
    const idx = parent.children.length + 1;
    const num = parent.num ? `${parent.num}.${idx}` : `${idx}`;
    const node: TocNode = { h, num, children: [] };
    parent.children.push(node);
    stack.push({ level: h.level, children: node.children, num });
  }
  return root;
}

function ancestors(
  nodes: TocNode[],
  id: string,
  path: string[] = [],
): string[] | null {
  for (const n of nodes) {
    if (n.h.id === id) return path;
    const hit = ancestors(n.children, id, [...path, n.h.id]);
    if (hit) return hit;
  }
  return null;
}

/**
 * Table of contents with scroll-spy. Build it from the headings of a
 * `target` container, or pass `items` manually. The current section is
 * marked by weight and surface (`aria-current="location"`), never by a
 * decorative border. `variant="rail"` shows a compact tick rail.
 * Emits `strata-change` `{ id, text }` when the current section changes.
 */
@customElement("strata-toc")
export class StrataToc extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host([sticky]) {
        position: sticky;
        top: var(--strata-toc-top, 16px);
        max-height: calc(100vh - 2 * var(--strata-toc-top, 16px));
        overflow-y: auto;
      }
      :host {
        display: block;
        width: min(100%, 280px);
      }
      nav {
        font: var(--strata-type-body-medium) var(--strata-font-sans);
      }
      .title {
        margin: 0 0 8px;
        padding-bottom: 6px;
        border-bottom: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
        font: var(--strata-type-label-large) var(--strata-font-sans);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--strata-color-text-secondary);
      }
      ol {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      ol ol {
        padding-left: 14px;
      }
      li {
        margin: 0 0 2px;
      }
      .row {
        display: flex;
        align-items: flex-start;
      }
      a {
        flex: 1;
        display: flex;
        gap: 8px;
        padding: 8px 10px;
        border-radius: var(--strata-radius-small);
        color: var(--strata-color-text-secondary);
        text-decoration: none;
      }
      a:hover {
        background: var(--strata-color-surface-hover);
        color: var(--strata-color-text-primary);
      }
      a[aria-current="location"] {
        background: var(--strata-color-surface-selected);
        color: var(--strata-color-text-primary);
        font-weight: 700;
      }
      a:focus-visible,
      .toggle:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 1px;
      }
      .num {
        flex: none;
        font: var(--strata-type-numeric-small) var(--strata-font-mono);
        font-variant-numeric: tabular-nums;
        opacity: 0.8;
      }
      .toggle {
        flex: none;
        width: 24px;
        height: 24px;
        margin-top: 2px;
        border: 0;
        border-radius: var(--strata-radius-small);
        background: transparent;
        color: var(--strata-color-text-secondary);
      }
      .toggle iconify-icon {
        transition: transform var(--strata-motion-fast);
      }
      .toggle[aria-expanded="false"] iconify-icon {
        transform: rotate(-90deg);
      }
      ul[hidden],
      ol[hidden] {
        display: none;
      }
      /* Rail variant */
      .rail a {
        display: block;
        position: relative;
        height: 14px;
        padding: 0;
        background: transparent;
      }
      .rail a::before {
        content: "";
        position: absolute;
        top: 6px;
        left: 0;
        height: 2px;
        width: var(--_w, 60%);
        background: var(--strata-color-border-subtle);
      }
      .rail a:hover::before {
        background: var(--strata-color-text-secondary);
      }
      .rail a[aria-current="location"]::before {
        width: 100%;
        background: var(--strata-color-text-primary);
      }
      @media (prefers-reduced-motion: reduce) {
        .toggle iconify-icon {
          transition: none;
        }
      }
    `,
  ];
  @property({ type: String }) label = "Contents";
  /** Visible title; empty hides it (the nav keeps `label` as its name). */
  @property({ type: String }) heading = "Contents";
  /** CSS selector of the article whose headings build the TOC. */
  @property({ type: String }) target = "";
  /** Heading levels to include, e.g. `2-4`. */
  @property({ type: String }) levels = "2-3";
  /** Manual list: `[{label,id,level}]` JSON, array or `a|b|c`. */
  @property() items: string | unknown[] = "";
  @property({ type: Boolean }) numbered = false;
  @property({ type: Boolean }) collapsible = false;
  /** Px below the viewport top where a heading counts as "current". */
  @property({ type: Number }) offset = 96;
  @property({ type: String, reflect: true }) variant: "list" | "rail" = "list";
  @property({ type: Boolean, reflect: true }) sticky = false;
  @property({ type: String, attribute: "expand-label" }) expandLabel =
    "Toggle subsections";
  @state() private list: HeadingInfo[] = [];
  @state() private current = "";
  @state() private open = new Set<string>();
  private stopScroll?: () => void;
  private mo?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    this.stopScroll = onScrollFrame(() => this.spy());
    const start = () => this.refresh();
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", start, { once: true })
      : queueMicrotask(start);
  }

  disconnectedCallback() {
    this.stopScroll?.();
    this.mo?.disconnect();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (
      ["target", "levels", "items"].some((k) => changed.has(k)) &&
      this.isConnected
    )
      this.refresh();
  }

  /** Rebuild from the DOM (call after injecting new content). */
  refresh() {
    const root = resolveTarget(this, this.target);
    const levels = parseLevels(this.levels);
    if (root) {
      this.list = collectHeadings(root, levels);
      this.mo?.disconnect();
      this.mo = new MutationObserver(() => {
        const next = collectHeadings(root, levels);
        const same =
          next.length === this.list.length &&
          next.every(
            (h, i) => h.id === this.list[i].id && h.text === this.list[i].text,
          );
        if (!same) this.list = next;
      });
      this.mo.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } else {
      this.list = this.manual();
    }
    this.spy();
  }

  private manual(): HeadingInfo[] {
    let raw: unknown = this.items;
    if (typeof raw === "string") {
      const s = raw.trim();
      if (s.startsWith("[")) {
        try {
          raw = JSON.parse(s);
        } catch {
          raw = [];
        }
      } else
        raw = s
          ? s
              .split("|")
              .map((x) => x.trim())
              .filter(Boolean)
          : [];
    }
    if (!Array.isArray(raw)) return [];
    const doc = this.getRootNode() as Document | ShadowRoot;
    return raw.flatMap((entry) => {
      const e =
        typeof entry === "string"
          ? { label: entry }
          : (entry as Record<string, unknown>);
      const text = String(e?.label ?? e?.title ?? "").trim();
      if (!text) return [];
      const id = String(e.id ?? "") || slugify(text);
      const level = Math.min(6, Math.max(1, Number(e.level) || 2));
      const el = (doc.getElementById?.(id) ??
        document.getElementById(id)) as HTMLElement | null;
      return [{ id, text, level, el }];
    });
  }

  private spy() {
    const id = activeHeadingId(this.list, this.offset);
    if (id === this.current) return;
    this.current = id;
    if (this.collapsible)
      this.open = new Set([
        ...this.open,
        ...(ancestors(buildTree(this.list), id) ?? []),
      ]);
    const h = this.list.find((x) => x.id === id);
    if (h) emitValueEvent(this, "strata-change", { id: h.id, text: h.text });
  }

  private go(event: Event, h: HeadingInfo) {
    if (!h.el) return;
    event.preventDefault();
    scrollToElement(h.el, this.offset - 8);
    try {
      history.replaceState(null, "", `#${h.id}`);
    } catch {
      /* sandboxed frame */
    }
    if (!h.el.hasAttribute("tabindex")) h.el.setAttribute("tabindex", "-1");
    h.el.focus?.({ preventScroll: true });
    this.current = h.id;
  }

  private toggle(id: string) {
    const next = new Set(this.open);
    next.has(id) ? next.delete(id) : next.add(id);
    this.open = next;
  }

  private node(n: TocNode, min: number): TemplateResult {
    const expanded = !this.collapsible || this.open.has(n.h.id);
    const href = safeHref(`#${n.h.id}`);
    return html`<li>
      <div class="row">
        ${
          this.collapsible && n.children.length
            ? html`<button
                type="button"
                class="toggle"
                aria-label=${`${this.expandLabel}: ${n.h.text}`}
                aria-expanded=${String(expanded)}
                @click=${() => this.toggle(n.h.id)}
              >
                <iconify-icon icon="carbon:chevron-down"></iconify-icon>
              </button>`
            : this.collapsible
              ? html`<span class="toggle" aria-hidden="true"></span>`
              : nothing
        }
        <a
          href=${href}
          aria-current=${this.current === n.h.id ? "location" : nothing}
          @click=${(e: Event) => this.go(e, n.h)}
        >
          ${this.numbered ? html`<span class="num">${n.num}</span>` : nothing}
          <span>${n.h.text}</span>
        </a>
      </div>
      ${
        n.children.length
          ? html`<ol ?hidden=${!expanded}>
              ${n.children.map((c) => this.node(c, min))}
            </ol>`
          : nothing
      }
    </li>`;
  }

  private rail() {
    const min = Math.min(...this.list.map((h) => h.level));
    return html`<ol class="rail">
      ${this.list.map((h) => {
        const w = Math.max(30, 100 - (h.level - min) * 25);
        return html`<li>
          <a
            href=${safeHref(`#${h.id}`)}
            style=${`--_w:${w}%`}
            title=${h.text}
            aria-label=${h.text}
            aria-current=${this.current === h.id ? "location" : nothing}
            @click=${(e: Event) => this.go(e, h)}
          ></a>
        </li>`;
      })}
    </ol>`;
  }

  render() {
    if (!this.list.length) return html`<nav aria-label=${this.label}></nav>`;
    const min = Math.min(...this.list.map((h) => h.level));
    return html`<nav aria-label=${this.label}>
      ${
        this.heading && this.variant !== "rail"
          ? html`<p class="title">${this.heading}</p>`
          : nothing
      }
      ${
        this.variant === "rail"
          ? this.rail()
          : html`<ol>
              ${buildTree(this.list).map((n) => this.node(n, min))}
            </ol>`
      }
    </nav>`;
  }
}
