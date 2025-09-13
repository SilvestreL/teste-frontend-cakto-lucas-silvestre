import Decimal from "decimal.js";
import { 
  calculateRate as newCalcRate,
  calculateTotal as newCalcTotal,
  calculateInstallment as newCalcInstallment,
  calculateNetValue as newCalcNetValue,
  generateInstallmentOptions as newGenerateInstallmentOptions,
  type PaymentMethod,
  type InstallmentOption,
} from "./pricing";

// Re-export types for backward compatibility
export type { PaymentMethod, InstallmentOption };

/**
 * @deprecated Use calculateRate from ./pricing instead
 * Calcula a taxa baseada no método de pagamento e parcelas
 */
export function calcRate(method: PaymentMethod, installments = 1): number {
  const rate = newCalcRate(method, installments);
  return rate.toNumber();
}

/**
 * @deprecated Use calculateTotal from ./pricing instead
 * Calcula o total que o comprador vai pagar
 */
export function calcTotal(value: number, rate: number): number {
  const total = newCalcTotal(new Decimal(value), new Decimal(rate));
  return total.toNumber();
}

/**
 * @deprecated Use calculateInstallment from ./pricing instead
 * Calcula o valor da parcela
 */
export function calcInstallment(total: number, installments: number): number {
  const installment = newCalcInstallment(new Decimal(total), installments, new Decimal("5.00"));
  return installment.monthlyValue.toNumber();
}

/**
 * @deprecated Use calculateNetValue from ./pricing instead
 * Calcula o valor líquido que o produtor recebe
 */
export function calcNet(originalValue: number, total: number): number {
  const netValue = newCalcNetValue(new Decimal(originalValue), new Decimal(total));
  return netValue.toNumber();
}

/**
 * @deprecated Use generateInstallmentOptions from ./pricing instead
 * Gera opções de parcelamento para cartão
 */
export function generateInstallmentOptions(value: number): InstallmentOption[] {
  const options = newGenerateInstallmentOptions(new Decimal(value));
  
  return options.map(option => ({
    value: option.value,
    label: option.label,
    rate: option.rate.toNumber(),
    monthlyValue: option.monthlyValue.toNumber(),
  }));
}
