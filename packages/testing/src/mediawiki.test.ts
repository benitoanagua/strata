import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const mw = path.join(root, "integrations/mediawiki");

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, "utf8"));

describe("@strata/integration-mediawiki packaging", () => {
  it("skin.json and i18n files are valid JSON", () => {
    const skin = readJson(path.join(mw, "skin.json"));
    expect(skin.name).toBe("Strata");
    expect(skin["ValidSkinNames"].strata.class).toBe("SkinMustache");
    const i18n = readJson(path.join(mw, "i18n/en.json"));
    expect(i18n["skinname-strata"]).toBeTruthy();
  });

  it("skin.json version matches package.json", () => {
    const pkg = readJson(path.join(mw, "package.json"));
    const skin = readJson(path.join(mw, "skin.json"));
    expect(skin.version).toBe(pkg.version);
  });

  it("synchronized CSS artifacts are up to date", { timeout: 30000 }, () => {
    execFileSync(process.execPath, [path.join(mw, "scripts/sync-tokens.mjs")]);
    const tokensCss = fs.readFileSync(
      path.join(mw, "resources/strata-tokens.css"),
      "utf8",
    );
    const expectedTokens = fs.readFileSync(
      path.join(root, "packages/tokens/dist/styles.css"),
      "utf8",
    );
    expect(tokensCss).toBe(expectedTokens);
    const proseCss = fs.readFileSync(
      path.join(mw, "resources/strata-prose.css"),
      "utf8",
    );
    const expectedProse = fs.readFileSync(
      path.join(root, "packages/prose/prose.css"),
      "utf8",
    );
    expect(proseCss).toBe(expectedProse);
  });

  it(
    "dist build emits Strata/ with injected version and composer.json",
    { timeout: 30000 },
    () => {
      execFileSync(process.execPath, [path.join(mw, "scripts/build.mjs")]);
      const distSkin = path.join(mw, "dist/Strata");
      const pkg = readJson(path.join(mw, "package.json"));
      const skin = readJson(path.join(distSkin, "skin.json"));
      expect(skin.version).toBe(pkg.version);
      const composer = readJson(path.join(distSkin, "composer.json"));
      expect(composer.type).toBe("mediawiki-skin");
      expect(composer.extra["installer-name"]).toBe("Strata");
      expect(
        fs.existsSync(path.join(distSkin, "resources/strata-prose.css")),
      ).toBe(true);
      const fontsJs = fs.readFileSync(
        path.join(distSkin, "resources/strata-fonts.js"),
        "utf8",
      );
      expect(fontsJs).toContain("fonts.googleapis.com");
      expect(skin.ResourceModules["skins.strata.fonts"].scripts).toContain(
        "resources/strata-fonts.js",
      );
      expect(skin.ValidSkinNames.strata.args[0].scripts).toContain(
        "skins.strata.fonts",
      );
    },
  );
});
