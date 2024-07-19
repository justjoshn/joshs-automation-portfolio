import { type Locator, type Page } from '@playwright/test'

export class HomePage {
    readonly page: Page
    readonly productImage: Locator

    constructor(page: Page) {
        this.page = page
        this.productImage = page.getByAltText('ecommerce website products')
    }
}
