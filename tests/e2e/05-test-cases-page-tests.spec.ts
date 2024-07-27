import { test, expect } from '@playwright/test'
import { HomePage } from '../../src/pages/homePage'
import { ShopMenu } from '../../src/components/shopMenu'
import { TestCasesPage } from '../../src/pages/testCasesPage'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)

  await page.goto('/')
  await homePage.featuredItems.first().waitFor()
})

test('Verify Test Cases Page', async ({ page }) => {
  const shopMenu = new ShopMenu(page)
  const testCasesPage = new TestCasesPage(page)

  await shopMenu.testCasesLink.click()
  await expect(testCasesPage.testCasesHeader).toBeVisible()

  const panelGroups = await testCasesPage.panelGroup.all()

  for (const panelGroup of panelGroups) {
    await expect(panelGroup).toBeVisible()
  }
})
