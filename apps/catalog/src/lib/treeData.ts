import type { StrataTreeNode } from "@strata/components";
import { catalog, categories, type CatalogEntry } from "./componentRegistry";
import { scenarios } from "./scenarios";

export const SCENARIOS_NODE_ID = "root:scenarios";
export const LIBRARY_NODE_ID = "root:library";

const CATEGORY_ICONS: Record<string, string> = {
  Actions: "carbon:add",
  Forms: "carbon:edit",
  Navigation: "carbon:link",
  Feedback: "carbon:information",
  Surfaces: "carbon:grid",
  "Data & Content": "carbon:document",
  Editorial: "carbon:quotes",
  "Article Navigation": "carbon:list-bulleted",
};

function matches(entry: CatalogEntry, q: string): boolean {
  return (
    entry.name.toLowerCase().includes(q) ||
    entry.id.includes(q) ||
    entry.tagName.includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    entry.category.toLowerCase().includes(q)
  );
}

function entryNode(entry: CatalogEntry): StrataTreeNode {
  return {
    id: `entry:${entry.id}`,
    label: entry.name,
    meta: entry.tagName.replace("strata-", ""),
    href: `#/${entry.id}`,
  };
}

/**
 * Builds the sidebar tree from the canonical registry. `search` filters
 * entries and scenarios; empty categories are dropped. Node ids are stable
 * (`root:*`, `cat:*`, `entry:*`, `scenario:*`) so expansion state survives
 * re-renders.
 */
export function buildTreeNodes(search = ""): StrataTreeNode[] {
  const q = search.trim().toLowerCase();

  const scenarioNodes = scenarios
    .filter((s) => !q || s.name.toLowerCase().includes(q) || s.id.includes(q))
    .map((s) => ({
      id: `scenario:${s.id}`,
      label: s.name,
      href: `#/scenario/${s.id}`,
    }));

  const libraryChildren = categories
    .map((category): StrataTreeNode | undefined => {
      const entries = catalog.filter(
        (e) => e.category === category && (!q || matches(e, q)),
      );
      if (!entries.length) return undefined;
      return {
        id: `cat:${category}`,
        label: category,
        icon: CATEGORY_ICONS[category],
        meta: String(entries.length),
        expanded: true,
        children: entries.map(entryNode),
      };
    })
    .filter((n): n is StrataTreeNode => n !== undefined);

  const roots: StrataTreeNode[] = [];
  if (scenarioNodes.length) {
    roots.push({
      id: SCENARIOS_NODE_ID,
      label: "Scenarios",
      icon: "carbon:grid",
      expanded: true,
      children: scenarioNodes,
    });
  }
  if (libraryChildren.length) {
    roots.push({
      id: LIBRARY_NODE_ID,
      label: "Library",
      icon: "carbon:folder",
      meta: String(catalog.length),
      expanded: true,
      children: libraryChildren,
    });
  }
  return roots;
}

/** Maps a hash route to the tree node id that should be selected. */
export function nodeIdForRoute(route: {
  kind: "component" | "scenario";
  id: string;
}): string {
  return route.kind === "scenario"
    ? `scenario:${route.id}`
    : `entry:${route.id}`;
}
