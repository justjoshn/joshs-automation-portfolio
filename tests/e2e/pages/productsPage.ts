import { type Locator, type Page } from '@playwright/test'

export class ProductsPage {
  readonly page: Page
  readonly allProductsHeader: Locator
  readonly featuredItems: Locator
  readonly productInfo: Locator
  readonly productPrice: Locator
  readonly productName: Locator
  readonly viewProductLink: Locator
  readonly featuredItemAddToCartLink: Locator
  readonly searchInput: Locator
  readonly submitSearchButton: Locator
  readonly searchedProductsHeader: Locator
  readonly productAddedModal: Locator
  readonly continueShoppingButton: Locator
  readonly viewCartLink: Locator
  readonly productOverlays: Locator
  readonly featuredItemAddToCartLinkOverlay: Locator

  constructor(page: Page) {
    this.page = page
    this.allProductsHeader = page.getByText('ALL PRODUCTS')
    this.featuredItems = page.locator('.features_items .product-image-wrapper')
    this.viewProductLink = this.featuredItems.getByRole('link', { name: /view product/i })
    this.productInfo = this.featuredItems.locator('.productinfo')
    this.productPrice = this.productInfo.getByRole('heading')
    this.productName = this.productInfo.locator('p')
    this.featuredItemAddToCartLink = this.productInfo.locator('.add-to-cart')
    this.searchInput = page.getByPlaceholder('Search Product')
    this.submitSearchButton = page.getByRole('button', { name: '' })
    this.searchedProductsHeader = page.getByRole('heading', { name: /searched products/i })
    this.productAddedModal = page.locator('.modal-content')

    this.continueShoppingButton = this.productAddedModal.getByRole('button', {
      name: /continue shopping/i,
    })

    this.viewCartLink = this.productAddedModal.getByRole('link', { name: /view cart/i })
    this.productOverlays = page.locator('.product-overlay')
    this.featuredItemAddToCartLinkOverlay = this.productOverlays.locator('.btn')
  }
}
