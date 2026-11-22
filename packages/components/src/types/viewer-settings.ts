/**
 * Preferences exposed by `strata-viewer-settings`. The component is fully
 * controlled: it reflects the current values and emits `strata-change`
 * with the whole settings object whenever one of them changes. Persistence
 * and theme resolution are the consumer's responsibility.
 */
export type ViewerThemePreference = "system" | "light" | "dark";
export type ViewerSurfacePreference = "auto" | "light" | "dark" | "grid";
export type ViewerViewportPreference = "desktop" | "tablet" | "mobile";
export type ViewerMotionPreference = "system" | "reduced";

export interface ViewerSettingsValue {
  theme: ViewerThemePreference;
  surface: ViewerSurfacePreference;
  viewport: ViewerViewportPreference;
  motion: ViewerMotionPreference;
}
