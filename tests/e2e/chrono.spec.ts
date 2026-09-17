import { expect, test, type Page } from '@playwright/test'

const START = new Date('2026-09-14T10:00:00')

/** `setFixedTime` only fakes `Date.now()`; `install()`'s frozen timers would stall Dexie's queries */
const elapsed = (page: Page, seconds: number) =>
  page.clock.setFixedTime(new Date(START.getTime() + seconds * 1000))

test('times a task, pauses it, and replaces its expected duration with the total time', async ({
  page,
}) => {
  await page.goto('/')
  await elapsed(page, 0)
  await page.getByRole('button', { name: 'Chronométrer une tâche' }).click()
  await page.getByRole('button', { name: 'Chronométrer Faire la vaisselle' }).click()

  await expect(page.getByRole('heading', { name: 'Faire la vaisselle' })).toBeVisible()
  await expect(page.getByText('00:00')).toBeVisible()

  await page.getByRole('button', { name: 'Démarrer' }).click()
  await expect(page.getByText('En cours')).toBeVisible()

  await elapsed(page, 90)
  await page.getByRole('button', { name: 'Pause' }).click()
  await expect(page.getByText('01:30')).toBeVisible()
  await expect(page.getByText('En pause')).toBeVisible()

  await elapsed(page, 150) // 60s paused, not counted in the effective time
  await page.getByRole('button', { name: 'Reprendre' }).click()
  await expect(page.getByText('01:30')).toBeVisible()

  await elapsed(page, 170)
  await page.getByRole('button', { name: 'Terminer' }).click()

  await expect(page.getByText('Mettre à jour « Faire la vaisselle » ?')).toBeVisible()
  await expect(page.getByText('Aucune durée prévue pour le moment')).toBeVisible()
  // Total: 170s wall-clock -> 3 min. Effective: 90 + 20 = 110s -> 2 min.
  await page.getByRole('button', { name: 'Remplacer par 3 min (temps total)' }).click()

  await expect(page.getByRole('button', { name: 'Générer une liste' })).toBeVisible()

  await page.getByRole('link', { name: 'Configuration' }).click()
  await page.getByText('Faire la vaisselle').click()
  await expect(page.getByRole('button', { name: '3 min', pressed: true })).toBeVisible()
})

test('cancels without saving anything', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Chronométrer une tâche' }).click()
  await page.getByRole('button', { name: 'Chronométrer Faire les litières' }).click()
  await page.getByRole('button', { name: 'Annuler' }).click()

  await expect(page.getByRole('button', { name: 'Générer une liste' })).toBeVisible()

  await page.getByRole('link', { name: 'Configuration' }).click()
  await page.getByText('Faire les litières').click()
  await expect(
    page.getByRole('group', { name: 'Durée prévue' }).getByRole('button', { pressed: true }),
  ).toHaveCount(0)
})
