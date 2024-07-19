import { type Locator, type Page } from '@playwright/test'

export class HeaderPage {
  readonly page: Page
  readonly homeLink: Locator
  readonly productsLink: Locator
  readonly cartLink: Locator
  readonly signupLoginLink: Locator
  readonly testCasesLink: Locator
  readonly apiTestingLink: Locator
  readonly contactUsLink: Locator
  readonly deleteAccountLink: Locator

  constructor(page: Page) {
    this.page = page
    this.homeLink = page.getByRole('link', { name: /home/i })
    this.productsLink = page.getByRole('link', { name: /products/i })
    this.cartLink = page.getByRole('link', { name: /cart/i })

    this.signupLoginLink = page.getByRole('link', {
      name: ' Signup / Login',
    })

    this.testCasesLink = page.getByRole('link', { name: /test cases/i })
    this.apiTestingLink = page.getByRole('link', { name: /api testing/i })
    this.contactUsLink = page.getByRole('link', { name: /contact us/i })

    this.deleteAccountLink = page.getByRole('link', {
      name: /delete account/i,
    })
  }
}
