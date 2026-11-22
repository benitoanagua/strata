import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src",
);
const repoRoot = path.resolve(srcDir, "../../..");

const FONT_ROLES = /var\(--strata-font-(serif|sans|mono)\)/;

function collectFiles(dir: string, exts: string[]): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(full, exts);
    return exts.some((ext) => entry.name.endsWith(ext)) ? [full] : [];
  });
}

const componentFiles = collectFiles(srcDir, [".ts", ".css"]);
const proseFile = path.join(repoRoot, "packages/prose/prose.css");
const globalCss = path.join(srcDir, "styles/global.css");

describe("STRATA typography roles", () => {
  it("scans component sources", () => {
    expect(componentFiles.length).toBeGreaterThan(0);
  });

  it.each([...componentFiles, proseFile])(
    "%s uses only the three font role variables",
    (file) => {
      const css = fs.readFileSync(file, "utf8");
      const familyDeclarations = css.match(/font-family\s*:[^;}]+/g) ?? [];
      for (const declaration of familyDeclarations) {
        const value = declaration.split(":").slice(1).join(":").trim();
        expect(
          FONT_ROLES.test(value),
          `${file}: font-family must use var(--strata-font-serif|sans|mono), got "${value}"`,
        ).toBe(true);
      }
    },
  );

  it.each([...componentFiles, proseFile])(
    "%s has no literal font shorthand sizes",
    (file) => {
      const css = fs.readFileSync(file, "utf8");
      const shorthands = css.match(/(^|[{;\s])font\s*:[^;}]+/g) ?? [];
      for (const declaration of shorthands) {
        expect(
          /\d(?:\.\d+)?(?:px|pt|rem|em)\b/.test(declaration),
          `${file}: literal font shorthand "${declaration.trim()}" — use --strata-type-* tokens`,
        ).toBe(false);
      }
    },
  );

  it("body inherits the serif reading face", () => {
    const css = fs.readFileSync(globalCss, "utf8");
    const bodyRule = css.match(/body\s*\{[^}]+\}/)?.[0] ?? "";
    expect(bodyRule).toContain("var(--strata-font-serif)");
  });
});
