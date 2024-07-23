import { test, expect, request } from '@playwright/test'

test('Get All Products List', async ({ request }) => {
  const response = await request.get('/api/productsList')
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
