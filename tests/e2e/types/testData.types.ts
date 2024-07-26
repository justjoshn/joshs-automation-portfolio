export interface PersonalInfo {
  fullName: string
  firstName: string
  lastName: string
  email: string
  title: string
  password: string
  phoneNumber: string
  birthDay: string
  birthMonth: string
  birthYear: string
}

export interface AddressInfo {
  country: string
  state: string
  city: string
  address1: string
  address2: string
  zipCode: string
}

export interface FinancialInfo {
  creditCardNumber: string
  cvcNumber: string
  expirationMonth: string
  expirationYear: string
}
