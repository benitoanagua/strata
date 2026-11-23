import fs from "node:fs";

const tokenFile = new URL("./src/tokens.json", import.meta.url);
const outDir = new URL("./dist/", import.meta.url);
const outFile = new URL("./styles.css", outDir);
const fontsFile = new URL("./fonts.css", outDir);
const tokens = JSON.parse(fs.readFileSync(tokenFile, "utf8"));

const kebab = (key) =>
  key
    .replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    .replace(/([a-z])(\d)/g, "$1-$2");
const vars = [];

for (const [key, value] of Object.entries(tokens.font))
  vars.push(`--strata-font-${kebab(key)}: ${value};`);
for (const [key, value] of Object.entries(tokens.scale)) {
  vars.push(`--strata-radius-${key}: ${value.radius}px;`);
  vars.push(`--strata-border-${key}: ${value.border}px;`);
  vars.push(
    `--strata-elevation-${key}: ${value.elevation ? `0 ${Math.max(1, value.elevation / 2)}px ${Math.max(2, value.elevation * 4)}px rgba(0,0,0,0.14)` : "none"};`,
  );
}
for (const [key, value] of Object.entries(tokens.monochrome))
  vars.push(`--strata-color-${kebab(key)}: ${value};`);
for (const [key, value] of Object.entries(tokens.spacing))
  vars.push(`--strata-space-${key}: ${value}px;`);
for (const [key, value] of Object.entries(tokens.motion))
  vars.push(`--strata-motion-${key}: ${value}ms;`);
for (const [key, value] of Object.entries(tokens.typography ?? {})) {
  const name = kebab(key);
  vars.push(
    `--strata-type-${name}: ${value.weight} ${value.size}px/${value.lineHeight}px;`,
  );
  vars.push(`--strata-type-${name}-tracking: ${value.letterSpacing}px;`);
}
for (const [key, value] of Object.entries(tokens.editorial))
  vars.push(
    `--strata-editorial-${kebab(key)}: ${value}${key === "measure" ? "px" : key === "gutter" || key === "dividerDouble" ? "px" : ""};`,
  );
for (const [key, value] of Object.entries(tokens.icon))
  vars.push(`--strata-icon-${kebab(key)}: ${value}px;`);

const themeVars = (theme) => {
  const semantic = { ...tokens.semantic[theme] };
  if (tokens.strictMonochrome)
    Object.assign(semantic, tokens.monochromeStatus?.[theme] ?? {});
  const syntax = Object.entries(tokens.syntax?.[theme] ?? {})
    .map(([key, value]) => `--strata-color-syntax-${kebab(key)}: ${value};`)
    .join("");
  return (
    Object.entries(semantic)
      .map(([key, value]) => `--strata-color-${kebab(key)}: ${value};`)
      .join("") + syntax
  );
};

const accentVars = (theme) =>
  tokens.accent?.enabled
    ? Object.entries(tokens.accent[theme] ?? {})
        .map(([key, value]) => `--strata-color-accent-${kebab(key)}: ${value};`)
        .join("")
    : "";

const kebabHue = (h) => h.replace(/([A-Z])/g, "-$1").toLowerCase();
// Taxonomy hues (tags, categories, labels). The only chromatic family besides
// status/accent; always paired with a text label (see docs/DESIGN-LAWS.md §4).
const tagHueVars = (theme) =>
  tokens.tagHue?.enabled
    ? Object.entries(tokens.tagHue[theme])
        .map(
          ([hue, v]) =>
            `--strata-tag-${kebabHue(hue)}-ink: ${v.ink};--strata-tag-${kebabHue(hue)}-tint: ${v.tint};`,
        )
        .join("")
    : "";
// Opt-out: <html data-tag-hues="mono"> collapses every hue to the ink ramp.
const tagHueMono = tokens.tagHue?.enabled
  ? Object.keys(tokens.tagHue.light)
      .map(
        (hue) =>
          `--strata-tag-${kebabHue(hue)}-ink: var(--strata-color-text-secondary);--strata-tag-${kebabHue(hue)}-tint: var(--strata-color-surface-subtle);`,
      )
      .join("")
  : "";

const css = `:root {
  ${vars.join("\n  ")}
  ${themeVars("light")}
  ${accentVars("light")}
  ${tagHueVars("light")}
  color-scheme: light;
}

[data-theme="light"] {
  ${themeVars("light")}
  ${accentVars("light")}
  ${tagHueVars("light")}
  color-scheme: light;
}

[data-theme="dark"] {
  ${themeVars("dark")}
  ${accentVars("dark")}
  ${tagHueVars("dark")}
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    ${themeVars("dark")}
    ${accentVars("dark")}
    ${tagHueVars("dark")}
    color-scheme: dark;
  }
}

:root[data-tag-hues="mono"] {
  ${tagHueMono}
}
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, css);
fs.writeFileSync(
  fontsFile,
  `/* Fuentes STRATA: se cargan desde Google Fonts, nunca desde el repo. */\n@import url("${tokens.fontsUrl}");\n`,
);
