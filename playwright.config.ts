import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./testing-examples/e2e/automated",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
});
