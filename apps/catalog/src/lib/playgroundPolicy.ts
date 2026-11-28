/** Components with editorial fixtures that seed a richer initial preview. */
export const RICH_PREVIEW_FIXTURE_IDS = ["card", "overlay", "grille"] as const;

export type RichPreviewFixtureId = (typeof RICH_PREVIEW_FIXTURE_IDS)[number];

export function usesRichPreviewFixture(
  id: string,
): id is RichPreviewFixtureId {
  return (RICH_PREVIEW_FIXTURE_IDS as readonly string[]).includes(id);
}

/** Seed a visually useful example; Reset still returns to source defaults. */
export function initialPlaygroundValues<
  T extends Record<string, string | number | boolean>,
>(id: string, defaults: T): T {
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

/** Constrain Grille's numeric column props to the source type's 1–6 range. */
export function normalizePlaygroundValue(
  id: string,
  name: string,
  value: string | number | boolean,
): string | number | boolean {
  if (id === "grille" && (name === "desktop" || name === "mobile")) {
    const numeric = Number(value);
    return Math.max(
      1,
      Math.min(6, Math.round(Number.isFinite(numeric) ? numeric : 1)),
    );
  }
  return value;
}
