import { type Locator, type Page } from '@playwright/test'

export class SubscriptionWidget {
  readonly page: Page
  readonly footerWidget: Locator
  readonly container: Locator
  readonly subscriptionHeader: Locator
  readonly emailAddressInput: Locator
  readonly submitButton: Locator
  readonly successSubscribe: Locator
  readonly successfulAlert: Locator

  constructor(page: Page) {
    this.page = page
    this.footerWidget = page.locator('.footer-widget')
    this.container = this.footerWidget.locator('.container')
    this.subscriptionHeader = this.container.getByRole('heading', { name: /subscription/i })
    this.emailAddressInput = this.container.getByPlaceholder('Your email address')
    this.submitButton = this.container.getByRole('button')
    this.successSubscribe = this.container.locator('#success-subscribe')
    this.successfulAlert = this.successSubscribe.getByText('You have been successfully subscribed!')
  }
}
