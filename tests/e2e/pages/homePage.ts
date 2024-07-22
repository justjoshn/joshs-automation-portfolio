import { type Locator, type Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly productImageWrapper: Locator
  readonly viewProductLinks: Locator
  readonly productInfo: Locator
  readonly productAddToCartLink: Locator
  readonly overlayAddToCartLink: Locator
  readonly productOverlays: Locator
  readonly productAddedModal: Locator
  readonly continueShoppingButton: Locator

  constructor(page: Page) {
    this.page = page
    this.productImageWrapper = page.locator('.features_items .product-image-wrapper')
    this.viewProductLinks = this.productImageWrapper.getByRole('listitem').getByRole('link')
    this.productInfo = this.productImageWrapper.locator('.productinfo')
    this.productOverlays = page.locator('.product-overlay')
    this.productAddToCartLink = this.productInfo.locator('.btn')
    this.overlayAddToCartLink = this.productOverlays.locator('.btn')
    this.productAddedModal = page.locator('.modal-content')

    this.continueShoppingButton = this.productAddedModal.getByRole('button', {
      name: /continue shopping/i,
    })
  }
}
