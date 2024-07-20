import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { ProductsPage } from './pages/productsPage'
import { ProductDetailsPage } from './pages/productDetailsPage'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)

  await page.goto('/')
  await expect(homePage.productImage.first()).toBeVisible()
})

test('Verify All Products and product detail page', async ({ page }) => {
  const shopMenu = new ShopMenu(page)
  const productsPage = new ProductsPage(page)
  const productDetailsPage = new ProductDetailsPage(page)

  await shopMenu.productsLink.click()
  await expect(productsPage.allProductsHeader).toBeVisible()
  await expect(productsPage.productImageWrapper.first()).toBeVisible()

  const productNameText: string = await productsPage.productName.first().innerText()
  const productPriceText: string = await productsPage.productPrice.first().innerText()

  await productsPage.viewProductLink.first().click()
  await expect(page).toHaveURL('/product_details/1')
  await expect(productDetailsPage.productName).toHaveText(productNameText, { useInnerText: true })
  await expect(productDetailsPage.productPrice).toHaveText(productPriceText, { useInnerText: true })
  await expect(productDetailsPage.productCategory.getByText('Women > Tops')).toBeVisible()
  await expect(productDetailsPage.productAvailability.getByText('In Stock')).toBeVisible()
  await expect(productDetailsPage.productCondition.getByText('New')).toBeVisible()
  await expect(productDetailsPage.productBrand.getByText('Polo')).toBeVisible()
})
