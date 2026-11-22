import { unsafeCSS } from "lit";

/**
 * Taxonomy hues. The rainbow exists ONLY to tell tags, categories and labels
 * apart (docs/DESIGN-LAWS.md §4, "Taxonomy exception"). A hue is always
 * redundant with a visible text label, never the sole carrier of meaning.
 */
export const TAG_HUES = [
  "neutral",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
] as const;
export type TagHue = (typeof TAG_HUES)[number];
export type TagHueInput = TagHue | "auto";

const SPECTRUM = TAG_HUES.slice(1);

/** Deterministic FNV-1a hash → the same label always gets the same hue. */
export function hueForLabel(label: string): TagHue {
  const text = label.trim().toLocaleLowerCase();
  if (!text) return "neutral";
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return SPECTRUM[hash % SPECTRUM.length];
}

export function resolveHue(hue: string | undefined, label: string): TagHue {
  if (hue === "auto") return hueForLabel(label);
  return (TAG_HUES as readonly string[]).includes(hue ?? "")
    ? (hue as TagHue)
    : "neutral";
}

const rule = (hue: string) =>
  `.strata-hue--${hue} { --_ink: var(--strata-tag-${hue}-ink); --_tint: var(--strata-tag-${hue}-tint); }`;

export const tagHueStyles = unsafeCSS(SPECTRUM.map(rule).join("\n"));
