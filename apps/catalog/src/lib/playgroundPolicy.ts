/** Editorial components whose source APIs are best explored with live controls. */
export const PROPERTY_PLAYGROUND_IDS = ["card", "overlay", "grille"] as const;

export type PlaygroundComponentId = (typeof PROPERTY_PLAYGROUND_IDS)[number];

export function usesPropertyPlayground(id: string): id is PlaygroundComponentId {
  return (PROPERTY_PLAYGROUND_IDS as readonly string[]).includes(id);
}

/** Seed a visually useful example; Reset still returns to source defaults. */
export function initialPlaygroundValues<T extends Record<string, string | number | boolean>>(
  id: string,
  defaults: T,
): T {
  const values = { ...defaults };
  if (id === "card") {
    Object.assign(values, {
      is_media: true,
      show_excerpt: true,
      show_meta: true,
      show_category: true,
    });
  } else if (id === "overlay") {
    Object.assign(values, { show_meta: true, show_category: true });
  }
  return values;
}
