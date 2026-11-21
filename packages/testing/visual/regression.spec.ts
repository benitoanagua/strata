import { test, expect } from "@playwright/test";

test.describe("STRATA responsive layout", () => {
  test("catalog canvas remains usable at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Component navigation" })).toBeVisible();
    await expect(page.locator(".preview-stage strata-button")).toBeVisible();
    await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 390);
  });

  test("catalog retains the workspace at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.locator(".sidebar")).toBeVisible();
    await expect(page.locator(".controls-panel")).toBeVisible();
    await expect(page.locator(".preview-block")).toBeVisible();
  });
});
