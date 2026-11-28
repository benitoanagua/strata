import { test, expect } from "@playwright/test";
import { stubRemoteFonts } from "./font-stub";

test.beforeEach(async ({ page }) => {
  await stubRemoteFonts(page);
});

test.describe("STRATA component contracts in the catalog", () => {
  test("uses the canonical canvas and a Lit button", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".canvas")).toBeVisible();
    const previewButton = page.locator(".preview-stage > strata-button");
    await expect(previewButton).toHaveJSProperty("label", "Continue");
    await expect(previewButton).toHaveJSProperty("variant", "outlined");
  });

  test("controls update DOM properties, including booleans", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open Playground" }).click();
    await page.getByLabel("Label", { exact: true }).fill("Save changes");
    await expect(
      page.locator(".preview-stage > strata-button"),
    ).toHaveJSProperty("label", "Save changes");
    await page.getByLabel("Disabled", { exact: true }).check();
    await expect(
      page.locator(".preview-stage > strata-button"),
    ).toHaveJSProperty("disabled", true);
  });

  test("navigation selects another registered component", async ({ page }) => {
    await page.goto("/");
    // Badge lives under Feedback: expand its category, then click the node.
    const cat = page.locator("[data-node-id='cat:Feedback']").first();
    if ((await cat.getAttribute("aria-expanded")) !== "true") {
      await cat.locator(".strata-tree__caret").first().click();
    }
    await page.locator("[data-node-id='entry:badge']").first().click();
    await expect(page.getByRole("heading", { name: "Badge." })).toBeVisible();
    await expect(page.locator(".preview-stage > strata-badge")).toContainText(
      "In review",
    );
    await expect(
      page.locator(".sidebar-nav [data-node-id='entry:badge']"),
    ).toHaveAttribute("aria-selected", "true");
  });

  test("viewer settings control surface and viewport", async ({ page }) => {
    await page.goto("/");
    await page.locator("strata-viewer-settings .vs-toggle").click();
    const panel = page.locator(".vs-panel");
    await panel.getByLabel("Surface").selectOption("dark");
    await expect(page.locator(".canvas")).toHaveAttribute("data-theme", "dark");
    await panel.getByLabel("Viewport").selectOption("mobile");
    await expect(page.locator(".preview-viewport")).toHaveClass(
      /viewport-mobile/,
    );
  });
});
