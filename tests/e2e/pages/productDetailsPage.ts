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
  readonly quantityInput: Locator
  readonly addToCartButton: Locator
  readonly productAddedModal: Locator
  readonly continueShoppingButton: Locator
  readonly viewCartLink: Locator
  readonly shopDetailsTab: Locator
  readonly writeYourReviewText: Locator
  readonly yourNameInput: Locator
  readonly emailAddressInput: Locator
  readonly addReviewHereTextArea: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.productInformation = page.locator('.product-information')
    this.productName = this.productInformation.getByRole('heading')
    this.productCategory = this.productInformation.locator('p', { hasText: 'Category:' })
    this.productPrice = this.productInformation.locator('span > span')
    this.productAvailability = this.productInformation.locator('p', { hasText: 'Availability:' })
    this.productCondition = this.productInformation.locator('p', { hasText: 'Condition:' })
    this.productBrand = this.productInformation.locator('p', { hasText: 'Brand:' })
    this.quantityInput = this.productInformation.locator('#quantity')
    this.addToCartButton = this.productInformation.getByRole('button', { name: /add to cart/i })
    this.productAddedModal = page.locator('.modal-content')

    this.continueShoppingButton = this.productAddedModal.getByRole('button', {
      name: /continue shopping/i,
    })

    this.viewCartLink = this.productAddedModal.getByRole('link', { name: /view cart/i })
    this.shopDetailsTab = page.locator('.shop-details-tab')
    this.writeYourReviewText = this.shopDetailsTab.getByText(/write your review/i)
    this.yourNameInput = this.shopDetailsTab.getByPlaceholder('Your Name')
    this.emailAddressInput = this.shopDetailsTab.getByPlaceholder('Email Address')
    this.addReviewHereTextArea = this.shopDetailsTab.getByPlaceholder('Add Review Here!')
    this.submitButton = this.shopDetailsTab.getByRole('button', { name: /submit/i })
  }
}
