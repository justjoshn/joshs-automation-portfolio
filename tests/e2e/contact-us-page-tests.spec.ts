import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ContactUsPage } from './pages/contactUsPage'
import { ShopMenu } from './pages/shopMenu'
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)

  await page.goto('/')
  await homePage.productImageWrapper.first().waitFor()
  await shopMenu.contactUsLink.click()
})

// TODO: Figure out issue with uploading file
test.fixme('Contact Us Form', async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)
  const contactUsPage = new ContactUsPage(page)
  const randomName = faker.person.firstName()
  const randomEmail = faker.internet.email()
  const randomSubject = faker.lorem.words()
  const randomParagraph = faker.lorem.paragraph()

  await shopMenu.contactUsLink.click()
  await expect(page.getByText('GET IN TOUCH')).toBeVisible()
  await contactUsPage.nameInput.fill(randomName)
  await contactUsPage.emailInput.fill(randomEmail)
  await contactUsPage.subjectInput.fill(randomSubject)
  await contactUsPage.textArea.fill(randomParagraph)
  await contactUsPage.uploadFile()
  await contactUsPage.submitButton.click()

  await expect(
    page.getByText('Success! Your details have been submitted successfully.')
  ).toBeVisible()

  await shopMenu.homeLink.click()

  const allProducts = await homePage.productImageWrapper.all()

  for (const product of allProducts) {
    await product.scrollIntoViewIfNeeded()
    await expect(product).toBeVisible()
  }
})
