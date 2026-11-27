import { LitElement, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import mainCSS from "../../main.css?inline";

const STRATA_WORDMARK = "Strata";

@customElement("strata-logo")
export class StrataLogo extends LitElement {
  static styles = [unsafeCSS(mainCSS)];

  // El componente usa el sistema de estilos global de STRATA
  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.className.trim()) {
      this.className = "strata-logo--default";
    }
    this.classList.add("strata-logo");
  }

  render() {
    return html`<span
      class="strata-logo__wordmark"
      role="img"
      aria-label="Strata"
      >${STRATA_WORDMARK}</span
    >`;
  }
}
