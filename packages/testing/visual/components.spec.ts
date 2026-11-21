import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../../catalog/src/lib/componentRegistry.ts";

const THEMES = ["light", "dark"] as const;

// Fragment components are always composed inside a parent container
// (tabs > tab, menu > menu-item, list > list-item). The catalog previews
// them standalone, so axe reports missing required parents. The composite
// parents are covered by their own tests.
const AXE_RULE_EXCEPTIONS: Record<string, readonly string[]> = {
  tab: ["aria-required-parent"],
  "menu-item": ["aria-required-parent"],
  "list-item": ["aria-required-parent"],
};

async function openComponent(page: Page, name: string, theme: string) {
  await page.goto("/");
  await page.getByLabel("Canvas surface").selectOption(theme);
  await page
    .getByRole("navigation", { name: "Component navigation" })
    .getByRole("button", { name: `◇ ${name}`, exact: true })
    .click();
  const preview = page.locator(".preview-stage > *").last();
  await expect(preview).toBeAttached();
  await page.waitForTimeout(150);
}

test.describe("STRATA component axe coverage", () => {
  for (const theme of THEMES) {
    for (const entry of catalog) {
      test(`${entry.id} has no serious or critical violations (${theme})`, async ({
        page,
      }) => {
        await openComponent(page, entry.name, theme);
        const results = await new AxeBuilder({ page })
          .include(".preview-stage")
          .analyze();
        const exceptions = AXE_RULE_EXCEPTIONS[entry.id] ?? [];
        const violations = results.violations.filter(
          (violation) =>
            (violation.impact === "critical" ||
              violation.impact === "serious") &&
            !exceptions.includes(violation.id),
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
      test(`${entry.id} preview is visually stable (${theme})`, async ({
        page,
      }) => {
        await openComponent(page, entry.name, theme);
        await expect(page.locator(".preview-stage")).toHaveScreenshot(
          `${entry.id}-${theme}.png`,
          { animations: "disabled", maxDiffPixelRatio: 0.02 },
        );
      });
    }
  }
});
