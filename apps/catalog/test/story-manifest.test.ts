import { describe, expect, it } from "vitest";
import { catalog } from "../src/lib/componentRegistry";
import { createStoryManifest } from "../src/stories/storyManifest";

function signature(args: Record<string, unknown>): string {
  return JSON.stringify(
    Object.fromEntries(Object.entries(args).sort(([a], [b]) => a.localeCompare(b))),
  );
}

describe("Quick view story manifest", () => {
  it("provides deterministic, uniquely keyed stories for every component", () => {
    for (const entry of catalog) {
      const stories = createStoryManifest(entry);
      expect(stories[0]?.id, entry.id).toBe("default");
      expect(stories.length, entry.id).toBeGreaterThan(0);
      expect(new Set(stories.map((item) => item.id)).size, entry.id).toBe(
        stories.length,
      );
      const signatures = stories.map((item) => signature(item.args));
      expect(new Set(signatures).size, entry.id).toBe(signatures.length);
    }
  });

  it("includes each non-default public select option", () => {
    for (const entry of catalog) {
      const stories = createStoryManifest(entry);
      for (const control of entry.controls) {
        if (control.type !== "select" || !control.options) continue;
        for (const option of control.options) {
          if (option === control.defaultValue) continue;
          expect(
            stories.some((item) => item.args[control.name] === option),
            `${entry.id} / ${control.name} / ${option}`,
          ).toBe(true);
        }
      }
    }
  });

  it("includes the opposite state for each public boolean", () => {
    for (const entry of catalog) {
      const stories = createStoryManifest(entry);
      for (const control of entry.controls) {
        if (control.type !== "boolean") continue;
        expect(
          stories.some(
            (item) => item.args[control.name] === !Boolean(control.defaultValue),
          ),
          `${entry.id} / ${control.name}`,
        ).toBe(true);
      }
    }
  });

  it("does not generate a Cartesian product of component properties", () => {
    for (const entry of catalog) {
      const controls = entry.controls;
      const upperBound =
        1 +
        controls.reduce((count, control) => {
          if (control.type === "select") {
            return count + (control.options?.length ?? 0);
          }
          if (control.type === "boolean") return count + 1;
          if (control.type === "number") {
            return count + (control.name === "value" ? 3 : 0);
          }
          return count;
        }, 0) +
        12; // bounded allowance for explicitly curated combinations
      expect(createStoryManifest(entry).length, entry.id).toBeLessThanOrEqual(
        upperBound,
      );
    }
  });
});
