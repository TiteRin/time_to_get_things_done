import { expect, test, type Page } from '@playwright/test'

const heading = (page: Page, name: string) => page.getByRole('heading', { name, exact: true })

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
  await page.clock.install({ time: new Date('2026-09-14T10:00:00') })
  await page.goto('/')
  // Build the session list on the generation screen
  for (const name of ['Nettoyer les fontaines', 'Faire la vaisselle', 'Faire les litières']) {
    await page.getByRole('button', { name: `Sélectionner ${name}` }).click()
  }
  await page.getByRole('button', { name: 'Démarrer' }).click()
  // Freeze time so only runFor() moves it and recorded timestamps stay deterministic
  await page.clock.pauseAt(new Date('2026-09-14T10:01:00'))
})

test('runs a session with taps, a swipe and the top menu', async ({ page }) => {
  await expect(heading(page, 'Nettoyer les fontaines')).toBeVisible()
  await expect(page.getByText('1 / 3')).toBeVisible()

  await page.getByRole('button', { name: 'Démarrer' }).click()
  await expect(page.getByText('En cours')).toBeVisible()

  await page.clock.runFor('01:00')
  await page.getByRole('button', { name: 'Pause' }).click()
  await expect(page.getByText('En pause')).toBeVisible()

  await page.clock.runFor('00:30')
  await page.getByRole('button', { name: 'Reprendre' }).click()

  await page.clock.runFor('02:00')
  await page.getByRole('button', { name: 'Tâche suivante' }).click()
  await expect(heading(page, 'Faire la vaisselle')).toBeVisible()
  await expect(page.getByText('Touchez pour commencer')).toBeVisible()

  await page.clock.runFor('00:10')
  await swipeUp(page)
  await expect(heading(page, 'Faire les litières')).toBeVisible()

  await page.getByRole('button', { name: 'Afficher le menu' }).click()
  await page.getByRole('button', { name: 'Annuler' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(heading(page, 'Faire les litières')).toBeVisible()

  await page.clock.runFor('00:05')
  await page.getByRole('button', { name: 'Afficher le menu' }).click()
  await page.getByRole('button', { name: 'Terminer' }).click()

  await expect(heading(page, 'Session terminée')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Timeline' }).getByRole('listitem')).toHaveText([
    '00:00Démarrer · Nettoyer les fontaines',
    '01:00Pause · Nettoyer les fontaines',
    '01:30Reprise · Nettoyer les fontaines',
    '03:30Tâche faite · Nettoyer les fontaines',
    '03:40Tâche faite · Faire la vaisselle',
    '03:45Session terminée · Faire les litières',
  ])
})

test('ends the session after the last task', async ({ page }) => {
  for (let i = 1; i <= 3; i++) {
    await expect(page.getByText(`${i} / 3`)).toBeVisible()
    await page.getByRole('button', { name: 'Tâche suivante' }).click()
  }

  await expect(heading(page, 'Session terminée')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Timeline' }).getByRole('listitem')).toHaveCount(3)
})
