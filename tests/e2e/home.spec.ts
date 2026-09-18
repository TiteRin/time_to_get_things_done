import { expect, test } from '@playwright/test'

test('offers to generate a list or time a task, and links to configuration', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'Générer une liste' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Chronométrer une tâche' })).toBeVisible()

  await page.getByRole('link', { name: 'Configuration' }).click()
  await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible()
})

test('navigates to the generation screen', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Générer une liste' }).click()
  await expect(page.getByRole('heading', { name: 'Choisir les tâches' })).toBeVisible()
})
