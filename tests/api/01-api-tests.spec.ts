import { test, expect } from '@playwright/test'
import { Brand, Product } from './types/product.types'
import { faker } from '@faker-js/faker'

const productsList = '/api/productsList'
const brandsList = '/api/brandsList'
const searchProduct = '/api/searchProduct'
const verifyLogin = '/api/verifyLogin'
const createAccount = '/api/createAccount'
const deleteAccount = '/api/deleteAccount'
const updateAccount = '/api/updateAccount'
const getUserDetailByEmail = '/api/getUserDetailByEmail'
const requestMethodMessage = 'This request method is not supported.'
const email = 'firstName@email.com'
const password = 'password'
const randomFullName = faker.person.fullName()
const randomEmail = faker.internet.email()
const randomTitle = faker.helpers.arrayElement(['Mr.', 'Mrs.'])

const randomDate = faker.date.birthdate({
  min: 1982,
  max: 2006,
  mode: 'year',
})

const randomPassword = faker.internet.password()
const randomDay = randomDate.getDate().toString()
const randomMonth = (randomDate.getMonth() + 1).toString()
const randomYear = randomDate.getFullYear().toString()
const randomFirstName = faker.person.firstName()
const randomLastName = faker.person.lastName()
const randomCompany = faker.company.name()
const randomAddress1 = faker.location.streetAddress()
const randomAddress2 = faker.location.secondaryAddress()

const randomCountry = faker.helpers.arrayElement([
  'India',
  'United States',
  'Canada',
  'Australia',
  'Israel',
  'New Zealand',
  'Singapore',
])

const randomState = faker.location.state()
const randomCity = faker.location.city()
const randomZipCode = faker.location.zipCode()
const randomPhoneNumber = faker.phone.number()

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
      email: email,
      password: password,
    },
  })

  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(200)
  expect(jsonResponse.message).toBe('User exists!')
})

test('POST To Verify Login without email parameter', async ({ request }) => {
  const response = await request.post(verifyLogin, {
    form: {
      password: password,
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
      email: email,
      password: password,
    },
  })

  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(405)
  expect(jsonResponse.message).toBe(requestMethodMessage)
})

test('POST To Verify Login with invalid details', async ({ request }) => {
  const response = await request.post(verifyLogin, {
    form: {
      email: randomEmail,
      password: randomPassword,
    },
  })

  const jsonResponse = await response.json()

  expect(jsonResponse.responseCode).toBe(404)
  expect(jsonResponse.message).toBe('User not found!')
})

test('POST To Create/Register User Account', async ({ request }) => {
  const createUserResponse = await request.post(createAccount, {
    form: {
      name: randomFullName,
      email: randomEmail,
      password: randomPassword,
      title: randomTitle,
      birth_date: randomDate.getDate().toString(),
      birth_month: (randomDate.getMonth() + 1).toString(),
      birth_year: randomDate.getFullYear().toString(),
      firstname: randomFirstName,
      lastname: randomLastName,
      company: randomCompany,
      address1: randomAddress1,
      address2: randomAddress2,
      country: randomCountry,
      zipcode: randomZipCode,
      state: randomState,
      city: randomCity,
      mobile_number: randomPhoneNumber,
    },
  })

  const createUserJson = await createUserResponse.json()

  expect(createUserJson.responseCode).toBe(201)
  expect(createUserJson.message).toBe('User created!')
})

test('DELETE METHOD To Delete User Account', async ({ request }) => {
  const createUserResponse = await request.post(createAccount, {
    form: {
      name: randomFullName,
      email: randomEmail,
      password: randomPassword,
      title: randomTitle,
      birth_date: randomDate.getDate().toString(),
      birth_month: (randomDate.getMonth() + 1).toString(),
      birth_year: randomDate.getFullYear().toString(),
      firstname: randomFirstName,
      lastname: randomLastName,
      company: randomCompany,
      address1: randomAddress1,
      address2: randomAddress2,
      country: randomCountry,
      zipcode: randomZipCode,
      state: randomState,
      city: randomCity,
      mobile_number: randomPhoneNumber,
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
  const shortWord = faker.lorem.word({ strategy: 'shortest' })

  const createUserResponse = await request.post(createAccount, {
    form: {
      name: randomFullName,
      email: randomEmail,
      password: randomPassword,
      title: randomTitle,
      birth_date: randomDay,
      birth_month: randomMonth,
      birth_year: randomYear,
      firstname: randomFirstName,
      lastname: randomLastName,
      company: randomCompany,
      address1: randomAddress1,
      address2: randomAddress2,
      country: randomCountry,
      zipcode: randomZipCode,
      state: randomState,
      city: randomCity,
      mobile_number: randomPhoneNumber,
    },
  })

  expect(createUserResponse.ok()).toBeTruthy()

  const updateUserResponse = await request.put(updateAccount, {
    form: {
      name: randomFullName + shortWord,
      email: randomEmail,
      password: randomPassword,
      title: randomTitle + shortWord,
      birth_date: randomDay + shortWord,
      birth_month: randomMonth + shortWord,
      birth_year: randomYear + shortWord,
      firstname: randomFirstName + shortWord,
      lastname: randomLastName + shortWord,
      company: randomCompany + shortWord,
      address1: randomAddress1 + shortWord,
      address2: randomAddress2 + shortWord,
      country: randomCountry + shortWord,
      zipcode: randomZipCode + shortWord,
      state: randomState + shortWord,
      city: randomCity + shortWord,
      mobile_number: randomPhoneNumber + shortWord,
    },
  })

  const updateUserJson = await updateUserResponse.json()

  expect(updateUserJson.responseCode).toBe(200)
  expect(updateUserJson.message).toBe('User updated!')
})

test('GET user account detail by email', async ({ request }) => {
  const getUserDetailResponse = await request.get(getUserDetailByEmail, {
    params: {
      email: email,
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
