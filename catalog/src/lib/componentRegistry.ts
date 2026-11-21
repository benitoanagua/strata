export type ControlType = "text" | "boolean" | "number" | "select";
export type ControlValue = string | number | boolean;
export interface PropControl {
  name: string; label: string; type: ControlType; defaultValue: ControlValue; options?: readonly string[];
}
export interface CatalogEntry {
  id: string; name: string; category: string; tagName: string; description: string;
  controls: readonly PropControl[]; slotContent?: string;
}
export const catalog: readonly CatalogEntry[] = [
  {
    id: "button", name: "Button", category: "Actions", tagName: "strata-button",
    description: "A clear action with semantic variants and states.",
    controls: [
      { name: "label", label: "Label", type: "text", defaultValue: "Continue" },
      { name: "variant", label: "Variant", type: "select", defaultValue: "outlined", options: ["filled", "outlined", "text", "elevated", "tonal"] },
      { name: "size", label: "Size", type: "select", defaultValue: "medium", options: ["small", "medium", "large"] },
      { name: "color", label: "Color", type: "select", defaultValue: "primary", options: ["primary", "secondary", "error", "success", "warning"] },
      { name: "disabled", label: "Disabled", type: "boolean", defaultValue: false },
      { name: "loading", label: "Loading", type: "boolean", defaultValue: false },
      { name: "fullWidth", label: "Full width", type: "boolean", defaultValue: false }
    ]
  },
  {
    id: "badge", name: "Badge", category: "Data display", tagName: "strata-badge",
    description: "A compact label for status and classification.",
    controls: [{ name: "tone", label: "Tone", type: "select", defaultValue: "blue", options: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"] }],
    slotContent: "In review"
  },
  {
    id: "alert", name: "Alert", category: "Feedback", tagName: "strata-alert",
    description: "A semantic message that communicates feedback and status.",
    controls: [{ name: "tone", label: "Tone", type: "select", defaultValue: "info", options: ["error", "warning", "success", "info"] }],
    slotContent: "Changes saved successfully."
  }
];
export const categories = [...new Set(catalog.map((entry) => entry.category))];
export function defaultsFor(entry: CatalogEntry): Record<string, ControlValue> {
  return Object.fromEntries(entry.controls.map(({ name, defaultValue }) => [name, defaultValue]));
}
