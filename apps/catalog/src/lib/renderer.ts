export interface StrataMountOptions {
  tagName: string;
  /** Property assignments — values keep their JavaScript types. */
  props?: Record<string, unknown>;
  /** Attribute assignments (strings). */
  attributes?: Record<string, string>;
  /** Inner HTML for the default slot (compound fixtures). */
  slotHtml?: string;
  /** Plain text content for the default slot. */
  slotContent?: string;
  /** Event listeners: event name → handler. */
  events?: Record<string, (event: Event) => void>;
}

export interface StrataMountHandle {
  element: HTMLElement;
  /** Re-assigns properties without recreating the element. */
  update: (props: Record<string, unknown>) => void;
  destroy: () => void;
}

function assignProps(
  element: HTMLElement,
  props: Record<string, unknown> | undefined,
) {
  if (!props) return;
  for (const [name, value] of Object.entries(props)) {
    if (value === undefined) continue;
    (element as unknown as Record<string, unknown>)[name] = value;
  }
}

/**
 * Mounts a real STRATA custom element into `host`:
 * waits for `customElements.whenDefined`, creates the instance, assigns
 * typed properties, configures slots and listeners, and returns a handle
 * with `update`/`destroy` for the lifecycle.
 */
export async function mountStrataElement(
  host: HTMLElement,
  options: StrataMountOptions,
): Promise<StrataMountHandle> {
  await customElements.whenDefined(options.tagName);
  const element = document.createElement(options.tagName) as HTMLElement;
  assignProps(element, options.props);
  if (options.attributes) {
    for (const [name, value] of Object.entries(options.attributes)) {
      element.setAttribute(name, value);
    }
  }
  if (options.slotHtml !== undefined) element.innerHTML = options.slotHtml;
  else if (options.slotContent !== undefined)
    element.textContent = options.slotContent;

  const listeners = Object.entries(options.events ?? {});
  for (const [name, handler] of listeners) {
    element.addEventListener(name, handler);
  }

  host.appendChild(element);

  let destroyed = false;
  return {
    element,
    update(props: Record<string, unknown>) {
      if (destroyed) return;
      assignProps(element, props);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const [name, handler] of listeners) {
        element.removeEventListener(name, handler);
      }
      element.remove();
    },
  };
}
