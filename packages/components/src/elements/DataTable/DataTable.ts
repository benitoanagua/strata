import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

interface Column {
  label: string;
  numeric?: boolean;
}

function toColumns(value: unknown): Column[] {
  let raw = value;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return [];
    if (text.startsWith("[")) {
      try {
        raw = JSON.parse(text);
      } catch {
        raw = text.split("|");
      }
    } else {
      raw = text.split("|");
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") return entry ? { label: entry } : null;
      if (entry && typeof entry === "object") {
        const e = entry as Record<string, unknown>;
        const label = String(e.label ?? e.key ?? "");
        if (!label) return null;
        return { label, numeric: Boolean(e.numeric) };
      }
      return null;
    })
    .filter((c): c is Column => c !== null);
}

function toRows(value: unknown): string[][] {
  let raw = value;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return [];
    if (text.startsWith("[")) {
      try {
        raw = JSON.parse(text);
      } catch {
        raw = [];
      }
    } else {
      raw = text
        .split("\n")
        .map((line) => line.split("|"))
        .filter((cells) => cells.some((c) => c.trim()));
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) =>
      Array.isArray(row)
        ? row.map((cell) => String(cell ?? ""))
        : [String(row ?? "")],
    )
    .filter((cells) => cells.some((c) => c.trim()));
}

/**
 * Data table. `columns` accepts a pipe list (`Name|Zone`) or JSON
 * (`[{"label":"Name","numeric":true}]`); `rows` accepts a JSON array of
 * arrays or newline/pipe rows (`Alameda|Oeste|42`).
 */
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

  @property() columns: string | unknown[] = "";
  @property() rows: string | unknown[] = "";

  render() {
    const cols = toColumns(this.columns);
    const body = toRows(this.rows);
    if (!cols.length && !body.length) return html``;
    return html`<table>
      ${
        cols.length
          ? html`<thead>
              <tr>
                ${cols.map(
                  (c) =>
                    html`<th class="${c.numeric ? "numeric" : ""}">
                      ${c.label}
                    </th>`,
                )}
              </tr>
            </thead>`
          : ""
      }
      <tbody>
        ${body.map(
          (cells) =>
            html`<tr>
              ${cells.map(
                (cell, i) =>
                  html`<td class="${cols[i]?.numeric ? "numeric" : ""}">
                    ${cell}
                  </td>`,
              )}
            </tr>`,
        )}
      </tbody>
    </table>`;
  }
}
