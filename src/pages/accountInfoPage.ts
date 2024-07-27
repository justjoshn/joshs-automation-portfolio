import { type Locator, type Page } from '@playwright/test'
import { userInfoFactory } from '../factories/userInfo'

export class AccountInfoPage {
  readonly page: Page
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly daySelect: Locator
  readonly monthSelect: Locator
  readonly yearSelect: Locator
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly companyInput: Locator
  readonly address1Input: Locator
  readonly address2Input: Locator
  readonly countrySelect: Locator
  readonly stateInput: Locator
  readonly cityInput: Locator
  readonly zipcodeInput: Locator
  readonly mobileNumberInput: Locator
  readonly createAccountButton: Locator
  readonly enterAccountInfoHeader: Locator
  readonly signUpNewsletterCheckbox: Locator
  readonly receiveOffersCheckbox: Locator

  constructor(page: Page) {
    this.page = page

    this.nameInput = page.getByTestId('name')
    this.emailInput = page.getByTestId('email')
    this.passwordInput = page.getByTestId('password')
    this.daySelect = page.getByTestId('days')
    this.monthSelect = page.getByTestId('months')
    this.yearSelect = page.getByTestId('years')
    this.firstNameInput = page.getByTestId('first_name')
    this.lastNameInput = page.getByTestId('last_name')
    this.companyInput = page.getByTestId('company')
    this.address1Input = page.getByTestId('address')
    this.address2Input = page.getByTestId('address2')
    this.countrySelect = page.getByTestId('country')
    this.stateInput = page.getByTestId('state')
    this.cityInput = page.getByTestId('city')
    this.zipcodeInput = page.getByTestId('zipcode')
    this.mobileNumberInput = page.getByTestId('mobile_number')

    this.createAccountButton = page.getByRole('button', {
      name: /create account/i,
    })

    this.enterAccountInfoHeader = page.getByRole('heading', {
      name: /enter account information/i,
    })

    this.signUpNewsletterCheckbox = page.getByText('Sign up for our newsletter!')
    this.receiveOffersCheckbox = page.getByText('Receive special offers from our partners!')
  }

  async fillOutAccountInfo() {
    const randomUserData = userInfoFactory()

    await this.page.getByLabel(randomUserData.title).click()
    await this.passwordInput.fill(randomUserData.password)
    await this.daySelect.selectOption(randomUserData.birthDay)
    await this.monthSelect.selectOption(randomUserData.birthMonth)
    await this.yearSelect.selectOption(randomUserData.birthYear)
    await this.signUpNewsletterCheckbox.click()
    await this.receiveOffersCheckbox.click()
    await this.firstNameInput.fill(randomUserData.firstName)
    await this.lastNameInput.fill(randomUserData.lastName)
    await this.companyInput.fill(randomUserData.company)
    await this.address1Input.fill(randomUserData.address1)
    await this.address2Input.fill(randomUserData.address2)
    await this.countrySelect.selectOption(randomUserData.country)
    await this.stateInput.fill(randomUserData.state)
    await this.cityInput.fill(randomUserData.city)
    await this.zipcodeInput.fill(randomUserData.zipcode)
    await this.mobileNumberInput.fill(randomUserData.phoneNumber)

    return randomUserData
  }
}
