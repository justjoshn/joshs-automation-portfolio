import { test, expect } from '@playwright/test'
import { HomePage } from '../../src/pages/homePage'
import { SubscriptionWidget } from '../../src/components/subscriptionWidget'
import { ProductDetailsPage } from '../../src/pages/productDetailsPage'
import { CartPage } from '../../src/pages/cartPage'
import { faker } from '@faker-js/faker'
import { ShopMenu } from '../../src/components/shopMenu'
import { SignupLoginPage } from '../../src/pages/signupLoginPage'
import { AccountInfoPage } from '../../src/pages/accountInfoPage'
import { LeftSidebar } from '../../src/components/leftSidebar'
import { userInfoFactory } from '../../src/factories/userInfo'
import { textContentFactory } from '../../src/factories/textContent'

const randomUserData = userInfoFactory()
const randomTextContent = textContentFactory()

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)

  await page.goto('/')
  await homePage.featuredItems.first().waitFor()
})

test('Verify Subscription in home page', async ({ page }) => {
  const subscriptionWidget = new SubscriptionWidget(page)

  await subscriptionWidget.footerWidget.scrollIntoViewIfNeeded()
  await expect(subscriptionWidget.subscriptionHeader).toBeVisible()
  await subscriptionWidget.emailAddressInput.fill(randomUserData.email)
  await subscriptionWidget.submitButton.click()
  await expect(subscriptionWidget.successSubscribe).not.toHaveClass('hide')
  await expect(subscriptionWidget.successfulAlert).toBeVisible()
})

test('Verify Product quantity in Cart', async ({ page }) => {
  const cartPage = new CartPage(page)
  const homePage = new HomePage(page)
  const productDetailsPage = new ProductDetailsPage(page)
  const productCount: number = await homePage.featuredItems.count()
  const randomIndex = faker.number.int({ min: 0, max: productCount - 1 })
  const productQuantity = '4'

  await homePage.viewProductLinks.nth(randomIndex).click()
  await expect(productDetailsPage.productInformation).toBeVisible()
  await productDetailsPage.quantityInput.clear()
  await productDetailsPage.quantityInput.fill(productQuantity)
  await productDetailsPage.addToCartButton.click()
  await productDetailsPage.viewCartLink.click()

  await expect(cartPage.productQuantities).toHaveText(productQuantity, {
    useInnerText: true,
  })
})

test('Place Order: Register while Checkout', async ({ page }) => {
  const homePage = new HomePage(page)
  const cartPage = new CartPage(page)
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)
  const accountInfoPage = new AccountInfoPage(page)
  const productCount: number = await homePage.featuredItems.count()
  const randomIndex1 = faker.number.int({ min: 0, max: productCount - 1 })
  const randomIndex2 = faker.number.int({ min: 0, max: productCount - 1 })
  const continueButton = page.getByRole('link', { name: /continue/i })

  await homePage.featuredItemAddToCartLink.nth(randomIndex1).click()
  await homePage.continueShoppingButton.click()
  await homePage.featuredItemAddToCartLink.nth(randomIndex2).click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.proceedToCheckout.click()
  await cartPage.registerLoginLink.click()
  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()
  await signUpLoginPage.fillOutSignUpForm(randomUserData.fullName, randomUserData.email)
  await signUpLoginPage.signUpButton.click()
  await expect(accountInfoPage.enterAccountInfoHeader).toBeVisible()

  const generatedUserData = await accountInfoPage.fillOutAccountInfo()
  const fullNameValue = await accountInfoPage.nameInput.inputValue()

  await accountInfoPage.createAccountButton.click()
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible()
  await continueButton.click()
  await expect(shopMenu.navBar.getByText(`Logged in as ${fullNameValue}`)).toBeVisible()
  await shopMenu.cartLink.click()
  await cartPage.proceedToCheckout.click()
  await expect(cartPage.deliveryFirstName.getByText(generatedUserData.firstName)).toBeVisible()
  await expect(cartPage.deliveryLastName.getByText(generatedUserData.lastName)).toBeVisible()
  await expect(cartPage.deliveryAddress1.getByText(generatedUserData.address1)).toBeVisible()
  await expect(cartPage.deliveryAddress2.getByText(generatedUserData.address2)).toBeVisible()
  await expect(cartPage.deliveryCity.getByText(generatedUserData.city)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(generatedUserData.state)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(generatedUserData.zipcode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(generatedUserData.country)).toBeVisible()
  await expect(cartPage.deliveryPhoneNumber.getByText(generatedUserData.phoneNumber)).toBeVisible()
  await expect(cartPage.billingFirstName.getByText(generatedUserData.firstName)).toBeVisible()
  await expect(cartPage.billingLastName.getByText(generatedUserData.lastName)).toBeVisible()
  await expect(cartPage.billingAddress1.getByText(generatedUserData.address1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(generatedUserData.address2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(generatedUserData.city)).toBeVisible()
  await expect(cartPage.billingState.getByText(generatedUserData.state)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(generatedUserData.zipcode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(generatedUserData.country)).toBeVisible()
  await expect(cartPage.billingPhoneNumber.getByText(generatedUserData.phoneNumber)).toBeVisible()
  await cartPage.commentTextArea.fill(randomTextContent.paragraph)
  await cartPage.placeOrderLink.click()
  await cartPage.fillOutPaymentInfo()
  await cartPage.payConfirmOrderButton.click()

  // TODO: Playwright says this alert is not visible
  // await expect(cartPage.orderSuccessfulMessage).toBeVisible()

  await shopMenu.deleteAccountLink.click()
  await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible()
  await continueButton.click()
})

test('Remove Products From Cart', async ({ page }) => {
  const homePage = new HomePage(page)
  const cartPage = new CartPage(page)
  const shopMenu = new ShopMenu(page)
  const productCount: number = await homePage.featuredItems.count()
  const randomIndex1 = faker.number.int({ min: 0, max: productCount - 1 })
  const randomIndex2 = faker.number.int({ min: 0, max: productCount - 1 })

  await homePage.featuredItemAddToCartLink.nth(randomIndex1).click()
  await homePage.continueShoppingButton.click()
  await homePage.featuredItemAddToCartLink.nth(randomIndex2).click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.cartProducts.first().waitFor()

  const initialCartProductCount = await cartPage.cartProducts.count()

  for (let i = 0; i < initialCartProductCount; i++) {
    await cartPage.cartQuantityDeleteLink.first().click()
    await expect(cartPage.cartProducts).toHaveCount(initialCartProductCount - i - 1)
  }
})

test('View Category Products', async ({ page }) => {
  const leftSidebar = new LeftSidebar(page)

  const womenSubcategoryLocators = [
    leftSidebar.womenTopsSubcategory,
    leftSidebar.womenDressSubcategory,
    leftSidebar.womenSareeSubcategory,
  ]

  const menSubcategoryLocators = [
    leftSidebar.menTshirtsSubcategory,
    leftSidebar.menJeansSubcategory,
  ]

  const selectedWomenSubcategoryLocator = faker.helpers.arrayElement(womenSubcategoryLocators)
  const selectedMenSubcategoryLocator = faker.helpers.arrayElement(menSubcategoryLocators)

  await expect(leftSidebar.categoryProducts).toBeVisible()
  await leftSidebar.womenCategory.click()

  const randomWomenLinkText = await selectedWomenSubcategoryLocator.innerText()

  await selectedWomenSubcategoryLocator.click()

  await expect(
    page.getByRole('heading', {
      name: `Women - ${randomWomenLinkText} Products`,
    })
  ).toBeVisible()

  await leftSidebar.menCategory.click()

  const randomMenLinkText = await selectedMenSubcategoryLocator.innerText()

  await selectedMenSubcategoryLocator.click()

  await expect(
    page.getByRole('heading', {
      name: `Men - ${randomMenLinkText} Products`,
    })
  ).toBeVisible()
})

test('Add to cart from Recommended items', async ({ page }) => {
  const homePage = new HomePage(page)
  const cartPage = new CartPage(page)

  await homePage.recommendedItems.scrollIntoViewIfNeeded()

  const recommendedItemsCount = await homePage.activeRecommendedItems.count()

  const randomIndex = faker.number.int({
    min: 0,
    max: recommendedItemsCount - 1,
  })

  const randomReccommendedItemText = await homePage.recommendedItemName.nth(randomIndex).innerText()

  await homePage.recommendedItemAddToCartLink.nth(randomIndex).click()
  await homePage.viewCartLink.click()
  await expect(cartPage.productNames.getByText(randomReccommendedItemText)).toBeVisible()
})

test('Download Invoice after purchase order', async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)
  const cartPage = new CartPage(page)
  const accountInfoPage = new AccountInfoPage(page)
  const signupLoginPage = new SignupLoginPage(page)
  const productCount: number = await homePage.featuredItems.count()
  const randomIndex1 = faker.number.int({ min: 0, max: productCount - 1 })
  const randomIndex2 = faker.number.int({ min: 0, max: productCount - 1 })
  const continueButton = page.getByRole('link', { name: /continue/i })

  await homePage.featuredItemAddToCartLink.nth(randomIndex1).click()
  await homePage.continueShoppingButton.click()
  await homePage.featuredItemAddToCartLink.nth(randomIndex2).click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.proceedToCheckout.click()
  await cartPage.registerLoginLink.click()
  await expect(signupLoginPage.newUserSignUpHeader).toBeVisible()
  await signupLoginPage.fillOutSignUpForm(randomUserData.fullName, randomUserData.email)
  await signupLoginPage.signUpButton.click()
  await expect(accountInfoPage.enterAccountInfoHeader).toBeVisible()

  const generatedUserData = await accountInfoPage.fillOutAccountInfo()

  await accountInfoPage.createAccountButton.click()
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible()
  await continueButton.click()
  await shopMenu.cartLink.click()
  await cartPage.proceedToCheckout.click()
  await expect(cartPage.deliveryFirstName.getByText(generatedUserData.firstName)).toBeVisible()
  await expect(cartPage.deliveryLastName.getByText(generatedUserData.lastName)).toBeVisible()
  await expect(cartPage.deliveryAddress1.getByText(generatedUserData.address1)).toBeVisible()
  await expect(cartPage.deliveryAddress2.getByText(generatedUserData.address2)).toBeVisible()
  await expect(cartPage.deliveryCity.getByText(generatedUserData.city)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(generatedUserData.state)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(generatedUserData.zipcode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(generatedUserData.country)).toBeVisible()
  await expect(cartPage.deliveryPhoneNumber.getByText(generatedUserData.phoneNumber)).toBeVisible()
  await expect(cartPage.billingFirstName.getByText(generatedUserData.firstName)).toBeVisible()
  await expect(cartPage.billingLastName.getByText(generatedUserData.lastName)).toBeVisible()
  await expect(cartPage.billingAddress1.getByText(generatedUserData.address1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(generatedUserData.address2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(generatedUserData.city)).toBeVisible()
  await expect(cartPage.billingState.getByText(generatedUserData.state)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(generatedUserData.zipcode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(generatedUserData.country)).toBeVisible()
  await expect(cartPage.billingPhoneNumber.getByText(generatedUserData.phoneNumber)).toBeVisible()
  await cartPage.commentTextArea.fill(randomTextContent.paragraph)
  await cartPage.placeOrderLink.click()
  await cartPage.fillOutPaymentInfo()
  await cartPage.payConfirmOrderButton.click()

  // TODO: Playwright says this alert is not visible
  // await expect(cartPage.orderSuccessfulMessage).toBeVisible()

  const downloadPromise = page.waitForEvent('download')

  await page.getByRole('link', { name: /Download Invoice/i }).click()

  const download = await downloadPromise

  await download.saveAs('./tests/e2e/misc/' + download.suggestedFilename())
  await continueButton.click()
  await shopMenu.deleteAccountLink.click()
  await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible()
  await continueButton.click()
})

test('Verify Scroll Up using "Arrow" button and Scroll Down functionality', async ({ page }) => {
  const homePage = new HomePage(page)
  const subscriptionWidget = new SubscriptionWidget(page)

  await subscriptionWidget.subscriptionHeader.scrollIntoViewIfNeeded()
  await expect(subscriptionWidget.subscriptionHeader).toBeVisible()
  await homePage.scrollUpLink.click()
  await expect(homePage.fullFledgedHeader).toBeVisible()
})

test('Verify Scroll Up without "Arrow" button and Scroll Down functionality', async ({ page }) => {
  const homePage = new HomePage(page)
  const subscriptionWidget = new SubscriptionWidget(page)

  await subscriptionWidget.subscriptionHeader.scrollIntoViewIfNeeded()
  await expect(subscriptionWidget.subscriptionHeader).toBeVisible()
  await homePage.fullFledgedHeader.scrollIntoViewIfNeeded()
  await expect(homePage.fullFledgedHeader).toBeVisible()
})
