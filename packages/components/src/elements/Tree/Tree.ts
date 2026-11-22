import { LitElement, html, nothing, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import baseCSS from "../../component-base.css?inline";
import componentCSS from "./Tree.css?inline";
import type { StrataTreeNode } from "../../types/tree.js";

const jsonConverter = {
  fromAttribute: (value: string | null): unknown => {
    if (value === null) return [];
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  toAttribute: (value: unknown): string => JSON.stringify(value ?? []),
};

/**
 * Generic accessible tree. Data-driven via the `nodes` property/attribute
 * (`StrataTreeNode[]` or a JSON string); selection and expansion are managed
 * internally and reported through `strata-select`, `strata-selection-change`
 * and `strata-toggle` events so consumers stay in control.
 *
 * Keyboard (roving tabindex, ARIA treeview pattern):
 * ArrowDown/ArrowUp move, ArrowRight expands or enters, ArrowLeft collapses
 * or moves to the parent, Home/End jump, Enter/Space selects.
 */
@customElement("strata-tree")
export class StrataTree extends LitElement {
  static styles = [unsafeCSS(baseCSS), unsafeCSS(componentCSS)];

  /** Accessible name for the tree. */
  @property({ type: String }) label = "Tree";
  /** Tree data: `StrataTreeNode[]` or a JSON string (attribute or property). */
  @property({ attribute: "nodes", converter: jsonConverter })
  nodes: StrataTreeNode[] | string = [];
  /** Selected node ids: `string[]` or a JSON string. */
  @property({ attribute: "selected-ids", converter: jsonConverter })
  selectedIds: string[] | string = [];
  /** Allow several selected nodes at once. */
  @property({ type: Boolean }) multiple = false;
  /**
   * Expansion behaviour. `"multiple"` (default) lets any number of sibling
   * nodes stay expanded. `"single"` applies accordion semantics: within each
   * sibling group only one node may be expanded at a time; expanding a node
   * collapses its expanded siblings. Ancestors of the current selection are
   * always kept expanded.
   */
  @property({ attribute: "expand-mode", type: String })
  expandMode: "multiple" | "single" = "multiple";
  /** Message rendered when `nodes` is empty. */
  @property({ attribute: "empty-label", type: String })
  emptyLabel = "No items";

  @state() private expandedIds = new Set<string>();
  @state() private selectedIdSet = new Set<string>();
  @state() private focusedId = "";

  private nodeMap = new Map<string, StrataTreeNode>();
  private parentMap = new Map<string, string>();
  private seededExpanded = new Set<string>();

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("nodes")) {
      this.rebuildIndex();
      this.seedExpanded();
      this.pruneState();
      // Data changes (e.g. a search filter being cleared) must not strand
      // the selection: selected ids survive filtering, so re-expand their
      // ancestors — nodes that return become visible again.
      this.expandAncestorsOfSelection();
      this.ensureFocus();
    }
    if (changed.has("selectedIds")) {
      this.selectedIdSet = new Set(this.selectedList());
      this.expandAncestorsOfSelection();
      this.ensureFocus();
    }
    this.ensureFocus();
  }

  private rebuildIndex() {
    this.nodeMap = new Map();
    this.parentMap = new Map();
    const walk = (list: StrataTreeNode[], parentId?: string) => {
      for (const node of list) {
        if (!node || typeof node.id !== "string" || !node.id) continue;
        this.nodeMap.set(node.id, node);
        if (parentId) this.parentMap.set(node.id, parentId);
        if (node.children?.length) walk(node.children, node.id);
      }
    };
    walk(this.nodeList());
  }

  private seedExpanded() {
    const next = new Set(this.expandedIds);
    const walk = (list: StrataTreeNode[]) => {
      for (const node of list) {
        if (node.children?.length) {
          if (node.expanded && !this.seededExpanded.has(node.id)) {
            next.add(node.id);
            this.seededExpanded.add(node.id);
          }
          walk(node.children);
        }
      }
    };
    walk(this.nodeList());
    this.enforceExclusive(next);
    this.expandedIds = next;
  }

  private pruneState() {
    // Expansion state for removed nodes is dropped; selection is kept so a
    // filtered-out node stays selected and reappears with its ancestors
    // expanded once the data contains it again.
    const expanded = new Set(
      [...this.expandedIds].filter((id) => this.nodeMap.has(id)),
    );
    if (expanded.size !== this.expandedIds.size) this.expandedIds = expanded;
    for (const id of [...this.seededExpanded]) {
      if (!this.nodeMap.has(id)) this.seededExpanded.delete(id);
    }
  }

  /** All sibling groups in the tree: the root list plus each node's children. */
  private siblingGroups(): StrataTreeNode[][] {
    const groups: StrataTreeNode[][] = [this.nodeList()];
    for (const node of this.nodeMap.values()) {
      if (node.children?.length) groups.push(node.children);
    }
    return groups;
  }

  /**
   * In `single` expand mode, keeps at most one expanded node per sibling
   * group. Ancestors of `priority` ids (the current selection by default)
   * win; otherwise the first node in document order survives. Mutates
   * `next` and returns the ids that were collapsed.
   */
  private enforceExclusive(
    next: Set<string>,
    priority: Iterable<string> = this.selectedIdSet,
  ): string[] {
    if (this.expandMode !== "single") return [];
    const keep = new Set<string>();
    for (const id of priority) {
      // Only nodes present in the current data may claim a sibling group.
      if (!this.nodeMap.has(id)) continue;
      keep.add(id);
      let parent = this.parentMap.get(id);
      while (parent) {
        keep.add(parent);
        parent = this.parentMap.get(parent);
      }
    }
    const removed: string[] = [];
    for (const children of this.siblingGroups()) {
      const open = children.filter((child) => next.has(child.id));
      if (open.length < 2) continue;
      const winner = open.find((child) => keep.has(child.id)) ?? open[0];
      for (const child of open) {
        if (child.id !== winner.id) {
          next.delete(child.id);
          removed.push(child.id);
        }
      }
    }
    return removed;
  }

  private dispatchToggles(entries: { id: string; expanded: boolean }[]) {
    for (const entry of entries) {
      this.dispatchEvent(
        new CustomEvent("strata-toggle", {
          bubbles: true,
          composed: true,
          detail: entry,
        }),
      );
    }
  }

  private expandAncestorsOfSelection() {
    const next = new Set(this.expandedIds);
    for (const id of this.selectedIdSet) {
      let parent = this.parentMap.get(id);
      while (parent) {
        next.add(parent);
        parent = this.parentMap.get(parent);
      }
    }
    const collapsed = this.enforceExclusive(next);
    this.expandedIds = next;
    if (collapsed.length) {
      this.dispatchToggles(collapsed.map((id) => ({ id, expanded: false })));
    }
  }

  private nodeList(): StrataTreeNode[] {
    const value: unknown = this.nodes;
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed: unknown = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private selectedList(): string[] {
    const value: unknown = this.selectedIds;
    if (Array.isArray(value)) return value as string[];
    if (typeof value === "string") {
      try {
        const parsed: unknown = JSON.parse(value);
        return Array.isArray(parsed) ? (parsed as string[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  /** Visible nodes in depth-first order, respecting expansion. */
  private visibleNodes(): StrataTreeNode[] {
    const out: StrataTreeNode[] = [];
    const walk = (list: StrataTreeNode[]) => {
      for (const node of list) {
        out.push(node);
        if (node.children?.length && this.expandedIds.has(node.id)) {
          walk(node.children);
        }
      }
    };
    walk(this.nodeList());
    return out;
  }

  private ensureFocus() {
    const visible = this.visibleNodes();
    if (!visible.length) {
      if (this.focusedId) this.focusedId = "";
      return;
    }
    if (!this.focusedId || !visible.some((n) => n.id === this.focusedId)) {
      const selected = visible.find((n) => this.selectedIdSet.has(n.id));
      this.focusedId = (selected ?? visible[0]).id;
    }
  }

  private emitSelection(node: StrataTreeNode, selected: boolean) {
    this.dispatchEvent(
      new CustomEvent("strata-select", {
        bubbles: true,
        composed: true,
        detail: { id: node.id, node, selected },
      }),
    );
    this.dispatchEvent(
      new CustomEvent("strata-selection-change", {
        bubbles: true,
        composed: true,
        detail: { ids: [...this.selectedIdSet] },
      }),
    );
  }

  private activate(node: StrataTreeNode) {
    this.focusedId = node.id;
    if (node.disabled) return;
    const next = new Set(this.selectedIdSet);
    const wasSelected = next.has(node.id);
    if (wasSelected && this.multiple) next.delete(node.id);
    else if (!wasSelected) {
      if (this.multiple) next.add(node.id);
      else {
        next.clear();
        next.add(node.id);
      }
    }
    this.selectedIdSet = next;
    this.emitSelection(node, next.has(node.id));
  }

  /** Expand or collapse a node programmatically. Emits `strata-toggle`. */
  setNodeExpanded(id: string, expanded: boolean) {
    const node = this.nodeMap.get(id);
    if (!node?.children?.length) return;
    const next = new Set(this.expandedIds);
    if (expanded) next.add(id);
    else next.delete(id);
    const collapsed = this.enforceExclusive(next, [id]);
    this.expandedIds = next;
    this.dispatchToggles([
      { id, expanded },
      ...collapsed.map((cid) => ({ id: cid, expanded: false })),
    ]);
  }

  expandAll() {
    const next = new Set(this.expandedIds);
    const walk = (list: StrataTreeNode[]) => {
      for (const node of list) {
        if (node.children?.length) {
          next.add(node.id);
          walk(node.children);
        }
      }
    };
    walk(this.nodeList());
    this.enforceExclusive(next);
    this.expandedIds = next;
  }

  collapseAll() {
    this.expandedIds = new Set();
  }

  /** Move keyboard focus to a node (expands ancestors first). */
  async focusNode(id: string) {
    const node = this.nodeMap.get(id);
    if (!node) return;
    this.expandAncestorsOfSelectionFor(id);
    this.focusedId = id;
    await this.updateComplete;
    const el = this.renderRoot.querySelector(`[data-node-id="${id}"]`);
    (el as HTMLElement | null)?.focus();
  }

  private expandAncestorsOfSelectionFor(id: string) {
    const next = new Set(this.expandedIds);
    let parent = this.parentMap.get(id);
    while (parent) {
      next.add(parent);
      parent = this.parentMap.get(parent);
    }
    const collapsed = this.enforceExclusive(next, [id]);
    this.expandedIds = next;
    if (collapsed.length) {
      this.dispatchToggles(
        collapsed.map((cid) => ({ id: cid, expanded: false })),
      );
    }
  }

  private onKeydown(event: KeyboardEvent) {
    const visible = this.visibleNodes();
    if (!visible.length) return;
    const index = visible.findIndex((n) => n.id === this.focusedId);
    const current = index < 0 ? 0 : index;
    const node = visible[current];
    let nextIndex = -1;
    let handled = true;

    switch (event.key) {
      case "ArrowDown":
        nextIndex = Math.min(current + 1, visible.length - 1);
        break;
      case "ArrowUp":
        nextIndex = Math.max(current - 1, 0);
        break;
      case "ArrowRight": {
        if (node.children?.length) {
          if (!this.expandedIds.has(node.id)) {
            this.setNodeExpanded(node.id, true);
          } else {
            nextIndex = visible.findIndex((n) => n.id === node.children![0].id);
          }
        }
        break;
      }
      case "ArrowLeft": {
        if (node.children?.length && this.expandedIds.has(node.id)) {
          this.setNodeExpanded(node.id, false);
        } else {
          const parentId = this.parentMap.get(node.id);
          if (parentId) nextIndex = visible.findIndex((n) => n.id === parentId);
        }
        break;
      }
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = visible.length - 1;
        break;
      case "Enter":
      case " ":
        this.activate(node);
        break;
      default:
        handled = false;
    }

    if (!handled) return;
    event.preventDefault();
    if (nextIndex >= 0 && nextIndex !== current) {
      const next = visible[nextIndex];
      this.focusedId = next.id;
      this.updateComplete.then(() => {
        const el = this.renderRoot.querySelector(
          `[data-node-id="${next.id}"]`,
        ) as HTMLElement | null;
        el?.focus();
      });
    }
  }

  private renderLevel(list: StrataTreeNode[], level: number): TemplateResult[] {
    return list.map((node, index) => {
      const children = node.children ?? [];
      const hasChildren = children.length > 0;
      const isOpen = this.expandedIds.has(node.id);
      const isSelected = this.selectedIdSet.has(node.id);
      const isFocused = this.focusedId === node.id;
      return html`
        <li
          role="treeitem"
          class="strata-tree__item"
          data-node-id=${node.id}
          aria-level=${level}
          aria-setsize=${list.length}
          aria-posinset=${index + 1}
          aria-expanded=${hasChildren ? isOpen : nothing}
          aria-selected=${isSelected}
          aria-disabled=${node.disabled ? "true" : nothing}
          tabindex=${isFocused ? 0 : -1}
        >
          <div class="strata-tree__row" @click=${() => this.activate(node)}>
            <span
              class="strata-tree__caret"
              aria-hidden="true"
              @click=${(e: Event) => {
                e.stopPropagation();
                if (hasChildren) this.setNodeExpanded(node.id, !isOpen);
              }}
              >${hasChildren ? (isOpen ? "⌄" : "›") : ""}</span
            >
            ${
              node.icon
                ? html`<iconify-icon
                    class="strata-tree__icon"
                    icon=${node.icon}
                    aria-hidden="true"
                  ></iconify-icon>`
                : nothing
            }
            <span class="strata-tree__label">${node.label}</span>
            ${
              node.href
                ? html`<span class="strata-tree__href" aria-hidden="true"
                    >↗</span
                  >`
                : nothing
            }
            ${
              node.meta
                ? html`<span class="strata-tree__meta">${node.meta}</span>`
                : nothing
            }
          </div>
          ${
            hasChildren && isOpen
              ? html`<ul role="group" class="strata-tree__group">
                  ${this.renderLevel(children, level + 1)}
                </ul>`
              : nothing
          }
        </li>
      `;
    });
  }

  render() {
    if (!this.nodeList().length) {
      return html`<p class="strata-tree__empty">${this.emptyLabel}</p>`;
    }
    return html`
      <ul
        class="strata-tree"
        role="tree"
        aria-label=${this.label}
        aria-multiselectable=${this.multiple ? "true" : nothing}
        @keydown=${this.onKeydown}
      >
        ${this.renderLevel(this.nodeList(), 1)}
      </ul>
    `;
  }
}
