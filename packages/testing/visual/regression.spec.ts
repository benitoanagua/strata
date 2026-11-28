import { test, expect } from "@playwright/test";
import { stubRemoteFonts } from "./font-stub";

test.beforeEach(async ({ page }) => {
  await stubRemoteFonts(page);
});

test.describe("STRATA responsive layout", () => {
  test("catalog canvas remains usable at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("navigation", { name: "Component navigation" }),
    ).toBeVisible();
    await expect(page.locator(".preview-stage strata-button")).toBeVisible();
    await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 390);
  });

  test("Quick view lists every story and selects into the shared preview", async ({
    page,
  }) => {
    await page.goto("/#/button");
    const gallery = page.locator(".quick-view-gallery");
    await expect(gallery).toBeVisible();
    const cards = gallery.locator(".quick-view-card");
    const count = await cards.count();
    const label = await gallery
      .locator(".quick-view-gallery-count")
      .textContent();
    expect(count).toBe(Number(label?.match(/\d+/)?.[0]));
    expect(count).toBeGreaterThan(1);
    const first = cards.first();
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await first.click();
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(first).toHaveClass(/selected/);
    await expect(page.locator(".preview-stage > strata-button")).toBeAttached();
  });

  test("Quick view selection keeps the shared preview for representative component families", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    for (const id of [
      "button",
      "card",
      "grille",
      "overlay",
      "avatar",
      "modal",
    ]) {
      await page.goto(`/#/${id}`);
      // The modal preview opens by default and blocks pointer events; its catalog
      // preset disables Escape/backdrop closing, so dismiss it via its close button.
      if (id === "modal") {
        const closeButton = page.getByRole("button", { name: "Close modal" });
        await closeButton.click();
        await expect(closeButton).toBeHidden();
      }
      const cards = page.locator(".quick-view-card");
      await expect(cards.first()).toBeVisible();
      const target = cards.nth(Math.min(1, (await cards.count()) - 1));
      await target.click();
      await expect(target).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.locator(`.preview-stage > strata-${id}`),
      ).toBeAttached();
    }
    await page.goto("/#/grille");
    await page.locator(".quick-view-card").first().click();
    await expect(
      page.locator(".preview-stage strata-grille article").first(),
    ).toBeAttached();
  });

  test("Playground collapse handle remains visible and aligned at 320px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/#/button");
    await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 320);
    const handle = page.locator(".edge-handle");
    await handle.click();
    const panel = page.locator(".playground-popover");
    await expect(panel).toBeVisible();
    await expect(handle).toBeVisible();
    const panelBox = await panel.boundingBox();
    const handleBox = await handle.boundingBox();
    expect(panelBox).not.toBeNull();
    expect(handleBox).not.toBeNull();
    // At 320px the popover is inset 8px from the screen edge, so the collapse
    // tab clamps to the left edge and straddles the panel border instead of
    // aligning flush with it.
    expect(handleBox!.x).toBeGreaterThanOrEqual(0);
    expect(handleBox!.x).toBeLessThanOrEqual(panelBox!.x);
    expect(handleBox!.x + handleBox!.width).toBeGreaterThan(panelBox!.x);
  });

  test("catalog retains the workspace at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.locator(".sidebar")).toBeVisible();
    await page.getByRole("button", { name: "Open Playground" }).click();
    await expect(
      page.locator(".playground-popover .controls-panel"),
    ).toBeVisible();
    await expect(page.locator(".preview-block")).toBeVisible();
  });
});
