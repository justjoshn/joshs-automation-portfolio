import { type Locator, type Page } from '@playwright/test'

export class LeftSidebar {
  readonly page: Page
  readonly leftSidebar: Locator
  readonly categoryProducts: Locator
  readonly brandProducts: Locator
  readonly womenCategory: Locator
  readonly womenPanel: Locator
  readonly womenDressSubcategory: Locator
  readonly womenTopsSubcategory: Locator
  readonly womenSareeSubcategory: Locator
  readonly menCategory: Locator
  readonly menPanel: Locator
  readonly menTshirtsSubcategory: Locator
  readonly menJeansSubcategory: Locator

  constructor(page: Page) {
    this.page = page
    this.leftSidebar = page.locator('.left-sidebar')
    this.categoryProducts = this.leftSidebar.locator('.category-products')
    this.brandProducts = this.leftSidebar.locator('.brands_products')
    this.womenCategory = this.categoryProducts.getByRole('link', { name: ' Women' })
    this.womenPanel = this.categoryProducts.locator('#Women')
    this.womenDressSubcategory = this.womenPanel.getByRole('link', { name: /dress/i })
    this.womenTopsSubcategory = this.womenPanel.getByRole('link', { name: /tops/i })
    this.womenSareeSubcategory = this.womenPanel.getByRole('link', { name: /saree/i })
    this.menCategory = this.categoryProducts.getByRole('link', { name: ' Men' })
    this.menPanel = this.categoryProducts.locator('#Men')
    this.menTshirtsSubcategory = this.menPanel.getByRole('link', { name: /tshirts/i })
    this.menJeansSubcategory = this.menPanel.getByRole('link', { name: /jeans/i })
  }
}
