import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emitValueEvent } from "../../events.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";

export interface StrataSelectOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

const jsonConverter = {
  fromAttribute(value: string | null): unknown {
    if (!value) return [];
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  toAttribute(value: unknown): string {
    return JSON.stringify(value ?? []);
  },
};

type NormalizedOption = { value: string; label: string; disabled?: boolean };

@customElement("strata-select")
export class StrataSelect extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      label {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 6px;
        font: var(--strata-type-label-medium) var(--strata-font-sans);
      }
      select {
        width: 100%;
        min-width: 0;
        min-height: 44px;
        padding: 9px 36px 9px 12px;
        border: var(--strata-border-small) solid
          var(--strata-color-border-subtle);
        border-radius: var(--strata-radius-small);
        background: var(--strata-color-surface-page);
        color: var(--strata-color-text-primary);
        font: var(--strata-type-body-medium) var(--strata-font-sans);
      }
      select:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 2px;
      }
      select:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    `,
  ];

  @property() label = "";
  @property() value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * Options as strings or { value, label, disabled } objects. Native <option>
   * children are supported too and are mirrored into the internal select.
   */
  @property({ attribute: "options", converter: jsonConverter })
  options: Array<string | StrataSelectOption> = [];

  private slotOptions: NormalizedOption[] = [];
  private optionObserver?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    this.syncSlottedOptions();
    this.optionObserver = new MutationObserver(() => this.syncSlottedOptions());
    this.optionObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  }

  disconnectedCallback() {
    this.optionObserver?.disconnect();
    this.optionObserver = undefined;
    super.disconnectedCallback();
  }

  private syncSlottedOptions() {
    this.slotOptions = Array.from(this.querySelectorAll("option")).map((option) => ({
      value: option.value,
      label: option.textContent?.trim() || option.value,
      disabled: option.disabled,
    }));
    this.requestUpdate();
  }

  private handleInput(event: Event) {
    if (this.disabled) return;
    this.value = (event.target as HTMLSelectElement).value;
    emitValueEvent(this, "strata-input", this.value);
  }

  private handleChange() {
    if (!this.disabled) emitValueEvent(this, "strata-change", this.value);
  }

  private normalizedOptions(): NormalizedOption[] {
    const items: unknown = this.options;
    const normalized = (Array.isArray(items) ? items : []).flatMap((item) => {
      if (typeof item === "string") {
        return [{ value: item, label: item }];
      }
      if (
        item &&
        typeof item === "object" &&
        typeof (item as StrataSelectOption).value === "string"
      ) {
        const option = item as StrataSelectOption;
        return [{
          value: option.value,
          label: option.label ?? option.value,
          disabled: option.disabled,
        }];
      }
      return [];
    });
    return normalized.length ? normalized : this.slotOptions;
  }

  render() {
    return html`<label>
      ${this.label}
      <select
        .value=${this.value}
        ?disabled=${this.disabled}
        @input=${this.handleInput}
        @change=${this.handleChange}
      >
        ${this.normalizedOptions().map(
          (option) => html`<option value=${option.value} ?disabled=${option.disabled ?? false}>${option.label}</option>`,
        )}
      </select>
    </label>`;
  }
}
