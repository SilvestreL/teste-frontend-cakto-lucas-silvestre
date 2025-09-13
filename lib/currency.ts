/**
 * Formata valor para moeda brasileira
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/**
 * Formata valor para moeda brasileira com precisão controlada
 */
export function formatBRLFixed(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formata porcentagem
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2).replace(".", ",")}%`
}

/**
 * Formata porcentagem com precisão controlada
 */
export function formatPercentFixed(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals).replace(".", ",")}%`
}
