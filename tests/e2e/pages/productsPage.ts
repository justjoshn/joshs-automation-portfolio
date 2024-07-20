import { type Locator, type Page } from '@playwright/test'

export class ProductsPage {
  readonly page: Page
  readonly allProductsHeader: Locator
  readonly productImageWrapper: Locator
  readonly productInfo: Locator
  readonly productPrice: Locator
  readonly productName: Locator
  readonly viewProductLink: Locator
  readonly addToCartLink: Locator
  readonly searchInput: Locator
  readonly submitSearchButton: Locator
  readonly searchedProductsHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.allProductsHeader = page.getByText('ALL PRODUCTS')
    this.productImageWrapper = page.locator('.product-image-wrapper')
    this.viewProductLink = this.productImageWrapper.getByRole('link', { name: /view product/i })
    this.productInfo = this.productImageWrapper.locator('.productinfo')
    this.productPrice = this.productInfo.getByRole('heading')
    this.productName = this.productInfo.locator('p')
    this.addToCartLink = this.productInfo.getByRole('link', { name: /add to cart/i })
    this.searchInput = page.getByPlaceholder('Search Product')
    this.submitSearchButton = page.getByRole('button', { name: '' })
    this.searchedProductsHeader = page.getByRole('heading', { name: /searched products/i })
  }
}
