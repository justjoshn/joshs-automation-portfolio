import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { TestCasesPage } from './pages/testCasesPage'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)

  await page.goto('/')
  await expect(homePage.productImage.first()).toBeVisible()
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
