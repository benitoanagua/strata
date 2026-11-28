import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("strata-dialog")
export class StrataDialog extends LitElement {
  static styles = css`
    :host { display:contents; }
    .backdrop { position:fixed; inset:0; z-index:100; display:grid; place-items:center; padding:20px; background:color-mix(in srgb, var(--strata-color-black) 45%, transparent); }
    .content { box-sizing:border-box; width:min(100%,560px); max-height:90vh; overflow:auto; background:var(--strata-color-surface-page); color:var(--strata-color-text-primary); padding:24px; border:var(--strata-border-large) solid var(--strata-color-border-strong); border-radius:var(--strata-radius-large); }
    .header { display:flex; align-items:center; justify-content:space-between; gap:16px; margin:-24px -24px 20px; padding:18px 24px; border-bottom:1px solid var(--strata-color-border-subtle); }
    .title { margin:0; font:var(--strata-type-title-large) var(--strata-font-serif); }
    .actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; margin:20px -24px -24px; padding:16px 24px; border-top:1px solid var(--strata-color-border-subtle); }
    .content:focus-visible { outline:2px solid var(--strata-color-focus-ring); outline-offset:3px; }
    @media (max-width:480px) { .backdrop { padding:12px; } .content { padding:18px; } }
  `;
  @property({ type:Boolean, reflect:true }) open = false;
  @property() title = "";
  @property({ type:Boolean, attribute:"close-on-backdrop" }) closeOnBackdrop = true;
  @property({ type:Boolean, attribute:"close-on-escape" }) closeOnEscape = true;
  @state() private labelledBy = "";
  private previouslyFocused: HTMLElement | null = null;
  private previousBodyOverflow = "";
  private bodyScrollLocked = false;
  private static nextId = 0;
  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("open") && this.open) this.labelledBy = this.title ? `dialog-title-${++StrataDialog.nextId}` : "";
  }
  protected updated(changed: Map<string, unknown>) { if (changed.has("open")) this.open ? this.openDialog() : this.closeDialog(); }
  disconnectedCallback() { this.restoreFocus(); this.restoreBodyScroll(); super.disconnectedCallback(); }
  private openDialog() {
    this.previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!this.bodyScrollLocked) { this.previousBodyOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; this.bodyScrollLocked = true; }
    queueMicrotask(() => {
      const content = this.renderRoot.querySelector<HTMLElement>(".content");
      const first = content?.querySelector<HTMLElement>('strata-close-button,button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
      (first || content)?.focus();
    });
  }
  private closeDialog() { this.restoreFocus(); this.restoreBodyScroll(); }
  private restoreBodyScroll() { if (!this.bodyScrollLocked) return; document.body.style.overflow = this.previousBodyOverflow; this.bodyScrollLocked = false; }
  private restoreFocus() { this.previouslyFocused?.focus(); this.previouslyFocused = null; }
  private close = () => { this.open = false; };
  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.closeOnEscape) { e.preventDefault(); this.close(); return; }
    if (e.key !== "Tab") return;
    const content = this.renderRoot.querySelector<HTMLElement>(".content");
    if (!content) return;
    const items = [...content.querySelectorAll<HTMLElement>('strata-close-button,button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
    if (!items.length) { e.preventDefault(); content.focus(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  render() {
    if (!this.open) return html``;
    return html`<div class="backdrop" @click=${(e:Event) => { if (this.closeOnBackdrop && e.target === e.currentTarget) this.close(); }}>
      <section class="content" role="dialog" aria-modal="true" aria-labelledby=${this.labelledBy || nothing} aria-label=${this.title ? nothing : "Dialog"} tabindex="-1" @keydown=${this.handleKeydown} @strata-close=${this.close}>
        <header class="header">
          ${this.title ? html`<h2 class="title" id=${this.labelledBy}>${this.title}</h2>` : html`<slot name="header"><span class="title">Dialog</span></slot>`}
          <strata-close-button label="Close dialog"></strata-close-button>
        </header>
        <div class="body"><slot></slot></div>
        <footer class="actions"><slot name="actions"></slot></footer>
      </section>
    </div>`;
  }
}
