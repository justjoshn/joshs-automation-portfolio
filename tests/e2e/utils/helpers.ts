import { faker } from '@faker-js/faker'
import { PersonalInfo, AddressInfo, FinancialInfo } from '../types/testData.types'

export const extractCategoryName = (fullText: string): string => {
  const match = fullText.match(/(?:\(\d+\)\s*•\s*)?(.+?)(?:\s*\(\d+\))?$/)
  return match ? match[1].trim() : fullText.trim()
}

export const generateRandomData = () => {
  const randomDate = faker.date.birthdate({
    min: 1982,
    max: 2006,
    mode: 'year',
  })

  const futureDate = faker.date.future({ years: 10 })

  const personalInfo: PersonalInfo = {
    fullName: faker.person.fullName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    title: faker.helpers.arrayElement(['Mr.', 'Mrs.']),
    password: faker.internet.password(),
    phoneNumber: faker.phone.number(),
    birthDay: randomDate.getDate().toString(),
    birthMonth: (randomDate.getMonth() + 1).toString(),
    birthYear: randomDate.getFullYear().toString(),
  }

  const addressInfo: AddressInfo = {
    country: faker.helpers.arrayElement([
      'India',
      'United States',
      'Canada',
      'Australia',
      'Israel',
      'New Zealand',
      'Singapore',
    ]),

    state: faker.location.state(),
    city: faker.location.city(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    zipCode: faker.location.zipCode(),
  }

  const financialInfo: FinancialInfo = {
    creditCardNumber: faker.finance.creditCardNumber(),
    cvcNumber: faker.finance.creditCardCVV(),
    expirationMonth: futureDate.getMonth().toString(),
    expirationYear: futureDate.getFullYear().toString(),
  }

  return {
    personalInfo,
    addressInfo,
    financialInfo,
    company: faker.company.name(),
    paragraph: faker.lorem.paragraph(),
  }
}

export const useStaticData = () => {
  const personalInfo = {
    fullName: 'firstName lastName',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'firstName@email.com',
    password: 'password',
    mobileNumber: '555-555-5555',
  }

  const addressInfo: AddressInfo = {
    country: 'United States',
    address1: '123 Address Ave',
    address2: 'Apt 1',
    state: 'stateName',
    city: 'cityName',
    zipCode: '12345',
  }

  return {
    personalInfo,
    addressInfo,
  }
}
