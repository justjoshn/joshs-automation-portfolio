import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { ContactUsPage } from './pages/contactUsPage'
import { ShopMenu } from './pages/shopMenu'

import { generateRandomData } from './utils/helpers'

const randomData = generateRandomData()

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)

  await page.goto('/')
  await homePage.featuredItems.first().waitFor()
  await shopMenu.contactUsLink.click()
})

// TODO: Figure out issue with uploading file
test.fixme('Contact Us Form', async ({ page }) => {
  const homePage = new HomePage(page)
  const shopMenu = new ShopMenu(page)
  const contactUsPage = new ContactUsPage(page)

  await shopMenu.contactUsLink.click()
  await expect(page.getByText('GET IN TOUCH')).toBeVisible()
  await contactUsPage.nameInput.fill(randomData.personalInfo.fullName)
  await contactUsPage.emailInput.fill(randomData.personalInfo.email)
  await contactUsPage.subjectInput.fill(randomData.words)
  await contactUsPage.textArea.fill(randomData.paragraph)
  await contactUsPage.uploadFile()
  await contactUsPage.submitButton.click()

  await expect(
    page.getByText('Success! Your details have been submitted successfully.')
  ).toBeVisible()

  await shopMenu.homeLink.click()

  const allProducts = await homePage.featuredItems.all()

  for (const product of allProducts) {
    await product.scrollIntoViewIfNeeded()
    await expect(product).toBeVisible()
  }
})
