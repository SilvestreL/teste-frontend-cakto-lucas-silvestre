export type PaymentMethod = "pix" | "card"

export interface CheckoutInput {
  email: string
  cpf: string
  paymentMethod: PaymentMethod
  installments: number
}

export interface Product {
  id: string
  name: string
  originalPrice: number
  currentPrice: number
  producer: string
  format: string
  deliveryTime: string
  description?: string
  image?: string
}

export interface OrderSummary {
  product: Product
  paymentMethod: PaymentMethod
  installments: number
  rate: number
  total: number
  monthlyValue: number
  netValue: number
  savings: number
}
