import { type Locator, type Page } from '@playwright/test'

export class SignupLoginPage {
  readonly page: Page
  readonly form: Locator
  readonly signUpForm: Locator
  readonly loginForm: Locator
  readonly nameInput: Locator
  readonly signupEmailAddressInput: Locator
  readonly loginEmailAddressInput: Locator
  readonly signUpButton: Locator
  readonly password: Locator
  readonly loginButton: Locator
  readonly logiinToYourAccountHeader: Locator
  readonly newUserSignUpHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.form = page.locator('form')
    this.signUpForm = this.form.filter({ hasText: 'Signup' })
    this.loginForm = this.form.filter({ hasText: 'Login' })
    this.nameInput = this.signUpForm.getByPlaceholder('Name')
    this.signupEmailAddressInput = this.signUpForm.getByPlaceholder('Email Address')
    this.loginEmailAddressInput = this.loginForm.getByPlaceholder('Email Address')
    this.password = this.loginForm.getByPlaceholder('Password')

    this.signUpButton = this.signUpForm.getByRole('button', {
      name: 'Signup',
    })

    this.loginButton = this.loginForm.getByRole('button', {
      name: /login/i,
    })

    this.logiinToYourAccountHeader = page.getByText('Login to your account')
    this.newUserSignUpHeader = page.getByText('New User Signup!')
  }

  async fillOutSignUpForm(fullName: string, email: string) {
    await this.nameInput.fill(fullName)
    await this.signupEmailAddressInput.fill(email)
  }

  async fillOutLoginForm(email: string, password: string) {
    await this.loginEmailAddressInput.fill(email)
    await this.password.fill(password)
  }
}
