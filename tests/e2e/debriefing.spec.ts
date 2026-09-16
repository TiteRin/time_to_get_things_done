import { expect, test, type Page } from '@playwright/test'

const START = new Date('2026-09-15T10:00:00')

/** Fakes `Date.now()` only: `clock.install()` freezes the timers Dexie's queries rely on */
const elapsed = (page: Page, seconds: number) =>
  page.clock.setFixedTime(new Date(START.getTime() + seconds * 1000))

/** Reads a task straight from IndexedDB, bypassing the UI */
const storedTask = (page: Page, name: string) =>
  page.evaluate(
    (name) =>
      new Promise<{ expectedDuration?: number; perceivedDifficulty?: string } | undefined>(
        (resolve, reject) => {
          const open = indexedDB.open('ttgtd')
          open.onerror = () => reject(open.error)
          open.onsuccess = () => {
            const request = open.result.transaction('tasks').objectStore('tasks').getAll()
            request.onsuccess = () => {
              open.result.close()
              resolve(request.result.find((task: { name: string }) => task.name === name))
            }
          }
        },
      ),
    name,
  )

test('debriefs a session and corrects a task from it', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Sélectionner Faire la vaisselle' }).click()
  await page.getByRole('button', { name: 'Sélectionner Faire les litières' }).click()
  await elapsed(page, 0)
  await page.getByRole('button', { name: 'Démarrer' }).click()

  await page.getByRole('button', { name: 'Démarrer' }).click()
  await elapsed(page, 240)
  await page.getByRole('button', { name: 'Pause' }).click()
  await elapsed(page, 300)
  await page.getByRole('button', { name: 'Reprendre' }).click()
  await elapsed(page, 720)
  await page.getByRole('button', { name: 'Tâche suivante' }).click()

  await elapsed(page, 730)
  await page.getByRole('button', { name: 'Démarrer' }).click()
  await elapsed(page, 1030)
  await page.getByRole('button', { name: 'Tâche suivante' }).click()

  await expect(page.getByRole('heading', { name: 'Bravo !' })).toBeVisible()
  await expect(page.getByText('2 tâches effectuées sur 2, temps passé : 17 minutes')).toBeVisible()

  const timeline = page.getByRole('list', { name: 'Timeline' })
  await timeline.getByRole('button', { name: 'Faire la vaisselle' }).first().click()
  const sheet = page.getByRole('dialog', { name: 'Faire la vaisselle' })
  await expect(sheet).toContainText('Durée totale12 min')
  await expect(sheet).toContainText('Durée effective11 min')

  await sheet.getByRole('button', { name: 'Modifier la durée prévue' }).click()
  await sheet.getByRole('button', { name: 'Utiliser 11 min' }).click()
  await expect(sheet.getByRole('button', { name: 'Modifier la durée prévue' })).toHaveText('11 min')
  expect((await storedTask(page, 'Faire la vaisselle'))?.expectedDuration).toBe(11)

  await sheet.getByRole('button', { name: 'Renseigner la difficulté' }).click()
  await sheet
    .getByRole('group', { name: 'Difficulté perçue' })
    .getByRole('button', { name: 'Difficile' })
    .click()
  await expect(sheet.getByRole('button', { name: 'Renseigner la difficulté' })).toHaveText(
    'Difficile',
  )
  expect((await storedTask(page, 'Faire la vaisselle'))?.perceivedDifficulty).toBe('hard')

  await sheet.getByRole('button', { name: 'Fermer le détail' }).click()
  await page.getByRole('button', { name: 'Fermer', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Choisir les tâches' })).toBeVisible()
})
