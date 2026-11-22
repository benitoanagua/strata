/**
 * Generic node for `strata-tree`. The tree is data-driven: consumers pass
 * a `nodes` array (or JSON string via the `nodes` attribute) and react to
 * `strata-select` / `strata-toggle` events. It knows nothing about routing,
 * catalogs or any specific domain.
 */
export interface StrataTreeNode {
  /** Stable unique identifier, used for selection and expansion state. */
  id: string;
  /** Visible label. */
  label: string;
  /** Nested children. Presence makes the node expandable. */
  children?: StrataTreeNode[];
  /** Disabled nodes are skipped by pointer and keyboard activation. */
  disabled?: boolean;
  /** Optional Carbon icon name (`carbon:*`), rendered decoratively. */
  icon?: string;
  /** Optional href surfaced to consumers through events; navigation is the
   *  consumer's responsibility so the tree stays router-agnostic. */
  href?: string;
  /** Optional right-aligned metadata (counts, shortcuts). */
  meta?: string;
  /** Initial expansion state for nodes with children. */
  expanded?: boolean;
}

export interface TreeSelectDetail {
  id: string;
  node: StrataTreeNode;
  selected: boolean;
}

export interface TreeSelectionDetail {
  ids: string[];
}

export interface TreeToggleDetail {
  id: string;
  expanded: boolean;
}

export type StrataTreeSelectEvent = CustomEvent<TreeSelectDetail>;
export type StrataTreeSelectionEvent = CustomEvent<TreeSelectionDetail>;
export type StrataTreeToggleEvent = CustomEvent<TreeToggleDetail>;
