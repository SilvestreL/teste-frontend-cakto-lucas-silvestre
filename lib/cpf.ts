/**
 * Aplica máscara de CPF
 */
export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

/**
 * Validação simples de CPF
 */
export function isValidCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "")

  if (numbers.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numbers)) return false

  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (10 - i)
  }

  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numbers.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numbers.charAt(10))) return false

  return true
}
