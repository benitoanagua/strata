import { describe, expect, it } from "vitest";
import "@strata/components";
import type { StrataTreeNode } from "@strata/components";
import { buildTreeNodes, LIBRARY_NODE_ID } from "../src/lib/treeData";
import { deriveControls, variantControls } from "../src/lib/props";
import { catalog, entryById } from "../src/lib/componentRegistry";

function entryNodes(nodes: StrataTreeNode[]): StrataTreeNode[] {
  const library = nodes.find((n) => n.id === LIBRARY_NODE_ID);
  return (library?.children ?? []).flatMap((cat) => cat.children ?? []);
}

describe("buildTreeNodes", () => {
  it("reports the real variant count as entry meta", () => {
    const nodes = entryNodes(buildTreeNodes());
    expect(nodes).toHaveLength(catalog.length);
    for (const node of nodes) {
      const entry = entryById(node.id.slice("entry:".length))!;
      const expected = variantControls(deriveControls(entry)).reduce(
        (sum, c) => sum + (c.options?.length ?? 0),
        0,
      );
      if (expected > 0) {
        expect(node.meta, entry.id).toBe(String(expected));
      } else {
        expect(node.meta, entry.id).toBeUndefined();
      }
    }
  });

  it("matches known variant counts and drops the technical tag name", () => {
    const byId = new Map(
      entryNodes(buildTreeNodes()).map((n) => [n.id.slice("entry:".length), n]),
    );
    // Alert exposes four tones; Badge five; Tag nine hues.
    expect(byId.get("alert")?.meta).toBe("4");
    expect(byId.get("badge")?.meta).toBe("5");
    expect(byId.get("tag")?.meta).toBe("9");
    // No meta repeats the element tag anymore.
    for (const node of byId.values()) {
      expect(node.meta).not.toBe(node.id.replace("entry:", ""));
    }
    // Components without select controls show no counter.
    expect(byId.get("progress")?.meta).toBeUndefined();
    expect(byId.get("spinner")?.meta).toBeUndefined();
  });

  it("keeps meta counts while searching", () => {
    const nodes = entryNodes(buildTreeNodes("alert"));
    expect(nodes.length).toBeGreaterThan(0);
    for (const node of nodes) {
      expect(node.meta === undefined || /^\d+$/.test(node.meta)).toBe(true);
    }
  });
});
