import { expect, test, type Page } from '@playwright/test'

const select = (page: Page, name: string) =>
  page.getByRole('button', { name: `Sélectionner ${name}` }).click()

/** Drags one sortable handle onto another with raw mouse moves (dnd-kit PointerSensor) */
async function dragHandle(page: Page, fromTask: string, toTask: string) {
  const from = (await page.getByRole('button', { name: `Déplacer ${fromTask}` }).boundingBox())!
  const to = (await page.getByRole('button', { name: `Déplacer ${toTask}` }).boundingBox())!
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 10 })
  await page.mouse.up()
  // dnd-kit stops propagation of every click for 50ms after a drop (`setTimeout(…, 50)`
  // in its PointerSensor). A human can't tap that fast, but Playwright can.
  await page.waitForTimeout(100)
}

test('builds a list, reorders it, and finds it back on the next visit', async ({ page }) => {
  await page.goto('/')

  await select(page, 'Nettoyer les fontaines')
  await select(page, 'Faire la vaisselle')
  await select(page, 'Faire les litières')
  await expect(
    page.getByText('3 tâches sélectionnées, durée approximative ~ 0 minutes'),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Étape suivante' }).click()
  await expect(page.getByRole('heading', { name: 'Ordonner les tâches' })).toBeVisible()

  await dragHandle(page, 'Faire les litières', 'Nettoyer les fontaines')
  await expect(page.getByRole('listitem')).toHaveText([
    /Faire les litières/,
    /Nettoyer les fontaines/,
    /Faire la vaisselle/,
  ])

  await page.getByRole('button', { name: 'Retirer Nettoyer les fontaines' }).click()
  await expect(page.getByText(/2 tâches sélectionnées/)).toBeVisible()

  await page.getByRole('button', { name: 'Démarrer' }).click()
  await expect(page.getByRole('heading', { name: 'Faire les litières' })).toBeVisible()
  await expect(page.getByText('1 / 2')).toBeVisible()

  // The last list is restored on the next visit
  await page.goto('/')
  await expect(page.getByText(/2 tâches sélectionnées/)).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Désélectionner Faire les litières' }),
  ).toBeVisible()
})

test('cannot start with an empty selection and redirects to the generation screen', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Démarrer' })).toBeDisabled()
  await expect(page.getByRole('heading', { name: 'Salon' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Étape suivante' })).toBeDisabled()

  // Reaching /execution without a saved list goes back to the generation screen
  await page.goto('/execution')
  await expect(page.getByRole('heading', { name: 'Choisir les tâches' })).toBeVisible()
})
