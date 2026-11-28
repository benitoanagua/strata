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
    expect(button.getAttribute("aria-current")).toBeNull();
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
    await new Promise((resolve) => setTimeout(resolve, 160));
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
  it("shows a labelled close button by default and hides it with show-close=false", async () => {
    const el = (await mount("strata-modal")) as HTMLElement & {
      open: boolean;
      showClose: boolean;
      updateComplete: Promise<unknown>;
    };
    el.open = true;
    await el.updateComplete;
    await flush();
    const close = el.shadowRoot?.querySelector<HTMLElement>("strata-close-button");
    expect(close).toBeTruthy();
    expect(close?.getAttribute("label")).toBe("Close modal");
    el.showClose = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".strata-modal__close")).toBeNull();
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
      const close = el.shadowRoot?.querySelector<HTMLElement>("header strata-close-button");
      expect(close?.getAttribute("label")).toBe(tag === "strata-drawer" ? "Close drawer" : "Close bottom sheet");
      close?.shadowRoot?.querySelector<HTMLButtonElement>("button")?.click();
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

describe("strata-nav", () => {
  it("renders a nav landmark and arrow-key navigation between items", async () => {
    const nav = (await mount("strata-nav")) as HTMLElement & {
      label: string;
      updateComplete: Promise<unknown>;
    };
    nav.label = "Primary";
    nav.innerHTML =
      '<strata-nav-item label="Home"></strata-nav-item>' +
      '<strata-nav-item label="Docs"></strata-nav-item>' +
      '<strata-nav-item label="Blog"></strata-nav-item>';
    await nav.updateComplete;
    const landmark = nav.shadowRoot?.querySelector("nav");
    expect(landmark?.getAttribute("aria-label")).toBe("Primary");
    const items = nav.querySelectorAll("strata-nav-item");
    expect(items).toHaveLength(3);
    (items[0] as HTMLElement).focus();
    const focusedItem = () =>
      [items[0], items[1], items[2]].find(
        (item) =>
          document.activeElement === item ||
          item.shadowRoot?.activeElement != null,
      );
    expect(focusedItem()).toBe(items[0]);
    landmark!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await flush();
    expect(focusedItem()).toBe(items[1]);
    landmark!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true }),
    );
    await flush();
    expect(focusedItem()).toBe(items[2]);
    nav.remove();
  });
});

describe("strata-carousel", () => {
  it("renders labelled arrows and dots and navigates slides", async () => {
    const el = document.createElement("strata-carousel") as HTMLElement & {
      desktop: number;
      updateComplete: Promise<unknown>;
    };
    el.desktop = 1;
    el.innerHTML =
      "<strata-carousel-item>One</strata-carousel-item>" +
      "<strata-carousel-item>Two</strata-carousel-item>" +
      "<strata-carousel-item>Three</strata-carousel-item>";
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();
    await flush();
    el.shadowRoot
      ?.querySelector("slot")
      ?.dispatchEvent(new Event("slotchange", { bubbles: true }));
    await flush();
    await flush();
    const arrows = el.shadowRoot?.querySelectorAll(".strata-carousel__arrow");
    expect(arrows?.length).toBe(2);
    expect(arrows?.[0].getAttribute("aria-label")).toMatch(/Previous item/);
    const dots = el.shadowRoot?.querySelectorAll(".strata-carousel__dot");
    expect(dots?.length).toBeGreaterThan(0);
    const changes: number[] = [];
    el.addEventListener("carousel-change", (e) =>
      changes.push((e as CustomEvent).detail.currentIndex),
    );
    (arrows![1] as HTMLButtonElement).click();
    await flush();
    expect(changes.length).toBeGreaterThan(0);
    el.remove();
  });
});

describe("strata-grille", () => {
  it("draws internal row/column divider borders on non-edge items", async () => {
    const el = document.createElement("strata-grille") as HTMLElement & {
      desktop: number;
      gap: string;
      updateComplete: Promise<unknown>;
    };
    el.desktop = 2;
    el.gap = "medium";
    el.innerHTML =
      "<strata-grille-item>1</strata-grille-item>" +
      "<strata-grille-item>2</strata-grille-item>" +
      "<strata-grille-item>3</strata-grille-item>" +
      "<strata-grille-item>4</strata-grille-item>";
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();
    await flush();
    const items = [...el.querySelectorAll("strata-grille-item")];
    // desktop=2, 4 items → 2x2: items 0,1 get right borders where applicable,
    // items 0,1 get bottom borders (row 1 of 2), item 2 gets right border.
    expect(items[0].style.borderRight).toContain("solid");
    expect(items[0].style.borderBottom).toContain("solid");
    expect(items[2].style.borderRight).toContain("solid");
    expect(items[3].style.borderRight).toBe("");
    expect(items[3].style.borderBottom).toBe("");
    el.remove();
  });
});

describe("strata-avatar", () => {
  it("renders photo image in photo variant and initials otherwise", async () => {
    const el = (await mount("strata-avatar")) as HTMLElement & {
      variant: string;
      label: string;
      src: string;
      updateComplete: Promise<unknown>;
    };
    el.label = "Ada Lovelace";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("span")?.textContent).toBe("AL");
    el.variant = "photo";
    el.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("img")).toBeTruthy();
    el.src = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("img")).toBeNull();
    expect(el.shadowRoot?.querySelector("span")?.textContent).toBe("AL");
    el.remove();
  });

  it("falls back to initials when the photo fails to load", async () => {
    const el = (await mount("strata-avatar")) as HTMLElement & {
      variant: string;
      label: string;
      src: string;
      updateComplete: Promise<unknown>;
    };
    el.variant = "photo";
    el.label = "Grace Hopper";
    el.src = "https://invalid.example/missing.png";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img")!;
    img.dispatchEvent(new Event("error"));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("img")).toBeNull();
    expect(el.shadowRoot?.querySelector("span")?.textContent).toBe("GH");
    el.remove();
  });
});

describe("strata-logo", () => {
  it("renders the Strata wordmark", async () => {
    const el = (await mount("strata-logo")) as HTMLElement;
    await flush();
    expect(el.textContent?.trim()).toBe("Strata");
    el.remove();
  });
});

describe("strata-page-layout", () => {
  it("renders start/main/end regions and hides empty asides", async () => {
    const el = document.createElement("strata-page-layout") as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    el.innerHTML =
      '<div slot="aside-start">TOC</div>' +
      "<p>Article body</p>" +
      '<div slot="aside-end">Related</div>';
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();
    expect(el.shadowRoot?.querySelector(".start")).toBeTruthy();
    expect(el.shadowRoot?.querySelector(".main")).toBeTruthy();
    expect(el.shadowRoot?.querySelector(".end")).toBeTruthy();
    const layout = el.shadowRoot?.querySelector(".layout");
    await flush();
    expect(layout?.hasAttribute("data-start")).toBe(true);
    expect(layout?.hasAttribute("data-end")).toBe(true);
    el.remove();
  });
});

describe("strata-toc", () => {
  it("builds links from a target's headings including nested levels", async () => {
    const article = document.createElement("article");
    article.innerHTML =
      '<h2 id="s1">Section One</h2><p>x</p>' +
      '<h3 id="s1a">Subsection</h3><p>y</p>' +
      '<h2 id="s2">Section Two</h2><p>z</p>';
    document.body.appendChild(article);
    const el = (await mount("strata-toc")) as HTMLElement & {
      target: string;
      numbered: boolean;
      updateComplete: Promise<unknown>;
    };
    el.target = "#toc-fixture";
    article.id = "toc-fixture";
    el.numbered = true;
    await el.updateComplete;
    await flush();
    await flush();
    const links = el.shadowRoot?.querySelectorAll("a");
    expect(links?.length).toBe(3);
    expect(links?.[0].getAttribute("href")).toBe("#s1");
    expect(el.shadowRoot?.textContent).toContain("Section One");
    article.remove();
    el.remove();
  });
});

describe("strata-reading-progress", () => {
  it("renders an accessible progressbar", async () => {
    const el = (await mount("strata-reading-progress")) as HTMLElement;
    await flush();
    const bar = el.shadowRoot?.querySelector("[role=progressbar]");
    expect(bar).toBeTruthy();
    expect(bar?.getAttribute("aria-valuemin")).toBe("0");
    expect(bar?.getAttribute("aria-valuemax")).toBe("100");
    expect(bar?.getAttribute("aria-valuenow")).not.toBeNull();
    el.remove();
  });
});

describe("strata-heading-anchors", () => {
  it("appends permalink anchors and ids to target headings", async () => {
    const article = document.createElement("article");
    article.id = "anchors-fixture";
    article.innerHTML = "<h2>First Section</h2><h2>Second Section</h2>";
    document.body.appendChild(article);
    const el = (await mount("strata-heading-anchors")) as HTMLElement & {
      target: string;
      updateComplete: Promise<unknown>;
    };
    el.target = "#anchors-fixture";
    await el.updateComplete;
    await flush();
    await flush();
    const anchors = article.querySelectorAll("a.strata-anchor");
    expect(anchors.length).toBe(2);
    const headings = article.querySelectorAll("h2");
    expect(headings[0].id).toBeTruthy();
    expect(anchors[0].getAttribute("href")).toBe(`#${headings[0].id}`);
    article.remove();
    el.remove();
  });
});

describe("responsive navigation and shared close", () => {
  it("toggles the mobile nav panel and renders navigation links", async () => {
    const nav = (await mount("strata-nav")) as HTMLElement & { updateComplete: Promise<unknown> };
    const item = document.createElement("strata-nav-item") as HTMLElement & { href: string; label: string; selected: boolean; updateComplete: Promise<unknown> };
    item.href = "/";
    item.label = "Home";
    item.selected = true;
    nav.append(item);
    await nav.updateComplete;
    await item.updateComplete;
    const toggle = nav.shadowRoot?.querySelector<HTMLButtonElement>(".strata-nav__toggle");
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    toggle?.click();
    await nav.updateComplete;
    expect(toggle?.getAttribute("aria-expanded")).toBe("true");
    expect(item.shadowRoot?.querySelector('a[href="/"]')?.getAttribute("aria-current")).toBe("page");
    nav.remove();
  });

  it("uses a navigation landmark for the sidebar and supports selected links", async () => {
    const menu = (await mount("strata-menu")) as HTMLElement & { updateComplete: Promise<unknown> };
    const item = document.createElement("strata-menu-item") as HTMLElement & { href: string; label: string; selected: boolean; updateComplete: Promise<unknown> };
    item.href = "/settings";
    item.label = "Settings";
    item.selected = true;
    menu.append(item);
    await menu.updateComplete;
    await item.updateComplete;
    expect(menu.shadowRoot?.querySelector("nav[aria-label]")).toBeTruthy();
    expect(menu.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
    expect(item.shadowRoot?.querySelector('a[href="/settings"]')?.getAttribute("aria-current")).toBe("page");
    menu.remove();
  });

  it("emits the shared close event from an accessible control", async () => {
    const close = (await mount("strata-close-button")) as HTMLElement & { updateComplete: Promise<unknown> };
    await close.updateComplete;
    const button = close.shadowRoot?.querySelector<HTMLButtonElement>("button");
    expect(button?.getAttribute("aria-label")).toBe("Close");
    const handler = vi.fn();
    close.addEventListener("strata-close", handler);
    button?.click();
    expect(handler).toHaveBeenCalledTimes(1);
    close.remove();
  });
});

describe("floating surface close composition", () => {
  it("provides the shared close button and actions slot in Modal", async () => {
    const modal = (await mount("strata-modal")) as HTMLElement & { open: boolean; title: string; updateComplete: Promise<unknown> };
    modal.title = "Confirm";
    modal.open = true;
    modal.innerHTML = "<strata-button slot=actions label=Confirm></strata-button>";
    await modal.updateComplete;
    await flush();
    expect(modal.shadowRoot?.querySelector("strata-close-button")).toBeTruthy();
    expect(modal.shadowRoot?.querySelector("slot[name=actions]")).toBeTruthy();
    modal.open = false;
    await modal.updateComplete;
    modal.remove();
  });

  it("uses the same close element in Modal, Drawer, BottomSheet and Popover", async () => {
    const tags = ["strata-modal", "strata-drawer", "strata-bottom-sheet", "strata-popover"];
    for (const tag of tags) {
      const el = (await mount(tag)) as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
      el.open = true;
      await el.updateComplete;
      await flush();
      expect(el.shadowRoot?.querySelector("strata-close-button")).toBeTruthy();
      el.open = false;
      await el.updateComplete;
      el.remove();
    }
  });
});
