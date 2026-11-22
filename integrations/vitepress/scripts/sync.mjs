#!/usr/bin/env node
/**
 * Copies @strata/tokens styles.css and @strata/prose prose.css into
 * theme/ so a VitePress site can import them from .vitepress/theme.
 * Generated artifacts are gitignored.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const outDir = path.join(here, "..", "theme");

const copies = [
  ["packages/tokens/dist/styles.css", "strata-tokens.css"],
  ["packages/prose/prose.css", "strata-prose.css"],
];

fs.mkdirSync(outDir, { recursive: true });
for (const [src, dest] of copies) {
  const from = path.join(root, src);
  if (!fs.existsSync(from)) {
    console.error(`missing ${src} — run the package builds first`);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(outDir, dest));
  console.log(`synced ${src} -> theme/${dest}`);
}
