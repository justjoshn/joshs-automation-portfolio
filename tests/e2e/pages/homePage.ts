import { type Locator, type Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly productImageWrapper: Locator
  readonly viewProductLinks: Locator

  constructor(page: Page) {
    this.page = page
    this.productImageWrapper = page.locator('.product-image-wrapper')
    this.viewProductLinks = this.productImageWrapper.getByRole('listitem').getByRole('link')
  }
}
