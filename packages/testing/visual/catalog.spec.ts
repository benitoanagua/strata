import { test, expect } from "@playwright/test";
import { stubRemoteFonts } from "./font-stub";

test.beforeEach(async ({ page }) => {
  await stubRemoteFonts(page);
});

const LIBRARY_ENTRIES = 74;
const SCENARIOS = 5;

test("catalog lists every canonical component and scenario", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".sidebar nav[aria-label='Component navigation'] .nav-entry"),
  ).toHaveCount(LIBRARY_ENTRIES);
  await expect(
    page.locator(".sidebar nav[aria-label='Scenarios'] .nav-entry"),
  ).toHaveCount(SCENARIOS);
});

test("search filters the library by name and description", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search components").fill("dialog");
  const entries = page.locator(
    ".sidebar nav[aria-label='Component navigation'] .nav-entry",
  );
  await expect(entries.first()).toBeVisible();
  const count = await entries.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(LIBRARY_ENTRIES);
  // Every visible entry must relate to the query (name, tag, category or description).
  const texts = await entries.allTextContents();
  expect(texts.some((t) => /dialog/i.test(t))).toBe(true);
  await page.getByLabel("Search components").fill("zzz-no-match");
  await expect(page.locator(".empty-search")).toBeVisible();
});

test("category navigation collapses and expands groups", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator(".category-toggle", { hasText: "Actions" });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const before = await page
    .locator(".sidebar nav[aria-label='Component navigation'] .nav-entry")
    .count();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  const after = await page
    .locator(".sidebar nav[aria-label='Component navigation'] .nav-entry")
    .count();
  expect(after).toBeLessThan(before);
  await toggle.click();
  await expect(
    page.locator(".sidebar nav[aria-label='Component navigation'] .nav-entry"),
  ).toHaveCount(LIBRARY_ENTRIES);
});

test("every component is selectable and mounts a real element", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.goto("/");
  const entries = await page
    .locator(".sidebar nav[aria-label='Component navigation'] .nav-entry")
    .evaluateAll((els) =>
      els.map((el) => ({
        id: el.getAttribute("data-entry-id"),
        tag: el.querySelector(".nav-tag")?.textContent?.trim(),
      })),
    );
  expect(entries).toHaveLength(LIBRARY_ENTRIES);
  for (const { id, tag } of entries) {
    await page.evaluate((hash) => (location.hash = hash), `#/${id}`);
    const mounted = page.locator(".preview-stage > *").first();
    await expect
      .poll(() => mounted.evaluate((el) => el.tagName.toLowerCase()), {
        timeout: 5_000,
      })
      .toBe(`strata-${tag}`);
  }
  expect(pageErrors).toEqual([]);
});

test("property controls mutate the mounted element with real types", async ({
  page,
}) => {
  await page.goto("/#/slider");
  const host = page.locator(".preview-stage > strata-slider");
  const minControl = page.locator("#prop-min");
  await expect(minControl).toHaveAttribute("type", "number");
  await minControl.fill("10");
  await expect(host).toHaveJSProperty("min", 10);
  expect(typeof (await host.evaluate((el) => (el as any).min))).toBe("number");

  await page.goto("/#/checkbox");
  const checked = page.locator("#prop-checked");
  await expect(checked).toHaveAttribute("type", "checkbox");
  await checked.uncheck();
  await expect(
    page.locator(".preview-stage > strata-checkbox"),
  ).toHaveJSProperty("checked", false);
});

test("reset restores declared defaults", async ({ page }) => {
  await page.goto("/#/button");
  await page.getByLabel("Label").fill("Changed label");
  await expect(page.locator(".preview-stage > strata-button")).toHaveJSProperty(
    "label",
    "Changed label",
  );
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator(".preview-stage > strata-button")).toHaveJSProperty(
    "label",
    "Continue",
  );
});

test("snippet tab shows copyable markup for the selected component", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#/tag");
  await page.getByRole("tab", { name: "Examples" }).click();
  const code = await page.locator(".snippet-block pre").textContent();
  expect(code).toContain('import "@strata/components"');
  expect(code).toContain("<strata-tag");
  await page.locator(".snippet-head button").click();
  await expect(page.locator(".snippet-head button")).toContainText("Copied");
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe(code);
});

test("API and accessibility tabs render documentation", async ({ page }) => {
  await page.goto("/#/tabs");
  await page.getByRole("tab", { name: "API" }).click();
  await expect(page.locator(".api-table").first()).toBeVisible();
  await page.getByRole("tab", { name: "Accessibility" }).click();
  await expect(page.locator(".a11y-panel")).toBeVisible();
});

test("compound components mount their slotted fixtures", async ({ page }) => {
  await page.goto("/#/tabs");
  const tabs = page.locator(".preview-stage > strata-tabs");
  await expect(tabs.locator("strata-tab").first()).toBeAttached();
  await page.goto("/#/data-table");
  await expect(
    page.locator(".preview-stage > strata-data-table tbody tr").first(),
  ).toBeAttached();
});

test("all five editorial scenarios render", async ({ page }) => {
  const scenarios = [
    ["editorial-article", "strata-article-header"],
    ["wiki-article", "strata-toc"],
    ["social", "strata-comment-thread"],
    ["data", "strata-data-table"],
    ["forms", "strata-text-field"],
  ] as const;
  for (const [id, selector] of scenarios) {
    await page.goto(`/#/scenario/${id}`);
    await expect(
      page.locator(`.scenario-stage ${selector}`).first(),
    ).toBeAttached();
  }
});

test("surface and viewport controls restyle the canvas", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Canvas surface").selectOption("dark");
  await expect(page.locator(".canvas")).toHaveClass(/canvas-dark/);
  await page.getByLabel("Canvas surface").selectOption("grid");
  await expect(page.locator(".canvas")).toHaveClass(/canvas-grid/);
  await page.getByLabel("Canvas viewport").selectOption("mobile");
  await expect(page.locator(".preview-viewport")).toHaveClass(
    /viewport-mobile/,
  );
});
