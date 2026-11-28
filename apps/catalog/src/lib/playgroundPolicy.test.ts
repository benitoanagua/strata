import { describe, expect, it } from "vitest";
import { catalog } from "./componentRegistry";
import { allowsCatalogControl } from "./props";
import {
  initialPlaygroundValues,
  normalizePlaygroundValue,
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

describe("rich preview fixture policy", () => {
  it.each(["card", "overlay", "grille"])(
    "%s receives a rich preview fixture",
    (id) => {
      expect(usesPropertyPlayground(id)).toBe(true);
    },
  );

  it.each(["button", "dialog", "accordion"])(
    "%s uses standard source defaults",
    (id) => {
      expect(usesPropertyPlayground(id)).toBe(false);
    },
  );

  it("seeds a rich Card fixture without mutating source defaults", () => {
    const defaults = {
      is_media: false,
      show_excerpt: false,
      show_meta: false,
      show_category: false,
    };
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
    expect(
      initialPlaygroundValues("overlay", {
        show_meta: false,
        show_category: false,
      }),
    ).toEqual({ show_meta: true, show_category: true });
  });

  it("keeps Grille column counts integral and within the Vue 1–6 contract", () => {
    expect(normalizePlaygroundValue("grille", "desktop", 0)).toBe(1);
    expect(normalizePlaygroundValue("grille", "mobile", 7)).toBe(6);
    expect(normalizePlaygroundValue("grille", "desktop", 2.6)).toBe(3);
    expect(normalizePlaygroundValue("grille", "desktop", "invalid")).toBe(1);
    expect(normalizePlaygroundValue("card", "heading", 7)).toBe(7);
  });

  it("does not add demo-only values to Grille source defaults", () => {
    const defaults = {
      desktop: 3,
      mobile: 3,
      gap: "large",
      color: "soft",
    };
    expect(initialPlaygroundValues("grille", defaults)).toEqual(defaults);
  });
});

describe("source API property filtering", () => {
  it("filters properties that are not present in the Vue source contract", () => {
    expect(allowsCatalogControl(entry("card"), "media_align")).toBe(true);
    expect(allowsCatalogControl(entry("card"), "density")).toBe(false);
    expect(allowsCatalogControl(entry("card"), "bordered")).toBe(false);
    expect(allowsCatalogControl(entry("overlay"), "reading_time")).toBe(false);
    expect(allowsCatalogControl(entry("grille"), "gap")).toBe(true);
    expect(allowsCatalogControl(entry("grille"), "debug")).toBe(false);
  });
});

describe("Vue source API parity: Card", () => {
  it("restricts catalog controls to source props and mapped post fields", () => {
    expect(entry("card").controlAllowlist).toEqual(
      expect.arrayContaining([
        "title",
        "url",
        "feature_image",
        "tag_name",
        "author_name",
        "published_at",
        "excerpt",
        "is_media",
        "media_align",
        "media_width",
        "aspect_ratio",
        "inline_mobile",
        "monochrome",
        "show_excerpt",
        "show_meta",
        "show_category",
        "heading",
        "icon",
      ]),
    );
    expect(entry("card").controlAllowlist).not.toEqual(
      expect.arrayContaining(["density", "bordered", "reading_time", "elevation", "font_group"]),
    );
    expect(control("card", "monochrome").defaultValue).toBe(true);
  });

  it("preserves Vue enum choices and defaults", () => {
    expect(control("card", "media_align").options).toEqual([
      "top",
      "left",
      "right",
      "bottom",
    ]);
    expect(control("card", "media_width").options).toEqual([
      "is-none",
      "is-full",
      "is-half",
      "is-two-fifths",
      "is-one-third",
      "is-one-quarter",
      "is-one-fifth",
    ]);
    expect(control("card", "aspect_ratio").options).toEqual([
      "monitor",
      "square",
      "video",
    ]);
    expect(control("card", "heading").defaultValue).toBe(3);
    expect(control("card", "media_width").defaultValue).toBe("is-half");
    expect(control("card", "aspect_ratio").defaultValue).toBe("monitor");
    expect(control("card", "media_align").defaultValue).toBe("left");
    expect(control("card", "inline_mobile").defaultValue).toBe(false);
    expect(control("card", "icon").defaultValue).toBe("none");
    expect(control("card", "is_media").defaultValue).toBe(false);
    expect(control("card", "show_meta").defaultValue).toBe(false);
    expect(control("card", "show_category").defaultValue).toBe(false);
    expect(control("card", "show_excerpt").defaultValue).toBe(false);
  });
});

describe("Vue source API parity: Overlay", () => {
  it("restricts controls to source-supported presentation and post fields", () => {
    expect(entry("overlay").controlAllowlist).toEqual(
      expect.arrayContaining([
        "title",
        "url",
        "feature_image",
        "tag_name",
        "author_name",
        "published_at",
        "heading",
        "aspect_ratio",
        "show_meta",
        "show_category",
        "monochrome",
        "theme",
        "align",
        "position",
        "box",
        "fill",
      ]),
    );
    expect(entry("overlay").controlAllowlist).not.toEqual(
      expect.arrayContaining(["reading_time", "font_group", "is_dark"]),
    );
    expect(control("overlay", "monochrome").defaultValue).toBe(true);
    expect(control("overlay", "theme").defaultValue).toBe("auto");
    expect(control("overlay", "theme").options).toEqual(["auto", "light", "dark"]);
  });

  it("preserves Vue enum choices and defaults", () => {
    expect(control("overlay", "align").options).toEqual([
      "start",
      "center",
      "end",
    ]);
    expect(control("overlay", "position").options).toEqual([
      "top",
      "center",
      "bottom",
    ]);
    expect(control("overlay", "box").options).toEqual([
      "border",
      "background",
      "transparent",
    ]);
    expect(control("overlay", "fill").options).toEqual([
      "full",
      "gradient",
      "none",
    ]);
    expect(control("overlay", "heading").defaultValue).toBe(1);
    expect(control("overlay", "aspect_ratio").defaultValue).toBe("monitor");
    expect(control("overlay", "position").defaultValue).toBe("center");
    expect(control("overlay", "box").defaultValue).toBe("background");
    expect(control("overlay", "fill").defaultValue).toBe("full");
    expect(control("overlay", "show_meta").defaultValue).toBe(false);
    expect(control("overlay", "show_category").defaultValue).toBe(false);
  });
});

describe("Vue source API parity: Grille", () => {
  it("uses native article cells for the Vue component's generic HTMLElement slot", () => {
    expect(entry("grille").slotHtml).toContain("<article");
    expect(entry("grille").slotHtml).not.toContain("strata-grille-item");
    expect(entry("grille").slots?.[0]?.description).toContain(
      "Any direct HTML element",
    );
  });

  it("exposes only the four source props and enum values", () => {
    expect(entry("grille").controlAllowlist).toEqual([
      "desktop",
      "mobile",
      "gap",
      "color",
    ]);
    expect(control("grille", "desktop").defaultValue).toBe(3);
    expect(control("grille", "mobile").defaultValue).toBe(3);
    expect(control("grille", "gap").defaultValue).toBe("large");
    expect(control("grille", "color").defaultValue).toBe("soft");
    expect(control("grille", "gap").options).toEqual([
      "small",
      "medium",
      "large",
    ]);
    expect(control("grille", "color").options).toEqual([
      "soft",
      "muted",
      "hard",
    ]);
  });
});
