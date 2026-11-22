import { describe, it, expect } from "vitest";
import "../src/elements/index.ts";
import type { StrataTreeNode } from "../src/types/tree.js";

const SAMPLE: StrataTreeNode[] = [
  {
    id: "cat-a",
    label: "Category A",
    meta: "2",
    children: [
      { id: "a-1", label: "Alpha One", icon: "carbon:document" },
      { id: "a-2", label: "Alpha Two", disabled: true },
    ],
  },
  { id: "b-1", label: "Beta One", expanded: undefined },
  {
    id: "cat-b",
    label: "Category B",
    children: [{ id: "b-2", label: "Beta Two" }],
    expanded: true,
  },
];

async function mount(
  nodes: StrataTreeNode[] = SAMPLE,
  expandMode: "multiple" | "single" = "multiple",
) {
  const el = document.createElement("strata-tree") as HTMLElement & {
    nodes: StrataTreeNode[];
    selectedIds: string[];
    multiple: boolean;
    expandMode: "multiple" | "single";
    updateComplete: Promise<unknown>;
  };
  el.nodes = nodes;
  el.expandMode = expandMode;
  document.body.appendChild(el);
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

function items(el: HTMLElement) {
  return [...(el.shadowRoot?.querySelectorAll('[role="treeitem"]') ?? [])];
}

describe("strata-tree", () => {
  it("renders nodes with tree semantics", async () => {
    const el = await mount();
    const tree = el.shadowRoot?.querySelector('[role="tree"]');
    expect(tree).toBeTruthy();
    expect(tree?.getAttribute("aria-label")).toBe("Tree");
    // cat-a closed (2 children hidden), cat-b open via expanded:true
    const rendered = items(el);
    expect(rendered.map((i) => i.getAttribute("data-node-id"))).toEqual([
      "cat-a",
      "b-1",
      "cat-b",
      "b-2",
    ]);
    const catB = rendered.find(
      (i) => i.getAttribute("data-node-id") === "cat-b",
    );
    expect(catB?.getAttribute("aria-expanded")).toBe("true");
    const catA = rendered.find(
      (i) => i.getAttribute("data-node-id") === "cat-a",
    );
    expect(catA?.getAttribute("aria-expanded")).toBe("false");
    expect(catA?.getAttribute("aria-level")).toBe("1");
    const b2 = rendered.find((i) => i.getAttribute("data-node-id") === "b-2");
    expect(b2?.getAttribute("aria-level")).toBe("2");
    el.remove();
  });

  it("expands and collapses via caret click and emits strata-toggle", async () => {
    const el = await mount();
    const toggles: unknown[] = [];
    el.addEventListener("strata-toggle", (e) =>
      toggles.push((e as CustomEvent).detail),
    );
    const catA = el.shadowRoot?.querySelector(
      '[data-node-id="cat-a"] .strata-tree__caret',
    ) as HTMLElement;
    catA.click();
    await el.updateComplete;
    expect(items(el).map((i) => i.getAttribute("data-node-id"))).toContain(
      "a-1",
    );
    expect(toggles).toEqual([{ id: "cat-a", expanded: true }]);
    catA.click();
    await el.updateComplete;
    expect(items(el).map((i) => i.getAttribute("data-node-id"))).not.toContain(
      "a-1",
    );
    el.remove();
  });

  it("selects nodes and emits strata-select with the node", async () => {
    const el = await mount();
    const selects: unknown[] = [];
    el.addEventListener("strata-select", (e) =>
      selects.push((e as CustomEvent).detail),
    );
    const row = el.shadowRoot?.querySelector(
      '[data-node-id="b-1"] .strata-tree__row',
    ) as HTMLElement;
    row.click();
    await el.updateComplete;
    expect(selects).toHaveLength(1);
    expect((selects[0] as { id: string }).id).toBe("b-1");
    expect((selects[0] as { selected: boolean }).selected).toBe(true);
    const b1 = items(el).find((i) => i.getAttribute("data-node-id") === "b-1");
    expect(b1?.getAttribute("aria-selected")).toBe("true");
    // Single selection: clicking another node moves the selection.
    const row2 = el.shadowRoot?.querySelector(
      '[data-node-id="cat-b"] .strata-tree__row',
    ) as HTMLElement;
    row2.click();
    await el.updateComplete;
    const b1After = items(el).find(
      (i) => i.getAttribute("data-node-id") === "b-1",
    );
    expect(b1After?.getAttribute("aria-selected")).toBe("false");
    el.remove();
  });

  it("does not select disabled nodes", async () => {
    const el = await mount();
    // expand cat-a first
    (
      el.shadowRoot?.querySelector(
        '[data-node-id="cat-a"] .strata-tree__caret',
      ) as HTMLElement
    ).click();
    await el.updateComplete;
    const disabled = items(el).find(
      (i) => i.getAttribute("data-node-id") === "a-2",
    );
    expect(disabled?.getAttribute("aria-disabled")).toBe("true");
    const selects: unknown[] = [];
    el.addEventListener("strata-select", (e) =>
      selects.push((e as CustomEvent).detail),
    );
    (disabled?.querySelector(".strata-tree__row") as HTMLElement).click();
    await el.updateComplete;
    expect(selects).toHaveLength(0);
    expect(disabled?.getAttribute("aria-selected")).toBe("false");
    el.remove();
  });

  it("supports multiple selection", async () => {
    const el = await mount();
    el.multiple = true;
    await el.updateComplete;
    const click = (id: string) =>
      (
        el.shadowRoot?.querySelector(
          `[data-node-id="${id}"] .strata-tree__row`,
        ) as HTMLElement
      ).click();
    click("b-1");
    click("cat-b");
    await el.updateComplete;
    const b1 = items(el).find((i) => i.getAttribute("data-node-id") === "b-1");
    const catB = items(el).find(
      (i) => i.getAttribute("data-node-id") === "cat-b",
    );
    expect(b1?.getAttribute("aria-selected")).toBe("true");
    expect(catB?.getAttribute("aria-selected")).toBe("true");
    const tree = el.shadowRoot?.querySelector('[role="tree"]');
    expect(tree?.getAttribute("aria-multiselectable")).toBe("true");
    el.remove();
  });

  it("honours controlled selectedIds and expands ancestors", async () => {
    const el = await mount();
    el.selectedIds = ["a-1"];
    await el.updateComplete;
    await el.updateComplete;
    // cat-a must have auto-expanded to reveal the selection.
    const ids = items(el).map((i) => i.getAttribute("data-node-id"));
    expect(ids).toContain("a-1");
    const a1 = items(el).find((i) => i.getAttribute("data-node-id") === "a-1");
    expect(a1?.getAttribute("aria-selected")).toBe("true");
    el.remove();
  });

  it("navigates with the keyboard", async () => {
    const el = await mount();
    const tree = el.shadowRoot?.querySelector('[role="tree"]') as HTMLElement;
    const press = async (key: string) => {
      tree.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
    };
    // Focus starts on first visible node (cat-a).
    await press("ArrowRight"); // expand cat-a
    expect(items(el).map((i) => i.getAttribute("data-node-id"))).toContain(
      "a-1",
    );
    await press("ArrowDown"); // -> b-1? order: cat-a, a-1, a-2, b-1...
    const focused = () =>
      items(el).find((i) => i.getAttribute("tabindex") === "0");
    expect(focused()?.getAttribute("data-node-id")).toBe("a-1");
    await press("ArrowDown");
    expect(focused()?.getAttribute("data-node-id")).toBe("a-2");
    await press("ArrowLeft"); // a-2 is leaf -> parent cat-a
    expect(focused()?.getAttribute("data-node-id")).toBe("cat-a");
    await press("ArrowLeft"); // cat-a open -> collapse
    expect(items(el).map((i) => i.getAttribute("data-node-id"))).not.toContain(
      "a-1",
    );
    await press("End");
    expect(focused()?.getAttribute("data-node-id")).toBe("b-2");
    await press("Home");
    expect(focused()?.getAttribute("data-node-id")).toBe("cat-a");
    await press("Enter"); // select cat-a
    const catA = items(el).find(
      (i) => i.getAttribute("data-node-id") === "cat-a",
    );
    expect(catA?.getAttribute("aria-selected")).toBe("true");
    el.remove();
  });

  it("parses nodes from a JSON attribute", async () => {
    const el = document.createElement("strata-tree") as HTMLElement;
    el.setAttribute("nodes", JSON.stringify([{ id: "x", label: "Ex" }]));
    document.body.appendChild(el);
    await (el as unknown as { updateComplete: Promise<unknown> })
      .updateComplete;
    await (el as unknown as { updateComplete: Promise<unknown> })
      .updateComplete;
    expect(items(el)).toHaveLength(1);
    el.remove();
  });

  it("renders the empty label when there are no nodes", async () => {
    const el = await mount([]);
    expect(el.shadowRoot?.textContent).toContain("No items");
    el.remove();
  });

  it("expandMode=single collapses expanded siblings", async () => {
    // SAMPLE seeds cat-b expanded; opening cat-a must collapse cat-b.
    const el = await mount(SAMPLE, "single");
    const caret = (id: string) =>
      el.shadowRoot?.querySelector(
        `[data-node-id="${id}"] .strata-tree__caret`,
      ) as HTMLElement;
    caret("cat-a").click();
    await el.updateComplete;
    const ids = items(el).map((i) => i.getAttribute("data-node-id"));
    expect(ids).toContain("a-1");
    expect(ids).not.toContain("b-2"); // cat-b collapsed as a sibling
    const catB = items(el).find(
      (i) => i.getAttribute("data-node-id") === "cat-b",
    );
    expect(catB?.getAttribute("aria-expanded")).toBe("false");
    el.remove();
  });

  it("expandMode=single keeps only one expanded node per level", async () => {
    const el = await mount(SAMPLE, "single");
    const api = el as unknown as {
      setNodeExpanded: (id: string, v: boolean) => void;
    };
    api.setNodeExpanded("cat-a", true);
    api.setNodeExpanded("cat-b", true);
    await el.updateComplete;
    const ids = items(el).map((i) => i.getAttribute("data-node-id"));
    expect(ids).toContain("b-2");
    expect(ids).not.toContain("a-1"); // cat-a lost the sibling group
    el.remove();
  });

  it("expandMode=single keeps ancestors of the selection expanded", async () => {
    const el = await mount(SAMPLE, "single");
    el.selectedIds = ["a-1"];
    await el.updateComplete;
    await el.updateComplete;
    const ids = items(el).map((i) => i.getAttribute("data-node-id"));
    // cat-a (selection ancestor) wins over seeded cat-b.
    expect(ids).toEqual(
      expect.arrayContaining(["cat-a", "a-1", "a-2", "b-1", "cat-b"]),
    );
    expect(ids).not.toContain("b-2");
    el.remove();
  });

  it("expandMode=single allows nested expansion under an open parent", async () => {
    const nested: StrataTreeNode[] = [
      {
        id: "p",
        label: "Parent",
        children: [
          {
            id: "c1",
            label: "Child 1",
            children: [{ id: "g1", label: "Grandchild" }],
          },
          { id: "c2", label: "Child 2" },
        ],
      },
      { id: "other", label: "Other", children: [{ id: "o1", label: "O1" }] },
    ];
    const el = await mount(nested, "single");
    const api = el as unknown as {
      setNodeExpanded: (id: string, v: boolean) => void;
    };
    api.setNodeExpanded("p", true);
    api.setNodeExpanded("c1", true);
    api.setNodeExpanded("other", true); // sibling of p -> collapses p subtree
    await el.updateComplete;
    let ids = items(el).map((i) => i.getAttribute("data-node-id"));
    expect(ids).toContain("o1");
    expect(ids).not.toContain("c1");
    // Re-open p: it wins the root sibling group again; c1 kept its own
    // expanded state while hidden under the collapsed p.
    api.setNodeExpanded("p", true);
    await el.updateComplete;
    ids = items(el).map((i) => i.getAttribute("data-node-id"));
    expect(ids).toContain("c1");
    expect(ids).not.toContain("o1");
    el.remove();
  });

  it("expandMode defaults to multiple (siblings coexist)", async () => {
    const el = await mount();
    const caret = (id: string) =>
      el.shadowRoot?.querySelector(
        `[data-node-id="${id}"] .strata-tree__caret`,
      ) as HTMLElement;
    caret("cat-a").click();
    await el.updateComplete;
    const ids = items(el).map((i) => i.getAttribute("data-node-id"));
    expect(ids).toContain("a-1");
    expect(ids).toContain("b-2"); // cat-b still expanded
    el.remove();
  });

  it("public API expands, collapses and focuses nodes", async () => {
    const el = await mount();
    const api = el as unknown as {
      setNodeExpanded: (id: string, v: boolean) => void;
      expandAll: () => void;
      collapseAll: () => void;
      focusNode: (id: string) => Promise<void>;
    };
    api.expandAll();
    await el.updateComplete;
    expect(items(el)).toHaveLength(6);
    api.collapseAll();
    await el.updateComplete;
    expect(items(el)).toHaveLength(3);
    api.setNodeExpanded("cat-a", true);
    await el.updateComplete;
    await api.focusNode("a-1");
    const focused = items(el).find((i) => i.getAttribute("tabindex") === "0");
    expect(focused?.getAttribute("data-node-id")).toBe("a-1");
    el.remove();
  });
});
