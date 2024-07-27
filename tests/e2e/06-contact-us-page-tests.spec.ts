import { test, expect } from '@playwright/test'
import { HomePage } from '../../src/pages/homePage'
import { ContactUsPage } from '../../src/pages/contactUsPage'
import { ShopMenu } from '../../src/components/shopMenu'
import { userInfoFactory } from '../../src/factories/userInfo'
import { textContentFactory } from '../../src/factories/textContent'

const randomUserData = userInfoFactory()
const randomTextContent = textContentFactory()

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
  await contactUsPage.nameInput.fill(randomUserData.fullName)
  await contactUsPage.emailInput.fill(randomUserData.email)
  await contactUsPage.subjectInput.fill(randomTextContent.words)
  await contactUsPage.textArea.fill(randomTextContent.paragraph)
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
