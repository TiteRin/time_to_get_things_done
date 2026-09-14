/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.join(dirname, 'src') },
  },
  test: {
    // Restore spies/mocks between tests so a stubbed console.error can't leak
    restoreMocks: true,
    projects: [
      ...(['units', 'integration'] as const).map((name) => ({
        extends: true as const,
        test: {
          name,
          environment: 'jsdom',
          include: [`tests/${name}/**/*.test.{ts,tsx}`],
          setupFiles: ['./tests/setup.ts'],
        },
      })),
      {
        // Runs every story as a smoke test in a real browser
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
