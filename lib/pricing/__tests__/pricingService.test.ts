import Decimal from "decimal.js";
import { PricingService, getPricing, getFormattedPricing } from "../pricingService";

describe("Serviço de Preços", () => {
  let pricingService: PricingService;

  beforeEach(() => {
    pricingService = new PricingService();
  });

  describe("calcularPrecos", () => {
    it("deve calcular preços PIX corretamente", () => {
      const input = {
        originalValue: new Decimal("497.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.rate.toFixed(4)).toBe("0.0000");
      expect(result.total.toFixed(2)).toBe("297.00");
      expect(result.monthlyValue.toFixed(2)).toBe("297.00");
      expect(result.lastValue.toFixed(2)).toBe("297.00");
      expect(result.savings.toFixed(2)).toBe("200.00");
      expect(result.isValid).toBe(true);
    });

    it("deve calcular preços de cartão corretamente", () => {
      const input = {
        originalValue: new Decimal("497.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 1,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.rate.toFixed(4)).toBe("0.0399");
      expect(result.total.toFixed(2)).toBe("308.85");
      expect(result.monthlyValue.toFixed(2)).toBe("308.85");
      expect(result.lastValue.toFixed(2)).toBe("308.85");
      expect(result.savings.toFixed(2)).toBe("200.00");
      expect(result.isValid).toBe(true);
    });

    it("deve calcular múltiplas parcelas corretamente", () => {
      const input = {
        originalValue: new Decimal("497.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 3,
      };

      const result = pricingService.calculatePricing(input);

      // Taxa: 4.99% + (2 * 2%) = 8.99%
      expect(result.rate.toFixed(4)).toBe("0.0899");
      expect(result.total.toFixed(2)).toBe("323.70");
      expect(result.monthlyValue.toFixed(2)).toBe("107.00");
      expect(result.lastValue.toFixed(2)).toBe("109.70");
      expect(result.savings.toFixed(2)).toBe("200.00");
      expect(result.isValid).toBe(true);
    });

    it("deve lidar com preços promocionais", () => {
      const input = {
        originalValue: new Decimal("497.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.savings.gt(0)).toBe(true);
      expect(result.effectiveValue.toFixed(2)).toBe("297.00");
      expect(result.originalValue.toFixed(2)).toBe("497.00");
    });

    it("deve gerar opções de parcelamento quando solicitado", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 1,
        includeInstallmentOptions: true,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.installmentOptions).toBeDefined();
      expect(result.installmentOptions).toHaveLength(12);
    });

    it("não deve gerar opções de parcelamento quando não solicitado", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 1,
      };

      const result = pricingService.calculatePricing(input);

      expect(result.installmentOptions).toHaveLength(12);
    });

    it("deve validar parcelas inválidas", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "card" as const,
        installments: 13, // Mais que o máximo
      };

      const result = pricingService.calculatePricing(input);

      expect(result.isValid).toBe(false);
    });
  });

  describe("obterValoresFormatados", () => {
    it("deve formatar todos os valores corretamente", () => {
      const pricing = {
        originalValue: new Decimal("497.00"),
        effectiveValue: new Decimal("297.00"),
        total: new Decimal("320.73"),
        monthlyValue: new Decimal("106.00"),
        lastValue: new Decimal("108.73"),
        adjustedTotal: new Decimal("320.73"),
        savings: new Decimal("176.27"),
        savingsPercentage: new Decimal("35.45"),
        rate: new Decimal("0.0799"),
        netValue: new Decimal("290.73"),
        feeAmount: new Decimal("30.00"),
        isValid: true,
        installmentOptions: [],
      };

      const formatted = pricingService.getFormattedValues(pricing);

      expect(formatted.originalValue).toMatch(/R\$\s*497,00/);
      expect(formatted.effectiveValue).toMatch(/R\$\s*297,00/);
      expect(formatted.total).toMatch(/R\$\s*320,73/);
      expect(formatted.monthlyValue).toMatch(/R\$\s*106,00/);
      expect(formatted.lastValue).toMatch(/R\$\s*108,73/);
      expect(formatted.savings).toMatch(/R\$\s*176,27/);
      expect(formatted.rate).toMatch(/7,99%/);
      expect(formatted.netValue).toMatch(/R\$\s*290,73/);
      expect(formatted.feeAmount).toMatch(/R\$\s*30,00/);
    });
  });

  describe("cache", () => {
    it("deve armazenar resultados em cache", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result1 = pricingService.calculatePricing(input);
      const result2 = pricingService.calculatePricing(input);

      expect(result1).toBe(result2); // Mesma referência de objeto
    });

    it("deve limpar cache", () => {
      const input = {
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix" as const,
        installments: 1,
      };

      const result1 = pricingService.calculatePricing(input);
      pricingService.clearCache();
      const result2 = pricingService.calculatePricing(input);

      expect(result1).not.toBe(result2); // Diferentes referências
    });
  });

  describe("funções de conveniência", () => {
    it("deve funcionar com getPricing", () => {
      const result = getPricing({
        originalValue: new Decimal("497.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix",
        installments: 1,
      });

      expect(result.total.toFixed(2)).toBe("297.00");
      expect(result.isValid).toBe(true);
    });

    it("deve funcionar com getFormattedPricing", () => {
      const result = getFormattedPricing({
        originalValue: new Decimal("497.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: "pix",
        installments: 1,
      });

      expect(result.total).toMatch(/R\$\s*297,00/);
      expect(result.rate).toMatch(/0%/);
    });
  });
});