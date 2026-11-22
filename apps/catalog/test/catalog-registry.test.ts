import { describe, expect, it } from "vitest";
import "@strata/components";
import { STRATA_COMPONENT_CATALOG } from "@strata/components";
import { catalog, categories, entryById } from "../src/lib/componentRegistry";
import { deriveControls } from "../src/lib/props";

const kebab = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

describe("catalog registry", () => {
  it("mirrors the canonical 74-entry inventory", () => {
    expect(catalog).toHaveLength(74);
    expect(new Set(catalog.map((e) => e.id)).size).toBe(74);
  });

  it("covers every canonical component exactly once", () => {
    const canonicalIds = STRATA_COMPONENT_CATALOG.map(kebab);
    expect(new Set(catalog.map((e) => e.id))).toEqual(new Set(canonicalIds));
  });

  it("maps every entry to its real custom element tag", () => {
    for (const entry of catalog) {
      expect(entry.tagName).toBe(`strata-${entry.id}`);
      expect(customElements.get(entry.tagName)).toBeDefined();
    }
  });

  it("uses only declared categories", () => {
    for (const entry of catalog) {
      expect(categories).toContain(entry.category);
    }
  });

  it("derives typed controls from Lit metadata for every entry", () => {
    for (const entry of catalog) {
      const controls = deriveControls(entry);
      // These elements expose no public reactive properties by design.
      if (["theme-toggle", "logo", "prose"].includes(entry.id)) {
        expect(controls).toHaveLength(0);
        continue;
      }
      expect(controls.length, entry.id).toBeGreaterThan(0);
      for (const control of controls) {
        expect(["text", "boolean", "number", "select", "list"]).toContain(
          control.type,
        );
        expect(control.defaultValue).not.toBeUndefined();
      }
    }
  });

  it("preserves boolean and number property types", () => {
    const button = entryById("button")!;
    const controls = deriveControls(button);
    const byName = Object.fromEntries(controls.map((c) => [c.name, c]));
    expect(byName.fullWidth?.type).toBe("boolean");
    expect(byName.disabled?.type).toBe("boolean");
    expect(byName.size?.type).toBe("select");
    expect(byName.label?.type).toBe("text");

    const slider = entryById("slider")!;
    const sliderControls = deriveControls(slider);
    const min = sliderControls.find((c) => c.name === "min");
    expect(min?.type).toBe("number");
    expect(typeof min?.defaultValue).toBe("number");
  });

  it("resolves entryById for every catalog id", () => {
    for (const entry of catalog) {
      expect(entryById(entry.id)).toBe(entry);
    }
    expect(entryById("does-not-exist")).toBeUndefined();
  });
});
