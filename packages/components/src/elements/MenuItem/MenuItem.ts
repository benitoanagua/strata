import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement } from "../StrataBase.js";

@customElement("strata-menu-item")
export class StrataMenuItem extends StrataElement {
  static styles = [
    StrataElement.styles,
    css`
      :host { display:block; min-width:0; }
      .item { box-sizing:border-box; display:flex; width:100%; min-height:40px; align-items:center; gap:10px;
        padding:8px 12px; border:0; border-radius:var(--strata-radius-small); background:transparent;
        color:var(--strata-color-text-primary); font:var(--strata-type-body-medium) var(--strata-font-sans);
        text-align:left; text-decoration:none; cursor:pointer; }
      .item:hover { background:var(--strata-color-surface-hover); }
      .item:focus-visible { outline:2px solid var(--strata-color-focus-ring); outline-offset:-2px; }
      .item:disabled, .item[aria-disabled="true"] { color:var(--strata-color-text-disabled); cursor:not-allowed; }
      :host([selected]) .item { background:var(--strata-color-surface-selected); color:var(--strata-color-text-primary); font-weight:700; }
      iconify-icon { flex:0 0 auto; font-size:16px; }
    `,
  ];
  @property() label = "";
  @property() icon = "";
  @property() href = "";
  @property({ type:Boolean, reflect:true }) disabled = false;
  @property({ type:Boolean, reflect:true }) selected = false;
  focus() { this.renderRoot.querySelector<HTMLElement>("a,button")?.focus(); }
  render() {
    const content = html`${this.icon ? html`<iconify-icon icon=${this.icon} aria-hidden="true"></iconify-icon>` : ""}
      <span>${this.label || html`<slot></slot>`}</span>`;
    return this.href && !this.disabled
      ? html`<a class="item" href=${this.href} aria-current=${this.selected ? "page" : nothing}>${content}</a>`
      : html`<button class="item" type="button" ?disabled=${this.disabled} aria-current=${this.selected ? "page" : nothing}>${content}</button>`;
  }
}
