import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Reading wrapper: adds the `strata-prose` class to the host so the
 * platform-agnostic prose stylesheet (`@strata/prose/prose.css`) styles
 * the slotted light-DOM content. The component itself ships no typography —
 * consumers must import `@strata/prose/prose.css` (or an equivalent
 * integration stylesheet).
 */
@customElement("strata-prose")
export class StrataProse extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;
  connectedCallback() {
    super.connectedCallback();
    this.classList.add("strata-prose");
  }
  render() {
    return html`<slot></slot>`;
  }
}
