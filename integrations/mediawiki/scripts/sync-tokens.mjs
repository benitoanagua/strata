#!/usr/bin/env node
/**
 * Copies the built STRATA stylesheets into resources/ so the skin is
 * self-contained for MediaWiki's ResourceLoader.
 *
 *   resources/strata-tokens.css <- @strata/tokens dist/styles.css
 *   resources/strata-prose.css  <- @strata/prose prose.css
 *
 * Generated files are gitignored; `pnpm build` regenerates them.
 * Requires `pnpm --filter @strata/tokens build` (turbo handles this via
 * the workspace dependency).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const tokensDist = path.resolve(pkgRoot, "../../packages/tokens/dist");
const proseCss = path.resolve(pkgRoot, "../../packages/prose/prose.css");
const outDir = path.join(pkgRoot, "resources");

for (const [src, dest] of [["styles.css", "strata-tokens.css"]]) {
  const from = path.join(tokensDist, src);
  if (!fs.existsSync(from)) {
    console.error(
      `Missing ${from}. Run \`pnpm --filter @strata/tokens build\` first.`,
    );
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(outDir, dest));
  console.log(`synced ${src} -> resources/${dest}`);
}
if (!fs.existsSync(proseCss)) {
  console.error(`Missing ${proseCss}. Is @strata/prose installed?`);
  process.exit(1);
}
fs.copyFileSync(proseCss, path.join(outDir, "strata-prose.css"));
console.log("synced @strata/prose -> resources/strata-prose.css");
