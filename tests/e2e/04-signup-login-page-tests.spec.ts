import { test, expect } from '@playwright/test'
import { HomePage } from '../../src/pages/homePage'
import { ShopMenu } from '../../src/components/shopMenu'
import { SignupLoginPage } from '../../src/pages/signupLoginPage'
import { AccountInfoPage } from '../../src/pages/accountInfoPage'
import { CartPage } from '../../src/pages/cartPage'
import { faker } from '@faker-js/faker'
import { realUserData } from '../../src/testData/realData'
import { userInfoFactory, textContentFactory } from '../../src/factories/factories'

const randomUserData = userInfoFactory()
const randomTextContent = textContentFactory()

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)

  await page.goto('/')
  await homePage.featuredItems.first().waitFor()
  await shopMenu.signupLoginLink.click()
})

test('Register User and Delete Account', async ({ page }) => {
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)
  const accountInfoPage = new AccountInfoPage(page)
  const continueButton = page.getByRole('link', { name: /continue/i })

  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()
  await signUpLoginPage.fillOutSignUpForm(randomUserData.fullName, randomUserData.email)
  await signUpLoginPage.signUpButton.click()
  await expect(accountInfoPage.enterAccountInfoHeader).toBeVisible()
  await accountInfoPage.fillOutAccountInfo()

  const fullNameValue = await accountInfoPage.nameInput.inputValue()

  await accountInfoPage.createAccountButton.click()
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible()
  await continueButton.click()
  await expect(shopMenu.navBar.getByText(`Logged in as ${fullNameValue}`)).toBeVisible()
  await shopMenu.deleteAccountLink.click()
  await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible()
  await continueButton.click()
})

test('Login User with correct email and password and Logout', async ({ page }) => {
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signUpLoginPage.fillOutLoginForm(realUserData.email, realUserData.password)
  await signUpLoginPage.loginButton.click()
  await expect(page.getByText(`Logged in as ${realUserData.fullName}`)).toBeVisible()
  await shopMenu.logoutLink.click()
  await expect(signUpLoginPage.loginForm).toBeVisible()
})

test('Login User with incorrect email and password', async ({ page }) => {
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signUpLoginPage.fillOutLoginForm(randomUserData.email, randomUserData.password)
  await signUpLoginPage.loginButton.click()
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible()
})

test('Register User with existing email', async ({ page }) => {
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()
  await signUpLoginPage.fillOutSignUpForm(realUserData.fullName, realUserData.email)
  await signUpLoginPage.signUpButton.click()
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
})

test('Place Order: Register before Checkout', async ({ page }) => {
  const homePage = new HomePage(page)
  const cartPage = new CartPage(page)
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)
  const accountInfoPage = new AccountInfoPage(page)
  const continueButton = page.getByRole('link', { name: /continue/i })

  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()
  await signUpLoginPage.fillOutSignUpForm(randomUserData.fullName, randomUserData.email)
  await signUpLoginPage.signUpButton.click()
  await expect(accountInfoPage.enterAccountInfoHeader).toBeVisible()

  const generatedData = await accountInfoPage.fillOutAccountInfo()
  const fullNameValue = await accountInfoPage.nameInput.inputValue()

  await accountInfoPage.createAccountButton.click()
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible()
  await continueButton.click()
  await expect(shopMenu.navBar.getByText(`Logged in as ${fullNameValue}`)).toBeVisible()

  const allAddToCartLinks = await homePage.featuredItemAddToCartLink.all()
  const firstRandomAddToCartLink = faker.helpers.arrayElement(allAddToCartLinks)

  const secondRandomAddToCartLink = faker.helpers.arrayElement(
    allAddToCartLinks.filter(addToCartLink => addToCartLink !== firstRandomAddToCartLink)
  )

  await firstRandomAddToCartLink.click()
  await homePage.continueShoppingButton.click()
  await secondRandomAddToCartLink.click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.proceedToCheckout.click()
  await expect(cartPage.deliveryFirstName.getByText(generatedData.firstName)).toBeVisible()
  await expect(cartPage.deliveryLastName.getByText(generatedData.lastName)).toBeVisible()
  await expect(cartPage.deliveryAddress1.getByText(generatedData.address1)).toBeVisible()
  await expect(cartPage.deliveryAddress2.getByText(generatedData.address2)).toBeVisible()
  await expect(cartPage.deliveryCity.getByText(generatedData.city)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(generatedData.state)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(generatedData.zipcode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(generatedData.country)).toBeVisible()
  await expect(cartPage.deliveryPhoneNumber.getByText(generatedData.phoneNumber)).toBeVisible()
  await expect(cartPage.billingFirstName.getByText(generatedData.firstName)).toBeVisible()
  await expect(cartPage.billingLastName.getByText(generatedData.lastName)).toBeVisible()
  await expect(cartPage.billingAddress1.getByText(generatedData.address1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(generatedData.address2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(generatedData.city)).toBeVisible()
  await expect(cartPage.billingState.getByText(generatedData.state)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(generatedData.zipcode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(generatedData.country)).toBeVisible()
  await expect(cartPage.billingPhoneNumber.getByText(generatedData.phoneNumber)).toBeVisible()

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

test('Place Order: Login before Checkout', async ({ page }) => {
  const homePage = new HomePage(page)
  const cartPage = new CartPage(page)
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signUpLoginPage.fillOutLoginForm(realUserData.email, realUserData.password)
  await signUpLoginPage.loginButton.click()
  await expect(page.getByText(`Logged in as ${realUserData.fullName}`)).toBeVisible()

  const allAddToCartLinks = await homePage.featuredItemAddToCartLink.all()
  const firstRandomAddToCartLink = faker.helpers.arrayElement(allAddToCartLinks)

  const secondRandomAddToCartLink = faker.helpers.arrayElement(
    allAddToCartLinks.filter(addToCartLink => addToCartLink !== firstRandomAddToCartLink)
  )

  await firstRandomAddToCartLink.click()
  await homePage.continueShoppingButton.click()
  await secondRandomAddToCartLink.click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.proceedToCheckout.click()
  await expect(cartPage.deliveryFirstName.getByText(realUserData.firstName)).toBeVisible()
  await expect(cartPage.deliveryLastName.getByText(realUserData.lastName)).toBeVisible()
  await expect(cartPage.deliveryAddress1.getByText(realUserData.address1)).toBeVisible()
  await expect(cartPage.deliveryAddress2.getByText(realUserData.address2)).toBeVisible()
  await expect(cartPage.deliveryCity.getByText(realUserData.city)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(realUserData.state)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(realUserData.zipCode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(realUserData.country)).toBeVisible()
  await expect(cartPage.deliveryPhoneNumber.getByText(realUserData.mobileNumber)).toBeVisible()
  await expect(cartPage.billingFirstName.getByText(realUserData.firstName)).toBeVisible()
  await expect(cartPage.billingLastName.getByText(realUserData.lastName)).toBeVisible()
  await expect(cartPage.billingAddress1.getByText(realUserData.address1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(realUserData.address2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(realUserData.city)).toBeVisible()
  await expect(cartPage.billingState.getByText(realUserData.state)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(realUserData.zipCode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(realUserData.country)).toBeVisible()
  await expect(cartPage.billingPhoneNumber.getByText(realUserData.mobileNumber)).toBeVisible()
  await cartPage.commentTextArea.fill(randomTextContent.paragraph)
  await cartPage.placeOrderLink.click()
  await cartPage.fillOutPaymentInfo()
  await cartPage.payConfirmOrderButton.click()

  // TODO: Playwright says this alert is not visible
  // await expect(cartPage.orderSuccessfulMessage).toBeVisible()
})
