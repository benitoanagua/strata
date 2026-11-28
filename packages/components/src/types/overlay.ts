import type { CardHeading, CardAspectRatio } from "./card.js";

export type OverlayAlign = "start" | "center" | "end";
export type OverlayPosition = "top" | "center" | "bottom";
export type OverlayFill = "full" | "gradient" | "none";
export type OverlayBox = "border" | "background" | "transparent";

export interface OverlayProps {
  title: string;
  url: string;
  feature_image: string;
  /** Apply grayscale to the background image without affecting text. */
  monochrome?: boolean;
  /** Resolve theme from design tokens by default, or force a theme. */
  theme?: "auto" | "light" | "dark";
  tag_name?: string;
  author_name?: string;
  published_at?: string;
  reading_time?: string;
  aspect_ratio?: CardAspectRatio;
  heading?: CardHeading;
  font_group?: "default" | "supplement" | "sans" | "serif";
  show_meta?: boolean;
  show_category?: boolean;
  align?: OverlayAlign;
  position?: OverlayPosition;
  box?: OverlayBox;
  fill?: OverlayFill;
  is_dark?: boolean;
}
