import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
@customElement("strata-data-table")
export class StrataDataTable extends LitElement {
  static styles = css`
    :host {
      display: block;
      overflow: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font: var(--strata-type-body-medium) var(--strata-font-serif);
    }
    th {
      text-align: left;
      font: var(--strata-type-label-medium) var(--strata-font-sans);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: var(--strata-border-large) solid
        var(--strata-color-border-strong);
      padding: 10px;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid var(--strata-color-border-subtle);
    }
    td.numeric,
    th.numeric {
      font-family: var(--strata-font-mono);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    tbody tr:hover {
      background: var(--strata-color-gray-50);
    }
  `;
  render() {
    return html`<table>
      <slot></slot>
    </table>`;
  }
}
