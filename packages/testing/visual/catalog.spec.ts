import { test, expect, type Page } from "@playwright/test";
import { stubRemoteFonts } from "./font-stub";
import { catalog } from "../../../apps/catalog/src/lib/componentRegistry.ts";

test.beforeEach(async ({ page }) => {
  await stubRemoteFonts(page);
});

const LIBRARY_ENTRIES = catalog.length;
const SCENARIOS = 5;

/**
 * The sidebar tree runs in `expand-mode="single"`, so entries are only in
 * the DOM while their category is expanded. This walks every category —
 * accordion-style, one at a time — and harvests all entry/scenario ids.
 */
async function harvestTreeIds(page: Page) {
  const entryIds = new Set<string>();
  const scenarioIds = new Set<string>();
  const isOpen = async (id: string) =>
    (await page
      .locator(`.sidebar-nav [data-node-id='${id}']`)
      .first()
      .getAttribute("aria-expanded")) === "true";
  const toggle = async (id: string) => {
    await page
      .locator(`.sidebar-nav [data-node-id='${id}'] .strata-tree__caret`)
      .first()
      .click();
  };

  if (!(await isOpen("root:library"))) await toggle("root:library");
  const cats = await page
    .locator(".sidebar-nav [data-node-id^='cat:']")
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-node-id")!));
  for (const cat of cats) {
    if (!(await isOpen(cat))) await toggle(cat);
    const ids = await page
      .locator(`.sidebar-nav [data-node-id='${cat}'] [data-node-id^='entry:']`)
      .evaluateAll((els) =>
        els.map((el) =>
          el.getAttribute("data-node-id")!.slice("entry:".length),
        ),
      );
    ids.forEach((id) => entryIds.add(id));
  }

  if (!(await isOpen("root:scenarios"))) await toggle("root:scenarios");
  const sids = await page
    .locator(
      ".sidebar-nav [data-node-id='root:scenarios'] [data-node-id^='scenario:']",
    )
    .evaluateAll((els) =>
      els.map((el) =>
        el.getAttribute("data-node-id")!.slice("scenario:".length),
      ),
    );
  sids.forEach((id) => scenarioIds.add(id));
  return { entryIds: [...entryIds], scenarioIds: [...scenarioIds] };
}

test("catalog lists every canonical component and scenario", async ({
  page,
}) => {
  await page.goto("/");
  const { entryIds, scenarioIds } = await harvestTreeIds(page);
  expect(entryIds).toHaveLength(LIBRARY_ENTRIES);
  expect(scenarioIds).toHaveLength(SCENARIOS);
});

test("tree starts compact: only the route ancestors are expanded", async ({
  page,
}) => {
  await page.goto("/");
  // Default route is #/button (Actions): Library + Actions open, nothing else.
  await expect(
    page.locator(".sidebar-nav [data-node-id='root:library']"),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.locator(".sidebar-nav [data-node-id='cat:Actions']"),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.locator(".sidebar-nav [data-node-id='root:scenarios']"),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.locator(".sidebar-nav [data-node-id='cat:Forms']"),
  ).toHaveAttribute("aria-expanded", "false");
  // Not every component is rendered up front.
  const visible = await page
    .locator(".sidebar-nav [data-node-id^='entry:']")
    .count();
  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThan(LIBRARY_ENTRIES);
});

test("expansion is exclusive between sibling categories", async ({ page }) => {
  await page.goto("/");
  const actions = page.locator("[data-node-id='cat:Actions']").first();
  const forms = page.locator("[data-node-id='cat:Forms']").first();
  await forms.locator(".strata-tree__caret").first().click();
  await expect(forms).toHaveAttribute("aria-expanded", "true");
  await expect(actions).toHaveAttribute("aria-expanded", "false");
  // The previously open category's entries leave the DOM.
  await expect(
    page.locator(".sidebar-nav [data-node-id='entry:button']"),
  ).toHaveCount(0);
  await expect(
    page.locator(".sidebar-nav [data-node-id='entry:checkbox']"),
  ).toBeVisible();
});

test("deep links expand only the ancestors of the selected entry", async ({
  page,
}) => {
  await page.goto("/#/checkbox");
  await expect(
    page.locator(".sidebar-nav [data-node-id='cat:Forms']"),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.locator(".sidebar-nav [data-node-id='cat:Actions']"),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.locator(".sidebar-nav [data-node-id='entry:checkbox']"),
  ).toHaveAttribute("aria-selected", "true");
});

test("search filters the library by name and description", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search components").fill("modal");
  const entries = page.locator(".sidebar-nav [data-node-id^='entry:']");
  await expect(entries.first()).toBeVisible();
  const count = await entries.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(LIBRARY_ENTRIES);
  // Only categories with results stay in the tree.
  const cats = await page
    .locator(".sidebar-nav [data-node-id^='cat:']")
    .count();
  expect(cats).toBeGreaterThan(0);
  expect(cats).toBeLessThan(8);
  // The expanded result category reveals matching entries.
  const texts = await entries.allTextContents();
  expect(texts.some((t) => /modal/i.test(t))).toBe(true);
  // Clearing the search restores the compact route-driven state.
  await page.getByLabel("Search components").fill("");
  await expect(
    page.locator(".sidebar-nav [data-node-id='entry:button']"),
  ).toBeVisible();
  await expect(
    page.locator(".sidebar-nav [data-node-id='entry:checkbox']"),
  ).toHaveCount(0);
  await page.getByLabel("Search components").fill("zzz-no-match");
  await expect(page.locator(".strata-tree__empty")).toBeVisible();
});

test("category navigation collapses and expands groups", async ({ page }) => {
  await page.goto("/");
  const group = page.locator("[data-node-id='cat:Actions']").first();
  await expect(group).toHaveAttribute("aria-expanded", "true");
  const before = await page
    .locator(".sidebar-nav [data-node-id^='entry:']")
    .count();
  await group.locator(".strata-tree__caret").first().click();
  await expect(group).toHaveAttribute("aria-expanded", "false");
  const after = await page
    .locator(".sidebar-nav [data-node-id^='entry:']")
    .count();
  expect(after).toBeLessThan(before);
  await group.locator(".strata-tree__caret").first().click();
  await expect(group).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.locator(".sidebar-nav [data-node-id='entry:button']"),
  ).toBeVisible();
});

test("tree keyboard navigation moves and selects entries", async ({ page }) => {
  await page.goto("/");
  const tree = page.locator("[role='tree']").first();
  await tree.locator("[tabindex='0']").first().focus();
  await page.keyboard.press("ArrowDown");
  const focused = page.locator("[role='treeitem'][tabindex='0']");
  await expect(focused).toHaveCount(1);
});

test("every component is selectable and mounts a real element", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.goto("/");
  const { entryIds } = await harvestTreeIds(page);
  expect(entryIds).toHaveLength(LIBRARY_ENTRIES);
  // Re-open the library on the default route before driving by hash.
  const libRoot = page.locator("[data-node-id='root:library']").first();
  if ((await libRoot.getAttribute("aria-expanded")) !== "true") {
    await libRoot.locator(".strata-tree__caret").first().click();
  }
  for (const id of entryIds) {
    await page.evaluate((hash) => (location.hash = hash), `#/${id}`);
    const mounted = page.locator(".preview-stage > *").first();
    await expect
      .poll(() => mounted.evaluate((el) => el.tagName.toLowerCase()), {
        timeout: 5_000,
      })
      .toBe(`strata-${id}`);
  }
  expect(pageErrors).toEqual([]);
});

test("property controls mutate the mounted element with real types", async ({
  page,
}) => {
  await page.goto("/#/slider");
  const host = page.locator(".preview-stage > strata-slider");
  const minControl = page.getByLabel("Min", { exact: true });
  await minControl.fill("10");
  await expect(host).toHaveJSProperty("min", 10);
  expect(typeof (await host.evaluate((el) => (el as any).min))).toBe("number");

  await page.goto("/#/checkbox");
  const checked = page.getByLabel("Checked", { exact: true });
  await checked.uncheck();
  await expect(
    page.locator(".preview-stage > strata-checkbox"),
  ).toHaveJSProperty("checked", false);
});

test("reset restores declared defaults", async ({ page }) => {
  await page.goto("/#/button");
  await page.getByLabel("Label", { exact: true }).fill("Changed label");
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

const snippetCode = (page: Page) =>
  page
    .locator(".code-scroll .line-text")
    .allTextContents()
    .then((lines) => lines.join("\n"));

test("snippet tab shows copyable markup for the selected component", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#/badge");
  await page.getByRole("tab", { name: "Examples" }).click();
  const code = await snippetCode(page);
  expect(code).toContain('import "@strata/components"');
  expect(code).toContain("<strata-badge");
  await page.locator(".code-tools strata-button").click();
  await expect(page.locator(".code-tools strata-button")).toContainText(
    "Copied",
  );
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard?.trimEnd()).toBe(code.trimEnd());
});

test("snippet tabs switch language and copy the active source", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#/button");
  await page.getByRole("tab", { name: "Examples" }).click();
  const tabs = page.locator(".code-tabs");
  await expect(tabs.getByRole("tab")).toHaveText([
    "HTML",
    "JavaScript",
    "Install",
  ]);

  await tabs.getByRole("tab", { name: "JavaScript" }).click();
  const js = await snippetCode(page);
  expect(js).toContain('import "@strata/components"');
  expect(js).toContain('document.createElement("strata-button")');
  expect(js).toContain("document.body.append(button)");

  await page.locator(".code-tools strata-button").click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard?.trimEnd()).toBe(js.trimEnd());

  await tabs.getByRole("tab", { name: "Install" }).click();
  await expect(page.locator(".code-scroll")).toContainText(
    "pnpm add @strata/components",
  );
  await page.locator(".code-tools strata-button").click();
  const install = await page.evaluate(() => navigator.clipboard.readText());
  expect(install?.trim()).toBe("pnpm add @strata/components");
});

test("snippet line numbers toggle and long snippets expand", async ({
  page,
}) => {
  await page.goto("/#/prose");
  await page.getByRole("tab", { name: "Examples" }).click();
  await expect(page.locator(".line-no").first()).toBeVisible();
  await page.getByRole("button", { name: "Hide line numbers" }).click();
  await expect(page.locator(".line-no")).toHaveCount(0);

  const expand = page.getByRole("button", { name: "Expand code" });
  await expect(expand).toBeVisible();
  const before = await page.locator(".code-scroll .code-line").count();
  await expand.click();
  await expect(
    page.getByRole("button", { name: "Collapse code" }),
  ).toBeVisible();
  const after = await page.locator(".code-scroll .code-line").count();
  expect(after).toBeGreaterThan(before);
});

test("API and accessibility tabs render documentation", async ({ page }) => {
  await page.goto("/#/tabs");
  await page.getByRole("tab", { name: "API" }).click();
  await expect(page.locator(".api-table").first()).toBeVisible();
  await page.getByRole("tab", { name: "Accessibility" }).click();
  await expect(page.locator(".a11y-panel")).toBeVisible();
});

test("component pages use one global Playground and a compact Quick view", async ({ page }) => {
  await page.goto("/#/button");
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toBeVisible();
  const globalTrigger = page.getByRole("button", { name: "Playground", exact: true });
  await expect(globalTrigger).toBeVisible();
  await expect(globalTrigger).toHaveAttribute("aria-controls", "playground-properties");
  await expect(page.locator(".topbar .playground-trigger")).toHaveCount(1);
  await expect(page.locator(".preview-block .playground-trigger")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Common components" })).toHaveCount(0);
  await expect(page.locator(".playground-popover")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Default", exact: true })).toBeVisible();
  await expect(page.locator(".playground-presets")).toHaveAttribute("aria-label", "Quick view variants");
  await expect(page.locator(".preset-chip")).not.toHaveCSS("border-radius", "999px");
  await expect(page.getByRole("heading", { name: "Variants" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "States" })).toHaveCount(0);

  const trigger = page.getByRole("button", { name: "Playground", exact: true });
  await trigger.click();
  const popover = page.getByRole("dialog", { name: "Playground properties" });
  await expect(page.locator(".topbar .playground-popover")).toHaveCount(0);
  await expect(page.locator(".topbar .playground-trigger")).toHaveAttribute("aria-expanded", "true");
  await expect(popover.getByText("Variant", { exact: true })).toBeVisible();
  await expect(popover.getByText("Size", { exact: true })).toBeVisible();

  await page.goto("/#/text-field");
  await expect(page.getByRole("button", { name: "Playground", exact: true })).toBeVisible();
  await expect(page.locator(".playground-presets-label")).toHaveText("Quick view");
  await expect(page.getByRole("button", { name: "Default", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Variants" })).toHaveCount(0);
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

test("viewer settings control theme, surface and viewport", async ({
  page,
}) => {
  await page.goto("/#/button");
  await page.locator("strata-viewer-settings .vs-toggle").click();
  const panel = page.locator(".vs-panel");
  await panel.getByLabel("Theme").selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await panel.getByLabel("Surface").selectOption("light");
  await expect(page.locator(".canvas")).toHaveAttribute("data-theme", "light");
  await panel.getByLabel("Surface").selectOption("grid");
  await expect(page.locator(".canvas")).toHaveClass(/canvas-grid/);
  await panel.getByLabel("Viewport").selectOption("mobile");
  await expect(page.locator(".preview-viewport")).toHaveClass(
    /viewport-mobile/,
  );
  // Preferences persist under the catalog-owned key.
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("strata-catalog-viewer") ?? "{}"),
  );
  expect(stored.theme).toBe("dark");
  expect(stored.surface).toBe("grid");
  expect(stored.viewport).toBe("mobile");
});

test("properties panel controls never overflow their field", async ({
  page,
}) => {
  await page.goto("/#/button");
  await page.getByRole("button", { name: "Playground", exact: true }).click();
  const overflowCount = await page.locator(".playground-popover .controls-panel").evaluate((el) => {
    const panel = el.getBoundingClientRect();
    return [...el.querySelectorAll("*")].filter((child) => {
      const r = child.getBoundingClientRect();
      return (
        r.width > 0 && (r.right > panel.right + 1 || r.left < panel.left - 1)
      );
    }).length;
  });
  expect(overflowCount).toBe(0);
});

test("quick view preset updates the shared live preview", async ({ page }) => {
  await page.goto("/#/button");
  const host = page.locator(".preview-stage > strata-button");
  await expect(host).toHaveJSProperty("variant", "outlined");
  await page.getByRole("button", { name: "filled", exact: true }).click();
  await expect(host).toHaveJSProperty("variant", "filled");
  // Global viewer preferences remain available regardless of component type.
  await page.locator("strata-viewer-settings .vs-toggle").click();
  await expect(page.locator(".vs-panel")).toBeVisible();
});

test("single-line form controls share one control height", async ({ page }) => {
  const measure = async (hash: string, selector: string) => {
    await page.goto(hash);
    return page
      .locator(selector)
      .first()
      .evaluate((host) => {
        const inner = host.shadowRoot?.querySelector(
          "input, select, .strata-field",
        );
        return inner ? inner.getBoundingClientRect().height : 0;
      });
  };
  const textField = await measure("/#/text-field", "strata-text-field");
  const select = await measure("/#/select", "strata-select");
  const searchField = await measure("/#/search-field", "strata-search-field");
  // All single-line field controls render the same 44px control box.
  for (const h of [textField, select, searchField]) {
    expect(Math.round(h)).toBe(44);
  }
});

test("global playground keeps a compact, persistent properties popover", async ({ page }) => {
  await page.goto("/#/card");
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toBeVisible();
  const trigger = page.getByRole("button", { name: "Playground", exact: true });
  await trigger.click();
  const popover = page.getByRole("dialog", { name: "Playground properties" });
  await expect(popover).toBeVisible();
  await expect(popover.getByText("CONFIGURATION", { exact: true })).toHaveCount(0);
  await expect(popover.getByText("Elevation", { exact: true })).toHaveCount(0);
  await expect(popover.getByText("Font group", { exact: true })).toHaveCount(0);
  await expect(popover.getByText("Monochrome images", { exact: true })).toBeVisible();

  // Presets live outside the popover; using them must not light-dismiss it.
  await page.getByRole("button", { name: "Default", exact: true }).click();
  await expect(popover).toBeVisible();
  await expect(page.locator(".preview-stage > strata-card")).toHaveJSProperty("is_media", false);

  await popover.getByRole("button", { name: "Close properties" }).click();
  await expect(popover).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(popover).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popover).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("Overlay playground exposes monochrome and theme instead of dark image treatment", async ({ page }) => {
  await page.goto("/#/overlay");
  const root = page.locator(".preview-stage > strata-overlay .strata-overlay");
  await expect(root).toHaveClass(/strata-overlay--monochrome/);
  await expect(root).toHaveClass(/strata-overlay--theme-auto/);
  await page.getByRole("button", { name: "Playground", exact: true }).click();
  const popover = page.getByRole("dialog", { name: "Playground properties" });
  await expect(popover.getByText("Monochrome images", { exact: true })).toBeVisible();
  await expect(popover.getByText("Theme", { exact: true })).toBeVisible();
  await expect(popover.getByText("Dark image treatment", { exact: true })).toHaveCount(0);
});
