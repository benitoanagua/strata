export type StrataSize = "micro" | "small" | "medium" | "large" | "hero";
export type StrataEmphasis = "low" | "medium" | "high";
export type StrataSurface = "flat" | "raised" | "outlined";
export type StrataState =
  | "default"
  | "hover"
  | "pressed"
  | "focus"
  | "selected"
  | "disabled"
  | "loading"
  | "error"
  | "warning"
  | "success";

export const STRATA_SCALE_ORDER: readonly StrataSize[] = [
  "micro",
  "small",
  "medium",
  "large",
  "hero",
];

export const STRATA_SCALE_LAW: Record<
  StrataSize,
  { radius: number; border: number; elevation: number }
> = {
  micro: { radius: 0, border: 0, elevation: 0 },
  small: { radius: 1, border: 0.5, elevation: 0 },
  medium: { radius: 2, border: 1, elevation: 0 },
  large: { radius: 2, border: 1, elevation: 0 },
  hero: { radius: 2, border: 1, elevation: 0 },
};

export function strataGeometry(size: StrataSize) {
  return STRATA_SCALE_LAW[size];
}

export function assertStrataScaleLaw(): void {
  for (const size of STRATA_SCALE_ORDER) {
    const geometry = STRATA_SCALE_LAW[size];
    if (geometry.radius < 0 || geometry.radius > 2)
      throw new Error(
        `STRATA Scale Law: ${size} radius must stay within 0-2px`,
      );
    if (![0, 0.5, 1].includes(geometry.border))
      throw new Error(
        `STRATA Scale Law: ${size} border must be a 0, 0.5 or 1px filete`,
      );
    if (geometry.elevation !== 0)
      throw new Error(
        `STRATA Scale Law: elevation is abolished; use filetes and space (${size})`,
      );
  }
  for (let i = 1; i < STRATA_SCALE_ORDER.length; i += 1) {
    const previous = STRATA_SCALE_LAW[STRATA_SCALE_ORDER[i - 1]];
    const current = STRATA_SCALE_LAW[STRATA_SCALE_ORDER[i]];
    if (current.radius < previous.radius || current.border < previous.border) {
      throw new Error(
        `STRATA Scale Law requires non-decreasing structural weight: ${STRATA_SCALE_ORDER[i - 1]} → ${STRATA_SCALE_ORDER[i]}`,
      );
    }
  }
}

export * from "./theme.js";
