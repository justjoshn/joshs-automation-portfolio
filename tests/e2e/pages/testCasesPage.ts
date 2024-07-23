import { type Locator, type Page } from '@playwright/test'

export class TestCasesPage {
  readonly page: Page
  readonly testCasesHeader: Locator
  readonly panelGroup: Locator

  constructor(page: Page) {
    this.page = page

    this.testCasesHeader = page.getByRole('heading', {
      name: 'Test Cases',
      exact: true,
    })

    this.panelGroup = page.locator('.panel-group')
  }
}
