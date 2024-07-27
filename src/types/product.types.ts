export interface Category {
  usertype: UserType
  category: string
}

export interface UserType {
  usertype: string
}

export interface Product {
  id: number
  name: string
  price: string
  brand: string
  category: Category
}

export interface Brand {
  id: number
  brand: string
}
