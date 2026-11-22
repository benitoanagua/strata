export interface HeadingInfo {
  id: string;
  text: string;
  level: number;
  el: HTMLElement | null;
}

/** URL-safe slug that keeps readable ids for accented text. */
export function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** `"2-4"` → [2, 4]; `"3"` → [3, 3]. Always clamped to 1–6. */
export function parseLevels(value: string | number): [number, number] {
  const [a, b] = String(value)
    .split("-")
    .map((n) => parseInt(n, 10));
  const lo = Math.min(6, Math.max(1, a || 2));
  const hi = Math.min(6, Math.max(lo, b || lo));
  return [lo, hi];
}

/** Resolve a CSS selector relative to the host's root, then the document. */
export function resolveTarget(
  host: Element,
  selector: string,
): HTMLElement | null {
  if (!selector) return null;
  const root = host.getRootNode() as Document | ShadowRoot;
  try {
    return (
      (root.querySelector?.(selector) as HTMLElement | null) ??
      (document.querySelector(selector) as HTMLElement | null)
    );
  } catch {
    return null;
  }
}

export function headingText(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  clone
    .querySelectorAll(".strata-anchor, .mw-editsection, [data-toc-skip]")
    .forEach((n) => n.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

/** Collect headings in document order, giving ids to those without one. */
export function collectHeadings(
  root: Element,
  levels: [number, number],
  ensureIds = true,
): HeadingInfo[] {
  const selector = Array.from(
    { length: levels[1] - levels[0] + 1 },
    (_, i) => `h${levels[0] + i}`,
  ).join(",");
  const used = new Set<string>(
    Array.from(root.querySelectorAll("[id]")).map((n) => n.id),
  );
  const out: HeadingInfo[] = [];
  root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const text = headingText(el);
    if (!text) return;
    let id = el.id;
    if (!id && ensureIds) {
      const base = slugify(text);
      id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      el.id = id;
      used.add(id);
    }
    out.push({ id, text, level: Number(el.tagName[1]), el });
  });
  return out;
}

/** The last heading whose top edge has passed `offset` px from the viewport top. */
export function activeHeadingId(
  headings: HeadingInfo[],
  offset: number,
): string {
  let current = "";
  for (const h of headings) {
    if (!h.el) continue;
    if (h.el.getBoundingClientRect().top <= offset + 1) current = h.id;
    else break;
  }
  return current;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scroll so `el` sits `offset` px below the viewport top. */
export function scrollToElement(el: Element, offset = 0) {
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo?.({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

/** rAF-throttled scroll/resize subscription. Returns the unsubscribe. */
export function onScrollFrame(fn: () => void): () => void {
  let queued = false;
  const run = () => {
    if (queued) return;
    queued = true;
    const tick = () => {
      queued = false;
      fn();
    };
    typeof requestAnimationFrame === "function"
      ? requestAnimationFrame(tick)
      : tick();
  };
  window.addEventListener("scroll", run, { passive: true });
  window.addEventListener("resize", run, { passive: true });
  return () => {
    window.removeEventListener("scroll", run);
    window.removeEventListener("resize", run);
  };
}
