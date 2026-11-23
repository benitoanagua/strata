import { describe, it, expect } from "vitest";
import "../src/elements/index.ts";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("strata-button") as HTMLElement & {
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

function inner(el: HTMLElement) {
  return el.querySelector("button, a") as HTMLElement;
}

describe("strata-button API surface", () => {
  it("applies variant, size and color classes for every declared value", async () => {
    for (const variant of ["filled", "outlined", "text", "elevated", "tonal"]) {
      for (const size of ["small", "medium", "large"]) {
        for (const color of [
          "primary",
          "secondary",
          "error",
          "success",
          "warning",
        ]) {
          const el = await mount({
            label: "Go",
            variant,
            size,
            color,
          });
          const cls = inner(el).className;
          expect(cls).toContain(`strata-button--variant-${variant}`);
          expect(cls).toContain(`strata-button--size-${size}`);
          expect(cls).toContain(`strata-button--color-${color}`);
          el.remove();
        }
      }
    }
  });

  it("keeps rendering the deprecated secondary color for compatibility", async () => {
    // `secondary` is deprecated in favor of variant="tonal" but must keep
    // working until the next major version.
    const el = await mount({ label: "Go", color: "secondary" });
    expect(inner(el).className).toContain("strata-button--color-secondary");
    el.remove();
  });

  it("renders a native button with type=button by default", async () => {
    const el = await mount({ label: "Save" });
    const btn = inner(el) as HTMLButtonElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.type).toBe("button");
    el.remove();
  });

  it("honours submit and reset types inside forms", async () => {
    for (const type of ["submit", "reset"]) {
      const el = await mount({ label: "Go", type });
      expect((inner(el) as HTMLButtonElement).type).toBe(type);
      el.remove();
    }
  });

  it("renders an <a role=button> when href is set", async () => {
    const el = await mount({ label: "Docs", href: "/docs" });
    const link = inner(el) as HTMLAnchorElement;
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("role")).toBe("button");
    expect(link.getAttribute("href")).toBe("/docs");
    el.remove();
  });

  it("falls back to a disabled native button when href + disabled", async () => {
    const el = await mount({ label: "Docs", href: "/docs", disabled: "" });
    const btn = inner(el) as HTMLButtonElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.disabled).toBe(true);
    el.remove();
  });
});

describe("strata-button states", () => {
  it("marks loading buttons disabled, busy and keeps the label for the accessible name", async () => {
    const el = await mount({ label: "Save", loading: "" });
    const btn = inner(el) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute("aria-busy")).toBe("true");
    const label = el.querySelector(".strata-button__label");
    expect(label?.textContent).toContain("Save");
    expect(label?.className).toContain("strata-button__label--hidden");
    expect(el.querySelector(".strata-button__spinner")).toBeTruthy();
    el.remove();
  });

  it("does not mark aria-busy when not loading", async () => {
    const el = await mount({ label: "Save" });
    expect(inner(el).getAttribute("aria-busy")).toBeNull();
    el.remove();
  });

  it("disables interaction when disabled", async () => {
    const el = await mount({ label: "Save", disabled: "" });
    const btn = inner(el) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain("strata-button--disabled");
    el.remove();
  });

  it("applies the full-width class", async () => {
    const el = await mount({ label: "Save", "full-width": "" });
    expect(inner(el).className).toContain("strata-button--full-width");
    el.remove();
  });
});

describe("strata-button icons and naming", () => {
  it("renders a leading carbon icon by default", async () => {
    const el = await mount({ label: "Add", icon: "carbon:add" });
    const icon = el.querySelector("iconify-icon");
    expect(icon?.getAttribute("icon")).toBe("carbon:add");
    expect(icon?.className).toContain("strata-button__icon--leading");
    el.remove();
  });

  it("renders a trailing icon when trailing-icon is set", async () => {
    const el = await mount({
      label: "Next",
      icon: "carbon:arrow-right",
      "trailing-icon": "",
    });
    const icon = el.querySelector("iconify-icon");
    expect(icon?.className).toContain("strata-button__icon--trailing");
    el.remove();
  });

  it("places the icon before the label by default and after it when trailing", async () => {
    const leading = await mount({ label: "Add", icon: "carbon:add" });
    const lIcon = leading.querySelector("iconify-icon")!;
    const lLabel = leading.querySelector(".strata-button__label")!;
    expect(
      lIcon.compareDocumentPosition(lLabel) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    leading.remove();

    const trailing = await mount({
      label: "Next",
      icon: "carbon:arrow-right",
      "trailing-icon": "",
    });
    const tIcon = trailing.querySelector("iconify-icon")!;
    const tLabel = trailing.querySelector(".strata-button__label")!;
    expect(
      tIcon.compareDocumentPosition(tLabel) & Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();
    trailing.remove();
  });

  it("ignores non-carbon icon names", async () => {
    const el = await mount({ label: "Add", icon: "mdi:plus" });
    expect(el.querySelector("iconify-icon")).toBeNull();
    el.remove();
  });

  it("names the control from the visible label without redundant aria-label", async () => {
    const el = await mount({ label: "Save" });
    const btn = inner(el);
    expect(btn.getAttribute("aria-label")).toBeNull();
    expect(btn.textContent).toContain("Save");
    el.remove();
  });

  it("supports icon-only usage through aria-label", async () => {
    const el = await mount({
      icon: "carbon:star",
      "aria-label": "Favorite",
    });
    const btn = inner(el);
    expect(btn.getAttribute("aria-label")).toBe("Favorite");
    el.remove();
  });

  it("lets aria-label override the visible label", async () => {
    const el = await mount({ label: "Save", "aria-label": "Save draft" });
    expect(inner(el).getAttribute("aria-label")).toBe("Save draft");
    el.remove();
  });
});

describe("strata-button updates", () => {
  it("reflects property changes in the rendered classes", async () => {
    const el = (await mount({ label: "Go" })) as HTMLElement & {
      variant: string;
      color: string;
      updateComplete: Promise<unknown>;
    };
    el.variant = "filled";
    el.color = "error";
    await el.updateComplete;
    const cls = inner(el).className;
    expect(cls).toContain("strata-button--variant-filled");
    expect(cls).toContain("strata-button--color-error");
    el.remove();
  });
});
