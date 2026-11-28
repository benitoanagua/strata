import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

@customElement("strata-nav")
export class StrataNav extends StrataElement {
  static styles = [
    StrataElement.styles,
    css`
      :host { display: block; width: 100%; }
      .strata-nav { display:flex; align-items:center; justify-content:space-between; gap:16px; width:100%; }
      .strata-nav__items { display:flex; align-items:center; gap:4px; min-width:0; }
      .strata-nav__toggle {
        display:none; align-items:center; justify-content:center; width:40px; height:40px;
        border:1px solid var(--strata-color-border-subtle); border-radius:var(--strata-radius-small);
        background:var(--strata-color-surface-page); color:var(--strata-color-text-primary);
      }
      .strata-nav__toggle:focus-visible { outline:2px solid var(--strata-color-focus-ring); outline-offset:2px; }
      @media (max-width:640px) {
        .strata-nav { align-items:flex-start; flex-wrap:wrap; }
        .strata-nav__toggle { display:inline-flex; margin-inline-start:auto; }
        .strata-nav__items {
          display:none; flex:0 0 100%; flex-direction:column; align-items:stretch; gap:2px;
          padding:8px 0; border-top:1px solid var(--strata-color-border-subtle);
        }
        .strata-nav__items[data-expanded] { display:flex; }
      }
    `,
  ];
  @property({ type: String }) label = "Primary navigation";
  @property({ type: String, attribute: "menu-label" }) menuLabel = "Open navigation";
  @state() private expanded = false;
  private toggleMenu = () => { this.expanded = !this.expanded; };
  private closeAfterNavigation = (event: Event) => {
    const item = event.composedPath().find((node) => node instanceof HTMLElement && node.tagName === "STRATA-NAV-ITEM") as HTMLElement | undefined;
    if (item) this.expanded = false;
  };
  render() {
    return html`<div class="strata-nav">
      <button class="strata-nav__toggle" type="button" aria-label=${this.menuLabel}
        aria-expanded=${this.expanded} @click=${this.toggleMenu}>
        <iconify-icon icon=${this.expanded ? "carbon:close" : "carbon:menu"} aria-hidden="true"></iconify-icon>
      </button>
      <nav aria-label=${this.label} class="strata-nav__items" ?data-expanded=${this.expanded}
        @click=${this.closeAfterNavigation}><slot></slot></nav>
    </div>`;
  }
}
