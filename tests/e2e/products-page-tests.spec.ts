import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { ProductsPage } from './pages/productsPage'
import { ProductDetailsPage } from './pages/productDetailsPage'
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)
  const productsPage = new ProductsPage(page)

  await page.goto('/')
  await expect(homePage.productImage.first()).toBeVisible()
  await shopMenu.productsLink.click()
  await expect(productsPage.allProductsHeader).toBeVisible()
  await expect(productsPage.productImageWrapper.first()).toBeVisible()
})

test('Verify All Products and product detail page', async ({ page }) => {
  const productDetailsPage = new ProductDetailsPage(page)
  const productsPage = new ProductsPage(page)

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

test('Search Product', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const productCount: number = await productsPage.productImageWrapper.count()
  const randomIndex: number = faker.number.int({ min: 0, max: productCount })
  const productNameText: string = await productsPage.productName.nth(randomIndex).innerText()

  await productsPage.searchInput.fill(productNameText)
  await productsPage.submitSearchButton.click()
  await expect(productsPage.searchedProductsHeader).toBeVisible()

  const productNames = await productsPage.productName.all()

  for (const productName of productNames) {
    await expect(productName).toHaveText(productNameText, { useInnerText: true })
  }
})
