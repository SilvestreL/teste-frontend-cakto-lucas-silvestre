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
 * Formata porcentagem
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2).replace(".", ",")}%`
}
