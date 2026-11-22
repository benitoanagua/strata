import type { Page } from "@playwright/test";

/**
 * Serve empty CSS for Google Fonts requests so visual tests never depend on
 * the network: components render with the fixed fallback stack.
 */
export async function stubRemoteFonts(page: Page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
    route.fulfill({ status: 200, contentType: "text/css", body: "" }),
  );
}
