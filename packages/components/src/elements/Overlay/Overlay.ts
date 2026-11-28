import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import baseCSS from "../../component-base.css?inline";
import componentCSS from "./Overlay.css?inline";
import type {
  OverlayAlign,
  OverlayPosition,
  OverlayFill,
  OverlayBox,
} from "../../types/overlay.js";
import type { CardHeading, CardAspectRatio } from "../../types/card.js";
import { TitleRendererMixin } from "../../mixins/TitleRenderer.js";
import { safeHref } from "../../utils/items.js";

// Aplicar el mixin a la clase base
const BaseClass = TitleRendererMixin(LitElement);

@customElement("strata-overlay")
export class StrataOverlay extends BaseClass {
  static styles = [unsafeCSS(baseCSS), unsafeCSS(componentCSS)];

  @property({ type: String }) title = "";
  /** Grayscale the image layer without affecting overlay text. */
  @property({ type: Boolean }) monochrome = true;
  /** Use the active token theme by default, or force light/dark presentation. */
  @property({ type: String }) theme: "auto" | "light" | "dark" = "auto";
  @property({ type: String }) url = "";
  @property({ type: String, attribute: "feature-image" }) feature_image = "";
  @property({ type: String, attribute: "tag-name" }) tag_name = "";
  @property({ type: String, attribute: "author-name" }) author_name = "";
  @property({ type: String, attribute: "published-at" }) published_at = "";
  @property({ type: String, attribute: "reading-time" }) reading_time = "";
  @property({ type: String, attribute: "aspect-ratio" })
  aspect_ratio: CardAspectRatio = "monitor";
  @property({ type: Number, reflect: true }) heading: CardHeading = 1;
  @property({ type: Boolean, attribute: "show-meta" }) show_meta = false;
  @property({ type: Boolean, attribute: "show-category" }) show_category =
    false;
  @property({ type: String, attribute: "font-group" }) font_group:
    "default" | "supplement" | "sans" | "serif" = "default";
  @property({ type: String }) align: OverlayAlign = "center";
  @property({ type: String }) position: OverlayPosition = "center";
  @property({ type: String }) box: OverlayBox = "background";
  @property({ type: String }) fill: OverlayFill = "full";
  @property({ type: Boolean, attribute: "is-dark" }) is_dark = false;

  protected createRenderRoot() {
    return this;
  }

  private getOverlayClasses() {
    const classes = [
      "strata-overlay",
      `strata-overlay--align-${this.align}`,
      `strata-overlay--position-${this.position}`,
      `strata-overlay--aspect-${this.aspect_ratio}`,
      `strata-overlay--font-${this.font_group}`,
      `strata-overlay--theme-${this.is_dark ? "dark" : this.theme}`,
    ];
    if (this.feature_image) classes.push("strata-overlay--has-image");
    if (this.monochrome) classes.push("strata-overlay--monochrome");

    if (this.fill !== "none") {
      classes.push(`strata-overlay--fill-${this.fill}`);
    }

    // Añadir la clase del tipo de box al contenedor principal
    classes.push(`strata-overlay--box-${this.box}`);
    return classes.join(" ");
  }

  render() {
    const url = safeHref(this.url);
    const image = this.feature_image
      ? `--strata-overlay-image: url("${this.feature_image.replace(/["\\\n\r]/g, "")}")`
      : "";
    return html`
      <div class="${this.getOverlayClasses()}" style="${image}">
        <div class="strata-overlay__content">
          ${
            this.show_category && this.tag_name
              ? html`
                  <span class="strata-overlay__category">${this.tag_name}</span>
                `
              : ""
          }

          <a href="${url}" class="strata-overlay__title-link">
            ${this.renderTitle()}
          </a>

          ${
            this.show_meta
              ? html`
                  <ul class="strata-overlay__meta">
                    ${
                      this.author_name
                        ? html`
                            <li class="strata-overlay__meta-item">
                              ${this.author_name}
                            </li>
                          `
                        : ""
                    }
                    ${
                      this.published_at
                        ? html`
                            <li class="strata-overlay__meta-item">
                              ${this.published_at}
                            </li>
                          `
                        : ""
                    }
                    ${
                      this.reading_time
                        ? html`
                            <li class="strata-overlay__meta-item">
                              ${this.reading_time}
                            </li>
                          `
                        : ""
                    }
                  </ul>
                `
              : ""
          }
        </div>
      </div>
    `;
  }
}
