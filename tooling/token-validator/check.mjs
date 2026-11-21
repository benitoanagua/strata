import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const t = JSON.parse(
  fs.readFileSync(
    path.join(here, "../../packages/tokens/src/tokens.json"),
    "utf8",
  ),
);
const sizes = ["micro", "small", "medium", "large", "hero"];
for (let i = 1; i < sizes.length; i++) {
  for (const k of ["radius", "border", "elevation"])
    if (t.scale[sizes[i]][k] < t.scale[sizes[i - 1]][k])
      throw new Error(`Scale Law: ${sizes[i]} ${k}`);
}

if ("spectrum" in t)
  throw new Error(
    "Spectrum contract removed: STRATA is grayscale-first with an optional single accent",
  );

const luminance = (hex) => {
  const c = hex.replace("#", "");
  const chan = (i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(0) + 0.7152 * chan(2) + 0.0722 * chan(4);
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const surfaces = [
  "surfacePage",
  "surfaceDefault",
  "surfaceRaised",
  "surfaceSubtle",
];
const statuses = ["statusError", "statusWarning", "statusSuccess"];

for (const theme of ["light", "dark"]) {
  const s = t.semantic[theme];
  for (const key of ["textPrimary", "textSecondary"])
    for (const surface of surfaces) {
      const ratio = contrast(s[key], s[surface]);
      if (ratio < 4.5)
        throw new Error(
          `Contrast contract: ${theme}.${key} on ${surface} is ${ratio.toFixed(2)}:1 (needs >= 4.5:1)`,
        );
    }
  for (const status of statuses)
    for (const surface of ["surfaceDefault", "surfaceRaised"]) {
      const ratio = contrast(s[status], s[surface]);
      if (ratio < 4.5)
        throw new Error(
          `Contrast contract: ${theme}.${status} on ${surface} is ${ratio.toFixed(2)}:1 (needs >= 4.5:1)`,
        );
    }
  if (contrast(s.focusRing, s.surfacePage) < 3)
    throw new Error(`Contrast contract: ${theme}.focusRing below 3:1`);
}

if (t.accent?.enabled) {
  for (const theme of ["light", "dark"]) {
    const a = t.accent[theme];
    const s = t.semantic[theme];
    for (const surface of surfaces)
      if (contrast(a.link, s[surface]) < 4.5)
        throw new Error(`Contrast contract: accent.${theme}.link below 4.5:1`);
    if (contrast(a.focus, s.surfacePage) < 3)
      throw new Error(`Contrast contract: accent.${theme}.focus below 3:1`);
  }
}

if (
  !t.fontsUrl?.startsWith("https://fonts.googleapis.com/") ||
  !["Source+Serif+4", "Source+Sans+3", "Source+Code+Pro"].every((f) =>
    t.fontsUrl.includes(f),
  )
)
  throw new Error("Fonts must load from Google Fonts (serif, sans, mono)");
for (const role of ["serif", "sans", "mono"])
  if (!t.font[role]) throw new Error(`Missing font role: ${role}`);
console.log("STRATA token contract passed");
