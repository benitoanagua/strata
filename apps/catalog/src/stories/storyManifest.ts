import type { CatalogEntry, ControlValue } from "../lib/componentRegistry";

export type StoryGroup =
  "Base" | "Appearance" | "States" | "Composition" | "Responsive";

export interface CatalogStory {
  id: string;
  title: string;
  group: StoryGroup;
  args: Record<string, ControlValue>;
  slotHtml?: string;
  slotContent?: string;
}

const story = (
  id: string,
  title: string,
  group: StoryGroup,
  args: Record<string, ControlValue>,
): CatalogStory => ({ id, title, group, args });

/**
 * Curated stories document useful combinations that cannot be inferred from a
 * single property. The property stories below cover the complete public option
 * and boolean state space without producing a Cartesian product.
 */
const QUICK_VIEW_GRILLE = ["A", "B", "C", "D", "E", "F"]
  .map(
    (label, index) =>
      '<article style="box-sizing:border-box;min-height:56px;padding:8px;display:flex;flex-direction:column;justify-content:space-between"><small style="font:var(--strata-type-label-small) var(--strata-font-mono)">' +
      String(index + 1).padStart(2, "0") +
      '</small><strong style="font:var(--strata-type-title-medium) var(--strata-font-serif)">' +
      label +
      "</strong></article>",
  )
  .join("");

const curated: Record<string, CatalogStory[]> = {
  button: [
    story("icon-leading", "Leading icon", "Composition", {
      icon: "carbon:add",
    }),
    story("icon-trailing", "Trailing icon", "Composition", {
      icon: "carbon:arrow-right",
      trailingIcon: true,
    }),
    story("full-width", "Full width", "Responsive", { fullWidth: true }),
    story("loading-filled", "Loading action", "States", {
      variant: "filled",
      loading: true,
    }),
  ],
  card: [
    story("media-left", "Media · left", "Composition", {
      is_media: true,
      media_align: "left",
    }),
    story("media-top", "Media · top", "Composition", {
      is_media: true,
      media_align: "top",
    }),
    story("metadata", "With metadata", "Composition", {
      show_meta: true,
      show_category: true,
      tag_name: "Design",
      author_name: "Ada Lovelace",
      published_at: "12 Nov 2026",
    }),
  ],
  grille: [
    story("two-columns", "2 columns", "Responsive", { desktop: 2 }),
    story("four-columns", "4 columns", "Responsive", { desktop: 4 }),
    story("mobile-one-column", "Mobile · 1 column", "Responsive", {
      mobile: 1,
    }),
  ],
  overlay: [
    story("theme-light", "Light theme", "Appearance", { theme: "light" }),
    story("theme-dark", "Dark theme", "Appearance", { theme: "dark" }),
    story("with-metadata", "With metadata", "Composition", {
      show_meta: true,
      show_category: true,
      tag_name: "Reportage",
      author_name: "Ana Ríos",
      published_at: "12 Nov 2026",
    }),
  ],
  avatar: [
    story("initials", "Initials", "Base", { variant: "initials" }),
    story("photo", "Photo", "Composition", { variant: "photo" }),
  ],
  modal: [
    story("minimal", "Minimal", "Appearance", { variant: "minimal" }),
    story("bordered", "Bordered", "Appearance", { variant: "bordered" }),
    story("large", "Large", "Responsive", { size: "large" }),
  ],
  checkbox: [
    story("unchecked", "Unchecked", "States", { checked: false }),
    story("checked", "Checked", "States", { checked: true }),
    story("disabled", "Disabled", "States", { disabled: true }),
  ],
};

/** Resolve a complete, deterministic story list before rendering the gallery. */
export function createStoryManifest(entry: CatalogEntry): CatalogStory[] {
  const stories: CatalogStory[] = [story("default", "Default", "Base", {})];

  for (const control of entry.controls) {
    if (control.type === "select" && control.options?.length) {
      for (const option of control.options) {
        if (option === control.defaultValue) continue;
        stories.push(
          story(
            `${control.name}-${option}`,
            `${control.label} · ${option}`,
            /theme|color|tone|hue|variant|size|gap|align|position|fill|box|aspect|media/i.test(
              control.name,
            )
              ? "Appearance"
              : /media|icon|meta|category|image|content|slot|show/i.test(
                    control.name,
                  )
                ? "Composition"
                : /fullwidth|inline|mobile|desktop|columns/i.test(control.name)
                  ? "Responsive"
                  : "States",
            { [control.name]: option, ...(control.demoProps ?? {}) },
          ),
        );
      }
    } else if (control.type === "boolean") {
      stories.push(
        story(
          `${control.name}-${control.defaultValue ? "off" : "on"}`,
          `${control.label} · ${control.defaultValue ? "Off" : "On"}`,
          "States",
          {
            [control.name]: !Boolean(control.defaultValue),
            ...(control.demoProps ?? {}),
          },
        ),
      );
    } else if (control.type === "number") {
      const values =
        control.name === "value"
          ? [0, 50, 100]
          : /columns|desktop|mobile/i.test(control.name)
            ? [1, 2, 3, 4]
            : /heading/i.test(control.name)
              ? [1, 2, 3, 4]
              : [];
      for (const value of values) {
        stories.push(
          story(
            `${control.name}-${value}`,
            `${control.label} · ${value}`,
            "States",
            {
              [control.name]: value,
            },
          ),
        );
      }
    }
  }

  stories.push(...(curated[entry.id] ?? []));

  // Grille's full editorial fixture is too dense for a compact thumbnail.
  // Keep the real component but use short cells so all column states remain legible.
  if (entry.id === "grille") {
    for (const item of stories) item.slotHtml = QUICK_VIEW_GRILLE;
  }

  // Keep one story per effective argument set. Preserve authored ordering.
  const seen = new Set<string>();
  return stories.filter((item) => {
    if (
      item.id !== "default" &&
      Object.entries(item.args).length > 0 &&
      Object.entries(item.args).every(
        ([name, value]) =>
          entry.controls.find((control) => control.name === name)
            ?.defaultValue === value,
      )
    )
      return false;
    const normalized = Object.fromEntries(
      Object.entries(item.args).sort(([a], [b]) => a.localeCompare(b)),
    );
    const signature = JSON.stringify(normalized);
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}
