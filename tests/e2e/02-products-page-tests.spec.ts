import { test, expect } from '@playwright/test'
import { HomePage } from '../../src/pages/homePage'
import { ShopMenu } from '../../src/components/shopMenu'
import { ProductsPage } from '../../src/pages/productsPage'
import { ProductDetailsPage } from '../../src/pages/productDetailsPage'
import { CartPage } from '../../src/pages/cartPage'
import { faker } from '@faker-js/faker'
import { LeftSidebar } from '../../src/components/leftSidebar'
import { extractCategoryName } from '../../src/utils/helpers'
import { SignupLoginPage } from '../../src/pages/signupLoginPage'
import { userInfoFactory } from '../../src/factories/userInfo'
import { textContentFactory } from '../../src/factories/textContent'
import { realUserData } from '../../src/testData/realData'

const randomUserData = userInfoFactory()
const randomTextContent = textContentFactory()

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)
  const productsPage = new ProductsPage(page)

  await page.goto('/')
  await homePage.featuredItems.first().waitFor()
  await shopMenu.productsLink.click()
  await expect(productsPage.allProductsHeader).toBeVisible()
  await productsPage.featuredItems.first().waitFor()
})

test('Verify All Products and product detail page', async ({ page }) => {
  const productDetailsPage = new ProductDetailsPage(page)
  const productsPage = new ProductsPage(page)
  const productName: string = await productsPage.productName.first().innerText()
  const productPrice: string = await productsPage.productPrice.first().innerText()

  await productsPage.viewProductLink.first().click()
  await expect(page).toHaveURL('/product_details/1')

  await expect(productDetailsPage.productName).toHaveText(productName, {
    useInnerText: true,
  })

  await expect(productDetailsPage.productPrice).toHaveText(productPrice, {
    useInnerText: true,
  })

  await expect(productDetailsPage.productCategory.getByText('Women > Tops')).toBeVisible()
  await expect(productDetailsPage.productAvailability.getByText('In Stock')).toBeVisible()
  await expect(productDetailsPage.productCondition.getByText('New')).toBeVisible()
  await expect(productDetailsPage.productBrand.getByText('Polo')).toBeVisible()
})

test('Search Product', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const productCount: number = await productsPage.featuredItems.count()
  const randomIndex: number = faker.number.int({ min: 0, max: productCount - 1 })
  const productNameText: string = await productsPage.productName.nth(randomIndex).innerText()

  await productsPage.searchInput.fill(productNameText)
  await productsPage.submitSearchButton.click()
  await expect(productsPage.searchedProductsHeader).toBeVisible()

  const productNames = await productsPage.productName.all()

  for (const productName of productNames) {
    await expect(productName).toHaveText(productNameText, {
      useInnerText: true,
    })
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

  await productsPage.featuredItemAddToCartLink.first().hover()
  await productsPage.featuredItemAddToCartLinkOverlay.first().click()
  await productsPage.continueShoppingButton.click()
  await productsPage.featuredItemAddToCartLink.nth(1).hover()
  await productsPage.featuredItemAddToCartLinkOverlay.nth(1).click()
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
    brandNameLocators.filter(brandName => brandName !== firstRandomBrandNameLocator)
  )

  await expect(leftSidebar.brandProducts).toBeVisible()

  const firstRandomBrandNameText = extractCategoryName(
    await firstRandomBrandNameLocator.innerText()
  )

  await firstRandomBrandNameLocator.click()

  await expect(
    page.getByRole('heading', {
      name: `Brand - ${firstRandomBrandNameText} Products`,
    })
  ).toBeVisible()

  const firstAllBrandProducts = await productsPage.featuredItems.all()

  for (const firstBrandProduct of firstAllBrandProducts) {
    await expect(firstBrandProduct).toBeVisible()
  }

  const secondRandomBrandNameText = extractCategoryName(
    await secondRandomBrandNameLocator.innerText()
  )

  await secondRandomBrandNameLocator.click()

  await expect(
    page.getByRole('heading', {
      name: `Brand - ${secondRandomBrandNameText} Products`,
    })
  ).toBeVisible()

  const secondAllBrandProducts = await productsPage.featuredItems.all()

  for (const secondBrandProduct of secondAllBrandProducts) {
    await expect(secondBrandProduct).toBeVisible()
  }
})

test('Search Products and Verify Cart After Login', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const cartPage = new CartPage(page)
  const shopMenu = new ShopMenu(page)
  const signupLoginPage = new SignupLoginPage(page)
  const firstAllProductNames = await productsPage.productName.all()
  const randomProductName = faker.helpers.arrayElement(firstAllProductNames)
  const randomProductNameText = await randomProductName.innerText()

  await productsPage.searchInput.fill(randomProductNameText)
  await productsPage.submitSearchButton.click()
  await expect(productsPage.searchedProductsHeader).toBeVisible()

  const secondAllProductNames = await productsPage.productName.all()

  for (const productName of secondAllProductNames) {
    await expect(productName.getByText(randomProductNameText)).toBeVisible()
  }

  const allAddToCartButtons = await productsPage.featuredItemAddToCartLink.all()

  for (const addToCartButton of allAddToCartButtons) {
    await addToCartButton.click()
    await productsPage.continueShoppingButton.click()
  }

  await shopMenu.cartLink.click()

  const firstAllCartProductNames = await cartPage.productNames.all()

  for (const firstCartProductName of firstAllCartProductNames) {
    await expect(firstCartProductName.getByText(randomProductNameText)).toBeVisible()
  }

  await shopMenu.signupLoginLink.click()
  await expect(signupLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signupLoginPage.fillOutLoginForm(realUserData.email, realUserData.password)
  await signupLoginPage.loginButton.click()
  await shopMenu.cartLink.click()
  await cartPage.cartProducts.first().waitFor()

  const secondAllCartProductNames = await cartPage.productNames.all()

  for (const secondCartProductName of secondAllCartProductNames) {
    await expect(secondCartProductName.getByText(randomProductNameText)).toBeVisible()
  }

  const initialCartProductCount = await cartPage.cartProducts.count()

  for (let i = 0; i < initialCartProductCount; i++) {
    await cartPage.cartQuantityDeleteLink.first().click()
    await expect(cartPage.cartProducts).toHaveCount(initialCartProductCount - i - 1)
  }
})

test('Add review on product', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const productDetailsPage = new ProductDetailsPage(page)
  const allViewProductLinks = await productsPage.viewProductLink.all()
  const randomViewProductLink = faker.helpers.arrayElement(allViewProductLinks)

  await randomViewProductLink.click()
  await expect(productDetailsPage.writeYourReviewText).toBeVisible()
  await productDetailsPage.yourNameInput.fill(randomUserData.fullName)
  await productDetailsPage.emailAddressInput.fill(randomUserData.email)
  await productDetailsPage.addReviewHereTextArea.fill(randomTextContent.paragraphs)
  await productDetailsPage.submitButton.click()
  await expect(page.getByText('Thank you for your review.')).toBeVisible()
})
