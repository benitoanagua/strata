import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = path.resolve(here, "../../tokens/src/tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

function luminance(hex: string) {
  const c = hex.replace("#", "");
  const channel = (i: number) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Worst-case status text sits on surface-raised (badge tint ~ surface).
const SURFACES = {
  light: ["#FFFFFF", "#F7F7F7"],
  dark: ["#111111", "#1B1B1B"],
} as const;

describe("strict-monochrome status colors", () => {
  it("tokens define the flag and a grayscale status map", () => {
    expect(tokens).toHaveProperty("strictMonochrome");
    expect(tokens.monochromeStatus.light.statusError).toMatch(
      /^#[0-9A-Fa-f]{6}$/,
    );
    for (const theme of ["light", "dark"] as const)
      for (const key of ["statusError", "statusWarning", "statusSuccess"]) {
        const value = tokens.monochromeStatus[theme][key];
        const [r, g, b] = [1, 3, 5].map((i) =>
          parseInt(value.slice(i, i + 2), 16),
        );
        expect(r).toBe(g);
        expect(g).toBe(b);
      }
  });

  it.each(["light", "dark"] as const)(
    "%s monochrome statuses keep WCAG AA (4.5:1) on every surface",
    (theme) => {
      for (const key of ["statusError", "statusWarning", "statusSuccess"]) {
        const fg = tokens.monochromeStatus[theme][key];
        for (const bg of SURFACES[theme])
          expect(
            contrast(fg, bg),
            `${key} ${fg} on ${bg}`,
          ).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});

describe("taxonomy tag hues", () => {
  const hues = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  it.each(["light", "dark"] as const)(
    "%s hues keep AA ink on tint and surfaces",
    (theme) => {
      for (const hue of hues) {
        const { ink, tint } = tokens.tagHue[theme][hue];
        expect(contrast(ink, tint), `${hue} ink/tint`).toBeGreaterThanOrEqual(
          4.5,
        );
        for (const bg of SURFACES[theme])
          expect(contrast(ink, bg), `${hue} on ${bg}`).toBeGreaterThanOrEqual(
            4.5,
          );
      }
    },
  );
  it("emits hue variables and a mono opt-out", () => {
    const css = fs.readFileSync(
      path.resolve(here, "../../tokens/dist/styles.css"),
      "utf8",
    );
    expect(css).toContain("--strata-tag-violet-ink");
    expect(css).toContain(':root[data-tag-hues="mono"]');
  });
});
