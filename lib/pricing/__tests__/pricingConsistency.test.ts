import { getPricing } from "../pricingService";
import Decimal from "decimal.js";

describe("Pricing Consistency Tests", () => {
  const testCases = [
    {
      name: "PIX - Preço promocional",
      originalValue: 497.00,
      currentValue: 297.00,
      paymentMethod: "pix" as const,
      installments: 1,
      expectedTotal: 297.00,
      expectedSavings: 200.00,
      expectedSavingsPercent: 40.24,
    },
    {
      name: "PIX - Preço original",
      originalValue: 497.00,
      currentValue: 497.00,
      paymentMethod: "pix" as const,
      installments: 1,
      expectedTotal: 497.00,
      expectedSavings: 0.00,
      expectedSavingsPercent: 0.00,
    },
    {
      name: "Cartão - 1x - Preço promocional",
      originalValue: 497.00,
      currentValue: 297.00,
      paymentMethod: "card" as const,
      installments: 1,
      expectedTotal: 297.00,
      expectedSavings: 200.00,
      expectedSavingsPercent: 40.24,
    },
    {
      name: "Cartão - 6x - Preço promocional",
      originalValue: 497.00,
      currentValue: 297.00,
      paymentMethod: "card" as const,
      installments: 6,
      expectedTotal: 297.00,
      expectedSavings: 200.00,
      expectedSavingsPercent: 40.24,
    },
    {
      name: "Cartão - 12x - Preço promocional",
      originalValue: 497.00,
      currentValue: 297.00,
      paymentMethod: "card" as const,
      installments: 12,
      expectedTotal: 297.00,
      expectedSavings: 200.00,
      expectedSavingsPercent: 40.24,
    },
  ];

  testCases.forEach(({ name, originalValue, currentValue, paymentMethod, installments, expectedTotal, expectedSavings, expectedSavingsPercent }) => {
    it(`deve calcular preços corretamente para ${name}`, () => {
      const pricing = getPricing({
        originalValue: new Decimal(originalValue),
        currentValue: new Decimal(currentValue),
        paymentMethod,
        installments,
      });

      expect(pricing.total.toNumber()).toBeCloseTo(expectedTotal, 2);
      expect(pricing.savings.toNumber()).toBeCloseTo(expectedSavings, 2);
      expect(pricing.savingsPercentage.toNumber()).toBeCloseTo(expectedSavingsPercent, 2);
      expect(pricing.isValid).toBe(true);
    });
  });

  it("deve calcular parcelas corretamente para cartão", () => {
    const pricing = getPricing({
      originalValue: new Decimal(297.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "card",
      installments: 6,
    });

    // Para 6x de R$ 297,00, cada parcela deve ser aproximadamente R$ 49,50
    expect(pricing.monthlyValue.toNumber()).toBeCloseTo(49.50, 2);
    expect(pricing.total.toNumber()).toBeCloseTo(297.00, 2);
  });

  it("deve calcular parcelas corretamente para 12x", () => {
    const pricing = getPricing({
      originalValue: new Decimal(297.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "card",
      installments: 12,
    });

    // Para 12x de R$ 297,00, cada parcela deve ser aproximadamente R$ 24,75
    expect(pricing.monthlyValue.toNumber()).toBeCloseTo(24.75, 2);
    expect(pricing.total.toNumber()).toBeCloseTo(297.00, 2);
  });

  it("deve calcular taxa corretamente para PIX", () => {
    const pricing = getPricing({
      originalValue: new Decimal(297.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "pix",
      installments: 1,
    });

    expect(pricing.rate.toNumber()).toBe(0);
    expect(pricing.feeAmount.toNumber()).toBe(0);
  });

  it("deve calcular taxa corretamente para cartão", () => {
    const pricing = getPricing({
      originalValue: new Decimal(297.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "card",
      installments: 1,
    });

    // Cartão deve ter taxa
    expect(pricing.rate.toNumber()).toBeGreaterThan(0);
    expect(pricing.feeAmount.toNumber()).toBeGreaterThan(0);
  });

  it("deve validar parcelas corretamente", () => {
    // Parcelas válidas
    const validPricing = getPricing({
      originalValue: new Decimal(297.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "card",
      installments: 12,
    });

    expect(validPricing.isValid).toBe(true);

    // Parcelas inválidas (muito altas)
    const invalidPricing = getPricing({
      originalValue: new Decimal(297.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "card",
      installments: 24, // Muito alto
    });

    expect(invalidPricing.isValid).toBe(false);
  });

  it("deve gerar opções de parcelamento corretamente", () => {
    const pricing = getPricing({
      originalValue: new Decimal(297.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "card",
      installments: 1,
      includeInstallmentOptions: true,
    });

    expect(pricing.installmentOptions).toBeDefined();
    expect(pricing.installmentOptions.length).toBeGreaterThan(0);
    
    // Verifica se as opções estão ordenadas corretamente
    const installments = pricing.installmentOptions.map(option => option.value);
    expect(installments).toEqual(installments.sort((a, b) => a - b));
  });

  it("deve manter consistência entre diferentes chamadas", () => {
    const input = {
      originalValue: new Decimal(497.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "pix" as const,
      installments: 1,
    };

    const pricing1 = getPricing(input);
    const pricing2 = getPricing(input);

    expect(pricing1.total.toNumber()).toBe(pricing2.total.toNumber());
    expect(pricing1.savings.toNumber()).toBe(pricing2.savings.toNumber());
    expect(pricing1.savingsPercentage.toNumber()).toBe(pricing2.savingsPercentage.toNumber());
  });

  it("deve lidar com valores decimais corretamente", () => {
    const pricing = getPricing({
      originalValue: new Decimal("497.99"),
      currentValue: new Decimal("297.50"),
      paymentMethod: "pix",
      installments: 1,
    });

    expect(pricing.total.toNumber()).toBeCloseTo(297.50, 2);
    expect(pricing.savings.toNumber()).toBeCloseTo(200.49, 2);
  });

  it("deve calcular netValue corretamente", () => {
    const pricing = getPricing({
      originalValue: new Decimal(497.00),
      currentValue: new Decimal(297.00),
      paymentMethod: "pix",
      installments: 1,
    });

    // Para PIX, netValue deve ser igual ao currentValue
    expect(pricing.netValue.toNumber()).toBeCloseTo(297.00, 2);
  });
});
