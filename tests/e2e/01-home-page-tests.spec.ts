import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { SubscriptionWidget } from './pages/subscriptionWidget'
import { ProductDetailsPage } from './pages/productDetailsPage'
import { CartPage } from './pages/cartPage'
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)

  await page.goto('/')
  await homePage.productImageWrapper.first().waitFor()
})

test('Verify Subscription in home page', async ({ page }) => {
  const subscriptionWidget = new SubscriptionWidget(page)
  const randomEmail = faker.internet.email()

  await subscriptionWidget.footerWidget.scrollIntoViewIfNeeded()
  await expect(subscriptionWidget.subscriptionHeader).toBeVisible()
  await subscriptionWidget.emailAddressInput.fill(randomEmail)
  await subscriptionWidget.submitButton.click()
  await expect(subscriptionWidget.successSubscribe).not.toHaveClass('hide')
  await expect(subscriptionWidget.successfulAlert).toBeVisible()
})

test('Verify Product quantity in Cart', async ({ page }) => {
  const cartPage = new CartPage(page)
  const homePage = new HomePage(page)
  const productDetailsPage = new ProductDetailsPage(page)
  const productCount: number = await homePage.productImageWrapper.count()
  const randomIndex = faker.number.int({ min: 0, max: productCount })

  await homePage.viewProductLinks.nth(randomIndex).click()
  await expect(productDetailsPage.productInformation).toBeVisible()
  await productDetailsPage.quantityInput.clear()
  await productDetailsPage.quantityInput.fill('4')
  await productDetailsPage.addToCartButton.click()
  await productDetailsPage.viewCartLink.click()
  await expect(cartPage.productQuantities).toHaveText('4', { useInnerText: true })
})
