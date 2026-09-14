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
  // Freeze time so only runFor() moves it and recorded timestamps are deterministic
  await page.clock.pauseAt(new Date('2026-09-14T10:01:00'))
})

test('runs a session with taps, a swipe and the top menu', async ({ page }) => {
  await expect(heading(page, 'Passer le balai dans le salon')).toBeVisible()
  await expect(page.getByText('1 / 9')).toBeVisible()

  await page.getByRole('button', { name: 'Démarrer' }).click()
  await expect(page.getByText('En cours')).toBeVisible()

  await page.clock.runFor('01:00')
  await page.getByRole('button', { name: 'Pause' }).click()
  await expect(page.getByText('En pause')).toBeVisible()

  await page.clock.runFor('00:30')
  await page.getByRole('button', { name: 'Reprendre' }).click()

  await page.clock.runFor('02:00')
  await page.getByRole('button', { name: 'Tâche suivante' }).click()
  await expect(heading(page, 'Passer le balai dans la cuisine')).toBeVisible()
  await expect(page.getByText('Touchez pour commencer')).toBeVisible()

  await page.clock.runFor('00:10')
  await swipeUp(page)
  await expect(heading(page, 'Nettoyer le sol du salon')).toBeVisible()

  await page.getByRole('button', { name: 'Afficher le menu' }).click()
  await page.getByRole('button', { name: 'Annuler' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(heading(page, 'Nettoyer le sol du salon')).toBeVisible()

  await page.clock.runFor('00:05')
  await page.getByRole('button', { name: 'Afficher le menu' }).click()
  await page.getByRole('button', { name: 'Terminer' }).click()

  await expect(heading(page, 'Session terminée')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Timeline' }).getByRole('listitem')).toHaveText([
    '00:00Démarrer · Passer le balai dans le salon',
    '01:00Pause · Passer le balai dans le salon',
    '01:30Reprise · Passer le balai dans le salon',
    '03:30Tâche faite · Passer le balai dans le salon',
    '03:40Tâche faite · Passer le balai dans la cuisine',
    '03:45Session terminée · Nettoyer le sol du salon',
  ])
})

test('ends the session after the last task', async ({ page }) => {
  for (let i = 1; i <= 9; i++) {
    await expect(page.getByText(`${i} / 9`)).toBeVisible()
    await page.getByRole('button', { name: 'Tâche suivante' }).click()
  }

  await expect(heading(page, 'Session terminée')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Timeline' }).getByRole('listitem')).toHaveCount(9)
})
