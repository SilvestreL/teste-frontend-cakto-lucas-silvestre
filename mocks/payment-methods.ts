import { CreditCard, Smartphone, Banknote, Zap, Apple, Chrome, QrCode } from "lucide-react"

/**
 * Dados mockados dos métodos de pagamento
 */

export interface PaymentMethodData {
  id: string
  name: string
  iconName: string
  description: string
  highlight: boolean
  badge: string
  rate: number
  available: boolean
}

export const mockPaymentMethods: PaymentMethodData[] = [
  {
    id: "pix",
    name: "PIX",
    iconName: "QrCode",
    description: "Instantâneo e gratuito",
    highlight: true, // ← PIX fica com fundo verde na homepage
    badge: "0% taxa",
    rate: 0,
    available: true,
  },
  {
    id: "credit-card",
    name: "Cartão de Crédito",
    iconName: "CreditCard",
    description: "Até 12x sem juros",
    highlight: false,// ← Cartão fica com fundo normal
    badge: "A partir de 3,99%",
    rate: 0.0399,
    available: true,
  },
  {
    id: "boleto",
    name: "Boleto",
    iconName: "Banknote",
    description: "Tradicional e confiável",
    highlight: false,
    badge: "2,99%",
    rate: 0.0299,
    available: true,
  },
  {
    id: "nupay",
    name: "Nupay",
    iconName: "Smartphone",
    description: "Carteira digital Nubank",
    highlight: false,
    badge: "3,49%",
    rate: 0.0349,
    available: true,
  },
  {
    id: "picpay",
    name: "PicPay",
    iconName: "Smartphone",
    description: "Pagamento social",
    highlight: false,
    badge: "3,49%",
    rate: 0.0349,
    available: true,
  },
  {
    id: "google-pay",
    name: "Google Pay",
    iconName: "Chrome",
    description: "Pagamento rápido Google",
    highlight: false,
    badge: "3,99%",
    rate: 0.0399,
    available: true,
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    iconName: "Apple",
    description: "Touch ID e Face ID",
    highlight: false,
    badge: "3,99%",
    rate: 0.0399,
    available: true,
  },
]

/**
 * Mapa de ícones para renderização
 */
export const paymentIconMap = {
  QrCode,
  CreditCard,
  Banknote,
  Smartphone,
  Chrome,
  Apple,
} as const

/**
 * Métodos de pagamento destacados (para homepage)
 */
export const featuredPaymentMethods = mockPaymentMethods.filter(method => method.highlight)

/**
 * Métodos de pagamento disponíveis para checkout
 */
export const availablePaymentMethods = mockPaymentMethods.filter(method => method.available)

/**
 * Função para buscar método de pagamento por ID
 */
export function getPaymentMethodById(id: string): PaymentMethodData | undefined {
  return mockPaymentMethods.find(method => method.id === id)
}
