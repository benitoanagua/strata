import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";
import {
  collectHeadings,
  parseLevels,
  resolveTarget,
} from "../../utils/headings.js";

/**
 * Progressive enhancement: appends a permalink anchor (`a.strata-anchor`,
 * styled by `@strata/prose`) to every heading of `target`, giving ids to
 * headings that lack one. Renders nothing itself.
 */
@customElement("strata-heading-anchors")
export class StrataHeadingAnchors extends StrataElement {
  @property({ type: String }) target = "";
  @property({ type: String }) levels = "2-4";
  @property({ type: String }) label = "Link to this section";
  private made: HTMLAnchorElement[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.style.display = "none";
    const start = () => this.apply();
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", start, { once: true })
      : queueMicrotask(start);
  }

  disconnectedCallback() {
    this.made.forEach((a) => a.remove());
    this.made = [];
    super.disconnectedCallback();
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("target") || changed.has("levels")) this.apply();
  }

  /** (Re)apply anchors, e.g. after loading new content. */
  apply() {
    const root = resolveTarget(this, this.target);
    if (!root) return;
    for (const h of collectHeadings(root, parseLevels(this.levels))) {
      if (!h.el || h.el.querySelector(":scope > a.strata-anchor")) continue;
      const a = document.createElement("a");
      a.className = "strata-anchor";
      a.href = `#${h.id}`;
      a.textContent = "#";
      a.setAttribute("aria-label", `${this.label}: ${h.text}`);
      a.style.cssText = "display:inline-flex;margin-inline-start:0.45em;color:var(--strata-color-text-secondary);font:var(--strata-type-label-medium) var(--strata-font-mono);text-decoration:none;vertical-align:middle;";
      h.el.append(a);
      this.made.push(a);
    }
  }

  render() {
    return html`<slot hidden></slot>`;
  }
}
