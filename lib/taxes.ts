export type PaymentMethod = "pix" | "card"

export interface InstallmentOption {
  value: number
  label: string
  rate: number
  monthlyValue: number
}

/**
 * Calcula a taxa baseada no método de pagamento e parcelas
 */
export function calcRate(method: PaymentMethod, installments = 1): number {
  if (method === "pix") return 0

  if (method === "card") {
    if (installments === 1) return 0.0399 // 3,99%
    return 0.0499 + 0.02 * (installments - 1) // 4,99% + 2% por parcela extra
  }

  return 0
}

/**
 * Calcula o total que o comprador vai pagar
 */
export function calcTotal(value: number, rate: number): number {
  return value * (1 + rate)
}

/**
 * Calcula o valor da parcela
 */
export function calcInstallment(total: number, installments: number): number {
  return total / installments
}

/**
 * Calcula o valor líquido que o produtor recebe
 */
export function calcNet(originalValue: number, total: number): number {
  return originalValue - (total - originalValue)
}

/**
 * Gera opções de parcelamento para cartão
 */
export function generateInstallmentOptions(value: number): InstallmentOption[] {
  const options: InstallmentOption[] = []

  for (let i = 1; i <= 12; i++) {
    const rate = calcRate("card", i)
    const total = calcTotal(value, rate)
    const monthlyValue = calcInstallment(total, i)

    options.push({
      value: i,
      label: i === 1 ? "1x sem juros" : `${i}x de`,
      rate,
      monthlyValue,
    })
  }

  return options
}
