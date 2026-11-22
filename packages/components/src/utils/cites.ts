export const CITE_EVENT = "strata-cite-change";

export interface CiteLike extends HTMLElement {
  ref: string;
}

let queued = false;
/** Tell every cite/reference list to renumber (coalesced per microtask). */
export function notifyCitesChanged() {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    window.dispatchEvent(new CustomEvent(CITE_EVENT));
  });
}

export function listCites(root: Node): CiteLike[] {
  const scope = root as ParentNode;
  return typeof scope.querySelectorAll === "function"
    ? (Array.from(scope.querySelectorAll("strata-cite")) as CiteLike[])
    : [];
}

/** Unique reference ids in order of first citation. */
export function citeOrder(root: Node): string[] {
  const seen: string[] = [];
  for (const cite of listCites(root))
    if (cite.ref && !seen.includes(cite.ref)) seen.push(cite.ref);
  return seen;
}
