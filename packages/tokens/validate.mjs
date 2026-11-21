import fs from "node:fs";
const t = JSON.parse(
  fs.readFileSync(new URL("./src/tokens.json", import.meta.url)),
);
const order = ["micro", "small", "medium", "large", "hero"];
for (const size of order) {
  const g = t.scale[size];
  if (g.radius < 0 || g.radius > 2)
    throw new Error(`STRATA Scale Law: ${size} radius must stay within 0-2px`);
  if (![0, 0.5, 1].includes(g.border))
    throw new Error(
      `STRATA Scale Law: ${size} border must be a 0, 0.5 or 1px filete`,
    );
  if (g.elevation !== 0)
    throw new Error(
      `STRATA Scale Law: elevation is abolished; use filetes and space (${size})`,
    );
}
for (let i = 1; i < order.length; i++) {
  const a = t.scale[order[i - 1]],
    b = t.scale[order[i]];
  if (b.radius < a.radius || b.border < a.border)
    throw new Error(
      `STRATA Scale Law violated: ${order[i - 1]} -> ${order[i]}`,
    );
}

if ("spectrum" in t)
  throw new Error(
    "STRATA spectrum was removed: the system is grayscale-first with an optional single accent",
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
  "surfaceHover",
  "surfaceSelected",
];
const statuses = ["statusError", "statusWarning", "statusSuccess"];

for (const theme of ["light", "dark"]) {
  const s = t.semantic[theme];
  for (const key of ["textPrimary", "textSecondary"])
    for (const surface of surfaces) {
      const ratio = contrast(s[key], s[surface]);
      if (ratio < 4.5)
        throw new Error(
          `STRATA contrast contract: ${theme}.${key} on ${surface} is ${ratio.toFixed(2)}:1 (needs >= 4.5:1)`,
        );
    }
  for (const status of statuses)
    for (const surface of ["surfaceDefault", "surfaceRaised"]) {
      const ratio = contrast(s[status], s[surface]);
      if (ratio < 4.5)
        throw new Error(
          `STRATA contrast contract: ${theme}.${status} on ${surface} is ${ratio.toFixed(2)}:1 (needs >= 4.5:1)`,
        );
    }
  const focus = contrast(s.focusRing, s.surfacePage);
  if (focus < 3)
    throw new Error(
      `STRATA contrast contract: ${theme}.focusRing on surfacePage is ${focus.toFixed(2)}:1 (needs >= 3:1)`,
    );
  const onAction = theme === "light" ? "#FFFFFF" : "#111111";
  const action = contrast(onAction, s.actionPrimary);
  if (action < 4.5)
    throw new Error(
      `STRATA contrast contract: ${theme}.actionPrimary vs label text is ${action.toFixed(2)}:1 (needs >= 4.5:1)`,
    );
}

if (t.accent?.enabled) {
  for (const theme of ["light", "dark"]) {
    const a = t.accent[theme];
    const s = t.semantic[theme];
    for (const surface of surfaces) {
      const ratio = contrast(a.link, s[surface]);
      if (ratio < 4.5)
        throw new Error(
          `STRATA contrast contract: accent.${theme}.link on ${surface} is ${ratio.toFixed(2)}:1 (needs >= 4.5:1)`,
        );
    }
    const focus = contrast(a.focus, s.surfacePage);
    if (focus < 3)
      throw new Error(
        `STRATA contrast contract: accent.${theme}.focus on surfacePage is ${focus.toFixed(2)}:1 (needs >= 3:1)`,
      );
  }
}

console.log("STRATA token validation passed");
