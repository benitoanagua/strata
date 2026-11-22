#!/usr/bin/env node
/**
 * Builds the distributable skin: syncs generated CSS, then assembles
 * dist/Strata/ — the directory name MUST match the skin name (`Strata`)
 * expected by MediaWiki's skin discovery.
 *
 * skin.json is emitted with `version` injected from package.json so the
 * skin metadata can never drift from the package version.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const distSkin = path.join(pkgRoot, "dist", "Strata");

execFileSync(process.execPath, [path.join(here, "sync-tokens.mjs")], {
  stdio: "inherit",
});

const pkg = JSON.parse(
  fs.readFileSync(path.join(pkgRoot, "package.json"), "utf8"),
);
const skinJson = JSON.parse(
  fs.readFileSync(path.join(pkgRoot, "skin.json"), "utf8"),
);
skinJson.version = pkg.version;

fs.rmSync(distSkin, { recursive: true, force: true });
for (const dir of ["i18n", "resources", "templates"]) {
  fs.cpSync(path.join(pkgRoot, dir), path.join(distSkin, dir), {
    recursive: true,
  });
}
fs.writeFileSync(
  path.join(distSkin, "skin.json"),
  JSON.stringify(skinJson, null, 2) + "\n",
);
console.log(`built dist/Strata (version ${pkg.version})`);
