import { test, expect } from "@playwright/test";
import { stubRemoteFonts } from "./font-stub";

test.beforeEach(async ({ page }) => {
  await stubRemoteFonts(page);
});

test.describe("STRATA component contracts in the catalog", () => {
  test("uses the canonical canvas and a Lit button", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".canvas")).toBeVisible();
    await expect(page.locator("strata-button")).toHaveJSProperty(
      "label",
      "Continue",
    );
    await expect(page.locator("strata-button")).toHaveJSProperty(
      "variant",
      "outlined",
    );
  });

  test("controls update DOM properties, including booleans", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Label").fill("Save changes");
    await expect(page.locator("strata-button")).toHaveJSProperty(
      "label",
      "Save changes",
    );
    await page.getByLabel("Disabled").check();
    await expect(page.locator("strata-button")).toHaveJSProperty(
      "disabled",
      true,
    );
  });

  test("navigation selects another registered component", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Badge/ }).click();
    await expect(page.getByRole("heading", { name: "Badge." })).toBeVisible();
    await expect(page.locator("strata-badge")).toContainText("In review");
  });

  test("surface and viewport selectors work", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Canvas surface").selectOption("dark");
    await expect(page.locator(".canvas")).toHaveAttribute("data-theme", "dark");
    await page.getByLabel("Canvas viewport").selectOption("mobile");
    await expect(page.locator(".preview-viewport")).toHaveClass(
      /viewport-mobile/,
    );
  });
});
