import { describe, it, expect } from "vitest";
import "../src/elements/index.ts";

async function mount<T extends HTMLElement>(tag: string): Promise<T> {
  const el = document.createElement(tag) as T;
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  return el;
}

function flush() {
  return new Promise((r) => setTimeout(r, 0));
}

describe("overlay accessibility fixes", () => {
  it("bottom-sheet exposes a single dialog role and an accessible name", async () => {
    const el = await mount<HTMLElement & { open: boolean }>(
      "strata-bottom-sheet",
    );
    el.setAttribute("title", "Opciones");
    el.open = true;
    await flush();
    const section = el.shadowRoot?.querySelector("[role=dialog]");
    expect(section).toBeTruthy();
    expect(el.shadowRoot?.querySelectorAll("[role=dialog]").length).toBe(1);
    expect(section?.getAttribute("aria-label")).toBe("Opciones");
    el.remove();
  });

  it("bottom-sheet falls back to a label and closes on Escape", async () => {
    const el = await mount<HTMLElement & { open: boolean }>(
      "strata-bottom-sheet",
    );
    el.open = true;
    await flush();
    const section = el.shadowRoot?.querySelector("[role=dialog]");
    expect(section?.getAttribute("aria-label")).toBe("Bottom sheet");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flush();
    expect(el.open).toBe(false);
    el.remove();
  });

  it("drawer moves focus inside on open and restores it on close", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const el = await mount<HTMLElement & { open: boolean }>("strata-drawer");
    el.setAttribute("title", "Filtros");
    el.open = true;
    await flush();
    await flush();
    const focused = el.shadowRoot?.activeElement;
    expect(focused).toBeTruthy();
    el.open = false;
    await flush();
    expect(document.activeElement).toBe(trigger);
    el.remove();
    trigger.remove();
  });

  it("dialog closes on Escape and keeps a fallback accessible name", async () => {
    const el = await mount<HTMLElement & { open: boolean }>("strata-dialog");
    el.open = true;
    await flush();
    const content = el.shadowRoot?.querySelector("[role=dialog]");
    expect(content?.getAttribute("aria-label")).toBe("Dialog");
    content?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await flush();
    expect(el.open).toBe(false);
    el.remove();
  });

  it("modal exposes a fallback accessible name when title is empty", async () => {
    const el = await mount<HTMLElement & { open: boolean }>("strata-modal");
    el.open = true;
    await flush();
    const content = el.shadowRoot?.querySelector("[role=dialog]");
    expect(content?.getAttribute("aria-label")).toBe("Modal");
    el.remove();
  });
});

describe("DataTable prop-driven API", () => {
  it("renders columns and rows from pipe-delimited strings", async () => {
    const el = await mount<HTMLElement>("strata-data-table");
    el.setAttribute("columns", "Name|Score");
    el.setAttribute("rows", "Alpha|9.1\nBeta|8.4");
    await flush();
    const table = el.shadowRoot?.querySelector("table");
    expect(table).toBeTruthy();
    expect(table?.querySelectorAll("th")).toHaveLength(2);
    expect(table?.querySelectorAll("tbody tr")).toHaveLength(2);
    expect(table?.textContent).toContain("Alpha");
    el.remove();
  });

  it("renders JSON columns with numeric alignment", async () => {
    const el = await mount<HTMLElement>("strata-data-table");
    el.setAttribute(
      "columns",
      '[{"label":"Name"},{"label":"Score","numeric":true}]',
    );
    el.setAttribute("rows", '[["Alpha",9.1],["Beta",8.4]]');
    await flush();
    const numericTh = el.shadowRoot?.querySelector("th.numeric");
    expect(numericTh?.textContent?.trim()).toBe("Score");
    const numericTd = el.shadowRoot?.querySelector("td.numeric");
    expect(numericTd?.textContent?.trim()).toBe("9.1");
    el.remove();
  });

  it("accepts JS arrays directly", async () => {
    const el = (await mount<HTMLElement>(
      "strata-data-table",
    )) as HTMLElement & {
      columns: unknown;
      rows: unknown;
      updateComplete: Promise<unknown>;
    };
    el.columns = ["A", "B"];
    el.rows = [["1", "2"]];
    await el.updateComplete;
    await flush();
    expect(el.shadowRoot?.querySelectorAll("td")).toHaveLength(2);
    el.remove();
  });
});

describe("FileUpload", () => {
  it("emits strata-change with selected file names", async () => {
    const el = await mount<HTMLElement>("strata-file-upload");
    const input = el.shadowRoot?.querySelector("input");
    expect(input).toBeTruthy();
    const file = new File(["x"], "notes.pdf", { type: "application/pdf" });
    Object.defineProperty(input, "files", {
      value: [file],
      configurable: true,
    });
    const events: unknown[] = [];
    el.addEventListener("strata-change", (e) =>
      events.push((e as CustomEvent).detail.value),
    );
    input?.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();
    expect(events).toEqual([["notes.pdf"]]);
    expect(
      el.shadowRoot?.querySelector(".strata-file-upload__files li")
        ?.textContent,
    ).toBe("notes.pdf");
    el.remove();
  });
});

describe("axe regressions", () => {
  it("filter-bar keeps list items inside a real list", async () => {
    const el = await mount<HTMLElement>("strata-filter-bar");
    const group = el.shadowRoot?.querySelector('[role="group"]');
    const ul = group?.querySelector("ul");
    expect(ul).toBeTruthy();
    expect(ul?.getAttribute("role")).toBeNull();
    expect(ul?.querySelectorAll(":scope > li").length).toBeGreaterThan(0);
    el.remove();
  });

  it("ticker exposes its scrollable list to the keyboard", async () => {
    const el = await mount<HTMLElement>("strata-ticker");
    const ul = el.shadowRoot?.querySelector("ul");
    expect(ul?.getAttribute("tabindex")).toBe("0");
    el.remove();
  });

  it("comment maps role-label to its badge without touching ARIA role", async () => {
    const el = await mount<HTMLElement>("strata-comment");
    el.setAttribute("role-label", "Autor");
    el.setAttribute("author", "Ana");
    await flush();
    expect((el as unknown as { role: string }).role).toBe("Autor");
    expect(el.getAttribute("role")).toBeNull();
    el.remove();
  });
});
