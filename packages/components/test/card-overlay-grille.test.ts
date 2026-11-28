import { describe, it, expect, afterEach } from "vitest";
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
  document.body.innerHTML = "";
});

describe("strata-card contract", () => {
  it("renders defaults: h3 title link, no media, no excerpt", async () => {
    const card = (await mount("strata-card")) as HTMLElement & {
      title: string;
      url: string;
      updateComplete: Promise<unknown>;
    };
    card.title = "Hello";
    card.url = "/post";
    await card.updateComplete;
    const heading = card.querySelector("h3");
    expect(heading?.textContent).toBe("Hello");
    expect(card.querySelector(".strata-card__excerpt")).toBeNull();
    expect(card.querySelector("figure")).toBeNull();
    card.remove();
  });

  it("reflects the heading level into the rendered tag", async () => {
    const card = (await mount("strata-card")) as HTMLElement & {
      title: string;
      heading: number;
      updateComplete: Promise<unknown>;
    };
    card.title = "T";
    for (const level of [1, 2, 4, 6] as const) {
      card.heading = level;
      await card.updateComplete;
      expect(card.querySelector(`h${level}`)).toBeTruthy();
    }
    card.remove();
  });

  it("toggles excerpt only when show-excerpt is set", async () => {
    const card = document.createElement("strata-card") as HTMLElement & {
      excerpt: string;
      show_excerpt: boolean;
      updateComplete: Promise<unknown>;
    };
    card.excerpt = "Some excerpt";
    document.body.appendChild(card);
    await card.updateComplete;
    expect(card.querySelector(".strata-card__excerpt")).toBeNull();
    card.show_excerpt = true;
    await card.updateComplete;
    expect(card.querySelector(".strata-card__excerpt")?.textContent).toContain(
      "Some excerpt",
    );
    card.remove();
  });

  it("uses monochrome media by default and supports opting out", async () => {
    const card = (await mount("strata-card")) as HTMLElement & {
      is_media: boolean;
      feature_image: string;
      monochrome: boolean;
      updateComplete: Promise<unknown>;
    };
    card.is_media = true;
    card.feature_image = "/sample.jpg";
    await card.updateComplete;
    expect(card.querySelector("img")?.classList.contains("strata-card__image--monochrome")).toBe(true);
    card.monochrome = false;
    await card.updateComplete;
    expect(card.querySelector("img")?.classList.contains("strata-card__image--monochrome")).toBe(false);
    card.remove();
  });

  it("hides media when media width is is-none even with an image", async () => {
    const card = (await mount("strata-card")) as HTMLElement & {
      is_media: boolean;
      feature_image: string;
      media_width: string;
      updateComplete: Promise<unknown>;
    };
    card.is_media = true;
    card.feature_image = "https://example.test/x.jpg";
    card.media_width = "is-none";
    await card.updateComplete;
    expect(card.querySelector("figure")).toBeNull();
    card.media_width = "is-half";
    await card.updateComplete;
    expect(card.querySelector("figure")).toBeTruthy();
    card.remove();
  });
});

describe("strata-overlay contract", () => {
  it("renders defaults: h1, center/center, full fill, background box, auto theme", async () => {
    const overlay = (await mount("strata-overlay")) as HTMLElement & {
      title: string;
      updateComplete: Promise<unknown>;
    };
    overlay.title = "Hero";
    await overlay.updateComplete;
    const root = overlay.querySelector(".strata-overlay")!;
    expect(root.classList.contains("strata-overlay--align-center")).toBe(true);
    expect(root.classList.contains("strata-overlay--position-center")).toBe(
      true,
    );
    expect(root.classList.contains("strata-overlay--fill-full")).toBe(true);
    expect(root.classList.contains("strata-overlay--box-background")).toBe(
      true,
    );
    expect(root.classList.contains("strata-overlay--theme-auto")).toBe(true);
    expect(overlay.querySelector("h1")?.textContent).toBe("Hero");
    overlay.remove();
  });

  it("omits the fill class when fill=none and applies dark theme", async () => {
    const overlay = (await mount("strata-overlay")) as HTMLElement & {
      fill: string;
      is_dark: boolean;
      updateComplete: Promise<unknown>;
    };
    overlay.fill = "none";
    overlay.is_dark = true;
    await overlay.updateComplete;
    const root = overlay.querySelector(".strata-overlay")!;
    expect(root.className).not.toContain("strata-overlay--fill-");
    expect(root.classList.contains("strata-overlay--theme-dark")).toBe(true);
    overlay.remove();
  });

  it("keeps grayscale on the image layer and supports explicit themes", async () => {
    const overlay = (await mount("strata-overlay")) as HTMLElement & {
      feature_image: string;
      monochrome: boolean;
      theme: "auto" | "light" | "dark";
      updateComplete: Promise<unknown>;
    };
    overlay.feature_image = "/sample.jpg";
    await overlay.updateComplete;
    let root = overlay.querySelector(".strata-overlay") as HTMLElement;
    expect(root.classList.contains("strata-overlay--has-image")).toBe(true);
    expect(root.classList.contains("strata-overlay--monochrome")).toBe(true);
    expect(root.style.getPropertyValue("--strata-overlay-image")).toContain("sample.jpg");
    overlay.monochrome = false;
    overlay.theme = "dark";
    await overlay.updateComplete;
    root = overlay.querySelector(".strata-overlay")!;
    expect(root.classList.contains("strata-overlay--monochrome")).toBe(false);
    expect(root.classList.contains("strata-overlay--theme-dark")).toBe(true);
    overlay.remove();
  });

  it("renders meta items only when show-meta is enabled", async () => {
    const overlay = (await mount("strata-overlay")) as HTMLElement & {
      show_meta: boolean;
      author_name: string;
      published_at: string;
      updateComplete: Promise<unknown>;
    };
    overlay.author_name = "A";
    overlay.published_at = "2026-01-01";
    await overlay.updateComplete;
    expect(overlay.querySelector(".strata-overlay__meta")).toBeNull();
    overlay.show_meta = true;
    await overlay.updateComplete;
    const items = overlay.querySelectorAll(".strata-overlay__meta-item");
    expect(items.length).toBe(2);
    overlay.remove();
  });
});

describe("strata-grille contract", () => {
  it("draws no dividers for a single cell in a one-column grid", async () => {
    const grid = document.createElement("strata-grille") as HTMLElement & {
      desktop: number;
      updateComplete: Promise<unknown>;
    };
    grid.desktop = 1;
    const cell = document.createElement("div");
    grid.append(cell);
    document.body.appendChild(grid);
    await grid.updateComplete;
    await flush();
    expect(cell.style.borderRight).toBe("");
    expect(cell.style.borderBottom).toBe("");
    grid.remove();
    expect(cell.style.width).toBe("");
  });

  it("recalculates layout when desktop columns change dynamically", async () => {
    const grid = document.createElement("strata-grille") as HTMLElement & {
      desktop: number;
      updateComplete: Promise<unknown>;
    };
    grid.desktop = 2;
    const cells = [1, 2, 3, 4].map(() => document.createElement("div"));
    grid.append(...cells);
    document.body.appendChild(grid);
    await grid.updateComplete;
    await flush();
    // 2 columns, 4 items: cell 0 has right+bottom borders.
    expect(cells[0].style.borderRight).toContain("solid");
    expect(cells[0].style.borderBottom).toContain("solid");
    // Switch to 4 columns: single row → no bottom borders remain.
    grid.desktop = 4;
    await grid.updateComplete;
    await flush();
    for (const cell of cells) {
      expect(cell.style.borderBottom).toBe("");
    }
    grid.remove();
    for (const cell of cells) {
      expect(cell.style.borderRight).toBe("");
      expect(cell.style.borderBottom).toBe("");
    }
  });

  it("responds to slot changes when items are added or removed", async () => {
    const grid = document.createElement("strata-grille") as HTMLElement & {
      desktop: number;
      updateComplete: Promise<unknown>;
    };
    grid.desktop = 2;
    const a = document.createElement("div");
    const b = document.createElement("div");
    grid.append(a, b);
    document.body.appendChild(grid);
    await grid.updateComplete;
    await flush();
    expect(a.style.borderRight).toContain("solid");
    expect(a.style.borderBottom).toBe("");
    // Adding a third item makes it the last cell of row 1 → gains bottom border.
    const c = document.createElement("div");
    grid.append(c);
    grid
      .querySelector("slot")
      ?.dispatchEvent(new Event("slotchange", { bubbles: true }));
    await flush();
    await flush();
    expect(a.style.borderBottom).toContain("solid");
    // c sits in column 0 of row 2: column divider but no bottom divider.
    expect(c.style.borderRight).toContain("solid");
    expect(c.style.borderBottom).toBe("");
    // Removing it restores the previous layout.
    c.remove();
    grid
      .querySelector("slot")
      ?.dispatchEvent(new Event("slotchange", { bubbles: true }));
    await flush();
    await flush();
    expect(a.style.borderBottom).toBe("");
    expect(c.style.width).toBe("");
    grid.remove();
  });

  it("clamps invalid column counts to a usable grid", async () => {
    const grid = document.createElement("strata-grille") as HTMLElement & {
      desktop: number;
      updateComplete: Promise<unknown>;
    };
    grid.desktop = 0;
    const cells = [
      document.createElement("div"),
      document.createElement("div"),
    ];
    grid.append(...cells);
    document.body.appendChild(grid);
    await grid.updateComplete;
    await flush();
    // 0 columns is clamped to 1: stacked cells get bottom borders.
    expect(cells[0].style.borderBottom).toContain("solid");
    expect(cells[1].style.borderBottom).toBe("");
    grid.remove();
  });
});
