import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { ProductsPage } from './pages/productsPage'
import { ProductDetailsPage } from './pages/productDetailsPage'
import { CartPage } from './pages/cartPage'
import { faker } from '@faker-js/faker'
import { LeftSidebar } from './pages/leftSidebar'
import { extractCategoryName } from './utils/helpers'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)
  const productsPage = new ProductsPage(page)

  await page.goto('/')
  await homePage.productImageWrapper.first().waitFor()
  await shopMenu.productsLink.click()
  await expect(productsPage.allProductsHeader).toBeVisible()
  await productsPage.productImageWrapper.first().waitFor()
})

test('Verify All Products and product detail page', async ({ page }) => {
  const productDetailsPage = new ProductDetailsPage(page)
  const productsPage = new ProductsPage(page)

  const productName: string = await productsPage.productName.first().innerText()
  const productPrice: string = await productsPage.productPrice.first().innerText()

  await productsPage.viewProductLink.first().click()
  await expect(page).toHaveURL('/product_details/1')
  await expect(productDetailsPage.productName).toHaveText(productName, { useInnerText: true })
  await expect(productDetailsPage.productPrice).toHaveText(productPrice, { useInnerText: true })
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

test('Add Products in Cart', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const cartPage = new CartPage(page)
  const productQuantity = '1'
  const firstProductName: string = await productsPage.productName.first().innerText()
  const firstProductPrice: string = await productsPage.productPrice.first().innerText()
  const secondProductName: string = await productsPage.productName.nth(1).innerText()
  const secondProductPrice: string = await productsPage.productPrice.nth(1).innerText()

  await productsPage.productAddToCartLink.first().hover()
  await productsPage.overlayAddToCartLink.first().click()
  await productsPage.continueShoppingButton.click()
  await productsPage.productAddToCartLink.nth(1).hover()
  await productsPage.overlayAddToCartLink.nth(1).click()
  await productsPage.viewCartLink.click()
  await expect(cartPage.cartProducts).toHaveCount(2)

  await expect(cartPage.productNames.first()).toHaveText(firstProductName, {
    useInnerText: true,
  })

  await expect(cartPage.productNames.nth(1)).toHaveText(secondProductName, {
    useInnerText: true,
  })

  await expect(cartPage.productPrices.first()).toHaveText(firstProductPrice, {
    useInnerText: true,
  })

  await expect(cartPage.productPrices.nth(1)).toHaveText(secondProductPrice, {
    useInnerText: true,
  })

  await expect(cartPage.productQuantities.first()).toHaveText(productQuantity, {
    useInnerText: true,
  })

  await expect(cartPage.productQuantities.nth(1)).toHaveText(productQuantity, {
    useInnerText: true,
  })

  await expect(cartPage.productTotalPrices.first()).toHaveText(firstProductPrice, {
    useInnerText: true,
  })

  await expect(cartPage.productTotalPrices.nth(1)).toHaveText(secondProductPrice, {
    useInnerText: true,
  })
})

test('View & Cart Brand Products', async ({ page }) => {
  const leftSidebar = new LeftSidebar(page)
  const productsPage = new ProductsPage(page)

  const brandNameLocators = [
    leftSidebar.poloCategory,
    leftSidebar.hmCategory,
    leftSidebar.madameCategory,
    leftSidebar.mastHarborCategory,
    leftSidebar.babyhubCategory,
    leftSidebar.allenSollyJuniorCategory,
    leftSidebar.kookieKidsCategory,
    leftSidebar.bibaCategory,
  ]

  const firstRandomBrandNameLocator = faker.helpers.arrayElement(brandNameLocators)

  const secondRandomBrandNameLocator = faker.helpers.arrayElement(
    brandNameLocators.filter((brandName) => brandName !== firstRandomBrandNameLocator)
  )

  await expect(leftSidebar.brandProducts).toBeVisible()

  const firstRandomBrandNameText = extractCategoryName(
    await firstRandomBrandNameLocator.innerText()
  )

  console.log(`First: ${firstRandomBrandNameText}`)

  await firstRandomBrandNameLocator.click()

  await expect(
    page.getByRole('heading', { name: `Brand - ${firstRandomBrandNameText} Products` })
  ).toBeVisible()

  const firstAllBrandProducts = await productsPage.productImageWrapper.all()

  for (const firstBrandProduct of firstAllBrandProducts) {
    await expect(firstBrandProduct).toBeVisible()
  }

  const secondRandomBrandNameText = extractCategoryName(
    await secondRandomBrandNameLocator.innerText()
  )

  console.log(`Second: ${firstRandomBrandNameText}`)

  await secondRandomBrandNameLocator.click()

  await expect(
    page.getByRole('heading', { name: `Brand - ${secondRandomBrandNameText} Products` })
  ).toBeVisible()

  const secondAllBrandProducts = await productsPage.productImageWrapper.all()

  for (const secondBrandProduct of secondAllBrandProducts) {
    await expect(secondBrandProduct).toBeVisible()
  }
})
