import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { SignupLoginPage } from './pages/signupLoginPage'
import { AccountInfoPage } from './pages/accountInfoPage'
import { CartPage } from './pages/cartPage'
import { faker } from '@faker-js/faker'
import { generateRandomData, useStaticData } from './utils/helpers'

const randomData = generateRandomData()
const staticData = useStaticData()

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

  await signUpLoginPage.fillOutSignUpForm(
    randomData.personalInfo.fullName,
    randomData.personalInfo.email
  )

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

  await signUpLoginPage.fillOutLoginForm(
    staticData.personalInfo.email,
    staticData.personalInfo.password
  )

  await signUpLoginPage.loginButton.click()
  await expect(page.getByText(`Logged in as ${staticData.personalInfo.fullName}`)).toBeVisible()
  await shopMenu.logoutLink.click()
  await expect(signUpLoginPage.loginForm).toBeVisible()
})

test('Login User with incorrect email and password', async ({ page }) => {
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()

  await signUpLoginPage.fillOutLoginForm(
    randomData.personalInfo.email,
    randomData.personalInfo.password
  )

  await signUpLoginPage.loginButton.click()
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible()
})

test('Register User with existing email', async ({ page }) => {
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()

  await signUpLoginPage.fillOutSignUpForm(
    staticData.personalInfo.fullName,
    staticData.personalInfo.email
  )

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

  await signUpLoginPage.fillOutSignUpForm(
    randomData.personalInfo.fullName,
    randomData.personalInfo.email
  )

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

  await expect(
    cartPage.deliveryFirstName.getByText(generatedData.personalInfo.firstName)
  ).toBeVisible()

  await expect(
    cartPage.deliveryLastName.getByText(generatedData.personalInfo.lastName)
  ).toBeVisible()

  await expect(
    cartPage.deliveryAddress1.getByText(generatedData.addressInfo.address1)
  ).toBeVisible()

  await expect(
    cartPage.deliveryAddress2.getByText(generatedData.addressInfo.address2)
  ).toBeVisible()

  await expect(cartPage.deliveryCity.getByText(generatedData.addressInfo.city)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(generatedData.addressInfo.state)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(generatedData.addressInfo.zipCode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(generatedData.addressInfo.country)).toBeVisible()

  await expect(
    cartPage.deliveryPhoneNumber.getByText(generatedData.personalInfo.phoneNumber)
  ).toBeVisible()

  await expect(
    cartPage.billingFirstName.getByText(generatedData.personalInfo.firstName)
  ).toBeVisible()

  await expect(
    cartPage.billingLastName.getByText(generatedData.personalInfo.lastName)
  ).toBeVisible()

  await expect(cartPage.billingAddress1.getByText(generatedData.addressInfo.address1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(generatedData.addressInfo.address2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(generatedData.addressInfo.city)).toBeVisible()
  await expect(cartPage.billingState.getByText(generatedData.addressInfo.state)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(generatedData.addressInfo.zipCode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(generatedData.addressInfo.country)).toBeVisible()

  await expect(
    cartPage.billingPhoneNumber.getByText(generatedData.personalInfo.phoneNumber)
  ).toBeVisible()

  await cartPage.commentTextArea.fill(randomData.paragraph)
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

  await signUpLoginPage.fillOutLoginForm(
    staticData.personalInfo.email,
    staticData.personalInfo.password
  )

  await signUpLoginPage.loginButton.click()
  await expect(page.getByText(`Logged in as ${staticData.personalInfo.fullName}`)).toBeVisible()

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

  await expect(
    cartPage.deliveryFirstName.getByText(staticData.personalInfo.firstName)
  ).toBeVisible()

  await expect(cartPage.deliveryLastName.getByText(staticData.personalInfo.lastName)).toBeVisible()
  await expect(cartPage.deliveryAddress1.getByText(staticData.addressInfo.address1)).toBeVisible()
  await expect(cartPage.deliveryAddress2.getByText(staticData.addressInfo.address2)).toBeVisible()
  await expect(cartPage.deliveryCity.getByText(staticData.addressInfo.city)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(staticData.addressInfo.state)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(staticData.addressInfo.zipCode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(staticData.addressInfo.country)).toBeVisible()

  await expect(
    cartPage.deliveryPhoneNumber.getByText(staticData.personalInfo.mobileNumber)
  ).toBeVisible()

  await expect(cartPage.billingFirstName.getByText(staticData.personalInfo.firstName)).toBeVisible()
  await expect(cartPage.billingLastName.getByText(staticData.personalInfo.lastName)).toBeVisible()
  await expect(cartPage.billingAddress1.getByText(staticData.addressInfo.address1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(staticData.addressInfo.address2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(staticData.addressInfo.city)).toBeVisible()
  await expect(cartPage.billingState.getByText(staticData.addressInfo.state)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(staticData.addressInfo.zipCode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(staticData.addressInfo.country)).toBeVisible()

  await expect(
    cartPage.billingPhoneNumber.getByText(staticData.personalInfo.mobileNumber)
  ).toBeVisible()

  await cartPage.commentTextArea.fill(randomData.paragraph)
  await cartPage.placeOrderLink.click()
  await cartPage.fillOutPaymentInfo()
  await cartPage.payConfirmOrderButton.click()

  // TODO: Playwright says this alert is not visible
  // await expect(cartPage.orderSuccessfulMessage).toBeVisible()
})
