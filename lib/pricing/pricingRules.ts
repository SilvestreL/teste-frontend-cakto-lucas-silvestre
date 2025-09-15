import Decimal from "decimal.js";

// Configuração de precisão decimal
Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP });

export type PaymentMethod = "pix" | "card";

export interface PricingRule {
  method: PaymentMethod;
  baseRate: Decimal;
  additionalRatePerInstallment: Decimal;
  minInstallmentValue: Decimal;
  maxInstallments: number;
}

export interface PricingConfig {
  rules: PricingRule[];
  currency: {
    symbol: string;
    code: string;
    decimals: number;
  };
}

// Regras de preços centralizadas
export const PRICING_RULES: PricingConfig = {
  rules: [
    {
      method: "pix",
      baseRate: new Decimal(0),
      additionalRatePerInstallment: new Decimal(0),
      minInstallmentValue: new Decimal(0),
      maxInstallments: 1,
    },
    {
      method: "card",
      baseRate: new Decimal("0.0399"), // 3,99% para 1x
      additionalRatePerInstallment: new Decimal("0.02"), // 2% por parcela extra
      minInstallmentValue: new Decimal("5.00"), // R$ 5,00 mínimo por parcela
      maxInstallments: 12,
    },
  ],
  currency: {
    symbol: "R$",
    code: "BRL",
    decimals: 2,
  },
};

/**
 * Calcula a taxa de juros baseada no método e parcelas
 * Regras de negócio:
 * - PIX: sem taxa
 * - 1x cartão: valor + 3.99%
 * - 2x cartão: (valor + 4.99%) / 2 + 2%
 * - 3x cartão: (valor + 4.99%) / 3 + 4%
 * - etc.
 */
export function calculateRate(method: PaymentMethod, installments: number): Decimal {
  if (method === "pix") return new Decimal(0);

  if (installments === 1) {
    return new Decimal("0.0399"); // 3.99% para 1x
  }

  // Para parcelas > 1: taxa base de 4.99% + taxa adicional por parcela
  // 2x: 4.99% + 2% = 6.99%
  // 3x: 4.99% + 4% = 8.99%
  // 4x: 4.99% + 6% = 10.99%
  const baseRate = new Decimal("0.0499"); // 4.99%
  const additionalRate = new Decimal("0.02").mul(installments - 1); // 2% por parcela extra
  
  return baseRate.plus(additionalRate);
}

/**
 * Calcula o total a ser pago
 */
export function calculateTotal(originalValue: Decimal, rate: Decimal): Decimal {
  return originalValue.mul(rate.plus(1));
}

/**
 * Calcula o valor da parcela com ajuste para última parcela
 */
export function calculateInstallment(
  total: Decimal,
  installments: number,
  minValue: Decimal
): { monthlyValue: Decimal; lastValue: Decimal; adjustedTotal: Decimal } {
  if (installments === 1) {
    return {
      monthlyValue: total,
      lastValue: total,
      adjustedTotal: total,
    };
  }

  // Valor base da parcela
  const baseMonthlyValue = total.div(installments);
  
  // Se o valor base é menor que o mínimo, ajusta
  if (baseMonthlyValue.lt(minValue)) {
    const adjustedMonthlyValue = minValue;
    const adjustedTotal = adjustedMonthlyValue.mul(installments - 1);
    const lastValue = total.minus(adjustedTotal);
    
    return {
      monthlyValue: adjustedMonthlyValue,
      lastValue: lastValue,
      adjustedTotal: adjustedTotal.plus(lastValue),
    };
  }

  // Cálculo normal com última parcela ajustada
  const monthlyValue = total.div(installments).floor();
  const lastValue = total.minus(monthlyValue.mul(installments - 1));
  const adjustedTotal = monthlyValue.mul(installments - 1).plus(lastValue);

  return {
    monthlyValue,
    lastValue,
    adjustedTotal,
  };
}

/**
 * Calcula o valor líquido que o produtor recebe
 */
export function calculateNetValue(originalValue: Decimal, total: Decimal): Decimal {
  return originalValue.mul(2).minus(total);
}

/**
 * Gera opções de parcelamento com cálculos precisos
 */
export type InstallmentOption = {
  value: number;
  label: string;
  rate: Decimal;
  monthlyValue: Decimal;
  lastValue: Decimal;
  total: Decimal;
  adjustedTotal: Decimal;
};

export function generateInstallmentOptions(originalValue: Decimal): InstallmentOption[] {
  const options: Array<{
    value: number;
    label: string;
    rate: Decimal;
    monthlyValue: Decimal;
    lastValue: Decimal;
    total: Decimal;
    adjustedTotal: Decimal;
  }> = [];
  const cardRule = PRICING_RULES.rules.find((r) => r.method === "card");
  
  if (!cardRule) return options;

  for (let i = 1; i <= cardRule.maxInstallments; i++) {
    const rate = calculateRate("card", i);
    const total = calculateTotal(originalValue, rate);
    const installment = calculateInstallment(total, i, cardRule.minInstallmentValue);

    options.push({
      value: i,
      label: i === 1 ? "1x sem juros" : `${i}x de`,
      rate,
      monthlyValue: installment.monthlyValue,
      lastValue: installment.lastValue,
      total,
      adjustedTotal: installment.adjustedTotal,
    });
  }

  return options;
}

/**
 * Valida se o parcelamento é viável
 */
export function validateInstallment(
  originalValue: Decimal,
  installments: number,
  method: PaymentMethod
): { isValid: boolean; reason?: string } {
  const rule = PRICING_RULES.rules.find((r) => r.method === method);
  if (!rule) return { isValid: false, reason: "Método de pagamento inválido" };

  if (installments > rule.maxInstallments) {
    return { isValid: false, reason: `Máximo de ${rule.maxInstallments} parcelas` };
  }

  if (installments < 1) {
    return { isValid: false, reason: "Mínimo de 1 parcela" };
  }

  if (method === "card" && installments > 1) {
    const rate = calculateRate(method, installments);
    const total = calculateTotal(originalValue, rate);
    const installment = calculateInstallment(total, installments, rule.minInstallmentValue);
    
    if (installment.monthlyValue.lt(rule.minInstallmentValue)) {
      return { isValid: false, reason: `Valor da parcela menor que R$ ${rule.minInstallmentValue}` };
    }
  }

  return { isValid: true };
}
