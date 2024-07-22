import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { SignupLoginPage } from './pages/signupLoginPage'
import { AccountInfoPage } from './pages/accountInfoPage'
import { faker } from '@faker-js/faker'
import { CartPage } from './pages/cartPage'

const fullName = 'firstName lastName'
const firstName = 'firstName'
const lastName = 'lastName'
const email = 'firstName@email.com'
const password = 'password'
const address1 = '123 Address Ave'
const address2 = 'Apt 1'
const country = 'United States'
const state = 'stateName'
const city = 'cityName'
const zipcode = '12345'
const mobileNumber = '555-555-5555'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)

  await page.goto('/')
  await homePage.productImageWrapper.first().waitFor()
  await shopMenu.signupLoginLink.click()
})

test('Register User and Delete Account', async ({ page }) => {
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)
  const accountInfoPage = new AccountInfoPage(page)
  const randomFullName = faker.person.fullName()
  const randomEmail = faker.internet.email()
  const randomTitle = faker.helpers.arrayElement(['Mr.', 'Mrs.'])

  const randomDate = faker.date.birthdate({
    min: 1982,
    max: 2006,
    mode: 'year',
  })

  const randomPassword = faker.internet.password()
  const randomDay = randomDate.getDate().toString()
  const randomMonth = (randomDate.getMonth() + 1).toString()
  const randomYear = randomDate.getFullYear().toString()
  const randomFirstName = faker.person.firstName()
  const randomLastName = faker.person.lastName()
  const randomCompany = faker.company.name()
  const randomAddress1 = faker.location.streetAddress()
  const randomAddress2 = faker.location.secondaryAddress()

  const randomCountry = faker.helpers.arrayElement([
    'India',
    'United States',
    'Canada',
    'Australia',
    'Israel',
    'New Zealand',
    'Singapore',
  ])

  const randomState = faker.location.state()
  const randomCity = faker.location.city()
  const randomZipCode = faker.location.zipCode()
  const randomPhoneNumber = faker.phone.number()
  const continueButton = page.getByRole('link', { name: /continue/i })

  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()
  await signUpLoginPage.nameInput.fill(randomFullName)
  await signUpLoginPage.signupEmailAddressInput.fill(randomEmail)
  await signUpLoginPage.signUpButton.click()
  await expect(accountInfoPage.enterAccountInfoHeader).toBeVisible()
  await page.getByLabel(randomTitle).click()
  await expect(accountInfoPage.nameInput).toHaveValue(randomFullName)
  await expect(accountInfoPage.emailInput).toHaveValue(randomEmail)
  await accountInfoPage.passwordInput.fill(randomPassword)
  await accountInfoPage.daySelect.selectOption(randomDay)
  await accountInfoPage.monthSelect.selectOption(randomMonth)
  await accountInfoPage.yearSelect.selectOption(randomYear)
  await accountInfoPage.signUpNewsletterCheckbox.click()
  await accountInfoPage.receiveOffersCheckbox.click()
  await accountInfoPage.firstNameInput.fill(randomFirstName)
  await accountInfoPage.lastNameInput.fill(randomLastName)
  await accountInfoPage.companyInput.fill(randomCompany)
  await accountInfoPage.address1Input.fill(randomAddress1)
  await accountInfoPage.address2Input.fill(randomAddress2)
  await accountInfoPage.countrySelect.selectOption(randomCountry)
  await accountInfoPage.stateInput.fill(randomState)
  await accountInfoPage.cityInput.fill(randomCity)
  await accountInfoPage.zipcodeInput.fill(randomZipCode)
  await accountInfoPage.mobileNumberInput.fill(randomPhoneNumber)
  await accountInfoPage.createAccountButton.click()
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible()
  await continueButton.click()
  await expect(shopMenu.navBar.getByText(`Logged in as ${randomFullName}`)).toBeVisible()
  await shopMenu.deleteAccountLink.click()
  await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible()
  await continueButton.click()
})

test('Login User with correct email and password and Logout', async ({ page }) => {
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signUpLoginPage.loginEmailAddressInput.fill(email)
  await signUpLoginPage.password.fill(password)
  await signUpLoginPage.loginButton.click()
  await expect(page.getByText(`Logged in as ${fullName}`)).toBeVisible()
  await shopMenu.logoutLink.click()
  await expect(signUpLoginPage.loginForm).toBeVisible()
})

test('Login User with incorrect email and password', async ({ page }) => {
  const signUpLoginPage = new SignupLoginPage(page)
  const randomEmail = faker.internet.email()
  const randomPassword = faker.internet.password()

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signUpLoginPage.loginEmailAddressInput.fill(randomEmail)
  await signUpLoginPage.password.fill(randomPassword)
  await signUpLoginPage.loginButton.click()
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible()
})

test('Register User with existing email', async ({ page }) => {
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()
  await signUpLoginPage.signupEmailAddressInput.fill(email)
  await signUpLoginPage.nameInput.fill(fullName)
  await signUpLoginPage.signUpButton.click()
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
})

test('Place Order: Register before Checkout', async ({ page }) => {
  const homePage = new HomePage(page)
  const cartPage = new CartPage(page)
  const shopMenu = new ShopMenu(page)
  const productCount: number = await homePage.productImageWrapper.count()
  const randomIndex1 = faker.number.int({ min: 0, max: productCount })
  const randomIndex2 = faker.number.int({ min: 0, max: productCount })
  const signUpLoginPage = new SignupLoginPage(page)
  const accountInfoPage = new AccountInfoPage(page)
  const randomFullName = faker.person.fullName()
  const randomEmail = faker.internet.email()
  const randomTitle = faker.helpers.arrayElement(['Mr.', 'Mrs.'])

  const randomDate = faker.date.birthdate({
    min: 1982,
    max: 2006,
    mode: 'year',
  })

  const randomPassword = faker.internet.password()
  const randomDay = randomDate.getDate().toString()
  const randomMonth = (randomDate.getMonth() + 1).toString()
  const randomYear = randomDate.getFullYear().toString()
  const randomFirstName = faker.person.firstName()
  const randomLastName = faker.person.lastName()
  const randomCompany = faker.company.name()
  const randomAddress1 = faker.location.streetAddress()
  const randomAddress2 = faker.location.secondaryAddress()

  const randomCountry = faker.helpers.arrayElement([
    'India',
    'United States',
    'Canada',
    'Australia',
    'Israel',
    'New Zealand',
    'Singapore',
  ])

  const randomState = faker.location.state()
  const randomCity = faker.location.city()
  const randomZipCode = faker.location.zipCode()
  const randomPhoneNumber = faker.phone.number()
  const randomParagraph = faker.lorem.paragraph()
  const randomCreditCardNumber = faker.finance.creditCardNumber()
  const randomCVC = faker.finance.creditCardCVV()
  const futureDate = faker.date.future({ years: 10 })
  const randomExpirationMonth = futureDate.getMonth().toString()
  const randomExpirationYear = futureDate.getFullYear().toString()
  const continueButton = page.getByRole('link', { name: /continue/i })

  await expect(signUpLoginPage.newUserSignUpHeader).toBeVisible()
  await signUpLoginPage.nameInput.fill(randomFullName)
  await signUpLoginPage.signupEmailAddressInput.fill(randomEmail)
  await signUpLoginPage.signUpButton.click()
  await expect(accountInfoPage.enterAccountInfoHeader).toBeVisible()
  await page.getByLabel(randomTitle).click()
  await expect(accountInfoPage.nameInput).toHaveValue(randomFullName)
  await expect(accountInfoPage.emailInput).toHaveValue(randomEmail)
  await accountInfoPage.passwordInput.fill(randomPassword)
  await accountInfoPage.daySelect.selectOption(randomDay)
  await accountInfoPage.monthSelect.selectOption(randomMonth)
  await accountInfoPage.yearSelect.selectOption(randomYear)
  await accountInfoPage.signUpNewsletterCheckbox.click()
  await accountInfoPage.receiveOffersCheckbox.click()
  await accountInfoPage.firstNameInput.fill(randomFirstName)
  await accountInfoPage.lastNameInput.fill(randomLastName)
  await accountInfoPage.companyInput.fill(randomCompany)
  await accountInfoPage.address1Input.fill(randomAddress1)
  await accountInfoPage.address2Input.fill(randomAddress2)
  await accountInfoPage.countrySelect.selectOption(randomCountry)
  await accountInfoPage.stateInput.fill(randomState)
  await accountInfoPage.cityInput.fill(randomCity)
  await accountInfoPage.zipcodeInput.fill(randomZipCode)
  await accountInfoPage.mobileNumberInput.fill(randomPhoneNumber)
  await accountInfoPage.createAccountButton.click()
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible()
  await continueButton.click()
  await expect(shopMenu.navBar.getByText(`Logged in as ${randomFullName}`)).toBeVisible()
  await homePage.productAddToCartLink.nth(randomIndex1).click()
  await homePage.continueShoppingButton.click()
  await homePage.productAddToCartLink.nth(randomIndex2).click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.proceedToCheckout.click()
  await expect(cartPage.deliveryFirstName.getByText(randomFirstName)).toBeVisible()
  await expect(cartPage.deliveryLastName.getByText(randomLastName)).toBeVisible()
  await expect(cartPage.deliveryAddress1.getByText(randomAddress1)).toBeVisible()
  await expect(cartPage.deliveryAddress2.getByText(randomAddress2)).toBeVisible()
  await expect(cartPage.deliveryCity.getByText(randomCity)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(randomState)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(randomZipCode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(randomCountry)).toBeVisible()
  await expect(cartPage.deliveryPhoneNumber.getByText(randomPhoneNumber)).toBeVisible()
  await expect(cartPage.billingFirstName.getByText(randomFirstName)).toBeVisible()
  await expect(cartPage.billingLastName.getByText(randomLastName)).toBeVisible()
  await expect(cartPage.billingAddress1.getByText(randomAddress1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(randomAddress2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(randomCity)).toBeVisible()
  await expect(cartPage.billingState.getByText(randomState)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(randomZipCode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(randomCountry)).toBeVisible()
  await expect(cartPage.billingPhoneNumber.getByText(randomPhoneNumber)).toBeVisible()
  await cartPage.commentTextArea.fill(randomParagraph)
  await cartPage.placeOrderLink.click()
  await cartPage.nameOnCardInput.fill(randomFullName)
  await cartPage.cardNumberInput.fill(randomCreditCardNumber)
  await cartPage.cvcInput.fill(randomCVC)
  await cartPage.expirationMonthInput.fill(randomExpirationMonth)
  await cartPage.expirationYearInput.fill(randomExpirationYear)
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
  const productCount: number = await homePage.productImageWrapper.count()
  const randomIndex1 = faker.number.int({ min: 0, max: productCount })
  const randomIndex2 = faker.number.int({ min: 0, max: productCount })
  const randomParagraph = faker.lorem.paragraph()
  const randomCreditCardNumber = faker.finance.creditCardNumber()
  const randomCVC = faker.finance.creditCardCVV()
  const futureDate = faker.date.future({ years: 10 })
  const randomExpirationMonth = futureDate.getMonth().toString()
  const randomExpirationYear = futureDate.getFullYear().toString()

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signUpLoginPage.loginEmailAddressInput.fill(email)
  await signUpLoginPage.password.fill(password)
  await signUpLoginPage.loginButton.click()
  await expect(page.getByText(`Logged in as ${fullName}`)).toBeVisible()
  await homePage.productAddToCartLink.nth(randomIndex1).click()
  await homePage.continueShoppingButton.click()
  await homePage.productAddToCartLink.nth(randomIndex2).click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.proceedToCheckout.click()
  await expect(cartPage.deliveryFirstName.getByText(firstName)).toBeVisible()
  await expect(cartPage.deliveryLastName.getByText(lastName)).toBeVisible()
  await expect(cartPage.deliveryAddress1.getByText(address1)).toBeVisible()
  await expect(cartPage.deliveryAddress2.getByText(address2)).toBeVisible()
  await expect(cartPage.deliveryCity.getByText(city)).toBeVisible()
  await expect(cartPage.deliveryState.getByText(state)).toBeVisible()
  await expect(cartPage.deliveryPostCode.getByText(zipcode)).toBeVisible()
  await expect(cartPage.deliveryCountry.getByText(country)).toBeVisible()
  await expect(cartPage.deliveryPhoneNumber.getByText(mobileNumber)).toBeVisible()
  await expect(cartPage.billingFirstName.getByText(firstName)).toBeVisible()
  await expect(cartPage.billingLastName.getByText(lastName)).toBeVisible()
  await expect(cartPage.billingAddress1.getByText(address1)).toBeVisible()
  await expect(cartPage.billingAddress2.getByText(address2)).toBeVisible()
  await expect(cartPage.billingCity.getByText(city)).toBeVisible()
  await expect(cartPage.billingState.getByText(state)).toBeVisible()
  await expect(cartPage.billingPostCode.getByText(zipcode)).toBeVisible()
  await expect(cartPage.billingCountry.getByText(country)).toBeVisible()
  await expect(cartPage.billingPhoneNumber.getByText(mobileNumber)).toBeVisible()
  await cartPage.commentTextArea.fill(randomParagraph)
  await cartPage.placeOrderLink.click()
  await cartPage.nameOnCardInput.fill(fullName)
  await cartPage.cardNumberInput.fill(randomCreditCardNumber)
  await cartPage.cvcInput.fill(randomCVC)
  await cartPage.expirationMonthInput.fill(randomExpirationMonth)
  await cartPage.expirationYearInput.fill(randomExpirationYear)
  await cartPage.payConfirmOrderButton.click()

  // TODO: Playwright says this alert is not visible
  // await expect(cartPage.orderSuccessfulMessage).toBeVisible()
})
