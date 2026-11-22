import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { emitValueEvent } from "../../events.js";

@customElement("strata-file-upload")
export class StrataFileUpload extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      .strata-file-upload[data-dragging="true"] {
        border-style: solid;
        border-color: var(--strata-color-action-primary);
        background: var(--strata-color-surface-subtle);
      }
      .strata-file-upload__files {
        margin: 8px 0 0;
        padding: 0;
        list-style: none;
        font: var(--strata-type-label-medium) var(--strata-font-mono);
        color: var(--strata-color-text-secondary);
      }
      .strata-file-upload__files li {
        padding: 2px 0;
      }
    `,
  ];

  @property({ type: String }) accept = "";
  @property({ type: Boolean }) multiple = false;
  @property({ type: String }) label = "Choose file";
  @state() private fileNames: string[] = [];
  @state() private dragging = false;

  @query("input") private input?: HTMLInputElement;

  private handleChange() {
    const files = this.input?.files;
    this.fileNames = files ? Array.from(files, (f) => f.name) : [];
    emitValueEvent(this, "strata-change", this.fileNames);
  }

  private assignFiles(files: FileList | File[]) {
    const input = this.input;
    if (!input || typeof DataTransfer !== "function") return;
    const transfer = new DataTransfer();
    for (const file of Array.from(files)) transfer.items.add(file);
    input.files = transfer.files;
    this.handleChange();
  }

  private handleDrop = (event: DragEvent) => {
    event.preventDefault();
    this.dragging = false;
    const files = event.dataTransfer?.files;
    if (files?.length) this.assignFiles(files);
  };

  private handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    this.dragging = true;
  };

  private handleDragLeave = (event: DragEvent) => {
    if (
      event.currentTarget instanceof Node &&
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    )
      return;
    this.dragging = false;
  };

  render() {
    return html`<label
        class="strata-file-upload"
        ?data-dragging=${this.dragging}
        @drop=${this.handleDrop}
        @dragover=${this.handleDragOver}
        @dragleave=${this.handleDragLeave}
        ><iconify-icon icon="carbon:upload" aria-hidden="true"></iconify-icon
        ><span><slot>${this.label}</slot></span
        ><input
          type="file"
          accept=${this.accept}
          ?multiple=${this.multiple}
          @change=${this.handleChange}
        />
      </label>
      ${
        this.fileNames.length
          ? html`<ul
              class="strata-file-upload__files"
              aria-label="Selected files"
            >
              ${this.fileNames.map((name) => html`<li>${name}</li>`)}
            </ul>`
          : nothing
      }`;
  }
}
