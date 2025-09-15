import { getPricing } from "@/lib/pricing";
import Decimal from "decimal.js";

describe("Pricing Consistency - Simple Tests", () => {
  const testProduct = {
    originalPrice: 497.00,
    currentPrice: 297.00,
  };

  describe("Consistência básica de preços", () => {
    it("deve calcular preços consistentes para PIX", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "pix",
        installments: 1,
      });

      expect(pricing.total.toNumber()).toBeCloseTo(297.00, 2);
      expect(pricing.savings.toNumber()).toBeCloseTo(200.00, 2);
      expect(pricing.savingsPercentage.toNumber()).toBeCloseTo(40.24, 2);
      expect(pricing.feeAmount.toNumber()).toBe(0);
    });

    it("deve calcular preços consistentes para cartão à vista", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "card",
        installments: 1,
      });

      expect(pricing.total.toNumber()).toBeCloseTo(297.00, 2);
      expect(pricing.savings.toNumber()).toBeCloseTo(200.00, 2);
      expect(pricing.savingsPercentage.toNumber()).toBeCloseTo(40.24, 2);
      expect(pricing.feeAmount.toNumber()).toBeGreaterThan(0);
    });

    it("deve calcular preços consistentes para cartão parcelado", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "card",
        installments: 6,
      });

      expect(pricing.total.toNumber()).toBeCloseTo(297.00, 2);
      expect(pricing.savings.toNumber()).toBeCloseTo(200.00, 2);
      expect(pricing.savingsPercentage.toNumber()).toBeCloseTo(40.24, 2);
      expect(pricing.monthlyValue.toNumber()).toBeCloseTo(49.50, 2);
    });

    it("deve calcular preços consistentes para cartão 12x", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "card",
        installments: 12,
      });

      expect(pricing.total.toNumber()).toBeCloseTo(297.00, 2);
      expect(pricing.savings.toNumber()).toBeCloseTo(200.00, 2);
      expect(pricing.savingsPercentage.toNumber()).toBeCloseTo(40.24, 2);
      expect(pricing.monthlyValue.toNumber()).toBeCloseTo(24.75, 2);
    });
  });

  describe("Consistência com timer expirado", () => {
    it("deve calcular preços corretos quando timer expira (preço original)", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.originalPrice), // Usa preço original
        paymentMethod: "pix",
        installments: 1,
      });

      expect(pricing.total.toNumber()).toBeCloseTo(497.00, 2);
      expect(pricing.savings.toNumber()).toBe(0);
      expect(pricing.savingsPercentage.toNumber()).toBe(0);
    });

    it("deve calcular preços corretos quando timer expira para cartão", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.originalPrice), // Usa preço original
        paymentMethod: "card",
        installments: 1,
      });

      expect(pricing.total.toNumber()).toBeCloseTo(497.00, 2);
      expect(pricing.savings.toNumber()).toBe(0);
      expect(pricing.savingsPercentage.toNumber()).toBe(0);
    });
  });

  describe("Consistência de cálculos", () => {
    it("deve manter consistência entre diferentes chamadas", () => {
      const input = {
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const pricing1 = getPricing(input);
      const pricing2 = getPricing(input);

      expect(pricing1.total.toNumber()).toBe(pricing2.total.toNumber());
      expect(pricing1.savings.toNumber()).toBe(pricing2.savings.toNumber());
      expect(pricing1.savingsPercentage.toNumber()).toBe(pricing2.savingsPercentage.toNumber());
    });

    it("deve calcular netValue corretamente", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "pix",
        installments: 1,
      });

      // Para PIX, netValue deve ser igual ao currentValue
      expect(pricing.netValue.toNumber()).toBeCloseTo(297.00, 2);
    });

    it("deve validar parcelas corretamente", () => {
      // Parcelas válidas
      const validPricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "card",
        installments: 12,
      });

      expect(validPricing.isValid).toBe(true);

      // Parcelas inválidas (muito altas)
      const invalidPricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "card",
        installments: 24, // Muito alto
      });

      expect(invalidPricing.isValid).toBe(false);
    });
  });

  describe("Consistência de formatação", () => {
    it("deve formatar valores corretamente", () => {
      const pricing = getPricing({
        originalValue: new Decimal(testProduct.originalPrice),
        currentValue: new Decimal(testProduct.currentPrice),
        paymentMethod: "pix",
        installments: 1,
      });

      // Verifica se os valores são números válidos
      expect(typeof pricing.total.toNumber()).toBe("number");
      expect(typeof pricing.savings.toNumber()).toBe("number");
      expect(typeof pricing.savingsPercentage.toNumber()).toBe("number");
      expect(typeof pricing.feeAmount.toNumber()).toBe("number");
      expect(typeof pricing.netValue.toNumber()).toBe("number");

      // Verifica se não são NaN
      expect(pricing.total.toNumber()).not.toBeNaN();
      expect(pricing.savings.toNumber()).not.toBeNaN();
      expect(pricing.savingsPercentage.toNumber()).not.toBeNaN();
      expect(pricing.feeAmount.toNumber()).not.toBeNaN();
      expect(pricing.netValue.toNumber()).not.toBeNaN();
    });
  });
});
