import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StrataElement, strataComponentStyles } from "../StrataBase.js";
import { emitValueEvent } from "../../events.js";

type Network = {
  label: string;
  icon: string;
  build?: (url: string, text: string) => string;
};

const NETWORKS: Record<string, Network> = {
  x: {
    label: "X",
    icon: "carbon:logo-x",
    build: (u, t) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  facebook: {
    label: "Facebook",
    icon: "carbon:logo-facebook",
    build: (u) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  linkedin: {
    label: "LinkedIn",
    icon: "carbon:logo-linkedin",
    build: (u) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
  },
  whatsapp: {
    label: "WhatsApp",
    icon: "carbon:chat",
    build: (u, t) =>
      `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`.trim())}`,
  },
  telegram: {
    label: "Telegram",
    icon: "carbon:send-alt",
    build: (u, t) =>
      `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  email: {
    label: "Email",
    icon: "carbon:email",
    build: (u, t) =>
      `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`,
  },
  copy: { label: "Copy link", icon: "carbon:link" },
};

export const STRATA_SHARE_NETWORKS = Object.keys(NETWORKS);

/**
 * Share actions rendered as monochrome Carbon glyphs — brand colours are
 * intentionally not reproduced. Each action has an accessible name.
 */
@customElement("strata-share")
export class StrataShare extends StrataElement {
  static styles = [
    strataComponentStyles,
    css`
      :host {
        display: inline-block;
      }
      ul {
        display: flex;
        gap: 2px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      :host([direction="col"]) ul {
        flex-direction: column;
      }
      a,
      button {
        display: inline-grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: var(--strata-radius-small);
        background: transparent;
        color: var(--strata-color-text-secondary);
        font-size: var(--strata-icon-medium);
        text-decoration: none;
      }
      a:hover,
      button:hover {
        background: var(--strata-color-surface-hover);
        color: var(--strata-color-text-primary);
      }
      a:focus-visible,
      button:focus-visible {
        outline: 2px solid var(--strata-color-focus-ring);
        outline-offset: 1px;
      }
      .status {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
      }
    `,
  ];
  @property({ type: String }) label = "Share";
  /** Pipe-separated: `x|facebook|linkedin|whatsapp|telegram|email|copy`. */
  @property({ type: String }) networks = "x|facebook|linkedin|email|copy";
  @property({ type: String }) url = "";
  @property({ type: String }) text = "";
  @property({ type: String, reflect: true }) direction: "row" | "col" = "row";
  private notice = "";

  private target() {
    return this.url || (typeof location !== "undefined" ? location.href : "");
  }

  private async copy() {
    try {
      await navigator.clipboard?.writeText(this.target());
      this.notice = "Link copied";
    } catch {
      this.notice = "Could not copy link";
    }
    emitValueEvent(this, "strata-change", {
      network: "copy",
      url: this.target(),
    });
    this.requestUpdate();
  }

  render() {
    const keys = this.networks
      .split("|")
      .map((n) => n.trim().toLowerCase())
      .filter((n) => n in NETWORKS);
    return html`<ul aria-label=${this.label}>
        ${keys.map((key) => {
          const net = NETWORKS[key];
          const icon = html`<iconify-icon
            icon=${net.icon}
            aria-hidden="true"
          ></iconify-icon>`;
          return html`<li>
            ${
              net.build
                ? html`<a
                    href=${net.build(this.target(), this.text)}
                    target=${key === "email" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    aria-label=${key === "email" ? "Share by email" : `Share on ${net.label}`}
                    >${icon}</a
                  >`
                : html`<button
                    type="button"
                    aria-label=${net.label}
                    @click=${this.copy}
                  >
                    ${icon}
                  </button>`
            }
          </li>`;
        })}
      </ul>
      <span class="status" role="status">${this.notice}</span>`;
  }
}
