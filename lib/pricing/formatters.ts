import Decimal from "decimal.js";
import { PRICING_RULES } from "./pricingRules";

// Cache para memoização
const formatCache = new Map<string, string>();

/**
 * Formata valor monetário com precisão controlada
 */
export function formatCurrency(
  value: Decimal | number,
  options: {
    decimals?: number;
    showSymbol?: boolean;
    useCache?: boolean;
  } = {}
): string {
  const {
    decimals = PRICING_RULES.currency.decimals,
    showSymbol = true,
    useCache = true,
  } = options;

  const decimalValue = value instanceof Decimal ? value : new Decimal(value);
  const cacheKey = `currency_${decimalValue.toString()}_${decimals}_${showSymbol}`;

  if (useCache && formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: PRICING_RULES.currency.code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(decimalValue.toNumber());

  if (useCache) {
    formatCache.set(cacheKey, formatted);
  }

  return formatted;
}

/**
 * Formata porcentagem com precisão controlada
 */
export function formatPercentage(
  value: Decimal | number,
  options: {
    decimals?: number;
    showSymbol?: boolean;
    useCache?: boolean;
  } = {}
): string {
  const {
    decimals = 2,
    showSymbol = true,
    useCache = true,
  } = options;

  const decimalValue = value instanceof Decimal ? value : new Decimal(value);
  const percentageValue = decimalValue.mul(100);
  const cacheKey = `percentage_${percentageValue.toString()}_${decimals}_${showSymbol}`;

  if (useCache && formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  const formatted = `${percentageValue.toFixed(decimals).replace(".", ",")}${showSymbol ? "%" : ""}`;

  if (useCache) {
    formatCache.set(cacheKey, formatted);
  }

  return formatted;
}

/**
 * Formata valor de parcela com informações completas
 */
export function formatInstallment(
  monthlyValue: Decimal,
  lastValue: Decimal,
  installments: number,
  options: {
    showTotal?: boolean;
    showRate?: boolean;
    rate?: Decimal;
    useCache?: boolean;
  } = {}
): string {
  const {
    showTotal = false,
    showRate = false,
    rate,
    useCache = true,
  } = options;

  const cacheKey = `installment_${monthlyValue.toString()}_${lastValue.toString()}_${installments}_${showTotal}_${showRate}`;

  if (useCache && formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  let formatted = `${installments}x de ${formatCurrency(monthlyValue)}`;

  if (installments > 1 && !monthlyValue.equals(lastValue)) {
    formatted += ` (última: ${formatCurrency(lastValue)})`;
  }

  if (showRate && rate) {
    formatted += ` (${formatPercentage(rate)})`;
  }

  if (showTotal) {
    const total = monthlyValue.mul(installments - 1).plus(lastValue);
    formatted += ` - Total: ${formatCurrency(total)}`;
  }

  if (useCache) {
    formatCache.set(cacheKey, formatted);
  }

  return formatted;
}

/**
 * Formata economia com destaque
 */
export function formatSavings(
  originalValue: Decimal,
  currentValue: Decimal,
  options: {
    showPercentage?: boolean;
    useCache?: boolean;
  } = {}
): string {
  const {
    showPercentage = true,
    useCache = true,
  } = options;

  const savings = originalValue.minus(currentValue);
  const percentage = originalValue.gt(0) ? savings.div(originalValue).mul(100) : new Decimal(0);
  const cacheKey = `savings_${savings.toString()}_${percentage.toString()}_${showPercentage}`;

  if (useCache && formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  let formatted = `Economia de ${formatCurrency(savings)}`;

  if (showPercentage) {
    formatted += ` (${formatPercentage(percentage)})`;
  }

  if (useCache) {
    formatCache.set(cacheKey, formatted);
  }

  return formatted;
}

/**
 * Formata taxa de juros com contexto
 */
export function formatInterestRate(
  rate: Decimal,
  options: {
    showContext?: boolean;
    useCache?: boolean;
  } = {}
): string {
  const {
    showContext = true,
    useCache = true,
  } = options;

  const cacheKey = `interest_${rate.toString()}_${showContext}`;

  if (useCache && formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  let formatted = formatPercentage(rate);

  if (showContext) {
    if (rate.equals(0)) {
      formatted = "0% (sem juros)";
    } else if (rate.lt(0.05)) {
      formatted += " (baixa taxa)";
    } else if (rate.lt(0.15)) {
      formatted += " (taxa moderada)";
    } else {
      formatted += " (alta taxa)";
    }
  }

  if (useCache) {
    formatCache.set(cacheKey, formatted);
  }

  return formatted;
}

/**
 * Limpa o cache de formatação
 */
export function clearFormatCache(): void {
  formatCache.clear();
}

/**
 * Obtém estatísticas do cache
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: formatCache.size,
    keys: Array.from(formatCache.keys()),
  };
}
