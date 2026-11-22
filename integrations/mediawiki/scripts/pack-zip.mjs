#!/usr/bin/env node
/**
 * Optional release artifact: zips dist/Strata into
 * dist/strata-skin-<version>.zip. Requires the `zip` binary.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const distDir = path.join(pkgRoot, "dist");

execFileSync(process.execPath, [path.join(here, "build.mjs")], {
  stdio: "inherit",
});

const pkg = JSON.parse(
  fs.readFileSync(path.join(pkgRoot, "package.json"), "utf8"),
);
const out = path.join(distDir, `strata-skin-${pkg.version}.zip`);
try {
  execFileSync("zip", ["-r", out, "Strata"], { cwd: distDir });
} catch {
  console.error("`zip` binary not found; dist/Strata is still built.");
  process.exit(1);
}
console.log(`wrote ${out}`);
