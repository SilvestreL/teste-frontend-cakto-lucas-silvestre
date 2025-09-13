import { describe, it, expect, beforeEach } from "vitest";
import Decimal from "decimal.js";
import { PricingService, getPricing, getFormattedPricing } from "../pricingService";

describe("PricingService", () => {
  let pricingService: PricingService;

  beforeEach(() => {
    pricingService = PricingService.getInstance();
    pricingService.clearCache();
    Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP });
  });

  describe("calculatePricing", () => {
    it("should calculate PIX pricing correctly", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.rate).toEqual(new Decimal(0));
      expect(result.total).toEqual(new Decimal("297.00"));
      expect(result.monthlyValue).toEqual(new Decimal("297.00"));
      expect(result.netValue).toEqual(new Decimal("297.00"));
      expect(result.savings).toEqual(new Decimal(0));
      expect(result.isValid).toBe(true);
    });

    it("should calculate card pricing correctly", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 1,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.rate).toEqual(new Decimal("0.0399"));
      expect(result.total.toFixed(2)).toBe("308.85");
      expect(result.monthlyValue.toFixed(2)).toBe("308.85");
      expect(result.isValid).toBe(true);
    });

    it("should calculate multiple installments correctly", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 3,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.rate).toEqual(new Decimal("0.0799"));
      expect(result.total.toFixed(2)).toBe("320.73");
      expect(result.monthlyValue.toFixed(2)).toBe("106.00");
      expect(result.lastValue.toFixed(2)).toBe("108.73");
      expect(result.isValid).toBe(true);
    });

    it("should handle promotional pricing", () => {
      const input = {
        originalValue: new Decimal("397.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.originalValue).toEqual(new Decimal("397.00"));
      expect(result.effectiveValue).toEqual(new Decimal("297.00"));
      expect(result.savings).toEqual(new Decimal("100.00"));
      expect(result.savingsPercentage.toFixed(2)).toBe("25.19");
    });

    it("should generate installment options when requested", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 1,
        includeInstallmentOptions: true,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.installmentOptions).toHaveLength(12);
      expect(result.installmentOptions[0].value).toBe(1);
      expect(result.installmentOptions[11].value).toBe(12);
    });

    it("should not generate installment options when not requested", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 1,
        includeInstallmentOptions: false,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.installmentOptions).toHaveLength(0);
    });

    it("should validate invalid installments", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 15, // Too many
      };

      const result = pricingService.calculatePricing(input);

      expect(result.isValid).toBe(false);
      expect(result.validationReason).toContain("Máximo de 12 parcelas");
    });
  });

  describe("getFormattedValues", () => {
    it("should format all values correctly", () => {
      const input = {
        originalValue: new Decimal("397.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 3,
      };

      const pricing = pricingService.calculatePricing(input);
      const formatted = pricingService.getFormattedValues(pricing);

      expect(formatted.originalValue).toMatch(/R\$\s*397,00/);
      expect(formatted.effectiveValue).toMatch(/R\$\s*297,00/);
      expect(formatted.total).toContain("R$");
      expect(formatted.monthlyValue).toContain("R$");
      expect(formatted.savings).toMatch(/R\$\s*100,00/);
      expect(formatted.savingsPercentage).toContain("%");
      expect(formatted.rate).toContain("%");
    });
  });

  describe("caching", () => {
    it("should cache results", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      // First call
      const result1 = pricingService.calculatePricing(input);
      
      // Second call should use cache
      const result2 = pricingService.calculatePricing(input);
      
      expect(result1).toBe(result2); // Same object reference
    });

    it("should clear cache", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      pricingService.calculatePricing(input);
      expect(pricingService.getCacheStats().size).toBeGreaterThan(0);

      pricingService.clearCache();
      expect(pricingService.getCacheStats().size).toBe(0);
    });
  });

  describe("convenience functions", () => {
    it("should work with getPricing", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result = getPricing(input);

      expect(result.rate).toEqual(new Decimal(0));
      expect(result.total).toEqual(new Decimal("297.00"));
    });

    it("should work with getFormattedPricing", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result = getFormattedPricing(input);

      expect(result.originalValue).toMatch(/R\$\s*297,00/);
      expect(result.effectiveValue).toMatch(/R\$\s*297,00/);
      expect(result.total).toMatch(/R\$\s*297,00/);
    });
  });
});
