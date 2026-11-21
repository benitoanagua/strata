import { test, expect } from "@playwright/test";

test("Svelte component catalog loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/STRATA.*Catalog/);
  await expect(page.getByRole("heading", { name: "Button." })).toBeVisible();
});

test("Lit custom elements register and receive property updates", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Label").fill("Icon action");
  await expect(page.locator("strata-button")).toHaveJSProperty(
    "label",
    "Icon action",
  );
});

test("controls reset to their declared defaults", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Label").fill("Changed");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator("strata-button")).toHaveJSProperty(
    "label",
    "Continue",
  );
});
