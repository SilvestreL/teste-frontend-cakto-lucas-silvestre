// Core pricing rules and calculations
export {
  calculateRate,
  calculateTotal,
  calculateInstallment,
  calculateNetValue,
  generateInstallmentOptions,
  validateInstallment,
  PRICING_RULES,
  type PaymentMethod,
  type InstallmentOption,
  type PricingRule,
  type PricingConfig,
} from "./pricingRules";

// Formatters with memoization
export {
  formatCurrency,
  formatPercentage,
  formatInstallment,
  formatSavings,
  formatInterestRate,
  clearFormatCache,
  getCacheStats,
} from "./formatters";

// Centralized pricing service
export {
  PricingService,
  pricingService,
  getPricing,
  getFormattedPricing,
  type PricingResult,
  type PricingInput,
} from "./pricingService";

// Legacy exports for backward compatibility
export {
  calcRate,
  calcTotal,
  calcInstallment,
  calcNet,
} from "../taxes";
