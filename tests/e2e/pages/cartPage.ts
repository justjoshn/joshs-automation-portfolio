import { type Locator, type Page } from '@playwright/test'

export class CartPage {
  readonly page: Page

  private firstNameSelector: string
  private lastNameSelector: string
  private address1Selector: string
  private address2Selector: string
  private citySelector: string
  private stateSelector: string
  private postalCodeSelector: string
  private countrySelector: string
  private phoneNumberSelector: string

  readonly cartInfoTable: Locator
  readonly cartProducts: Locator
  readonly cartDescriptions: Locator
  readonly productNames: Locator
  readonly productPrices: Locator
  readonly productQuantities: Locator
  readonly productTotalPrices: Locator
  readonly proceedToCheckout: Locator
  readonly checkoutModal: Locator
  readonly registerLoginLink: Locator
  readonly deliveryAddressBox: Locator
  readonly deliveryFirstName: Locator
  readonly deliveryLastName: Locator
  readonly deliveryAddress1: Locator
  readonly deliveryAddress2: Locator
  readonly deliveryCity: Locator
  readonly deliveryState: Locator
  readonly deliveryPostCode: Locator
  readonly deliveryCountry: Locator
  readonly deliveryPhoneNumber: Locator
  readonly billingAddressBox: Locator
  readonly billingFirstName: Locator
  readonly billingLastName: Locator
  readonly billingAddress1: Locator
  readonly billingAddress2: Locator
  readonly billingCity: Locator
  readonly billingState: Locator
  readonly billingPostCode: Locator
  readonly billingCountry: Locator
  readonly billingPhoneNumber: Locator
  readonly commentTextArea: Locator
  readonly placeOrderLink: Locator
  readonly paymentForm: Locator
  readonly nameOnCardInput: Locator
  readonly cardNumberInput: Locator
  readonly cvcInput: Locator
  readonly expirationMonthInput: Locator
  readonly expirationYearInput: Locator
  readonly payConfirmOrderButton: Locator
  readonly orderSuccessfulMessage: Locator
  readonly cartQuantityDeleteLink: Locator

  constructor(page: Page) {
    this.page = page

    this.firstNameSelector = '.address_firstname'
    this.lastNameSelector = '.address_lastname'
    this.address1Selector = '.address_address1'
    this.address2Selector = '.address_address2'
    this.citySelector = '.address_city'
    this.stateSelector = '.address_state_name'
    this.postalCodeSelector = '.address_postcode'
    this.countrySelector = '.address_country_name'
    this.phoneNumberSelector = '.address_phone'

    this.cartInfoTable = page.locator('#cart_info_table')
    this.cartProducts = this.cartInfoTable.locator('.cart_product')
    this.cartDescriptions = this.cartInfoTable.locator('.cart_description')
    this.productNames = this.cartDescriptions.getByRole('link')
    this.productPrices = this.cartInfoTable.locator('.cart_price > p')
    this.productQuantities = this.cartInfoTable.locator('.cart_quantity').getByRole('button')
    this.productTotalPrices = this.cartInfoTable.locator('.cart_total_price')
    this.proceedToCheckout = page.getByText('Proceed To Checkout')
    this.checkoutModal = page.locator('.modal-content')
    this.registerLoginLink = this.checkoutModal.getByRole('link').getByText('Register / Login')
    this.deliveryAddressBox = page.locator('#address_delivery')
    this.deliveryFirstName = this.deliveryAddressBox.locator(this.firstNameSelector)
    this.deliveryLastName = this.deliveryAddressBox.locator(this.lastNameSelector)
    this.deliveryAddress1 = this.deliveryAddressBox.locator(this.address1Selector)
    this.deliveryAddress2 = this.deliveryAddressBox.locator(this.address2Selector)
    this.deliveryCity = this.deliveryAddressBox.locator(this.citySelector)
    this.deliveryState = this.deliveryAddressBox.locator(this.stateSelector)
    this.deliveryPostCode = this.deliveryAddressBox.locator(this.postalCodeSelector)
    this.deliveryCountry = this.deliveryAddressBox.locator(this.countrySelector)
    this.deliveryPhoneNumber = this.deliveryAddressBox.locator(this.phoneNumberSelector)
    this.billingAddressBox = page.locator('#address_invoice')
    this.billingFirstName = this.billingAddressBox.locator(this.firstNameSelector)
    this.billingLastName = this.billingAddressBox.locator(this.lastNameSelector)
    this.billingAddress1 = this.billingAddressBox.locator(this.address1Selector)
    this.billingAddress2 = this.billingAddressBox.locator(this.address2Selector)
    this.billingCity = this.billingAddressBox.locator(this.citySelector)
    this.billingState = this.billingAddressBox.locator(this.stateSelector)
    this.billingPostCode = this.billingAddressBox.locator(this.postalCodeSelector)
    this.billingCountry = this.billingAddressBox.locator(this.countrySelector)
    this.billingPhoneNumber = this.billingAddressBox.locator(this.phoneNumberSelector)
    this.commentTextArea = page.locator('textarea')
    this.placeOrderLink = page.getByRole('link', { name: /place order/i })
    this.paymentForm = page.locator('#payment-form')
    this.nameOnCardInput = this.paymentForm.getByTestId('name-on-card')
    this.cardNumberInput = this.paymentForm.getByTestId('card-number')
    this.cvcInput = this.paymentForm.getByPlaceholder('ex. 311')
    this.expirationMonthInput = this.paymentForm.getByPlaceholder('MM')
    this.expirationYearInput = this.paymentForm.getByPlaceholder('YYYY')

    this.payConfirmOrderButton = this.paymentForm.getByRole('button', {
      name: /pay and confirm order/i,
    })

    this.orderSuccessfulMessage = page.getByText(/your order has been placed successfully/i)
    this.cartQuantityDeleteLink = this.cartInfoTable.locator('.cart_quantity_delete')
  }
}
