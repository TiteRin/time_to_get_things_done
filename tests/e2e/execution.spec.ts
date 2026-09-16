import { expect, test, type Page } from '@playwright/test'

const heading = (page: Page, name: string) => page.getByRole('heading', { name, exact: true })

const START = new Date('2026-09-14T10:00:00')

/**
 * Moves the recorded time to `seconds` after the session start. `setFixedTime` only
 * fakes `Date.now()`, unlike `install()`, whose frozen timers stall Dexie's queries.
 */
const elapsed = (page: Page, seconds: number) =>
  page.clock.setFixedTime(new Date(START.getTime() + seconds * 1000))

async function swipeUp(page: Page) {
  const viewport = page.viewportSize()!
  const x = viewport.width / 2
  const main = page.getByRole('main')
  await main.dispatchEvent('pointerdown', {
    clientX: x,
    clientY: viewport.height * 0.6,
    pointerId: 1,
  })
  await main.dispatchEvent('pointerup', {
    clientX: x,
    clientY: viewport.height * 0.3,
    pointerId: 1,
  })
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // Build the session list on the generation screen
  for (const name of ['Nettoyer les fontaines', 'Faire la vaisselle', 'Faire les litières']) {
    await page.getByRole('button', { name: `Sélectionner ${name}` }).click()
  }
  await elapsed(page, 0)
  await page.getByRole('button', { name: 'Démarrer' }).click()
})

test('runs a session with taps, a swipe and the top menu', async ({ page }) => {
  await expect(heading(page, 'Nettoyer les fontaines')).toBeVisible()
  await expect(page.getByText('1 / 3')).toBeVisible()

  await page.getByRole('button', { name: 'Démarrer' }).click()
  await expect(page.getByText('En cours')).toBeVisible()

  await elapsed(page, 60)
  await page.getByRole('button', { name: 'Pause' }).click()
  await expect(page.getByText('En pause')).toBeVisible()

  await elapsed(page, 90)
  await page.getByRole('button', { name: 'Reprendre' }).click()

  await elapsed(page, 210)
  await page.getByRole('button', { name: 'Tâche suivante' }).click()
  await expect(heading(page, 'Faire la vaisselle')).toBeVisible()
  await expect(page.getByText('Touchez pour commencer')).toBeVisible()

  await elapsed(page, 220)
  await swipeUp(page)
  await expect(heading(page, 'Faire les litières')).toBeVisible()

  await page.getByRole('button', { name: 'Afficher le menu' }).click()
  await page.getByRole('button', { name: 'Annuler' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(heading(page, 'Faire les litières')).toBeVisible()

  await elapsed(page, 225)
  await page.getByRole('button', { name: 'Afficher le menu' }).click()
  await page.getByRole('button', { name: 'Terminer' }).click()

  await expect(heading(page, 'Bravo !')).toBeVisible()
  await expect(page.getByText('1 tâche effectuée sur 3, temps passé : 4 minutes')).toBeVisible()
})

test('ends the session after the last task', async ({ page }) => {
  for (let i = 1; i <= 3; i++) {
    await expect(page.getByText(`${i} / 3`)).toBeVisible()
    await page.getByRole('button', { name: 'Tâche suivante' }).click()
  }

  // Nothing was ever started: the debriefing offers to run the list again
  await expect(heading(page, 'Aucune tâche effectuée')).toBeVisible()
  await expect(page.getByText('0 tâche effectuée sur 3, temps passé : 0 minute')).toBeVisible()
})
