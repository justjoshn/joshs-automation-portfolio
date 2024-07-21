import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { SubscriptionWidget } from './pages/subscriptionWidget'
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)

  await page.goto('/')
  await expect(homePage.productImage.first()).toBeVisible()
  
  await shopMenu.cartLink.click()
})

test('Verify Subscription in cart page', async ({ page }) => {
  const subscriptionWidget = new SubscriptionWidget(page)
  const randomEmail = faker.internet.email()

  await subscriptionWidget.footerWidget.scrollIntoViewIfNeeded()
  await expect(subscriptionWidget.subscriptionHeader).toBeVisible()
  await subscriptionWidget.emailAddressInput.fill(randomEmail)
  await subscriptionWidget.submitButton.click()
  await expect(subscriptionWidget.successSubscribe).not.toHaveClass('hide')
  await expect(subscriptionWidget.successfulAlert).toBeVisible()
})
