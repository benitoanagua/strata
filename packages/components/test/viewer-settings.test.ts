import { describe, it, expect } from "vitest";
import "../src/elements/index.ts";

async function mount() {
  const el = document.createElement("strata-viewer-settings") as HTMLElement & {
    theme: string;
    surface: string;
    viewport: string;
    motion: string;
    open: boolean;
    updateComplete: Promise<unknown>;
  };
  document.body.appendChild(el);
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

function toggle(el: HTMLElement) {
  return el.shadowRoot?.querySelector(".vs-toggle") as HTMLElement;
}

describe("strata-viewer-settings", () => {
  it("renders a collapsed settings toggle", async () => {
    const el = await mount();
    const btn = toggle(el);
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    const panel = el.shadowRoot?.querySelector(".vs-panel");
    expect(panel?.hasAttribute("hidden")).toBe(true);
    el.remove();
  });

  it("opens the panel and shows the four settings", async () => {
    const el = await mount();
    toggle(el).click();
    await el.updateComplete;
    expect(toggle(el).getAttribute("aria-expanded")).toBe("true");
    const panel = el.shadowRoot?.querySelector(".vs-panel");
    expect(panel?.hasAttribute("hidden")).toBe(false);
    const selects = el.shadowRoot?.querySelectorAll("strata-select");
    expect(selects).toHaveLength(4);
    for (const select of selects ?? []) {
      const options = select.shadowRoot?.querySelectorAll("option");
      expect(options?.length).toBeGreaterThan(0);
    }
    el.remove();
  });

  it("emits strata-change with the full settings object", async () => {
    const el = await mount();
    const events: unknown[] = [];
    el.addEventListener("strata-change", (e) =>
      events.push((e as CustomEvent).detail.value),
    );
    // Simulate a strata-select change coming from the panel.
    const select = el.shadowRoot?.querySelector(
      'strata-select[label="Theme"]',
    ) as HTMLElement & { theme?: string };
    select.dispatchEvent(
      new CustomEvent("strata-change", {
        bubbles: true,
        composed: true,
        detail: { value: "dark" },
      }),
    );
    await el.updateComplete;
    expect(el.getAttribute("theme")).toBe("dark");
    expect(events).toEqual([
      { theme: "dark", surface: "auto", viewport: "desktop", motion: "system" },
    ]);
    el.remove();
  });

  it("closes on Escape", async () => {
    const el = await mount();
    toggle(el).click();
    await el.updateComplete;
    el.shadowRoot
      ?.querySelector(".viewer-settings")
      ?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    await el.updateComplete;
    expect(toggle(el).getAttribute("aria-expanded")).toBe("false");
    el.remove();
  });

  it("closes on outside pointerdown and removes the listener on disconnect", async () => {
    const el = await mount();
    toggle(el).click();
    await el.updateComplete;
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(toggle(el).getAttribute("aria-expanded")).toBe("false");
    // Re-open then disconnect: no leaked listeners throw.
    toggle(el).click();
    await el.updateComplete;
    el.remove();
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  });
});
