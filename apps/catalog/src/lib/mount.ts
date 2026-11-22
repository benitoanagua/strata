import {
  mountStrataElement,
  type StrataMountHandle,
  type StrataMountOptions,
} from "./renderer";

interface ActionResult {
  update?: (options: StrataMountOptions) => void;
  destroy?: () => void;
}

/**
 * Svelte action that mounts a real STRATA custom element into the node.
 * Re-mounts when the options object changes; destroys on teardown.
 */
export function mountStrata(
  node: HTMLElement,
  options: StrataMountOptions,
): ActionResult {
  let handle: StrataMountHandle | undefined;
  let current = options;
  let seq = 0;

  const run = async () => {
    const mine = ++seq;
    handle?.destroy();
    handle = undefined;
    const mounted = await mountStrataElement(node, current);
    if (mine !== seq) {
      mounted.destroy();
      return;
    }
    handle = mounted;
  };

  void run();

  return {
    update(next: StrataMountOptions) {
      current = next;
      void run();
    },
    destroy() {
      seq += 1;
      handle?.destroy();
      handle = undefined;
    },
  };
}
