import { type Locator, type Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly featuredItems: Locator
  readonly viewProductLinks: Locator
  readonly productInfo: Locator
  readonly featuredItemAddToCartLink: Locator
  readonly featuredItemAddToCartLinkOverlay: Locator
  readonly productOverlays: Locator
  readonly productAddedModal: Locator
  readonly continueShoppingButton: Locator
  readonly viewCartLink: Locator
  readonly recommendedItems: Locator
  readonly activeRecommendedItems: Locator
  readonly recommendedItemAddToCartLink: Locator
  readonly recommendedItemName: Locator

  constructor(page: Page) {
    this.page = page

    this.featuredItems = page.locator('.features_items .product-image-wrapper')
    this.viewProductLinks = this.featuredItems.getByRole('listitem').getByRole('link')
    this.productInfo = this.featuredItems.locator('.productinfo')
    this.productOverlays = page.locator('.product-overlay')
    this.featuredItemAddToCartLink = this.productInfo.locator('.add-to-cart')
    this.featuredItemAddToCartLinkOverlay = this.productOverlays.locator('.add-to-cart')
    this.productAddedModal = page.locator('.modal-content')

    this.continueShoppingButton = this.productAddedModal.getByRole('button', {
      name: /continue shopping/i,
    })

    this.viewCartLink = this.productAddedModal.getByRole('link')
    this.recommendedItems = page.locator('.recommended_items')

    this.activeRecommendedItems = this.recommendedItems.locator(
      '.item.active .product-image-wrapper'
    )

    this.recommendedItemAddToCartLink = this.activeRecommendedItems.locator('.add-to-cart')
    this.recommendedItemName = this.activeRecommendedItems.locator('p')
  }
}
