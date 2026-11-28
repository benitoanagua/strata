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

  test("Quick view lists every story and lazily mounts real elements", async ({
    page,
  }) => {
    await page.goto("/#/button");
    const gallery = page.locator(".quick-view-gallery");
    await expect(gallery).toBeVisible();
    const count = await gallery.locator(".quick-view-card").count();
    const label = await gallery.locator(".quick-view-gallery-count").textContent();
    expect(count).toBe(Number(label?.match(/\d+/)?.[0]));
    expect(count).toBeGreaterThan(1);
    await expect(
      gallery.locator(".quick-view-card").first().locator(".quick-view-host > strata-button"),
    ).toBeVisible();
    expect(await gallery.locator(".quick-view-host:empty").count()).toBeGreaterThan(
      0,
    );
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
    expect(Math.abs(handleBox!.x - panelBox!.x)).toBeLessThanOrEqual(1);
  });

  test("catalog retains the workspace at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.locator(".sidebar")).toBeVisible();
    await expect(page.locator(".controls-panel")).toBeVisible();
    await expect(page.locator(".preview-block")).toBeVisible();
  });
});
