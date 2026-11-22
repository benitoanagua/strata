import type {
  ViewerMotionPreference,
  ViewerSettingsValue,
  ViewerSurfacePreference,
  ViewerThemePreference,
  ViewerViewportPreference,
} from "@strata/components";

export type {
  ViewerMotionPreference,
  ViewerSettingsValue,
  ViewerSurfacePreference,
  ViewerThemePreference,
  ViewerViewportPreference,
};

export const VIEWER_STORAGE_KEY = "strata-catalog-viewer";
export const VIEWER_PREFS_VERSION = 1;

export interface ViewerPreferences extends ViewerSettingsValue {
  version: number;
}

export const DEFAULT_VIEWER_PREFERENCES: ViewerPreferences = {
  version: VIEWER_PREFS_VERSION,
  theme: "system",
  surface: "auto",
  viewport: "desktop",
  motion: "system",
};

const THEMES: readonly ViewerThemePreference[] = ["system", "light", "dark"];
const SURFACES: readonly ViewerSurfacePreference[] = [
  "auto",
  "light",
  "dark",
  "grid",
];
const VIEWPORTS: readonly ViewerViewportPreference[] = [
  "desktop",
  "tablet",
  "mobile",
];
const MOTIONS: readonly ViewerMotionPreference[] = ["system", "reduced"];

function pick<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" &&
    (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/** Resolves a theme preference against the OS-level color scheme. */
export function resolveTheme(
  preference: ViewerThemePreference,
  systemPrefersDark: boolean,
): "light" | "dark" {
  if (preference === "light" || preference === "dark") return preference;
  return systemPrefersDark ? "dark" : "light";
}

export interface CanvasSurface {
  theme: "light" | "dark";
  grid: boolean;
}

/** Maps the surface preference to the theme/grid applied to the canvas. */
export function canvasSurface(
  surface: ViewerSurfacePreference,
  effectiveTheme: "light" | "dark",
): CanvasSurface {
  if (surface === "grid") return { theme: effectiveTheme, grid: true };
  if (surface === "auto") return { theme: effectiveTheme, grid: false };
  return { theme: surface, grid: false };
}

function storageOrDefault(): Storage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

/** Loads persisted viewer preferences, validating every field. */
export function loadViewerPreferences(
  storage: Storage | null = storageOrDefault(),
): ViewerPreferences {
  if (!storage) return { ...DEFAULT_VIEWER_PREFERENCES };
  let raw: string | null = null;
  try {
    raw = storage.getItem(VIEWER_STORAGE_KEY);
  } catch {
    return { ...DEFAULT_VIEWER_PREFERENCES };
  }
  if (!raw) return { ...DEFAULT_VIEWER_PREFERENCES };
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed !== "object" || parsed === null) {
      return { ...DEFAULT_VIEWER_PREFERENCES };
    }
    return {
      version: VIEWER_PREFS_VERSION,
      theme: pick(parsed.theme, THEMES, DEFAULT_VIEWER_PREFERENCES.theme),
      surface: pick(
        parsed.surface,
        SURFACES,
        DEFAULT_VIEWER_PREFERENCES.surface,
      ),
      viewport: pick(
        parsed.viewport,
        VIEWPORTS,
        DEFAULT_VIEWER_PREFERENCES.viewport,
      ),
      motion: pick(parsed.motion, MOTIONS, DEFAULT_VIEWER_PREFERENCES.motion),
    };
  } catch {
    return { ...DEFAULT_VIEWER_PREFERENCES };
  }
}

/** Persists viewer preferences under the catalog-owned key. */
export function saveViewerPreferences(
  prefs: ViewerSettingsValue,
  storage: Storage | null = storageOrDefault(),
): void {
  if (!storage) return;
  try {
    storage.setItem(
      VIEWER_STORAGE_KEY,
      JSON.stringify({ version: VIEWER_PREFS_VERSION, ...prefs }),
    );
  } catch {
    // storage unavailable (private mode, quota) — preferences stay in memory
  }
}
