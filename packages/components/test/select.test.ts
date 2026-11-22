import { describe, it, expect } from "vitest";
import "../src/elements/index.ts";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("strata-select") as HTMLElement & {
    value: string;
    options: unknown[];
    updateComplete: Promise<unknown>;
  };
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

function innerSelect(el: HTMLElement) {
  return el.shadowRoot?.querySelector("select") as HTMLSelectElement;
}

describe("strata-select options", () => {
  it("renders string options as real option elements", async () => {
    const el = await mount();
    el.options = ["light", "dark"];
    await el.updateComplete;
    const options = innerSelect(el).querySelectorAll("option");
    expect([...options].map((o) => o.value)).toEqual(["light", "dark"]);
    expect([...options].map((o) => o.textContent)).toEqual(["light", "dark"]);
    el.remove();
  });

  it("renders { value, label } options with distinct labels", async () => {
    const el = await mount();
    el.options = [{ value: "andean", label: "Andina" }];
    await el.updateComplete;
    const option = innerSelect(el).querySelector("option");
    expect(option?.value).toBe("andean");
    expect(option?.textContent).toBe("Andina");
    el.remove();
  });

  it("parses a JSON options attribute", async () => {
    const el = await mount({ options: '["a","b"]' });
    expect(innerSelect(el).querySelectorAll("option")).toHaveLength(2);
    el.remove();
  });

  it("ignores malformed option entries", async () => {
    const el = await mount();
    el.options = ["ok", 42, null, { label: "no value" }] as unknown[];
    await el.updateComplete;
    const options = innerSelect(el).querySelectorAll("option");
    expect(options).toHaveLength(1);
    expect(options[0].value).toBe("ok");
    el.remove();
  });
});
