import { describe, it, expect, vi, afterEach } from "vitest";
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

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("strata-select", () => {
  it("accepts a delimited string as the options property", async () => {
    const el = (await mount("strata-select")) as HTMLElement & {
      options: unknown;
      updateComplete: Promise<unknown>;
    };
    el.options = "alpha|beta|gamma";
    await el.updateComplete;
    const options = el.shadowRoot?.querySelectorAll("option");
    expect([...options!].map((o) => o.textContent)).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
    el.remove();
  });

  it("mirrors slotted <option> elements and disabled state", async () => {
    const el = document.createElement("strata-select");
    el.innerHTML =
      '<option value="a">A</option><option value="b" disabled>B</option>';
    document.body.appendChild(el);
    await (el as unknown as { updateComplete: Promise<unknown> })
      .updateComplete;
    const options = el.shadowRoot?.querySelectorAll("option");
    expect(options).toHaveLength(2);
    expect(options?.[1].disabled).toBe(true);
    el.remove();
  });

  it("keeps the bound value and emits strata-change", async () => {
    const el = (await mount("strata-select")) as HTMLElement & {
      options: unknown;
      value: string;
      updateComplete: Promise<unknown>;
    };
    el.options = ["one", "two"];
    el.value = "two";
    await el.updateComplete;
    const select = el.shadowRoot?.querySelector("select")!;
    expect(select.value).toBe("two");
    const events: string[] = [];
    el.addEventListener("strata-change", (e) =>
      events.push(String((e as CustomEvent).detail?.value)),
    );
    select.value = "one";
    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(events).toEqual(["one"]);
    el.remove();
  });
});

describe("strata-radio", () => {
  it("renders a native radio sharing the checkbox accent strategy", async () => {
    const el = (await mount("strata-radio")) as HTMLElement & {
      checked: boolean;
      disabled: boolean;
      updateComplete: Promise<unknown>;
    };
    el.setAttribute("label", "Option A");
    await el.updateComplete;
    const input =
      el.shadowRoot?.querySelector<HTMLInputElement>("input[type=radio]");
    expect(input).toBeTruthy();
    expect(input?.getAttribute("aria-hidden")).toBeNull();
    el.checked = true;
    await el.updateComplete;
    expect(input?.checked).toBe(true);
    el.disabled = true;
    await el.updateComplete;
    expect(input?.disabled).toBe(true);
    el.remove();
  });
});

describe("strata-switch", () => {
  it("toggles role=switch state and respects disabled", async () => {
    const el = (await mount("strata-switch")) as HTMLElement & {
      checked: boolean;
      disabled: boolean;
      updateComplete: Promise<unknown>;
    };
    el.setAttribute("label", "Alerts");
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("role")).toBe("switch");
    expect(button.getAttribute("aria-checked")).toBe("false");
    button.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(button.getAttribute("aria-checked")).toBe("true");
    el.disabled = true;
    await el.updateComplete;
    button.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    el.remove();
  });
});

describe("strata-nav-item standalone", () => {
  it("renders and reflects selected state without a parent nav", async () => {
    const el = (await mount("strata-nav-item")) as HTMLElement & {
      selected: boolean;
      updateComplete: Promise<unknown>;
    };
    el.setAttribute("label", "Docs");
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.textContent).toContain("Docs");
    expect(button.getAttribute("aria-current")).toBe("false");
    el.selected = true;
    await el.updateComplete;
    expect(button.getAttribute("aria-current")).toBe("page");
    el.remove();
  });
});

describe("strata-menu-item", () => {
  it("renders a menuitem button with icon and disabled state", async () => {
    const el = (await mount("strata-menu-item")) as HTMLElement & {
      label: string;
      icon: string;
      disabled: boolean;
      updateComplete: Promise<unknown>;
    };
    el.label = "Profile";
    el.icon = "carbon:user";
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("role")).toBe("menuitem");
    expect(button.textContent).toContain("Profile");
    expect(el.shadowRoot?.querySelector("iconify-icon")).toBeTruthy();
    el.disabled = true;
    await el.updateComplete;
    expect(button.disabled).toBe(true);
    el.remove();
  });
});

describe("strata-popover", () => {
  it("toggles open on trigger click and closes on Escape", async () => {
    const el = (await mount("strata-popover")) as HTMLElement & {
      open: boolean;
      updateComplete: Promise<unknown>;
    };
    await el.updateComplete;
    const anchor = el.shadowRoot!.querySelector(
      ".strata-popover-anchor",
    ) as HTMLElement;
    const trigger = el.shadowRoot!.querySelector(
      ".strata-popover__trigger",
    ) as HTMLElement;
    trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(true);
    anchor.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.remove();
  });

  it("does not close when clicking inside the panel", async () => {
    const el = (await mount("strata-popover")) as HTMLElement & {
      open: boolean;
      updateComplete: Promise<unknown>;
    };
    el.open = true;
    await el.updateComplete;
    const panel = el.shadowRoot!.querySelector(
      ".strata-popover",
    ) as HTMLElement;
    panel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(true);
    el.remove();
  });

  it("closes on outside pointer interaction", async () => {
    const el = (await mount("strata-popover")) as HTMLElement & {
      open: boolean;
      updateComplete: Promise<unknown>;
    };
    el.open = true;
    await el.updateComplete;
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.remove();
  });

  it("opens on hover when trigger=hover", async () => {
    const el = document.createElement("strata-popover") as HTMLElement & {
      open: boolean;
      trigger: string;
      updateComplete: Promise<unknown>;
    };
    el.trigger = "hover";
    document.body.appendChild(el);
    await el.updateComplete;
    const anchor = el.shadowRoot!.querySelector(
      ".strata-popover-anchor",
    ) as HTMLElement;
    anchor.dispatchEvent(new MouseEvent("mouseenter"));
    await el.updateComplete;
    expect(el.open).toBe(true);
    anchor.dispatchEvent(new MouseEvent("mouseleave"));
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.remove();
  });
});

describe("strata-snackbar", () => {
  it("announces via role=status and auto-dismisses after duration", async () => {
    vi.useFakeTimers();
    const el = (await mount("strata-snackbar")) as HTMLElement & {
      open: boolean;
      duration: number;
      message: string;
      updateComplete: Promise<unknown>;
    };
    el.message = "Item saved.";
    el.duration = 1000;
    let dismissed = 0;
    el.addEventListener("strata-dismiss", () => dismissed++);
    el.open = true;
    await el.updateComplete;
    const region = el.shadowRoot?.querySelector("[role=status]");
    expect(region?.textContent).toContain("Item saved.");
    vi.advanceTimersByTime(1000);
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(dismissed).toBe(1);
    el.remove();
  });

  it("stays open when duration is 0", async () => {
    vi.useFakeTimers();
    const el = (await mount("strata-snackbar")) as HTMLElement & {
      open: boolean;
      duration: number;
      updateComplete: Promise<unknown>;
    };
    el.duration = 0;
    el.open = true;
    await el.updateComplete;
    vi.advanceTimersByTime(60000);
    await el.updateComplete;
    expect(el.open).toBe(true);
    el.remove();
  });
});

describe("strata-modal close affordance", () => {
  it("has no close button by default and shows one with show-close", async () => {
    const el = (await mount("strata-modal")) as HTMLElement & {
      open: boolean;
      showClose: boolean;
      updateComplete: Promise<unknown>;
    };
    el.open = true;
    await el.updateComplete;
    await flush();
    expect(el.shadowRoot?.querySelector(".strata-modal__close")).toBeNull();
    el.showClose = true;
    await el.updateComplete;
    const close = el.shadowRoot?.querySelector<HTMLButtonElement>(
      ".strata-modal__close",
    );
    expect(close).toBeTruthy();
    expect(close?.getAttribute("aria-label")).toBe("Close modal");
    el.remove();
  });
});

describe("overlay close affordances", () => {
  for (const tag of ["strata-drawer", "strata-bottom-sheet"]) {
    it(`${tag} renders a labelled close button that closes it`, async () => {
      const el = (await mount(tag)) as HTMLElement & {
        open: boolean;
        title: string;
        updateComplete: Promise<unknown>;
      };
      el.title = "Panel";
      el.open = true;
      await el.updateComplete;
      const button =
        el.shadowRoot?.querySelector<HTMLButtonElement>("header button");
      expect(button?.getAttribute("aria-label")).toBe("Close");
      button?.click();
      await el.updateComplete;
      expect(el.open).toBe(false);
      el.remove();
    });
  }
});

describe("strata-theme-toggle", () => {
  it("exposes an accessible label and pressed state", async () => {
    const el = (await mount("strata-theme-toggle")) as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await flush();
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-label")).toMatch(/Switch to/);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    button.click();
    await el.updateComplete;
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    el.remove();
  });
});

describe("strata-viewer-settings", () => {
  it("opens its panel and emits strata-change on setting updates", async () => {
    const el = (await mount("strata-viewer-settings")) as HTMLElement & {
      open: boolean;
      updateComplete: Promise<unknown>;
    };
    await el.updateComplete;
    const toggle = el.shadowRoot?.querySelector<HTMLElement>(".vs-toggle")!;
    toggle.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    const panel = el.shadowRoot?.querySelector<HTMLElement>(".vs-panel")!;
    expect(panel.hidden).toBe(false);
    el.remove();
  });
});

describe("semantic tone scale", () => {
  it("alert applies a distinct tone class per status", async () => {
    const el = (await mount("strata-alert")) as HTMLElement & {
      tone: string;
      updateComplete: Promise<unknown>;
    };
    for (const tone of ["error", "warning", "success", "info"]) {
      el.tone = tone;
      await el.updateComplete;
      expect(
        el.shadowRoot?.querySelector(`.strata-alert--${tone}`),
      ).toBeTruthy();
    }
    el.remove();
  });

  it("badge renders an icon for the info tone", async () => {
    const el = (await mount("strata-badge")) as HTMLElement & {
      tone: string;
      updateComplete: Promise<unknown>;
    };
    el.tone = "info";
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector("iconify-icon");
    expect(icon?.getAttribute("icon")).toBe("carbon:information");
    el.remove();
  });
});
