import { test, expect } from '@playwright/test'
import { Brand, Product } from './types/product.types'
import { faker } from '@faker-js/faker'
import { generateRandomData, useStaticData } from '../e2e/utils/helpers'

const randomData = generateRandomData()
const randomData2 = generateRandomData()
const staticData = useStaticData()

const productsList = '/api/productsList'
const brandsList = '/api/brandsList'
const searchProduct = '/api/searchProduct'
const verifyLogin = '/api/verifyLogin'
const createAccount = '/api/createAccount'
const deleteAccount = '/api/deleteAccount'
const updateAccount = '/api/updateAccount'
const getUserDetailByEmail = '/api/getUserDetailByEmail'
const requestMethodMessage = 'This request method is not supported.'

test('Get All Products List', async ({ request }) => {
  const response = await request.get(productsList)
  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(200)
  expect(jsonResponse).toHaveProperty('products')
  expect(Array.isArray(jsonResponse.products)).toBe(true)
  expect(jsonResponse.products.length).toBeGreaterThan(0)
  expect(jsonResponse.products).toBeTruthy()

  jsonResponse.products.forEach((product: Product) => {
    expect(product).toHaveProperty('id')
    expect(typeof product.id).toBe('number')
    expect(product).toHaveProperty('name')
    expect(typeof product.name).toBe('string')
    expect(product).toHaveProperty('price')
    expect(product.price).toMatch(/^Rs\. \d+$/)
    expect(product).toHaveProperty('brand')
    expect(typeof product.brand).toBe('string')
    expect(product).toHaveProperty('category')
    expect(product.category).toHaveProperty('usertype')
    expect(product.category).toHaveProperty('category')
    expect(product.category.usertype).toHaveProperty('usertype')
    expect(['Women', 'Men', 'Kids']).toContain(product.category.usertype.usertype)

    expect(['Tops', 'Tshirts', 'Dress', 'Tops & Shirts', 'Jeans', 'Saree']).toContain(
      product.category.category
    )
  })
})

test('POST To All Products List', async ({ request }) => {
  const response = await request.post(productsList)
  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(405)
  expect(jsonResponse.message).toBe(requestMethodMessage)
})

test('Get All Brands List', async ({ request }) => {
  const response = await request.get(brandsList)
  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(200)
  expect(jsonResponse).toHaveProperty('brands')
  expect(Array.isArray(jsonResponse.brands)).toBe(true)
  expect(jsonResponse.brands.length).toBeGreaterThan(0)
  expect(jsonResponse.brands).toBeTruthy()

  jsonResponse.brands.forEach((brand: Brand) => {
    expect(brand).toHaveProperty('id')
    expect(typeof brand.id).toBe('number')
    expect(brand).toHaveProperty('brand')
    expect(typeof brand.brand).toBe('string')

    expect([
      'Polo',
      'H&M',
      'Madame',
      'Mast & Harbour',
      'Babyhug',
      'Allen Solly Junior',
      'Kookie Kids',
      'Biba',
    ]).toContain(brand.brand)
  })
})

test('PUT To All Brands List', async ({ request }) => {
  const response = await request.put(brandsList)
  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(405)
  expect(jsonResponse.message).toBe(requestMethodMessage)
})

test('POST To Search Product', async ({ request }) => {
  const getAllProductsResponse = await request.get(productsList)
  const products = await getAllProductsResponse.json()

  expect(getAllProductsResponse.ok()).toBeTruthy()

  const randomIndex: number = faker.number.int({ min: 0, max: products.products.length - 1 })
  const randomProduct = products.products[randomIndex].name

  const searchResponse = await request.post(searchProduct, {
    form: {
      search_product: randomProduct,
    },
  })

  const searchResults = await searchResponse.json()

  expect(searchResults.responseCode).toBe(200)

  searchResults.products.forEach((product: Product) => {
    expect(product).toHaveProperty('name')
    expect(product.name).toBe(randomProduct)
  })
})

test('POST To Search Product without search_product parameter', async ({ request }) => {
  const response = await request.post(searchProduct)
  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(400)

  expect(jsonResponse.message).toBe(
    'Bad request, search_product parameter is missing in POST request.'
  )
})

test('POST To Verify Login with valid details', async ({ request }) => {
  const response = await request.post(verifyLogin, {
    form: {
      email: staticData.personalInfo.email,
      password: staticData.personalInfo.password,
    },
  })

  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(200)
  expect(jsonResponse.message).toBe('User exists!')
})

test('POST To Verify Login without email parameter', async ({ request }) => {
  const response = await request.post(verifyLogin, {
    form: {
      password: randomData.personalInfo.password,
    },
  })

  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(400)

  expect(jsonResponse.message).toBe(
    'Bad request, email or password parameter is missing in POST request.'
  )
})

test('DELETE To Verify Login', async ({ request }) => {
  const response = await request.delete(verifyLogin, {
    form: {
      email: staticData.personalInfo.email,
      password: staticData.personalInfo.password,
    },
  })

  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(405)
  expect(jsonResponse.message).toBe(requestMethodMessage)
})

test('POST To Verify Login with invalid details', async ({ request }) => {
  const response = await request.post(verifyLogin, {
    form: {
      email: randomData.personalInfo.email,
      password: randomData.personalInfo.password,
    },
  })

  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(404)
  expect(jsonResponse.message).toBe('User not found!')
})

test('POST To Create/Register User Account', async ({ request }) => {
  const createUserResponse = await request.post(createAccount, {
    form: {
      name: randomData.personalInfo.fullName,
      email: randomData.personalInfo.email,
      password: randomData.personalInfo.password,
      title: randomData.personalInfo.title,
      birth_date: randomData.personalInfo.birthDay,
      birth_month: randomData.personalInfo.birthMonth,
      birth_year: randomData.personalInfo.birthYear,
      firstname: randomData.personalInfo.firstName,
      lastname: randomData.personalInfo.lastName,
      company: randomData.company,
      address1: randomData.addressInfo.address1,
      address2: randomData.addressInfo.address2,
      country: randomData.addressInfo.country,
      zipcode: randomData.addressInfo.zipCode,
      state: randomData.addressInfo.state,
      city: randomData.addressInfo.city,
      mobile_number: randomData.personalInfo.phoneNumber,
    },
  })

  const createUserJson = await createUserResponse.json()

  expect(createUserJson.responseCode).toBe(201)
  expect(createUserJson.message).toBe('User created!')
})

test('DELETE METHOD To Delete User Account', async ({ request }) => {
  const randomEmail = randomData.personalInfo.email
  const randomPassword = randomData.personalInfo.password

  const createUserResponse = await request.post(createAccount, {
    form: {
      name: randomData.personalInfo.fullName,
      email: randomEmail,
      password: randomPassword,
      title: randomData.personalInfo.title,
      birth_date: randomData.personalInfo.birthDay,
      birth_month: randomData.personalInfo.birthMonth,
      birth_year: randomData.personalInfo.birthYear,
      firstname: randomData.personalInfo.firstName,
      lastname: randomData.personalInfo.lastName,
      company: randomData.company,
      address1: randomData.addressInfo.address1,
      address2: randomData.addressInfo.address2,
      country: randomData.addressInfo.country,
      zipcode: randomData.addressInfo.zipCode,
      state: randomData.addressInfo.state,
      city: randomData.addressInfo.city,
      mobile_number: randomData.personalInfo.phoneNumber,
    },
  })

  expect(createUserResponse.ok()).toBeTruthy()

  const deleteUserResponse = await request.delete(deleteAccount, {
    form: {
      email: randomEmail,
      password: randomPassword,
    },
  })

  const deleteUserJson = await deleteUserResponse.json()

  expect(deleteUserJson.responseCode).toBe(200)
  expect(deleteUserJson.message).toBe('Account deleted!')
})

test('PUT METHOD To Update User Account', async ({ request }) => {
  const createUserResponse = await request.post(createAccount, {
    form: {
      name: randomData.personalInfo.fullName,
      email: randomData.personalInfo.email,
      password: randomData.personalInfo.password,
      title: randomData.personalInfo.title,
      birth_date: randomData.personalInfo.birthDay,
      birth_month: randomData.personalInfo.birthMonth,
      birth_year: randomData.personalInfo.birthYear,
      firstname: randomData.personalInfo.firstName,
      lastname: randomData.personalInfo.lastName,
      company: randomData.company,
      address1: randomData.addressInfo.address1,
      address2: randomData.addressInfo.address2,
      country: randomData.addressInfo.country,
      zipcode: randomData.addressInfo.zipCode,
      state: randomData.addressInfo.state,
      city: randomData.addressInfo.city,
      mobile_number: randomData.personalInfo.phoneNumber,
    },
  })

  expect(createUserResponse.ok()).toBeTruthy()

  const updateUserResponse = await request.put(updateAccount, {
    form: {
      name: randomData2.personalInfo.fullName,
      email: randomData.personalInfo.email,
      password: randomData.personalInfo.password,
      title: randomData2.personalInfo.title,
      birth_date: randomData2.personalInfo.birthDay,
      birth_month: randomData2.personalInfo.birthMonth,
      birth_year: randomData2.personalInfo.birthYear,
      firstname: randomData2.personalInfo.firstName,
      lastname: randomData2.personalInfo.lastName,
      company: randomData2.company,
      address1: randomData2.addressInfo.address1,
      address2: randomData2.addressInfo.address2,
      country: randomData2.addressInfo.country,
      zipcode: randomData2.addressInfo.zipCode,
      state: randomData2.addressInfo.state,
      city: randomData2.addressInfo.city,
      mobile_number: randomData2.personalInfo.phoneNumber,
    },
  })

  const updateUserJson = await updateUserResponse.json()

  expect(updateUserJson.responseCode).toBe(200)
  expect(updateUserJson.message).toBe('User updated!')
})

test('GET user account detail by email', async ({ request }) => {
  const getUserDetailResponse = await request.get(getUserDetailByEmail, {
    params: {
      email: staticData.personalInfo.email,
    },
  })

  const getUserDetailJson = await getUserDetailResponse.json()

  expect(getUserDetailJson.responseCode).toBe(200)
  expect(getUserDetailJson).toHaveProperty('user')
  expect(typeof getUserDetailJson.user).toBe('object')
  expect(Array.isArray(getUserDetailJson.user)).toBe(false)
  expect(getUserDetailJson.user).toBeTruthy()
  expect(getUserDetailJson.user).toHaveProperty('id')
  expect(typeof getUserDetailJson.user.id).toBe('number')
  expect(getUserDetailJson.user).toHaveProperty('email')
  expect(typeof getUserDetailJson.user.email).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('title')
  expect(typeof getUserDetailJson.user.title).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('birth_day')
  expect(typeof getUserDetailJson.user.birth_day).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('birth_month')
  expect(typeof getUserDetailJson.user.birth_month).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('birth_year')
  expect(typeof getUserDetailJson.user.birth_year).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('first_name')
  expect(typeof getUserDetailJson.user.first_name).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('last_name')
  expect(typeof getUserDetailJson.user.last_name).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('company')
  expect(typeof getUserDetailJson.user.company).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('address1')
  expect(typeof getUserDetailJson.user.address1).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('address2')
  expect(typeof getUserDetailJson.user.address2).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('country')
  expect(typeof getUserDetailJson.user.country).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('state')
  expect(typeof getUserDetailJson.user.state).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('city')
  expect(typeof getUserDetailJson.user.city).toBe('string')
  expect(getUserDetailJson.user).toHaveProperty('zipcode')
  expect(typeof getUserDetailJson.user.zipcode).toBe('string')
})
