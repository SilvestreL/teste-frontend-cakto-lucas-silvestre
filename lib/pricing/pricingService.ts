import Decimal from "decimal.js";
import {
  calculateRate,
  calculateTotal,
  calculateInstallment,
  calculateNetValue,
  generateInstallmentOptions,
  validateInstallment,
  type PaymentMethod,
} from "./pricingRules";
import {
  formatCurrency,
  formatPercentage,
  formatInstallment,
  formatSavings,
  formatInterestRate,
} from "./formatters";

export interface PricingResult {
  // Valores base
  originalValue: Decimal;
  effectiveValue: Decimal;
  
  // Cálculos de pagamento
  rate: Decimal;
  total: Decimal;
  monthlyValue: Decimal;
  lastValue: Decimal;
  adjustedTotal: Decimal;
  netValue: Decimal;
  
  // Informações de economia
  savings: Decimal;
  savingsPercentage: Decimal;
  feeAmount: Decimal;
  
  // Validação
  isValid: boolean;
  validationReason?: string;
  
  // Opções de parcelamento
  installmentOptions: Array<{
    value: number;
    label: string;
    rate: Decimal;
    monthlyValue: Decimal;
    lastValue: Decimal;
    total: Decimal;
    adjustedTotal: Decimal;
  }>;
}

export interface PricingInput {
  originalValue: Decimal | number;
  currentValue: Decimal | number;
  paymentMethod: PaymentMethod;
  installments: number;
  includeInstallmentOptions?: boolean;
}

/**
 * Serviço centralizado de preços - Single Source of Truth
 */
export class PricingService {
  private static instance: PricingService;
  private cache = new Map<string, PricingResult>();

  private constructor() {}

  static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  /**
   * Calcula preços completos baseado nos parâmetros
   */
  calculatePricing(input: PricingInput): PricingResult {
    const {
      originalValue: originalValueInput,
      currentValue: currentValueInput,
      paymentMethod,
      installments,
      includeInstallmentOptions = true,
    } = input;

    // Normaliza valores para Decimal
    const originalValue = originalValueInput instanceof Decimal 
      ? originalValueInput 
      : new Decimal(originalValueInput);
    
    const effectiveValue = currentValueInput instanceof Decimal 
      ? currentValueInput 
      : new Decimal(currentValueInput);

    // Gera chave de cache
    const cacheKey = `${originalValue.toString()}_${effectiveValue.toString()}_${paymentMethod}_${installments}_${includeInstallmentOptions}`;

    // Verifica cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Valida entrada
    const validation = validateInstallment(effectiveValue, installments, paymentMethod);
    
    // Calcula taxa e total
    const rate = calculateRate(paymentMethod, installments);
    const total = calculateTotal(effectiveValue, rate);
    
    // Calcula parcelas
    const installment = calculateInstallment(total, installments, new Decimal("5.00"));
    
    // Calcula valores derivados
    const netValue = calculateNetValue(effectiveValue, total);
    const savings = originalValue.minus(effectiveValue);
    const savingsPercentage = originalValue.gt(0) 
      ? savings.div(originalValue).mul(100) 
      : new Decimal(0);
    const feeAmount = total.minus(effectiveValue);

    // Gera opções de parcelamento se solicitado
    const installmentOptions = includeInstallmentOptions 
      ? generateInstallmentOptions(effectiveValue)
      : [];

    const result: PricingResult = {
      originalValue,
      effectiveValue,
      rate,
      total,
      monthlyValue: installment.monthlyValue,
      lastValue: installment.lastValue,
      adjustedTotal: installment.adjustedTotal,
      netValue,
      savings,
      savingsPercentage,
      feeAmount,
      isValid: validation.isValid,
      validationReason: validation.reason,
      installmentOptions,
    };

    // Armazena no cache
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Obtém formatação de valores
   */
  getFormattedValues(pricing: PricingResult) {
    return {
      originalValue: formatCurrency(pricing.originalValue),
      effectiveValue: formatCurrency(pricing.effectiveValue),
      total: formatCurrency(pricing.total),
      monthlyValue: formatCurrency(pricing.monthlyValue),
      lastValue: formatCurrency(pricing.lastValue),
      adjustedTotal: formatCurrency(pricing.adjustedTotal),
      netValue: formatCurrency(pricing.netValue),
      savings: formatCurrency(pricing.savings),
      savingsPercentage: formatPercentage(pricing.savingsPercentage),
      feeAmount: formatCurrency(pricing.feeAmount),
      rate: formatInterestRate(pricing.rate),
      installment: formatInstallment(
        pricing.monthlyValue,
        pricing.lastValue,
        pricing.installmentOptions.length > 0 ? pricing.installmentOptions[0].value : 1,
        {
          showTotal: true,
          showRate: true,
          rate: pricing.rate,
        }
      ),
    };
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Limpa cache e força recálculo
   */
  forceRecalculation(): void {
    this.clearCache();
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Instância singleton
export const pricingService = PricingService.getInstance();

// Função de conveniência para uso direto
export function getPricing(input: PricingInput): PricingResult {
  return pricingService.calculatePricing(input);
}

// Função de conveniência para formatação
export function getFormattedPricing(input: PricingInput) {
  const pricing = getPricing(input);
  return pricingService.getFormattedValues(pricing);
}
