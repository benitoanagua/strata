import type {
  CatalogEntry,
  ControlType,
  ControlValue,
  PropControl,
} from "./componentRegistry";

export interface PropInfo extends PropControl {
  attribute?: string;
  propertyType?: string;
}

interface PropertyDeclarationLike {
  attribute?: string | boolean;
  type?: unknown;
  reflect?: boolean;
  state?: boolean;
}

const TYPE_MAP: Record<string, ControlType> = {
  Boolean: "boolean",
  Number: "number",
};

/** Props that hold structured data (JSON array or pipe-separated list). */
const LIST_PROPS = new Set(["items", "groups", "columns", "rows"]);

const defaultsCache = new Map<string, Record<string, ControlValue>>();

function constructorName(type: unknown): string {
  if (typeof type === "function") return type.name;
  return "";
}

function elementProperties(
  tagName: string,
): Map<string, PropertyDeclarationLike> {
  const ctor = customElements.get(tagName) as unknown as {
    elementProperties?: Map<string, PropertyDeclarationLike>;
  } | null;
  return ctor?.elementProperties ?? new Map();
}

/** Reads the real default values of every reactive property of an element. */
export function elementDefaults(tagName: string): Record<string, ControlValue> {
  const cached = defaultsCache.get(tagName);
  if (cached) return cached;
  const el = document.createElement(tagName) as unknown as Record<
    string,
    unknown
  >;
  const out: Record<string, ControlValue> = {};
  for (const name of elementProperties(tagName).keys()) {
    if (name.startsWith("_") || typeof name !== "string") continue;
    const value = el[name];
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    )
      out[name] = value;
  }
  defaultsCache.set(tagName, out);
  return out;
}

function humanize(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * Builds the full control list for an entry: every public reactive property
 * becomes a control; curated definitions override label/type/options/default.
 */
export function deriveControls(entry: CatalogEntry): PropInfo[] {
  const props = elementProperties(entry.tagName);
  const defaults = elementDefaults(entry.tagName);
  const curated = new Map(entry.controls.map((c) => [c.name, c]));
  const result: PropInfo[] = [];

  for (const [name, decl] of props) {
    if (decl.state) continue;
    if (typeof name !== "string" || name.startsWith("_")) continue;
    const override = curated.get(name);
    const litType = constructorName(decl.type);
    const type: ControlType =
      override?.type ??
      TYPE_MAP[litType] ??
      (LIST_PROPS.has(name) ? "list" : "text");

    const attribute =
      decl.attribute === false || decl.attribute === undefined
        ? name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
        : typeof decl.attribute === "string"
          ? decl.attribute
          : name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

    const rawDefault = defaults[name];
    const defaultValue: ControlValue =
      override?.defaultValue ??
      (typeof rawDefault === "string" ||
      typeof rawDefault === "number" ||
      typeof rawDefault === "boolean"
        ? rawDefault
        : type === "boolean"
          ? false
          : type === "number"
            ? 0
            : "");

    result.push({
      name,
      label: override?.label ?? humanize(name),
      type,
      defaultValue,
      options: override?.options,
      demoProps: override?.demoProps,
      attribute,
      propertyType: litType || undefined,
    });
  }
  return result;
}

/**
 * Select controls that generate variant demos: every option of every select
 * is one explorable variant. Shared by the Variants section and the sidebar
 * tree so both report the same numbers.
 */
export function variantControls(controls: PropInfo[]): PropInfo[] {
  return controls.filter((c) => c.type === "select" && !!c.options?.length);
}
