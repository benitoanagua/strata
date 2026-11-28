import { describe, expect, it } from "vitest";
import "../src/elements/index.ts";
import { STRATA_COMPONENT_CATALOG } from "../src/elements/ComponentCatalog";

const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "summary",
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="textbox"]',
  '[role="searchbox"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[role="region"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="complementary"]',
  '[role="form"]',
  '[role="search"]',
].join(",");

function hasAccessibleName(el: Element, host?: Element): boolean {
  if (el.getAttribute("aria-label")?.trim()) return true;
  if (el.getAttribute("aria-labelledby")?.trim()) return true;
  if (el.getAttribute("title")?.trim()) return true;
  if (el.getAttribute("placeholder")?.trim()) return true;
  if (el.textContent?.trim()) return true;
  const label = el.closest("label");
  if (label?.textContent?.trim()) return true;
  if (el instanceof HTMLInputElement && ["checkbox", "radio"].includes(el.type))
    return true;
  // Slotted light-DOM content names controls that render a <slot>.
  if (host && el.querySelector("slot") && host.textContent?.trim()) return true;
  return false;
}

describe.each(STRATA_COMPONENT_CATALOG.map((name) => [name, `strata-${name}`]))(
  "STRATA <%s>",
  (_name, tagName) => {
    async function mount() {
      const el = document.createElement(tagName);
      for (const attr of [
        "label",
        "title",
        "message",
        "text",
        "name",
        "placeholder",
        "items",
      ])
        el.setAttribute(attr, "STRATA");
      el.setAttribute("open", "");
      el.textContent = "STRATA";
      document.body.appendChild(el);
      await (el as unknown as { updateComplete: Promise<unknown> })
        .updateComplete;
      await (el as unknown as { updateComplete: Promise<unknown> })
        .updateComplete;
      return el;
    }

    it("is registered as a custom element", () => {
      expect(customElements.get(tagName)).toBeTruthy();
    });

    it("renders without throwing", async () => {
      const el = await mount();
      const rendered =
        (el.shadowRoot?.innerHTML.trim().length ?? 0) > 0 ||
        el.textContent?.trim().length > 0;
      expect(rendered, `<${tagName}> produced no DOM`).toBe(true);
      el.remove();
    });

    it("gives interactive content an accessible name", async () => {
      const el = await mount();
      const controls = Array.from(
        el.shadowRoot?.querySelectorAll(INTERACTIVE_SELECTOR) ?? [],
      );
      const unnamed = controls.filter((control) => {
        if (control.closest('[aria-hidden="true"]')) return false;
        if (control instanceof HTMLElement && control.hidden) return false;
        return !hasAccessibleName(control, el);
      });
      expect(
        unnamed.map((control) =>
          control instanceof HTMLElement
            ? control.outerHTML.slice(0, 120)
            : String(control),
        ),
        `<${tagName}> interactive elements missing accessible names`,
      ).toHaveLength(0);
      el.remove();
    });
  },
);


describe("removed compatibility elements", () => {
  it("does not register obsolete Tag, Dialog or Snackbar custom elements", () => {
    expect(customElements.get("strata-tag")).toBeUndefined();
    expect(customElements.get("strata-tag-list")).toBeUndefined();
    expect(customElements.get("strata-dialog")).toBeUndefined();
    expect(customElements.get("strata-button-group")).toBeUndefined();
    expect(customElements.get("strata-snackbar")).toBeUndefined();
  });
});
