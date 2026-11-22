import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { stubRemoteFonts } from "./font-stub";

test.beforeEach(async ({ page }) => {
  await stubRemoteFonts(page);
});

test("STRATA catalog has no critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Button." })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Component navigation" }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter(
    (violation) => violation.impact === "critical",
  );
  expect(
    critical,
    critical
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toHaveLength(0);
});
