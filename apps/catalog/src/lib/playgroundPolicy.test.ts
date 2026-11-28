import { describe, expect, it } from "vitest";
import { catalog } from "./componentRegistry";
import {
  initialPlaygroundValues,
  usesPropertyPlayground,
} from "./playgroundPolicy";

function entry(id: string) {
  const found = catalog.find((item) => item.id === id);
  if (!found) throw new Error(`Missing catalog entry: ${id}`);
  return found;
}

function control(id: string, name: string) {
  const found = entry(id).controls.find((item) => item.name === name);
  if (!found) throw new Error(`Missing ${id} control: ${name}`);
  return found;
}

describe("editorial component playground policy", () => {
  it.each(["card", "overlay", "grille"])("%s uses a live property playground", (id) => {
    expect(usesPropertyPlayground(id)).toBe(true);
  });

  it.each(["button", "dialog", "accordion"])("%s retains the variant gallery", (id) => {
    expect(usesPropertyPlayground(id)).toBe(false);
  });

  it("seeds a rich Card fixture without mutating source defaults", () => {
    const defaults = { is_media: false, show_excerpt: false, show_meta: false, show_category: false };
    expect(initialPlaygroundValues("card", defaults)).toEqual({
      is_media: true,
      show_excerpt: true,
      show_meta: true,
      show_category: true,
    });
    expect(defaults).toEqual({
      is_media: false,
      show_excerpt: false,
      show_meta: false,
      show_category: false,
    });
  });

  it("seeds Overlay metadata while keeping reset values source-defaulted", () => {
    expect(initialPlaygroundValues("overlay", { show_meta: false, show_category: false }))
      .toEqual({ show_meta: true, show_category: true });
  });

  it("does not add demo-only values to Grille's source defaults", () => {
    expect(initialPlaygroundValues("grille", { desktop: 3, mobile: 3, gap: "large", color: "soft" }))
      .toEqual({ desktop: 3, mobile: 3, gap: "large", color: "soft" });
  });
});

describe("Vue source API parity: Card", () => {
  it("restricts catalog controls to the source component API and inherited post fields", () => {
    expect(entry("card").controlAllowlist).toEqual(expect.arrayContaining([
      "title", "url", "feature_image", "tag_name", "author_name", "published_at", "excerpt",
      "is_media", "media_align", "media_width", "aspect_ratio", "inline_mobile", "elevation",
      "show_excerpt", "show_meta", "show_category", "heading", "font_group", "icon",
    ]));
    expect(entry("card").controlAllowlist).not.toEqual(expect.arrayContaining(["density", "bordered", "reading_time"]));
  });

  it("preserves Vue enum choices and defaults", () => {
    expect(control("card", "media_align").options).toEqual(["top", "left", "right", "bottom"]);
    expect(control("card", "media_width").options).toEqual([
      "is-none", "is-full", "is-half", "is-two-fifths", "is-one-third", "is-one-quarter", "is-one-fifth",
    ]);
    expect(control("card", "aspect_ratio").options).toEqual(["monitor", "square", "video"]);
    expect(control("card", "is_media").defaultValue).toBe(false);
    expect(control("card", "show_meta").defaultValue).toBe(false);
    expect(control("card", "show_category").defaultValue).toBe(false);
    expect(control("card", "show_excerpt").defaultValue).toBe(false);
  });
});

describe("Vue source API parity: Overlay", () => {
  it("restricts controls to source-supported presentation and post fields", () => {
    expect(entry("overlay").controlAllowlist).toEqual(expect.arrayContaining([
      "title", "url", "feature_image", "tag_name", "author_name", "published_at",
      "heading", "aspect_ratio", "show_meta", "show_category", "font_group",
      "align", "position", "box", "is_dark", "fill",
    ]));
    expect(entry("overlay").controlAllowlist).not.toEqual(expect.arrayContaining(["reading_time"]));
  });

  it("preserves Vue enum choices and defaults", () => {
    expect(control("overlay", "align").options).toEqual(["start", "center", "end"]);
    expect(control("overlay", "position").options).toEqual(["top", "center", "bottom"]);
    expect(control("overlay", "box").options).toEqual(["border", "background", "transparent"]);
    expect(control("overlay", "fill").options).toEqual(["full", "gradient", "none"]);
    expect(control("overlay", "show_meta").defaultValue).toBe(false);
    expect(control("overlay", "show_category").defaultValue).toBe(false);
  });
});

describe("Vue source API parity: Grille", () => {
  it("exposes only the four source props and enum values", () => {
    expect(entry("grille").controlAllowlist).toEqual(["desktop", "mobile", "gap", "color"]);
    expect(control("grille", "desktop").defaultValue).toBe(3);
    expect(control("grille", "mobile").defaultValue).toBe(3);
    expect(control("grille", "gap").options).toEqual(["small", "medium", "large"]);
    expect(control("grille", "color").options).toEqual(["soft", "muted", "hard"]);
  });
});
