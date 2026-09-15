import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },
    // Emulated on Chromium: WebKit needs system libs (`sudo npx playwright install-deps webkit`)
    { name: 'iphone-14', use: { ...devices['iPhone 14'], browserName: 'chromium' } },
  ],
  webServer: {
    // The production build, not the dev server: Vite's dependency pre-bundling
    // triggers a full page reload mid-test, which wipes the React state
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
})
