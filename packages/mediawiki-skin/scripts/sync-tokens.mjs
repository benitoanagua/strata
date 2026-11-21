#!/usr/bin/env node
/**
 * Copies the built STRATA token stylesheets into resources/ so the skin is
 * self-contained for MediaWiki's ResourceLoader.
 *
 *   resources/strata-fonts.css  <- @strata/tokens dist/fonts.css (Google Fonts @import)
 *   resources/strata-tokens.css <- @strata/tokens dist/styles.css  (CSS custom properties)
 *
 * Requires `pnpm --filter @strata/tokens build` to have run (turbo handles
 * this via the workspace dependency).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const tokensDist = path.resolve(pkgRoot, "../tokens/dist");
const outDir = path.join(pkgRoot, "resources");

for (const [src, dest] of [
  ["fonts.css", "strata-fonts.css"],
  ["styles.css", "strata-tokens.css"],
]) {
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
