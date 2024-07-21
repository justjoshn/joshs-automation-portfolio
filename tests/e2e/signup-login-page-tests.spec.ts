import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ShopMenu } from './pages/shopMenu'
import { SignupLoginPage } from './pages/signupLoginPage'
import { AccountInfoPage } from './pages/accountInfoPage'
import { faker } from '@faker-js/faker'

const emailAddress = 'josh@josh.com'
const password = 'josh'
const name = 'josh'

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
  const randomName = faker.person.firstName()
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
  await signUpLoginPage.nameInput.fill(randomName)
  await signUpLoginPage.signupEmailAddressInput.fill(randomEmail)
  await signUpLoginPage.signUpButton.click()
  await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible()
  await page.getByLabel(randomTitle).click()
  await expect(accountInfoPage.nameInput).toHaveValue(randomName)
  await expect(accountInfoPage.emailInput).toHaveValue(randomEmail)
  await accountInfoPage.passwordInput.fill(randomPassword)
  await accountInfoPage.daySelect.selectOption(randomDay)
  await accountInfoPage.monthSelect.selectOption(randomMonth)
  await accountInfoPage.yearSelect.selectOption(randomYear)
  await page.getByText('Sign up for our newsletter!').click()
  await page.getByText('Receive special offers from our partners!').click()
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
  await expect(page.getByText(`Logged in as ${randomName}`)).toBeVisible()
  await shopMenu.deleteAccountLink.click()
  await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible()
  await continueButton.click()
})

test('Login User with correct email and password and Logout', async ({ page }) => {
  const shopMenu = new ShopMenu(page)
  const signUpLoginPage = new SignupLoginPage(page)

  await expect(signUpLoginPage.logiinToYourAccountHeader).toBeVisible()
  await signUpLoginPage.loginEmailAddressInput.fill(emailAddress)
  await signUpLoginPage.password.fill(password)
  await signUpLoginPage.loginButton.click()
  await expect(page.getByText(`Logged in as ${name}`)).toBeVisible()
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
  await signUpLoginPage.signupEmailAddressInput.fill(emailAddress)
  await signUpLoginPage.nameInput.fill(name)
  await signUpLoginPage.signUpButton.click()
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
})
