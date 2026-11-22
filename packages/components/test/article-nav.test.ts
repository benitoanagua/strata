import { afterEach, describe, expect, it } from "vitest";
import "../src/elements/index.ts";
import {
  parseLevels,
  slugify,
  collectHeadings,
  activeHeadingId,
} from "../src/utils/headings";

type El = HTMLElement &
  Record<string, any> & { updateComplete: Promise<unknown> };
const tick = () => new Promise((r) => setTimeout(r, 0));
// scroll handlers are rAF-throttled (~16ms in jsdom)
const frame = () => new Promise((r) => setTimeout(r, 40));

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
  await tick();
  await el.updateComplete;
  return el;
}

const ARTICLE = `<article id="art">
  <h1>Título</h1>
  <h2>Introducción</h2><p>uno dos tres</p>
  <h2>Historia</h2><h3>Orígenes</h3><h3>Siglo XX</h3>
  <h2>Historia</h2>
  <h2>Geografía</h2>
</article>`;

function mockTops(tops: Record<string, number>) {
  for (const [id, top] of Object.entries(tops)) {
    document.getElementById(id)!.getBoundingClientRect = () =>
      ({ top }) as DOMRect;
  }
}

afterEach(() => (document.body.innerHTML = ""));

describe("heading utilities", () => {
  it("slugifies accents and parses level ranges", () => {
    expect(slugify("Geografía física")).toBe("geografia-fisica");
    expect(slugify("¿¿??")).toBe("section");
    expect(parseLevels("2-4")).toEqual([2, 4]);
    expect(parseLevels("3")).toEqual([3, 3]);
    expect(parseLevels("9-1")).toEqual([6, 6]);
  });
  it("assigns unique ids and ignores anchors in text", () => {
    document.body.innerHTML = ARTICLE;
    const hs = collectHeadings(document.getElementById("art")!, [2, 3]);
    expect(hs.map((h) => h.id)).toEqual([
      "introduccion",
      "historia",
      "origenes",
      "siglo-xx",
      "historia-2",
      "geografia",
    ]);
    document
      .querySelector("h2")!
      .insertAdjacentHTML("beforeend", '<a class="strata-anchor">#</a>');
    expect(
      collectHeadings(document.getElementById("art")!, [2, 2])[0].text,
    ).toBe("Introducción");
  });
});

describe("<strata-toc>", () => {
  it("builds a nested numbered tree from the target", async () => {
    document.body.insertAdjacentHTML("beforeend", ARTICLE);
    const toc = await mount("strata-toc", { target: "#art", numbered: "" });
    const links = toc.shadowRoot!.querySelectorAll("a");
    expect(links).toHaveLength(6);
    expect(toc.shadowRoot!.querySelectorAll("ol ol")).toHaveLength(1);
    const nums = [...toc.shadowRoot!.querySelectorAll(".num")].map(
      (n) => n.textContent,
    );
    expect(nums).toEqual(["1", "2", "2.1", "2.2", "3", "4"]);
  });

  it("marks the current section (aria-current) as you scroll and emits changes", async () => {
    document.body.insertAdjacentHTML("beforeend", ARTICLE);
    const toc = await mount("strata-toc", { target: "#art" });
    const seen: string[] = [];
    toc.addEventListener("strata-change", (e) =>
      seen.push((e as CustomEvent).detail.value.id),
    );
    mockTops({
      introduccion: -400,
      historia: -50,
      origenes: 300,
      "siglo-xx": 600,
      "historia-2": 900,
      geografia: 1200,
    });
    window.dispatchEvent(new Event("scroll"));
    await frame();
    await toc.updateComplete;
    const current = toc.shadowRoot!.querySelectorAll(
      'a[aria-current="location"]',
    );
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute("href")).toBe("#historia");
    expect(seen).toContain("historia");
  });

  it("activeHeadingId is empty above the first heading", () => {
    document.body.innerHTML = ARTICLE;
    const hs = collectHeadings(document.getElementById("art")!, [2, 2]);
    mockTops({
      introduccion: 500,
      historia: 800,
      "historia-2": 900,
      geografia: 1000,
    });
    expect(activeHeadingId(hs, 96)).toBe("");
  });

  it("collapsible groups hide children until toggled or active", async () => {
    document.body.insertAdjacentHTML("beforeend", ARTICLE);
    const toc = await mount("strata-toc", { target: "#art", collapsible: "" });
    const sub = toc.shadowRoot!.querySelector("ol ol") as HTMLElement;
    expect(sub.hidden).toBe(true);
    const btn =
      toc.shadowRoot!.querySelector<HTMLButtonElement>("button.toggle")!;
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    btn.click();
    await toc.updateComplete;
    expect((toc.shadowRoot!.querySelector("ol ol") as HTMLElement).hidden).toBe(
      false,
    );
  });

  it("rail variant gives every tick an accessible name", async () => {
    document.body.insertAdjacentHTML("beforeend", ARTICLE);
    const toc = await mount("strata-toc", { target: "#art", variant: "rail" });
    const ticks = toc.shadowRoot!.querySelectorAll(".rail a");
    expect(ticks).toHaveLength(6);
    ticks.forEach((a) => expect(a.getAttribute("aria-label")).toBeTruthy());
  });

  it("supports a manual list without a target", async () => {
    const toc = await mount("strata-toc", {
      items: JSON.stringify([
        { label: "A", level: 2 },
        { label: "B", level: 3 },
      ]),
    });
    expect(toc.shadowRoot!.querySelectorAll("a")).toHaveLength(2);
  });
});

describe("<strata-reading-time>", () => {
  it("counts target words, skipping references", async () => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div id="a">${"palabra ".repeat(440)}<strata-references>${"x ".repeat(500)}</strata-references></div>`,
    );
    const rt = await mount("strata-reading-time", {
      target: "#a",
      "show-words": "",
    });
    expect(rt.shadowRoot!.textContent).toContain("2 min read");
    expect(rt.shadowRoot!.textContent).toContain("440");
  });
  it("uses `words` and never shows less than 1 minute", async () => {
    const rt = await mount("strata-reading-time", { words: "30" });
    expect(rt.shadowRoot!.textContent).toContain("1 min read");
  });
});

describe("citations and references", () => {
  const body = `
    <p>A<strata-cite ref="b"></strata-cite> y B<strata-cite ref="a"></strata-cite> otra vez A<strata-cite ref="b"></strata-cite></p>
    <strata-references>
      <li id="a">Primera <em>fuente</em></li>
      <li id="b">Segunda fuente</li>
      <li id="z">No citada</li>
    </strata-references>`;

  it("numbers cites by first appearance and orders references to match", async () => {
    document.body.innerHTML = body;
    const refs = document.querySelector("strata-references") as El;
    await tick();
    await tick();
    await refs.updateComplete;
    const cites = [...document.querySelectorAll<El>("strata-cite")];
    await Promise.all(cites.map((c) => c.updateComplete));
    expect(
      cites.map((c) => c.shadowRoot!.querySelector("a")!.textContent),
    ).toEqual(["[1]", "[2]", "[1]"]);
    const rows = [
      ...refs.shadowRoot!.querySelectorAll<HTMLElement>("li[data-ref]"),
    ];
    expect(rows.map((r) => r.dataset.ref)).toEqual(["b", "a", "z"]);
    expect(rows[1].querySelector("em")).not.toBeNull();
  });

  it("gives repeated citations lettered back-links and reveals entries", async () => {
    document.body.innerHTML = body;
    const refs = document.querySelector("strata-references") as El;
    await tick();
    await tick();
    await refs.updateComplete;
    const back = refs.shadowRoot!.querySelectorAll<HTMLElement>(
      "li[data-ref='b'] .back a",
    );
    expect([...back].map((a) => a.textContent!.trim())).toEqual(["a", "b"]);
    expect(refs.reveal("b")).toBe(true);
    await refs.updateComplete;
    expect(
      refs
        .shadowRoot!.querySelector("li[data-ref='b']")!
        .hasAttribute("data-hit"),
    ).toBe(true);
    expect(refs.reveal("nope")).toBe(false);
  });

  it("accepts items JSON and sanitises hrefs", async () => {
    const refs = await mount("strata-references", {
      items: JSON.stringify([
        { id: "x", label: "Libro", href: "javascript:alert(1)" },
        { id: "y", label: "Web", href: "https://e.org" },
      ]),
    });
    const links = refs.shadowRoot!.querySelectorAll(".src a");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("https://e.org");
  });
});

describe("back to top, anchors, hatnote, article nav", () => {
  it("floating button appears only after the threshold; inline always", async () => {
    const btt = await mount("strata-back-to-top", { threshold: "100" });
    const btn = btt.shadowRoot!.querySelector("button")!;
    expect(btn.hidden).toBe(true);
    Object.defineProperty(window, "scrollY", {
      value: 500,
      configurable: true,
    });
    window.dispatchEvent(new Event("scroll"));
    await frame();
    await btt.updateComplete;
    expect(btt.shadowRoot!.querySelector("button")!.hidden).toBe(false);
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    const inline = await mount("strata-back-to-top", { variant: "inline" });
    expect(inline.shadowRoot!.querySelector("button")!.hidden).toBe(false);
  });

  it("heading anchors add one permalink per heading, idempotently, and clean up", async () => {
    document.body.insertAdjacentHTML("beforeend", ARTICLE);
    const ha = await mount("strata-heading-anchors", {
      target: "#art",
      levels: "2-3",
    });
    expect(document.querySelectorAll("a.strata-anchor")).toHaveLength(6);
    (ha as any).apply();
    expect(document.querySelectorAll("a.strata-anchor")).toHaveLength(6);
    ha.remove();
    expect(document.querySelectorAll("a.strata-anchor")).toHaveLength(0);
  });

  it("hatnote and article-nav drop unsafe links", async () => {
    const h = await mount("strata-hatnote", {
      lead: "Para otros usos, véase",
      items: JSON.stringify([
        { label: "Bien", href: "/ok" },
        { label: "Mal", href: "javascript:1" },
      ]),
    });
    expect(h.shadowRoot!.querySelectorAll("a")).toHaveLength(1);
    const n = await mount("strata-article-nav", {
      prev: "Antes",
      "prev-href": "javascript:1",
      next: "Después",
      "next-href": "/n",
    });
    expect(n.shadowRoot!.querySelector(".prev")).toBeNull();
    expect(n.shadowRoot!.querySelector(".next")!.getAttribute("rel")).toBe(
      "next",
    );
  });
});
