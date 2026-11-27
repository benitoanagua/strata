import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";
import type { StrataNavItem } from "../NavItem/NavItem.js";

/**
 * Navigation landmark grouping `strata-nav-item` children. Arrow keys, Home
 * and End move focus between items; each item keeps its own `selected`
 * state. `strata-nav-item` also works standalone without this container.
 */
@customElement("strata-nav")
export class StrataNav extends StrataElement {
  static styles = StrataElement.styles;

  @property({ type: String }) label = "Main";

  @query("slot") private slotEl?: HTMLSlotElement;

  private items(): StrataNavItem[] {
    return (this.slotEl?.assignedElements({ flatten: true }) ?? []).filter(
      (el): el is StrataNavItem =>
        el instanceof HTMLElement && el.tagName === "STRATA-NAV-ITEM",
    );
  }

  private handleKeydown = (event: KeyboardEvent) => {
    const items = this.items().filter((item) => !item.hasAttribute("disabled"));
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
    return html`<nav
      class="strata-nav"
      aria-label=${this.label}
      @keydown=${this.handleKeydown}
    >
      <slot></slot>
    </nav>`;
  }
}
