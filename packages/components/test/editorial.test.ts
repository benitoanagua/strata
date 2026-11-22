import { describe, expect, it } from "vitest";
import "../src/elements/index.ts";
import { hueForLabel, resolveHue, TAG_HUES } from "../src/utils/hue";
import { parseItems, safeHref } from "../src/utils/items";

type El = HTMLElement & { updateComplete: Promise<unknown> };
async function mount(
  tag: string,
  attrs: Record<string, string> = {},
  html = "",
) {
  const el = document.createElement(tag) as El;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = html;
  document.body.appendChild(el);
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

describe("taxonomy hues", () => {
  it("is deterministic, case-insensitive and never neutral for real labels", () => {
    expect(hueForLabel("Historia")).toBe(hueForLabel(" historia "));
    expect(hueForLabel("Historia")).not.toBe("neutral");
    expect(hueForLabel("")).toBe("neutral");
  });
  it("spreads labels over the whole rainbow", () => {
    const seen = new Set(
      Array.from({ length: 200 }, (_, i) => hueForLabel(`categoria-${i}`)),
    );
    expect(seen.size).toBe(TAG_HUES.length - 1);
  });
  it("falls back to neutral for unknown hues", () => {
    expect(resolveHue("magenta", "x")).toBe("neutral");
    expect(resolveHue("auto", "x")).toBe(hueForLabel("x"));
  });
  it("strata-tag always renders its label next to the hue", async () => {
    const tag = await mount("strata-tag", { label: "Ciencia", hue: "auto" });
    const span = tag.shadowRoot!.querySelector(".strata-tag")!;
    expect(span.textContent).toContain("Ciencia");
    expect(span.className).toContain(`strata-hue--${hueForLabel("Ciencia")}`);
  });
});

describe("items parsing", () => {
  it("accepts pipes, JSON and arrays", () => {
    expect(parseItems("a|b")).toEqual([{ label: "a" }, { label: "b" }]);
    expect(parseItems('[{"label":"a","href":"/x"}]')).toEqual([
      { label: "a", href: "/x" },
    ]);
    expect(parseItems(["a", { title: "b", url: "/b" }])).toHaveLength(2);
  });
  it("drops unsafe URLs", () => {
    expect(safeHref("javascript:alert(1)")).toBe("");
    expect(safeHref("data:text/html,x")).toBe("");
    expect(safeHref("/wiki/Page")).toBe("/wiki/Page");
    expect(safeHref("https://example.org")).toBe("https://example.org");
  });
});

describe("news / wiki components", () => {
  it("tag-list links items through base-href", async () => {
    const el = await mount("strata-tag-list", {
      items: "Arte|Música",
      "base-href": "/tag/",
    });
    const tags = el.shadowRoot!.querySelectorAll("strata-tag");
    expect(tags).toHaveLength(2);
    expect(tags[0].getAttribute("href")).toBe("/tag/Arte");
  });

  it("comment emits strata-reply and shows replies only when present", async () => {
    const el = await mount(
      "strata-comment",
      { author: "Ana", date: "hoy" },
      "<p>Hola</p>",
    );
    const replies = el.shadowRoot!.querySelector(".replies") as HTMLElement;
    expect(replies.hidden).toBe(true);
    let author = "";
    el.addEventListener(
      "strata-reply",
      (e) => (author = (e as CustomEvent).detail.author),
    );
    el.shadowRoot!.querySelector<HTMLButtonElement>(".actions button")!.click();
    expect(author).toBe("Ana");
  });

  it("share builds encoded URLs and exposes names", async () => {
    const el = await mount("strata-share", {
      url: "https://e.org/a b",
      text: "T&C",
      networks: "x|email|copy|bogus",
    });
    const links = el.shadowRoot!.querySelectorAll("a");
    expect(links).toHaveLength(2);
    expect(links[0].href).toContain(encodeURIComponent("https://e.org/a b"));
    expect(links[0].getAttribute("aria-label")).toBe("Share on X");
    expect(el.shadowRoot!.querySelectorAll("button")).toHaveLength(1);
  });

  it("filter-bar emits category/view/sort and marks the active chip", async () => {
    const el = await mount("strata-filter-bar", { items: "Arte|Ciencia" });
    let detail: unknown;
    el.addEventListener(
      "strata-change",
      (e) => (detail = (e as CustomEvent).detail.value),
    );
    const chips = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".chip");
    expect(chips).toHaveLength(3);
    chips[2].click();
    await el.updateComplete;
    expect(detail).toEqual({ category: "Ciencia", view: "list", sort: "desc" });
    expect(
      el.shadowRoot!.querySelectorAll('.chip[aria-pressed="true"]'),
    ).toHaveLength(1);
  });

  it("ranked-list numbers items and supports variant none", async () => {
    const el = await mount("strata-ranked-list", { items: "a|b|c" });
    expect(el.shadowRoot!.querySelectorAll(".rank")).toHaveLength(3);
    el.setAttribute("variant", "none");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("ol")).toBeNull();
  });

  it("index-list renders grouped links and ignores malformed JSON", async () => {
    const el = await mount("strata-index-list", {
      groups: JSON.stringify([
        { heading: "A", items: [{ label: "Alfa", href: "/a" }] },
      ]),
    });
    expect(el.shadowRoot!.querySelector("a")?.getAttribute("href")).toBe("/a");
    el.setAttribute("groups", "{nope");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll("section")).toHaveLength(0);
  });

  it("quote links its source only when safe", async () => {
    const el = await mount(
      "strata-quote",
      { cite: "X", source: "javascript:1" },
      "texto",
    );
    expect(el.shadowRoot!.querySelector("cite a")).toBeNull();
  });

  it("article-header and entry omit unsafe images", async () => {
    const h = await mount("strata-article-header", {
      heading: "T",
      image: "javascript:1",
    });
    expect(h.shadowRoot!.querySelector("img")).toBeNull();
    const e = await mount("strata-entry", {
      heading: "T",
      href: "javascript:1",
    });
    expect(e.shadowRoot!.querySelector("h3 a")).toBeNull();
  });

  it("ticker never auto-advances unless interval is set", async () => {
    const el = (await mount("strata-ticker", { items: "a|b" })) as El & {
      timer?: unknown;
    };
    expect(el.timer).toBeUndefined();
  });
});
