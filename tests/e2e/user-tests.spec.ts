import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homePage'
import { HeaderPage } from './pages/headerPage'
import { SignupLoginPage } from './pages/signupLoginPage'
import { faker } from '@faker-js/faker'
 
test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Register User', async ({ page }) => {
    const homePage = new HomePage(page)
    const headerPage = new HeaderPage(page)
    const signUpLoginPage = new SignupLoginPage(page)
    const randomName = faker.person.firstName()
    const randomEmail = faker.internet.email()
    const randomTitle = faker.helpers.arrayElement(['Mr.', 'Mrs.'])

    await homePage.productImage.first().waitFor()
    await headerPage.signupLoginLink.click()

    await expect(page.getByText('New User Signup!')).toBeVisible()

    await signUpLoginPage.nameInput.fill(randomName)
    await signUpLoginPage.signupEmailAddressInput.fill(randomEmail)
    await signUpLoginPage.signUpButton.click()

    await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible()

    await page.getByLabel(randomTitle).click()
    await expect()
})
