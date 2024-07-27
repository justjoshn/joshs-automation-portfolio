import { faker } from '@faker-js/faker'

export const textContentFactory = (overrides = {}) => {
  return {
    paragraphs: faker.lorem.paragraphs(),
    paragraph: faker.lorem.paragraph(),
    words: faker.lorem.words(),
    ...overrides,
  }
}
