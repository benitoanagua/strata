import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./visual",
  use: {
    baseURL: "http://127.0.0.1:5174",
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      "pnpm --filter @strata/catalog preview --host 127.0.0.1 --port 5174 --strictPort",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
