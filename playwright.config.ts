import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 1,
  use: { baseURL: "http://127.0.0.1:3100", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run dev -- -p 3100",
    url: "http://127.0.0.1:3100/ar",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
