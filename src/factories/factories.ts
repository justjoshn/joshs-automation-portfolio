import { UserInfo, FinancialInfo } from '../types/testData.types'
import { faker } from '@faker-js/faker'

const randomBirthDate = faker.date.birthdate({
  min: 1982,
  max: 2006,
  mode: 'year',
})

const futureDate = faker.date.future({ years: 10 })

export const userInfoFactory = (overrides: Partial<UserInfo> = {}): UserInfo => {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    title: faker.helpers.arrayElement(['Mr.', 'Mrs.']),
    birthDay: randomBirthDate.getDate().toString(),
    birthMonth: (randomBirthDate.getMonth() + 1).toString(),
    birthYear: randomBirthDate.getFullYear().toString(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),

    country: faker.helpers.arrayElement([
      'India',
      'United States',
      'Canada',
      'Australia',
      'Israel',
      'New Zealand',
      'Singapore',
    ]),

    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    phoneNumber: faker.phone.number(),
    ...overrides,
  }
}

export const creditCardInfoFactory = (overrides: Partial<FinancialInfo> = {}): FinancialInfo => {
  return {
    creditCardNumber: faker.finance.creditCardNumber(),
    cvcNumber: faker.finance.creditCardCVV(),
    expirationMonth: futureDate.getMonth().toString(),
    expirationYear: futureDate.getFullYear().toString(),
    ...overrides,
  }
}

export const textContentFactory = (overrides = {}) => {
  return {
    paragraphs: faker.lorem.paragraphs(),
    paragraph: faker.lorem.paragraph(),
    words: faker.lorem.words(),
    ...overrides,
  }
}
