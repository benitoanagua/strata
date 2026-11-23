import { describe, it, expect } from "vitest";
import "../src/elements/index.ts";

async function mount(props: Record<string, unknown> = {}) {
  const el = document.createElement("strata-icon-button") as HTMLElement & {
    updateComplete: Promise<unknown>;
    pressed?: boolean;
    expanded?: boolean;
  };
  for (const [name, value] of Object.entries(props)) {
    (el as unknown as Record<string, unknown>)[name] = value;
  }
  document.body.appendChild(el);
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

function inner(el: HTMLElement) {
  return el.shadowRoot!.querySelector("button") as HTMLButtonElement;
}

describe("strata-icon-button toggle semantics", () => {
  it("renders aria-pressed on the inner button when pressed is set", async () => {
    const on = await mount({ label: "Wrap", pressed: true });
    expect(inner(on).getAttribute("aria-pressed")).toBe("true");
    const off = await mount({ label: "Wrap", pressed: false });
    expect(inner(off).getAttribute("aria-pressed")).toBe("false");
  });

  it("omits aria-pressed when the button is not a toggle", async () => {
    const el = await mount({ label: "Copy" });
    expect(inner(el).hasAttribute("aria-pressed")).toBe(false);
    expect(inner(el).hasAttribute("aria-expanded")).toBe(false);
  });

  it("renders aria-expanded for disclosure buttons", async () => {
    const el = await mount({ label: "Expand", expanded: false });
    expect(inner(el).getAttribute("aria-expanded")).toBe("false");
    el.expanded = true;
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    expect(inner(el).getAttribute("aria-expanded")).toBe("true");
  });
});
