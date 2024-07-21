import { type Locator, type Page } from '@playwright/test'

export class CartPage {
  readonly page: Page
  readonly cartProducts: Locator
  readonly cartDescriptions: Locator
  readonly productNames: Locator
  readonly productPrices: Locator
  readonly productQuantities: Locator
  readonly productTotalPrices: Locator

  constructor(page: Page) {
    this.page = page
    this.cartProducts = page.locator('.cart_product')
    this.cartDescriptions = page.locator('.cart_description')
    this.productNames = this.cartDescriptions.getByRole('link')
    this.productPrices = this.page.locator('.cart_price > p')
    this.productQuantities = this.page.locator('.cart_quantity').getByRole('button')
    this.productTotalPrices = this.page.locator('.cart_total_price')
  }
}
