import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

const productsList = '/api/productsList'
const brandsList = '/api/brandsList'
const searchProduct = '/api/searchProduct'

test('Get All Products List', async ({ request }) => {
  const response = await request.get(productsList)
  const jsonResponse = await response.json()

  expect(response.status()).toBe(200)
  expect(jsonResponse).toHaveProperty('products')
  expect(Array.isArray(jsonResponse.products)).toBe(true)
  expect(jsonResponse.products.length).toBeGreaterThan(0)

  jsonResponse.products.forEach(product => {
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

test('Get All Brands List', async ({ request }) => {
  const response = await request.get(brandsList)
  const jsonResponse = await response.json()

  expect(response.status()).toBe(200)
  expect(jsonResponse).toHaveProperty('brands')
  expect(Array.isArray(jsonResponse.brands)).toBe(true)
  expect(jsonResponse.brands.length).toBeGreaterThan(0)

  jsonResponse.brands.forEach(brand => {
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

  expect(searchResponse.status()).toBe(200)

  const searchResults = await searchResponse.json()

  searchResults.products.forEach(product => {
    expect(product).toHaveProperty('name')
    expect(product.name).toBe(randomProduct)
  })
})
