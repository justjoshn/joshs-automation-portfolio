import { UserInfo } from '../types/testData.types'
import { faker } from '@faker-js/faker'

const randomBirthDate = faker.date.birthdate({
  min: 1982,
  max: 2006,
  mode: 'year',
})

const userTitleArray = ['Mr.', 'Mrs.']

const userCountryArray = [
  'India',
  'United States',
  'Canada',
  'Australia',
  'Israel',
  'New Zealand',
  'Singapore',
]

export const userInfoFactory = (overrides: Partial<UserInfo> = {}): UserInfo => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    password: faker.internet.password(),
    title: faker.helpers.arrayElement(userTitleArray),
    birthDay: randomBirthDate.getDate().toString(),
    birthMonth: (randomBirthDate.getMonth() + 1).toString(),
    birthYear: randomBirthDate.getFullYear().toString(),
    firstName: firstName,
    lastName: lastName,
    fullName: faker.person.fullName({ firstName: firstName, lastName: lastName }),
    email: faker.internet.email({ firstName: firstName, lastName: lastName }),
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(userCountryArray),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    phoneNumber: faker.phone.number(),
    ...overrides,
  }
}

export const userInfoFactories = (length: number) =>
  Array.from({ length: length }, () => userInfoFactory())
