import { test, expect, type Page } from "@playwright/test";
import { stubRemoteFonts } from "./font-stub";

/**
 * Dark-mode coverage: the app chrome follows `data-theme` on <html>, the
 * canvas surface is scoped to `.canvas[data-theme]`, and `system` defers to
 * prefers-color-scheme. Assertions check computed colors, not just attrs.
 */

async function seedPrefs(
  page: Page,
  prefs: { theme?: string; surface?: string },
) {
  await page.addInitScript((value) => {
    window.localStorage.setItem(
      "strata-catalog-viewer",
      JSON.stringify({
        version: 1,
        theme: "system",
        surface: "auto",
        viewport: "desktop",
        motion: "system",
        ...value,
      }),
    );
  }, prefs);
}

const bg = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => getComputedStyle(el).backgroundColor);

test.describe("dark mode", () => {
  test.beforeEach(async ({ page }) => {
    await stubRemoteFonts(page);
  });

  test("chrome surfaces flip between light and dark", async ({ page }) => {
    await seedPrefs(page, { theme: "light", surface: "auto" });
    await page.goto("/#/button");
    const light = {
      sidebar: await bg(page, ".sidebar"),
      topbar: await bg(page, ".topbar"),
      body: await bg(page, "body"),
      canvas: await bg(page, ".canvas"),
      snippet: await bg(page, ".snippet-block pre"),
      controls: await bg(page, ".controls-panel"),
    };

    await seedPrefs(page, { theme: "dark", surface: "auto" });
    await page.reload();
    const dark = {
      sidebar: await bg(page, ".sidebar"),
      topbar: await bg(page, ".topbar"),
      body: await bg(page, "body"),
      canvas: await bg(page, ".canvas"),
      snippet: await bg(page, ".snippet-block pre"),
      controls: await bg(page, ".controls-panel"),
    };

    for (const key of [
      "sidebar",
      "topbar",
      "body",
      "canvas",
      "snippet",
    ] as const) {
      expect(dark[key], `${key} should change with the theme`).not.toBe(
        light[key],
      );
    }
    // Semantic dark surfaces: sidebar #1B1B1B, page #111111.
    expect(dark.sidebar).toBe("rgb(27, 27, 27)");
    expect(dark.body).toBe("rgb(17, 17, 17)");
    // No chrome surface may stay light in dark mode.
    for (const [key, value] of Object.entries(dark)) {
      expect(value, `${key} must not remain a light surface`).not.toBe(
        "rgb(255, 255, 255)",
      );
      expect(value, `${key} must not remain a light gray`).not.toBe(
        "rgb(247, 247, 247)",
      );
    }
  });

  test("canvas surface is independent of the app theme", async ({ page }) => {
    const combos = [
      { theme: "dark", surface: "light" },
      { theme: "light", surface: "dark" },
      { theme: "dark", surface: "dark" },
      { theme: "light", surface: "light" },
    ] as const;
    // .canvas uses surface-raised: #F7F7F7 light, #1B1B1B dark.
    const expectedCanvasBg: Record<string, string> = {
      light: "rgb(247, 247, 247)",
      dark: "rgb(27, 27, 27)",
    };
    await page.goto("/#/button");
    for (const combo of combos) {
      await seedPrefs(page, combo);
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        combo.theme,
      );
      await expect(page.locator(".canvas")).toHaveAttribute(
        "data-theme",
        combo.surface,
      );
      // The canvas background follows its own scope, not the document.
      expect(await bg(page, ".canvas")).toBe(expectedCanvasBg[combo.surface]);
      // Chrome stays on the app theme regardless of the canvas surface.
      const sidebarBg = await bg(page, ".sidebar");
      expect(
        sidebarBg === "rgb(27, 27, 27)",
        `sidebar should be dark only when theme=dark (${combo.theme}/${combo.surface})`,
      ).toBe(combo.theme === "dark");
    }
  });

  test("grid surface keeps the effective theme and adds gridlines", async ({
    page,
  }) => {
    await seedPrefs(page, { theme: "dark", surface: "grid" });
    await page.goto("/#/button");
    await expect(page.locator(".canvas")).toHaveClass(/canvas-grid/);
    await expect(page.locator(".canvas")).toHaveAttribute("data-theme", "dark");
    const bgImage = await page
      .locator(".canvas")
      .evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bgImage).toContain("linear-gradient");
  });

  test("viewer settings panel is themed and functional in dark", async ({
    page,
  }) => {
    await seedPrefs(page, { theme: "dark", surface: "auto" });
    await page.goto("/#/button");
    await page.locator("strata-viewer-settings .vs-toggle").click();
    const panel = page.locator(".vs-panel");
    await expect(panel).toBeVisible();
    await panel.getByLabel("Theme").selectOption("light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    // Switching the app theme must not touch the global theme key.
    const globalKey = await page.evaluate(() =>
      window.localStorage.getItem("strata-theme"),
    );
    expect(globalKey).toBeNull();
  });

  test("viewer preferences persist across reloads", async ({ page }) => {
    // No seeded prefs: exercise the real default -> UI change -> reload path.
    await page.goto("/#/button");
    await page.locator("strata-viewer-settings .vs-toggle").click();
    await page.locator(".vs-panel").getByLabel("Theme").selectOption("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("strata-catalog-viewer"),
    );
    expect(stored).toContain('"theme":"dark"');
    expect(
      await page.evaluate(() => window.localStorage.getItem("strata-theme")),
    ).toBeNull();
  });

  test("mobile navigation opens the themed sidebar and scrim", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPrefs(page, { theme: "dark", surface: "auto" });
    await page.goto("/#/button");
    await page.locator(".nav-toggle").click();
    await expect(page.locator(".app-shell")).toHaveClass(/sidebar-open/);
    await expect(page.locator(".sidebar-scrim")).toBeVisible();
    expect(await bg(page, ".sidebar")).toBe("rgb(27, 27, 27)");
    await page
      .locator(".sidebar-scrim")
      .click({ position: { x: 370, y: 400 } });
    await expect(page.locator(".app-shell")).not.toHaveClass(/sidebar-open/);
  });

  test("dark catalog page screenshot", async ({ page }) => {
    await seedPrefs(page, { theme: "dark", surface: "auto" });
    await page.goto("/#/button");
    await expect(page.locator(".preview-stage > strata-button")).toBeAttached();
    await expect(page.locator(".app-shell")).toHaveScreenshot(
      "catalog-dark.png",
      { animations: "disabled" },
    );
  });

  test("dark catalog with light canvas screenshot", async ({ page }) => {
    await seedPrefs(page, { theme: "dark", surface: "light" });
    await page.goto("/#/scenario/editorial-article");
    await expect(
      page.locator(".scenario-stage strata-article-header"),
    ).toBeAttached();
    await expect(page.locator(".app-shell")).toHaveScreenshot(
      "catalog-dark-canvas-light.png",
      { animations: "disabled" },
    );
  });
});

test.describe("system theme", () => {
  test.use({ colorScheme: "dark" });

  test("theme=system follows prefers-color-scheme without data-theme", async ({
    page,
  }) => {
    await stubRemoteFonts(page);
    await seedPrefs(page, { theme: "system", surface: "auto" });
    await page.goto("/#/button");
    // System mode removes the explicit attribute and lets the media query
    // drive the tokens.
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    expect(await bg(page, ".sidebar")).toBe("rgb(27, 27, 27)");
    expect(await bg(page, "body")).toBe("rgb(17, 17, 17)");
  });
});

test.describe("system theme (light preference)", () => {
  test.use({ colorScheme: "light" });

  test("theme=system follows a light prefers-color-scheme", async ({
    page,
  }) => {
    await stubRemoteFonts(page);
    await seedPrefs(page, { theme: "system", surface: "auto" });
    await page.goto("/#/button");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    expect(await bg(page, ".sidebar")).toBe("rgb(247, 247, 247)");
    expect(await bg(page, "body")).toBe("rgb(255, 255, 255)");
  });
});
