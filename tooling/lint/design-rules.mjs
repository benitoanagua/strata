import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = [
  path.join(root, "packages/components/src"),
  path.join(root, "integrations/mediawiki"),
];
const violations = [];

// Radius law: scale tokens only (max 2px). Literal radii are allowed solely
// on the circular-element allowlist documented in docs/DESIGN-LAWS.md.
const allowedRadiusValue =
  /var\(--strata-radius-[\w-]+\)|var\(--strata-component-radius\)|inherit|^0(?:px)?$/;
const circularRadius = /^(?:50%|999px|9999px|100%)$/;
const allowedRadiusSelectors = [
  // Button ripple + spinner: inherently circular effects.
  { files: ["Button.css"], selectors: ["__ripple-effect", "__spinner"] },
  // StrataBase spinner.
  { files: ["StrataBase.ts"], selectors: [".strata-spinner"] },
  // Card author avatars.
  { files: ["Card.css"], selectors: ["__author-image", "__author-bullet"] },
  // Carousel pagination dots.
  { files: ["Carousel.css"], selectors: ["__dot"] },
  // Switch thumb.
  { files: ["Switch.ts"], selectors: ["__thumb"] },
];

// Elevation is abolished: box-shadow may only ever be `none`.
const allowedShadow = /^none$/;

const allowedBorderWidth =
  /var\(--strata-border-(micro|small|medium|large|hero)\)|0|thin|medium|thick/;
const rawColor = /#[0-9a-fA-F]{3,8}\b|\brgb\(|\brgba\(|\bhsl\(|\bhsla\(/;
const removedColorToken =
  /--strata-color-(?:red|orange|yellow|green|blue|indigo|violet)\b|--strata-color-status-(?:info|caution|context|special)\b/;

// Generated artifacts synced from @strata/tokens / @strata/prose.
const GENERATED = /^strata-(tokens|fonts|prose)\.css$/;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      entry.name.startsWith(".")
    )
      continue;
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|css)$/.test(entry.name) && !GENERATED.test(entry.name))
      checkFile(full);
  }
}

function radiusAllowed(file, blockText, value) {
  if (allowedRadiusValue.test(value.trim())) return true;
  if (!circularRadius.test(value.trim())) return false;
  const base = path.basename(file);
  return allowedRadiusSelectors.some(
    (entry) =>
      entry.files.includes(base) &&
      entry.selectors.some((sel) => blockText.includes(sel)),
  );
}

function checkFile(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\n/);
  let blockText = "";
  lines.forEach((line, i) => {
    const n = i + 1;
    if (rawColor.test(line))
      violations.push(`${file}:${n} raw color; use STRATA color tokens`);
    if (removedColorToken.test(line))
      violations.push(
        `${file}:${n} removed spectrum/status token; use semantic or status-* tokens`,
      );
    const shadow = line.match(/box-shadow\s*:\s*([^;]+)/);
    if (shadow && !allowedShadow.test(shadow[1].trim()))
      violations.push(
        `${file}:${n} box-shadow is abolished (only "none" allowed)`,
      );
    const radius = line.match(/border-radius\s*:\s*([^;]+)/);
    if (radius && !radiusAllowed(file, blockText, radius[1]))
      violations.push(
        `${file}:${n} border-radius exceeds the 2px scale law; circular shapes need an explicit allowlist entry`,
      );
    const border = line.match(
      /(?:^|[;{])border(?:-(?:width|top|right|bottom|left))?\s*:\s*([^;]+)/,
    );
    if (
      border &&
      !allowedBorderWidth.test(border[1]) &&
      !border[1].includes("solid")
    )
      violations.push(`${file}:${n} non-token border width`);
    for (const decl of line.matchAll(
      /\bborder(?!-radius|-color|-style)(?:-[a-z]+)*\s*:\s*([^;]+)/g,
    )) {
      const px = decl[1].match(/(\d+(?:\.\d+)?)px/);
      if (px && Number(px[1]) > 1 && !decl[1].includes("currentColor"))
        violations.push(
          `${file}:${n} border exceeds the 1px filete law (focus/spinner borders in currentColor are exempt)`,
        );
    }
    if (
      file.endsWith("NavItem.ts") &&
      line.includes(":host([selected])") &&
      line.slice(line.indexOf(":host([selected])")).includes("border:")
    )
      violations.push(
        `${file}:${n} selected navigation must not use a decorative border`,
      );
    if (
      line.includes("<iconify-icon") &&
      /icon\s*=\s*["'](?!carbon:)/.test(line)
    )
      violations.push(`${file}:${n} icon must use carbon:*`);
    blockText += line + "\n";
    if (line.includes("}")) blockText = "";
  });
}

for (const dir of roots) {
  if (fs.existsSync(dir)) walk(dir);
}

if (violations.length) {
  console.error("STRATA design-rule lint failed:");
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log("STRATA design-rule lint passed");
