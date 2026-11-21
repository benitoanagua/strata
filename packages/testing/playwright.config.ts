import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./visual",
  use: {
    baseURL: "http://127.0.0.1:5174",
    colorScheme: "light",
    viewport: { width: 1280, height: 900 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm --filter @strata/catalog-svelte dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
