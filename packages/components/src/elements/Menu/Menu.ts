import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

/** Sidebar navigation. Uses standard link tab order, not ARIA command-menu semantics. */
@customElement("strata-menu")
export class StrataMenu extends StrataElement {
  static styles = [
    StrataElement.styles,
    css`
      .strata-menu { display:grid; align-content:start; gap:2px; min-width:180px; padding:6px;
        border:1px solid var(--strata-color-border-subtle); border-radius:var(--strata-radius-medium);
        background:var(--strata-color-surface-raised); }
      .strata-menu[hidden] { display:none; }
    `,
  ];
  @property({ type:Boolean, reflect:true }) open = true;
  @property() label = "Sidebar navigation";
  render() {
    return html`<nav class="strata-menu" aria-label=${this.label} ?hidden=${!this.open}><slot></slot></nav>`;
  }
}
