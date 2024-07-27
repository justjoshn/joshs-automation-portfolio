import { test, expect } from '@playwright/test'
import { HomePage } from '../../src/pages/homePage'
import { ShopMenu } from '../../src/components/shopMenu'
import { SubscriptionWidget } from '../../src/components/subscriptionWidget'
import { userInfoFactory } from '../../src/factories/userInfo'

const randomUserData = userInfoFactory()

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)

  await page.goto('/')
  await homePage.featuredItems.first().waitFor()
  await shopMenu.cartLink.click()
})

test('Verify Subscription in cart page', async ({ page }) => {
  const subscriptionWidget = new SubscriptionWidget(page)

  await subscriptionWidget.footerWidget.scrollIntoViewIfNeeded()
  await expect(subscriptionWidget.subscriptionHeader).toBeVisible()
  await subscriptionWidget.emailAddressInput.fill(randomUserData.email)
  await subscriptionWidget.submitButton.click()
  await expect(subscriptionWidget.successSubscribe).not.toHaveClass('hide')
  await expect(subscriptionWidget.successfulAlert).toBeVisible()
})
