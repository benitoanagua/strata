#!/usr/bin/env node
/**
 * MediaWiki smoke test against the docker-compose instance.
 *
 * Prerequisites (see docker-compose.yml header):
 *   1. pnpm --filter @strata/integration-mediawiki build
 *   2. docker compose -f integrations/mediawiki/docker-compose.yml up -d db
 *   3. docker compose -f integrations/mediawiki/docker-compose.yml run --rm install
 *   4. docker compose -f integrations/mediawiki/docker-compose.yml up -d
 *
 * Then run: node integrations/mediawiki/scripts/smoke.mjs
 *
 * Creates an example article exercising wikitable, an infobox template,
 * TOC, references and categories, then fetches the rendered page.
 * Dark mode is driven by prefers-color-scheme, which HTTP cannot
 * emulate; verify visually in a browser if needed.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const composeDir = path.resolve(here, "..");
const composeFile = path.join(composeDir, "docker-compose.yml");
const base = process.env.MW_URL ?? "http://localhost:8080";

const ARTICLE = "Strata:Smoke Article";
// The official image serves MediaWiki under /wiki (Apache alias).
const ARTICLE_URL = `${base}/index.php/${encodeURIComponent(ARTICLE)}`;

const WIKITEXT = `= Smoke =

This article exercises the Strata skin: '''bold''', ''italic'', a [[link]],
and inline <code>code</code>.

== Table of contents ==

__TOC__

== Section one ==

Paragraph with a reference.<ref name="r1">Citation text.</ref> Another
claim.<ref>Citation two.</ref>

{| class="wikitable"
! Header A !! Header B
|-
| row 1 col 1 || row 1 col 2
|-
| row 2 col 1 || row 2 col 2
|}

== Section two ==

{{Infobox
| title = Smoke Infobox
| field1 = value one
| field2 = value two
}}

== References ==

<references />

[[Category:Strata Smoke]]
[[Category:Smoke Tests]]
`;

function compose(args, opts = {}) {
  return execFileSync("docker", ["compose", "-f", composeFile, ...args], {
    cwd: composeDir,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "inherit"],
    ...opts,
  });
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

function fail(msg) {
  console.error(`SMOKE FAIL: ${msg}`);
  process.exit(1);
}

// 1. Create the example article via maintenance/edit.php (bypasses CSRF).
compose(
  [
    "exec",
    "-T",
    "mediawiki",
    "php",
    "maintenance/edit.php",
    "--user=Admin",
    "--summary=Smoke article",
    ARTICLE,
  ],
  { input: WIKITEXT },
);
console.log(`created ${ARTICLE}`);

// 2. Fetch the rendered page.
const html = await fetchText(ARTICLE_URL);

const checks = [
  ["skin class", /skin-strata/.test(html)],
  ["parser output", html.includes("mw-parser-output")],
  ["wikitable", html.includes("wikitable")],
  ["TOC", html.includes("mw-toc")],
  [
    "references",
    html.includes("mw-references-wrap") || html.includes("reflist"),
  ],
  ["sidebar portlet", html.includes("mw-portlet")],
  ["styles module", html.includes("skins.strata.styles")],
  ["fonts module", html.includes("skins.strata.fonts")],
];

let ok = true;
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
  if (!pass) ok = false;
}

// 3. Verify the fonts module actually serves the Google Fonts URL.
const fontsModuleUrl = `${base}/load.php?lang=en&modules=skins.strata.fonts&only=scripts&skin=strata`;
const fontsModule = await fetchText(fontsModuleUrl);
const fontsCheck = fontsModule.includes("fonts.googleapis.com");
console.log(`${fontsCheck ? "PASS" : "FAIL"} fonts module serves fontsUrl`);
if (!fontsCheck) ok = false;

if (!ok) fail("see FAIL lines above");
console.log("SMOKE PASS");
