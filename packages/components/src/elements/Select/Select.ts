import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emitValueEvent } from "../../events.js";

export interface StrataSelectOption {
  value: string;
  label?: string;
}

const jsonConverter = {
  fromAttribute: (value: string | null): unknown => {
    if (value === null) return [];
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  toAttribute: (value: unknown): string => JSON.stringify(value ?? []),
};

@customElement("strata-select")
export class StrataSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    label {
      display: grid;
      gap: 6px;
      font: var(--strata-type-label-medium) var(--strata-font-sans);
    }
    select {
      min-height: 40px;
      padding: 9px 12px;
      border: var(--strata-border-small) solid var(--strata-color-border-subtle);
      border-radius: var(--strata-radius-small);
      background: var(--strata-color-surface-page);
      color: var(--strata-color-text-primary);
      font: var(--strata-type-body-medium) var(--strata-font-sans);
    }
  `;
  @property() label = "";
  @property() value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * Select options as strings or `{ value, label }` objects. Rendered as real
   * `<option>` children of the inner `<select>` — slotted `<option>` elements
   * do not register as options inside shadow DOM, so this prop (or a JSON
   * string via the `options` attribute) is the supported API.
   */
  @property({ attribute: "options", converter: jsonConverter })
  options: Array<string | StrataSelectOption> = [];

  private handleInput(event: Event) {
    if (this.disabled) return;
    this.value = (event.target as HTMLSelectElement).value;
    emitValueEvent(this, "strata-input", this.value);
  }
  private handleChange() {
    if (!this.disabled) emitValueEvent(this, "strata-change", this.value);
  }

  private normalizedOptions(): Array<{ value: string; label: string }> {
    const list: unknown = this.options;
    const items = Array.isArray(list) ? list : [];
    return items
      .map((item): { value: string; label: string } | undefined => {
        if (typeof item === "string") return { value: item, label: item };
        if (
          item &&
          typeof item === "object" &&
          typeof (item as StrataSelectOption).value === "string"
        ) {
          const opt = item as StrataSelectOption;
          return { value: opt.value, label: opt.label ?? opt.value };
        }
        return undefined;
      })
      .filter((o): o is { value: string; label: string } => o !== undefined);
  }

  render() {
    return html`<label
      >${this.label}<select
        .value=${this.value}
        ?disabled=${this.disabled}
        @input=${this.handleInput}
        @change=${this.handleChange}
      >
        ${this.normalizedOptions().map(
          (opt) => html`<option value=${opt.value}>${opt.label}</option>`,
        )}
      </select></label
    >`;
  }
}
