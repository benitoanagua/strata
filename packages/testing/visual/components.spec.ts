import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../../apps/catalog/src/lib/componentRegistry.ts";
import { stubRemoteFonts } from "./font-stub";

const THEMES = ["light", "dark"] as const;

// Fragment components are exercised inside their required parent so axe
// sees a valid ARIA tree instead of a standalone excerpt.
const PARENT_FIXTURES: Record<string, string> = {
  tab: `<strata-tabs>
    <strata-tab slot="tabs">Overview</strata-tab>
    <strata-tab slot="tabs">Details</strata-tab>
    <strata-tab-panel slot="panels">Overview panel.</strata-tab-panel>
    <strata-tab-panel slot="panels">Details panel.</strata-tab-panel>
  </strata-tabs>`,
  "menu-item": `<strata-menu>
    <strata-menu-item label="Profile"></strata-menu-item>
    <strata-menu-item label="Settings"></strata-menu-item>
  </strata-menu>`,
  "list-item": `<strata-list>
    <strata-list-item title="First item" description="Supporting text."></strata-list-item>
    <strata-list-item title="Second item" description="Supporting text."></strata-list-item>
  </strata-list>`,
};

async function seedViewerPrefs(page: Page, surface: string) {
  await page.addInitScript((value) => {
    window.localStorage.setItem(
      "strata-catalog-viewer",
      JSON.stringify({
        version: 1,
        theme: "system",
        surface: value,
        viewport: "desktop",
        motion: "system",
      }),
    );
  }, surface);
}

async function openComponent(page: Page, entryId: string, surface: string) {
  await seedViewerPrefs(page, surface);
  await page.goto(`/#/${entryId}`);
  const preview = page.locator(".preview-stage > *").last();
  await expect(preview).toBeAttached();
  // Shadow-DOM CSS animations (e.g. strata-modal's 300ms transitions) are not
  // covered by Playwright's `animations: "disabled"`, so wait them out before
  // screenshots compare pixels.
  await page.waitForTimeout(400);
}

test.describe("STRATA component axe coverage", () => {
  for (const theme of THEMES) {
    for (const entry of catalog) {
      test(`${entry.id} has no serious or critical violations (${theme})`, async ({
        page,
      }) => {
        await stubRemoteFonts(page);
        await seedViewerPrefs(page, theme);
        await page.goto(`/#/${entry.id}`);

        const fixture = PARENT_FIXTURES[entry.id];
        if (fixture) {
          await page.locator(".preview-stage").evaluate((el, html) => {
            el.innerHTML = html;
          }, fixture);
          await page.waitForTimeout(200);
        } else {
          const preview = page.locator(".preview-stage > *").last();
          await expect(preview).toBeAttached();
          await page.waitForTimeout(150);
        }

        const results = await new AxeBuilder({ page })
          .include(".preview-stage")
          .analyze();
        const violations = results.violations.filter(
          (violation) =>
            violation.impact === "critical" || violation.impact === "serious",
        );
        expect(
          violations.map(
            (violation) =>
              `${violation.id} (${violation.impact}): ${violation.help}`,
          ),
          `axe violations for ${entry.id} in ${theme} theme`,
        ).toHaveLength(0);
      });
    }
  }
});

test.describe("STRATA component screenshots", () => {
  for (const theme of THEMES) {
    for (const entry of catalog) {
      test(`${entry.id} preview can be captured (${theme})`, async ({
        page,
      }) => {
        await stubRemoteFonts(page);
        await openComponent(page, entry.id, theme);
        const screenshot = await page
          .locator(".preview-stage")
          .screenshot({ animations: "disabled" });
        // Baselines are local-only artifacts (see AGENTS.md); CI verifies
        // that every component renders and can be captured in both themes.
        expect(screenshot.byteLength).toBeGreaterThan(1_000);
      });
    }
  }
});
