import { FinancialInfo } from '../types/testData.types'
import { faker } from '@faker-js/faker'

const futureDate = faker.date.future({ years: 10 })

export const creditCardInfoFactory = (overrides: Partial<FinancialInfo> = {}): FinancialInfo => {
  return {
    creditCardNumber: faker.finance.creditCardNumber(),
    cvcNumber: faker.finance.creditCardCVV(),
    expirationMonth: futureDate.getMonth().toString(),
    expirationYear: futureDate.getFullYear().toString(),
    ...overrides,
  }
}
