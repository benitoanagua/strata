import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emitValueEvent } from "../../events.js";

@customElement("strata-text-field")
export class StrataTextField extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .strata-text-field {
      display: grid;
      gap: 6px;
    }
    label {
      font: var(--strata-type-label-medium) var(--strata-font-sans);
    }
    input {
      width: 100%;
      min-height: 40px;
      padding: 9px 12px;
      border: var(--strata-border-small) solid var(--strata-color-border-subtle);
      border-radius: var(--strata-radius-small);
      background: var(--strata-color-surface-page);
      color: var(--strata-color-text-primary);
      font: var(--strata-type-body-medium) var(--strata-font-sans);
    }
    input:focus {
      border-color: var(--strata-color-focus-ring);
      outline: 2px solid
        color-mix(in srgb, var(--strata-color-focus-ring) 25%, transparent);
      outline-offset: 1px;
    }
    input[aria-invalid="true"] {
      border-color: var(--strata-color-status-error);
    }
    .strata-text-field__error {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      font: var(--strata-type-label-medium) var(--strata-font-sans);
      color: var(--strata-color-status-error);
    }
    .strata-text-field__error iconify-icon {
      font-size: 1em;
    }
  `;

  @property() label = "";
  @property() placeholder = "";
  @property() value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) error = false;
  @property() errorMessage = "";
  private readonly errorId = `strata-tf-error-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  private handleInput(event: Event) {
    if (this.disabled) return;
    this.value = (event.target as HTMLInputElement).value;
    emitValueEvent(this, "strata-input", this.value);
  }

  private handleChange() {
    if (!this.disabled) emitValueEvent(this, "strata-change", this.value);
  }

  render() {
    return html`<div class="strata-text-field">
      <label>${this.label}</label>
      <input
        .value=${this.value}
        .placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        aria-invalid=${this.error ? "true" : "false"}
        aria-describedby=${
          this.error && this.errorMessage ? this.errorId : nothing
        }
        @input=${this.handleInput}
        @change=${this.handleChange}
      />
      ${
        this.error && this.errorMessage
          ? html`<p
              id=${this.errorId}
              class="strata-text-field__error"
              role="alert"
            >
              <iconify-icon
                icon="carbon:error"
                aria-hidden="true"
              ></iconify-icon
              >${this.errorMessage}
            </p>`
          : nothing
      }
    </div>`;
  }
}
