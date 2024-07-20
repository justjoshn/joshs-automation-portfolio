import { type Locator, type Page } from '@playwright/test'

export class ProductDetailsPage {
  readonly page: Page
  readonly productInformation: Locator
  readonly productName: Locator
  readonly productCategory: Locator
  readonly productPrice: Locator
  readonly productAvailability: Locator
  readonly productCondition: Locator
  readonly productBrand: Locator

  constructor(page: Page) {
    this.page = page
    this.productInformation = page.locator('.product-information')
    this.productName = this.productInformation.getByRole('heading')
    this.productCategory = this.productInformation.locator('p', { hasText: 'Category:' })
    this.productPrice = this.productInformation.locator('span > span')
    this.productAvailability = this.productInformation.locator('p', { hasText: 'Availability:' })
    this.productCondition = this.productInformation.locator('p', { hasText: 'Condition:' })
    this.productBrand = this.productInformation.locator('p', { hasText: 'Brand:' })
  }
}
