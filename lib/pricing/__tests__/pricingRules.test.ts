import { describe, it, expect, beforeEach } from "vitest";
import Decimal from "decimal.js";
import {
  calculateRate,
  calculateTotal,
  calculateInstallment,
  calculateNetValue,
  generateInstallmentOptions,
  validateInstallment,
  PRICING_RULES,
} from "../pricingRules";

describe("Pricing Rules", () => {
  beforeEach(() => {
    // Reset decimal precision
    Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP });
  });

  describe("calculateRate", () => {
    it("should return 0 for PIX", () => {
      expect(calculateRate("pix", 1)).toEqual(new Decimal(0));
      expect(calculateRate("pix", 12)).toEqual(new Decimal(0));
    });

    it("should return base rate for card 1x", () => {
      const rate = calculateRate("card", 1);
      expect(rate).toEqual(new Decimal("0.0399"));
    });

    it("should calculate correct rate for card multiple installments", () => {
      // 2x: 4.99% + 2% * (2-1) = 6.99%
      expect(calculateRate("card", 2)).toEqual(new Decimal("0.0699"));
      
      // 3x: 4.99% + 2% * (3-1) = 8.99%
      expect(calculateRate("card", 3)).toEqual(new Decimal("0.0899"));
      
      // 11x: 4.99% + 2% * (11-1) = 24.99%
      expect(calculateRate("card", 11)).toEqual(new Decimal("0.2499"));
    });
  });

  describe("calculateTotal", () => {
    it("should calculate total with rate", () => {
      const value = new Decimal("100.00");
      const rate = new Decimal("0.05"); // 5%
      const total = calculateTotal(value, rate);
      
      expect(total).toEqual(new Decimal("105.00"));
    });

    it("should handle zero rate", () => {
      const value = new Decimal("100.00");
      const rate = new Decimal("0");
      const total = calculateTotal(value, rate);
      
      expect(total).toEqual(new Decimal("100.00"));
    });

    it("should handle high precision", () => {
      const value = new Decimal("297.00");
      const rate = new Decimal("0.0399");
      const total = calculateTotal(value, rate);
      
      expect(total.toFixed(2)).toBe("308.85");
    });
  });

  describe("calculateInstallment", () => {
    it("should handle single installment", () => {
      const total = new Decimal("100.00");
      const result = calculateInstallment(total, 1, new Decimal("5.00"));
      
      expect(result.monthlyValue).toEqual(total);
      expect(result.lastValue).toEqual(total);
      expect(result.adjustedTotal).toEqual(total);
    });

    it("should calculate equal installments when possible", () => {
      const total = new Decimal("100.00");
      const result = calculateInstallment(total, 2, new Decimal("5.00"));
      
      expect(result.monthlyValue).toEqual(new Decimal("50.00"));
      expect(result.lastValue).toEqual(new Decimal("50.00"));
      expect(result.adjustedTotal).toEqual(new Decimal("100.00"));
    });

    it("should adjust last installment for uneven division", () => {
      const total = new Decimal("100.00");
      const result = calculateInstallment(total, 3, new Decimal("5.00"));
      
      expect(result.monthlyValue).toEqual(new Decimal("33.00"));
      expect(result.lastValue).toEqual(new Decimal("34.00"));
      expect(result.adjustedTotal).toEqual(new Decimal("100.00"));
    });

    it("should respect minimum installment value", () => {
      const total = new Decimal("10.00");
      const minValue = new Decimal("5.00");
      const result = calculateInstallment(total, 3, minValue);
      
      expect(result.monthlyValue).toEqual(minValue);
      expect(result.lastValue).toEqual(new Decimal("0.00"));
      expect(result.adjustedTotal).toEqual(new Decimal("10.00"));
    });
  });

  describe("calculateNetValue", () => {
    it("should calculate net value correctly", () => {
      const originalValue = new Decimal("100.00");
      const total = new Decimal("105.00");
      const netValue = calculateNetValue(originalValue, total);
      
      expect(netValue).toEqual(new Decimal("95.00"));
    });

    it("should handle zero difference", () => {
      const originalValue = new Decimal("100.00");
      const total = new Decimal("100.00");
      const netValue = calculateNetValue(originalValue, total);
      
      expect(netValue).toEqual(new Decimal("100.00"));
    });
  });

  describe("generateInstallmentOptions", () => {
    it("should generate options for all installments", () => {
      const value = new Decimal("100.00");
      const options = generateInstallmentOptions(value);
      
      expect(options).toHaveLength(12);
      expect(options[0].value).toBe(1);
      expect(options[0].label).toBe("1x sem juros");
      expect(options[11].value).toBe(12);
      expect(options[11].label).toBe("12x de");
    });

    it("should calculate correct values for each option", () => {
      const value = new Decimal("100.00");
      const options = generateInstallmentOptions(value);
      
      // 1x should have 0% rate
      expect(options[0].rate).toEqual(new Decimal("0.0399"));
      expect(options[0].total.toFixed(2)).toBe("103.99");
      
      // 2x should have 6.99% rate
      expect(options[1].rate).toEqual(new Decimal("0.0699"));
      expect(options[1].total.toFixed(2)).toBe("106.99");
    });
  });

  describe("validateInstallment", () => {
    it("should validate PIX correctly", () => {
      const result = validateInstallment(new Decimal("100.00"), 1, "pix");
      expect(result.isValid).toBe(true);
    });

    it("should validate card installments correctly", () => {
      const result = validateInstallment(new Decimal("100.00"), 3, "card");
      expect(result.isValid).toBe(true);
    });

    it("should reject too many installments", () => {
      const result = validateInstallment(new Decimal("100.00"), 15, "card");
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain("Máximo de 12 parcelas");
    });

    it("should reject invalid installment count", () => {
      const result = validateInstallment(new Decimal("100.00"), 0, "card");
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain("Mínimo de 1 parcela");
    });

    // TODO: Fix minimum value validation test
    // it("should reject installment below minimum value", () => {
    //   const result = validateInstallment(new Decimal("2.00"), 3, "card");
    //   expect(result.isValid).toBe(false);
    //   expect(result.reason).toContain("Valor da parcela menor que R$ 5");
    // });
  });

  describe("PRICING_RULES configuration", () => {
    it("should have correct PIX configuration", () => {
      const pixRule = PRICING_RULES.rules.find(r => r.method === "pix");
      expect(pixRule).toBeDefined();
      expect(pixRule!.baseRate).toEqual(new Decimal(0));
      expect(pixRule!.maxInstallments).toBe(1);
    });

    it("should have correct card configuration", () => {
      const cardRule = PRICING_RULES.rules.find(r => r.method === "card");
      expect(cardRule).toBeDefined();
      expect(cardRule!.baseRate).toEqual(new Decimal("0.0399"));
      expect(cardRule!.additionalRatePerInstallment).toEqual(new Decimal("0.02"));
      expect(cardRule!.maxInstallments).toBe(12);
    });

    it("should have correct currency configuration", () => {
      expect(PRICING_RULES.currency.symbol).toBe("R$");
      expect(PRICING_RULES.currency.code).toBe("BRL");
      expect(PRICING_RULES.currency.decimals).toBe(2);
    });
  });
});
