import { type Locator, type Page } from '@playwright/test'

export class ContactUsPage {
  readonly page: Page
  readonly contactForm: Locator
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly subjectInput: Locator
  readonly textArea: Locator
  readonly chooseFileInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.contactForm = page.locator('.contact-form')
    this.nameInput = this.contactForm.getByPlaceholder('Name')
    this.emailInput = this.contactForm.getByPlaceholder('Email')
    this.subjectInput = this.contactForm.getByPlaceholder('Subject')
    this.textArea = this.contactForm.getByPlaceholder('Your Message Here')
    this.chooseFileInput = this.contactForm.locator('input[type="file"]')
    this.submitButton = this.contactForm.getByRole('button', { name: /submit/i })
  }

  async uploadFile() {
    await this.chooseFileInput.setInputFiles({
      name: 'fakefile.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('This is a fake PDF file content'),
    })
  }
}
