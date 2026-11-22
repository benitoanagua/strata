import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";
import type { StrataMenuItem } from "../MenuItem/MenuItem.js";

@customElement("strata-menu")
export class StrataMenu extends StrataElement {
  @property({ type: Boolean }) open = true;
  @property({ type: String }) label = "Menu";

  @query("slot") private slotEl?: HTMLSlotElement;

  private items(): StrataMenuItem[] {
    return (this.slotEl?.assignedElements({ flatten: true }) ?? []).filter(
      (el): el is StrataMenuItem =>
        el instanceof HTMLElement && el.tagName === "STRATA-MENU-ITEM",
    );
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (!this.open) return;
    if (event.key === "Escape") {
      this.open = false;
      return;
    }
    const items = this.items().filter((item) => !item.disabled);
    if (!items.length) return;
    const active = document.activeElement as HTMLElement | null;
    const index = items.findIndex(
      (item) => item === active || item.contains(active),
    );
    let next = -1;
    switch (event.key) {
      case "ArrowDown":
        next = index < 0 ? 0 : (index + 1) % items.length;
        break;
      case "ArrowUp":
        next =
          index < 0
            ? items.length - 1
            : (index - 1 + items.length) % items.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    items[next]?.focus();
  };

  render() {
    return html`<div
      class="strata-menu"
      role="menu"
      aria-label=${this.label}
      ?hidden=${!this.open}
      @keydown=${this.handleKeydown}
    >
      <slot></slot>
    </div>`;
  }
}
