import { test, expect } from "@playwright/test";
import { stubRemoteFonts } from "./font-stub";

test.beforeEach(async ({ page }) => {
  await stubRemoteFonts(page);
});

test("Svelte component catalog loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/STRATA.*Catalog/);
  await expect(page.getByRole("heading", { name: "Button." })).toBeVisible();
});

test("Lit custom elements register and receive property updates", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Playground" }).click();
  await page.getByLabel("Label", { exact: true }).fill("Icon action");
  await expect(page.locator(".preview-stage > strata-button")).toHaveJSProperty(
    "label",
    "Icon action",
  );
});

test("controls reset to their declared defaults", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Playground" }).click();
  await page.getByLabel("Label", { exact: true }).fill("Changed");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator(".preview-stage > strata-button")).toHaveJSProperty(
    "label",
    "Continue",
  );
});
