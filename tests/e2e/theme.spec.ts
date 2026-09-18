import { expect, test } from '@playwright/test'

test('toggling the theme persists across a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')

  await expect(page.locator('html')).toHaveClass(/dark/)
  const toLight = page.getByRole('button', { name: 'Passer en thème clair' })
  await expect(toLight).toBeVisible()

  await toLight.click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await expect(page.getByRole('button', { name: 'Passer en thème sombre' })).toBeVisible()

  await page.reload()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await expect(page.getByRole('button', { name: 'Passer en thème sombre' })).toBeVisible()
})

test('follows the system preference when no theme was chosen', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')

  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await expect(page.getByRole('button', { name: 'Passer en thème sombre' })).toBeVisible()
})
