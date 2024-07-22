import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { SubscriptionWidget } from './pages/subscriptionWidget'
import { ProductDetailsPage } from './pages/productDetailsPage'
import { CartPage } from './pages/cartPage'
import { faker } from '@faker-js/faker'
import { ShopMenu } from './pages/shopMenu'
import { SignupLoginPage } from './pages/signupLoginPage'
import { AccountInfoPage } from './pages/accountInfoPage'

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
  const productQuantity = '4'

  await homePage.viewProductLinks.nth(randomIndex).click()
  await expect(productDetailsPage.productInformation).toBeVisible()
  await productDetailsPage.quantityInput.clear()
  await productDetailsPage.quantityInput.fill(productQuantity)
  await productDetailsPage.addToCartButton.click()
  await productDetailsPage.viewCartLink.click()
  await expect(cartPage.productQuantities).toHaveText(productQuantity, { useInnerText: true })
})

test('Place Order: Register while Checkout', async ({ page }) => {
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

  await homePage.productAddToCartLink.nth(randomIndex1).click()
  await homePage.continueShoppingButton.click()
  await homePage.productAddToCartLink.nth(randomIndex2).click()
  await homePage.continueShoppingButton.click()
  await shopMenu.cartLink.click()
  await expect(cartPage.cartInfoTable).toBeVisible()
  await cartPage.proceedToCheckout.click()
  await cartPage.registerLoginLink.click()
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
  await shopMenu.cartLink.click()
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
