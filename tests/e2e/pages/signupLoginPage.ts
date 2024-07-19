import { type Locator, type Page } from '@playwright/test'

export class SignupLoginPage {
    readonly page: Page
    readonly form: Locator
    readonly signForm: Locator
    readonly loginForm: Locator
    readonly nameInput: Locator
    readonly emailAddressPlaceholder: Locator
    readonly signupEmailAddressInput: Locator
    readonly loginEmailAddressInput: Locator
    readonly passwordInput: Locator
    readonly signUpButton: Locator

    constructor(page: Page) {
        this.page = page
        this.form = page.locator('form')
        this.signForm = this.form.filter({ hasText: 'Signup' })
        this.loginForm = this.form.filter({ hasText: 'Login' })
        this.nameInput = this.signForm.getByPlaceholder('Name')

        this.signupEmailAddressInput =
            this.signForm.getByPlaceholder('Email Address')

        this.loginEmailAddressInput =
            this.loginForm.getByPlaceholder('Email Address')

        this.signUpButton = this.signForm.getByRole('button', {
            name: 'Signup',
        })
    }
}
