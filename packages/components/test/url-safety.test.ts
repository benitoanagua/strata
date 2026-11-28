import { describe, it, expect, afterEach } from "vitest";
import "../src/elements/index.ts";

async function mount<T extends HTMLElement>(tag: string): Promise<T> {
  const el = document.createElement(tag) as T;
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("URL safety contract", () => {
  it("strata-card strips javascript: URLs from title, media, author and tag links", async () => {
    const card = (await mount("strata-card")) as HTMLElement & {
      title: string;
      url: string;
      is_media: boolean;
      feature_image: string;
      show_meta: boolean;
      show_category: boolean;
      author_name: string;
      author_url: string;
      tag_name: string;
      tag_url: string;
      updateComplete: Promise<unknown>;
    };
    card.title = "Unsafe";
    card.url = "javascript:alert(1)";
    card.is_media = true;
    card.feature_image = "https://example.test/a.jpg";
    card.show_meta = true;
    card.show_category = true;
    card.author_name = "Author";
    card.author_url = "javascript:alert(2)";
    card.tag_name = "Tag";
    card.tag_url = "javascript:alert(3)";
    await card.updateComplete;

    const hrefs = [...card.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of hrefs) {
      expect(href ?? "").not.toMatch(/^\s*javascript:/i);
    }
    card.remove();
  });

  it("strata-card keeps safe and relative URLs", async () => {
    const card = (await mount("strata-card")) as HTMLElement & {
      title: string;
      url: string;
      updateComplete: Promise<unknown>;
    };
    card.title = "Safe";
    card.url = "/docs/guide";
    await card.updateComplete;
    expect(
      card.querySelector("a.strata-card__title-link")?.getAttribute("href"),
    ).toBe("/docs/guide");
    card.url = "https://example.test/x";
    await card.updateComplete;
    expect(
      card.querySelector("a.strata-card__title-link")?.getAttribute("href"),
    ).toBe("https://example.test/x");
    card.remove();
  });

  it("strata-overlay strips javascript: URLs", async () => {
    const overlay = (await mount("strata-overlay")) as HTMLElement & {
      title: string;
      url: string;
      updateComplete: Promise<unknown>;
    };
    overlay.title = "Overlay";
    overlay.url = "javascript:alert(1)";
    await overlay.updateComplete;
    const link = overlay.querySelector("a.strata-overlay__title-link");
    expect(link?.getAttribute("href") ?? "").not.toMatch(/^\s*javascript:/i);
    overlay.remove();
  });

  it("strata-overlay quotes the background image URL so it cannot break out of the declaration", async () => {
    const overlay = (await mount("strata-overlay")) as HTMLElement & {
      feature_image: string;
      updateComplete: Promise<unknown>;
    };
    overlay.feature_image = 'x.jpg");position:fixed;top:0';
    await overlay.updateComplete;
    const style =
      overlay.querySelector(".strata-overlay")?.getAttribute("style") ?? "";
    expect(style).toContain('url("x.jpg);position:fixed;top:0")');
    expect(style.match(/url\(/g)?.length).toBe(1);
    overlay.remove();
  });

  it("strata-button falls back to a native button for unsafe hrefs", async () => {
    const button = (await mount("strata-button")) as HTMLElement & {
      label: string;
      href: string;
      updateComplete: Promise<unknown>;
    };
    button.label = "Go";
    button.href = "javascript:alert(1)";
    await button.updateComplete;
    expect(button.querySelector("a")).toBeNull();
    expect(button.querySelector("button")).toBeTruthy();
    button.href = "https://example.test";
    await button.updateComplete;
    expect(button.querySelector("a")?.getAttribute("href")).toBe(
      "https://example.test",
    );
    button.remove();
  });
});
