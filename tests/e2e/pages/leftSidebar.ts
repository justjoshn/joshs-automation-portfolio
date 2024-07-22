import { type Locator, type Page } from '@playwright/test'

export class LeftSidebar {
  readonly page: Page
  readonly leftSidebar: Locator
  readonly categoryProducts: Locator
  readonly brandProducts: Locator
  readonly poloCategory: Locator
  readonly hmCategory: Locator
  readonly madameCategory: Locator
  readonly mastHarborCategory: Locator
  readonly babyhubCategory: Locator
  readonly allenSollyJuniorCategory: Locator
  readonly kookieKidsCategory: Locator
  readonly bibaCategory: Locator
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
    this.poloCategory = this.brandProducts.getByRole('link', { name: /polo/i })
    this.hmCategory = this.brandProducts.getByRole('link', { name: /h&m/i })
    this.madameCategory = this.brandProducts.getByRole('link', { name: /madame/i })
    this.mastHarborCategory = this.brandProducts.getByRole('link', { name: /mast & harbour/i })
    this.babyhubCategory = this.brandProducts.getByRole('link', { name: /babyhug/i })

    this.allenSollyJuniorCategory = this.brandProducts.getByRole('link', {
      name: /allen solly junior/i,
    })

    this.kookieKidsCategory = this.brandProducts.getByRole('link', { name: /biba/i })
    this.bibaCategory = this.brandProducts.getByRole('link', { name: /biba/i })
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
