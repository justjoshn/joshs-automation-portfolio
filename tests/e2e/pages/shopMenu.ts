import { type Locator, type Page } from '@playwright/test'

export class ShopMenu {
  readonly page: Page
  readonly navBar: Locator
  readonly homeLink: Locator
  readonly productsLink: Locator
  readonly cartLink: Locator
  readonly signupLoginLink: Locator
  readonly testCasesLink: Locator
  readonly apiTestingLink: Locator
  readonly contactUsLink: Locator
  readonly deleteAccountLink: Locator
  readonly logoutLink: Locator

  constructor(page: Page) {
    this.page = page
    this.navBar = page.locator('.nav.navbar-nav')
    this.homeLink = this.navBar.getByRole('link', { name: /home/i })
    this.productsLink = this.navBar.getByRole('link', { name: /products/i })
    this.cartLink = this.navBar.getByRole('link', { name: /cart/i })

    this.signupLoginLink = this.navBar.getByRole('link', {
      name: ' Signup / Login',
    })

    this.testCasesLink = this.navBar.getByRole('link', { name: /test cases/i })
    this.apiTestingLink = this.navBar.getByRole('link', { name: /api testing/i })
    this.contactUsLink = this.navBar.getByRole('link', { name: /contact us/i })

    this.deleteAccountLink = this.navBar.getByRole('link', {
      name: /delete account/i,
    })

    this.logoutLink = this.navBar.getByRole('link', { name: /logout/i })
  }
}
