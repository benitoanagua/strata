import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import baseCSS from "../../component-base.css?inline";
import componentCSS from "./ViewerSettings.css?inline";
import type {
  ViewerMotionPreference,
  ViewerSettingsValue,
  ViewerSurfacePreference,
  ViewerThemePreference,
  ViewerViewportPreference,
} from "../../types/viewer-settings.js";

type SettingKey = keyof ViewerSettingsValue;

/**
 * Generic viewer/canvas settings control. Renders a disclosure button and a
 * panel with one `strata-select` per setting: theme (system/light/dark),
 * surface (auto/light/dark/grid), viewport (desktop/tablet/mobile) and
 * motion (system/reduced).
 *
 * The component is controlled: set the properties and listen for
 * `strata-change` (`detail.value` is the full `ViewerSettingsValue`).
 * It knows nothing about routing, persistence or any specific app.
 */
@customElement("strata-viewer-settings")
export class StrataViewerSettings extends LitElement {
  static styles = [unsafeCSS(baseCSS), unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true })
  theme: ViewerThemePreference = "system";
  @property({ type: String, reflect: true })
  surface: ViewerSurfacePreference = "auto";
  @property({ type: String, reflect: true })
  viewport: ViewerViewportPreference = "desktop";
  @property({ type: String, reflect: true })
  motion: ViewerMotionPreference = "system";
  /** Accessible name of the toggle button and the settings group. */
  @property({ type: String }) label = "Viewer settings";
  /** Whether the settings panel is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  private readonly panelId = `strata-vs-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
  private outsideListener: ((e: Event) => void) | null = null;

  settings(): ViewerSettingsValue {
    return {
      theme: this.theme,
      surface: this.surface,
      viewport: this.viewport,
      motion: this.motion,
    };
  }

  private toggle() {
    this.open = !this.open;
  }

  private onSetting(key: SettingKey, event: Event) {
    // Keep the inner control's event from leaking: consumers only see the
    // normalized strata-change emitted by this component.
    event.stopPropagation();
    const value = (event as CustomEvent<{ value: string }>).detail?.value;
    if (typeof value !== "string") return;
    (this as unknown as Record<SettingKey, string>)[key] = value;
    this.dispatchEvent(
      new CustomEvent("strata-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.settings() },
      }),
    );
  }

  private onToggleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && this.open) {
      event.stopPropagation();
      this.open = false;
      this.renderRoot.querySelector<HTMLElement>(".vs-toggle")?.focus();
    }
  }

  private onDocumentPointerDown = (event: Event) => {
    if (!this.open) return;
    const path = event.composedPath();
    if (!path.includes(this)) this.open = false;
  };

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open && !this.outsideListener) {
        this.outsideListener = this.onDocumentPointerDown;
        document.addEventListener("pointerdown", this.outsideListener, true);
      } else if (!this.open && this.outsideListener) {
        document.removeEventListener("pointerdown", this.outsideListener, true);
        this.outsideListener = null;
      }
    }
  }

  disconnectedCallback() {
    if (this.outsideListener) {
      document.removeEventListener("pointerdown", this.outsideListener, true);
      this.outsideListener = null;
    }
    super.disconnectedCallback();
  }

  private setting(key: SettingKey, label: string, options: readonly string[]) {
    return html`
      <strata-select
        label=${label}
        .value=${this[key]}
        .options=${[...options]}
        @strata-change=${(e: Event) => this.onSetting(key, e)}
      ></strata-select>
    `;
  }

  render() {
    return html`
      <div class="viewer-settings" @keydown=${this.onToggleKeydown}>
        <button
          type="button"
          class="vs-toggle"
          aria-expanded=${this.open}
          aria-controls=${this.panelId}
          @click=${this.toggle}
        >
          <iconify-icon
            icon="carbon:settings"
            aria-hidden="true"
          ></iconify-icon>
          <span>${this.label}</span>
        </button>
        <div
          class="vs-panel"
          id=${this.panelId}
          role="group"
          aria-label=${this.label}
          ?hidden=${!this.open}
        >
          ${this.setting("theme", "Theme", ["system", "light", "dark"])}
          ${this.setting("surface", "Surface", [
            "auto",
            "light",
            "dark",
            "grid",
          ])}
          ${this.setting("viewport", "Viewport", [
            "desktop",
            "tablet",
            "mobile",
          ])}
          ${this.setting("motion", "Motion", ["system", "reduced"])}
        </div>
      </div>
    `;
  }
}
