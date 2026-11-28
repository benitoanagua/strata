import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import baseCSS from "../../component-base.css?inline";
import componentCSS from "./Grille.css?inline";
import type { GrilleProps, Gap } from "../../types/grille.js";

const STYLE_PROPERTIES = [
  "box-sizing",
  "width",
  "padding-right",
  "margin-right",
  "border-right-width",
  "border-right-style",
  "border-right-color",
  "padding-bottom",
  "margin-bottom",
  "border-bottom-width",
  "border-bottom-style",
  "border-bottom-color",
  "border-image",
] as const;

@customElement("strata-grille")
export class StrataGrille extends LitElement implements GrilleProps {
  static styles = [unsafeCSS(baseCSS), unsafeCSS(componentCSS)];

  @property({ type: Number }) desktop: GrilleProps["desktop"] = 3;
  @property({ type: Number }) mobile: GrilleProps["mobile"] = 3;
  @property({ type: String }) gap: Gap = "large";
  @property({ type: String }) color: NonNullable<GrilleProps["color"]> = "soft";

  @query(".strata-grille__container", true)
  private containerElement!: HTMLElement;

  @query("slot", true)
  private slotElement!: HTMLSlotElement;

  private resizeObserver?: ResizeObserver;
  private readonly originalStyles = new WeakMap<HTMLElement, Map<string, string>>();
  private readonly managedElements = new Set<HTMLElement>();
  private readonly handleResize = () => this.gridRendering();

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.handleResize);
  }

  firstUpdated() {
    if (typeof ResizeObserver === "function" && this.containerElement) {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.containerElement);
    }
    this.gridRendering();
  }

  updated() {
    this.gridRendering();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this.handleResize);
    this.restoreManagedElements();
  }

  private grid(
    columns: number,
    index: number,
    length: number,
  ): { rows: number; row: number; col: number } {
    const count = Math.max(1, Math.floor(Number(columns) || 1));
    const rows = Math.ceil(length / count);
    const row = Math.floor(index / count) + 1;
    const col = index % count;
    return { rows, row, col };
  }

  private rememberAndRestore(element: HTMLElement) {
    let original = this.originalStyles.get(element);
    if (!original) {
      original = new Map(
        STYLE_PROPERTIES.map((name) => [
          name,
          element.style.getPropertyValue(name),
        ]),
      );
      this.originalStyles.set(element, original);
    }
    for (const name of STYLE_PROPERTIES) {
      const value = original.get(name) ?? "";
      if (value) element.style.setProperty(name, value);
      else element.style.removeProperty(name);
    }
  }

  private restoreManagedElements() {
    for (const element of this.managedElements) {
      this.rememberAndRestore(element);
    }
    this.managedElements.clear();
  }

  private gridRendering = () => {
    if (!this.slotElement || !this.containerElement) return;

    const elements = this.slotElement
      .assignedElements()
      .filter((element) => element.tagName.toLowerCase() === "strata-grille-item")
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const current = new Set(elements);

    // Restore styles for items removed from the slot, and preserve consumer
    // inline styles before applying this component's layout declarations.
    for (const element of this.managedElements) {
      if (!current.has(element)) {
        this.rememberAndRestore(element);
        this.managedElements.delete(element);
      }
    }

    const isMobile = window.innerWidth < 768;
    const columns = Math.max(
      1,
      Math.floor(Number(isMobile ? this.mobile : this.desktop) || 1),
    );
    const gap = this.gap === "small" ? 8 : this.gap === "medium" ? 16 : 24;
    const width = this.containerElement.clientWidth;
    const itemWidth = Math.max(
      0,
      Math.floor((width - 2 * gap * (columns - 1)) / columns),
    );
    const borderColor =
      this.color === "muted"
        ? "var(--strata-color-border-strong)"
        : this.color === "hard"
          ? "var(--strata-color-text-primary)"
          : "var(--strata-color-border-subtle)";

    elements.forEach((element, index) => {
      this.rememberAndRestore(element);
      this.managedElements.add(element);

      const position = this.grid(columns, index, elements.length);
      const hasRight = position.col < columns - 1;
      const hasBottom = position.row < position.rows;

      element.style.boxSizing = "content-box";
      element.style.width = `${itemWidth - (hasRight ? 1 : 0)}px`;

      if (hasRight) {
        element.style.paddingRight = `${gap}px`;
        element.style.marginRight = `${gap}px`;
        element.style.borderRight = `1px solid ${borderColor}`;
      }
      if (hasBottom) {
        element.style.paddingBottom = `${gap}px`;
        element.style.marginBottom = `${gap}px`;
        element.style.borderBottom = `1px solid ${borderColor}`;
      }
      if (hasRight && hasBottom) {
        const corner = Math.round((2 * gap * Math.sqrt(2)) / 4 + 1);
        element.style.borderImage = `linear-gradient(315deg, transparent ${corner}px, ${borderColor} 0) 1`;
      }
    });
  };

  render() {
    return html`
      <div class="strata-grille__container">
        <slot @slotchange=${this.gridRendering}></slot>
      </div>
    `;
  }
}
