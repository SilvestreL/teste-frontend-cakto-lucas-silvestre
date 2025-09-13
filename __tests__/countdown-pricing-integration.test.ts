import { describe, it, expect } from "vitest";
import { getPricing, getFormattedPricing } from "../lib/pricing";
import Decimal from "decimal.js";

describe("Integração Contador + Sistema de Preços", () => {
  it("deve calcular preços corretamente com timer ativo", () => {
    // Simula timer ativo (não expirado) - preço promocional

    const pricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("297.00"), // Preço promocional
      paymentMethod: "card",
      installments: 3,
    });

    const formattedPricing = getFormattedPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("297.00"),
      paymentMethod: "card",
      installments: 3,
    });

    console.log("🧪 Teste: Timer ATIVO");
    console.log("Preço original: R$ 497,00");
    console.log("Preço promocional: R$ 297,00");
    console.log("Total calculado:", formattedPricing.total);
    console.log("Parcela:", formattedPricing.monthlyValue);
    console.log("Taxa:", formattedPricing.rate);

    expect(pricing.total.toFixed(2)).toBe("320.73");
    expect(pricing.savings.toFixed(2)).toBe("200.00");
    expect(pricing.isValid).toBe(true);
  });

  it("deve calcular preços corretamente com timer expirado", () => {
    // Simula timer expirado
    const isExpired = true;

    const pricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("497.00"), // Preço original (sem promoção)
      paymentMethod: "card",
      installments: 3,
    });

    const formattedPricing = getFormattedPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("497.00"),
      paymentMethod: "card",
      installments: 3,
    });

    console.log("\n🧪 Teste: Timer EXPIROU");
    console.log("Preço original: R$ 497,00");
    console.log("Preço atual: R$ 497,00 (sem promoção)");
    console.log("Total calculado:", formattedPricing.total);
    console.log("Parcela:", formattedPricing.monthlyValue);
    console.log("Taxa:", formattedPricing.rate);

    expect(pricing.total.toFixed(2)).toBe("536.71");
    expect(pricing.savings.toFixed(2)).toBe("0.00");
    expect(pricing.isValid).toBe(true);
  });

  it("deve mostrar diferença significativa entre estados", () => {
    // Preço promocional (timer ativo)
    const promotionalPricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("297.00"),
      paymentMethod: "card",
      installments: 7,
    });

    // Preço original (timer expirado)
    const originalPricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("497.00"),
      paymentMethod: "card",
      installments: 7,
    });

    const difference = originalPricing.total.minus(promotionalPricing.total);

    console.log("\n🧪 Teste: Comparação de Estados");
    console.log("Com promoção (7x):", "R$ " + promotionalPricing.total.toFixed(2).replace(".", ","));
    console.log("Sem promoção (7x):", "R$ " + originalPricing.total.toFixed(2).replace(".", ","));
    console.log("Diferença:", "R$ " + difference.toFixed(2).replace(".", ","));

    expect(difference.toFixed(2)).toBe("231.98");
    expect(promotionalPricing.total.lt(originalPricing.total)).toBe(true);
  });

  it("deve funcionar com diferentes métodos de pagamento", () => {

    // PIX (sem juros)
    const pixPricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("297.00"),
      paymentMethod: "pix",
      installments: 1,
    });

    // Cartão (com juros)
    const cardPricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("297.00"),
      paymentMethod: "card",
      installments: 3,
    });

    console.log("\n🧪 Teste: Diferentes Métodos de Pagamento");
    console.log("PIX:", "R$ " + pixPricing.total.toFixed(2).replace(".", ","));
    console.log("Cartão 3x:", "R$ " + cardPricing.total.toFixed(2).replace(".", ","));

    expect(pixPricing.total.toFixed(2)).toBe("297.00");
    expect(cardPricing.total.toFixed(2)).toBe("320.73");
    expect(pixPricing.rate.toFixed(4)).toBe("0.0000");
    expect(cardPricing.rate.toFixed(4)).toBe("0.0799");
  });

  it("deve simular fluxo completo de timer", () => {
    // Simula diferentes estados do timer
    const timerStates = [
      { isExpired: false, minutes: 2, description: "Estado inicial" },
      { isExpired: false, minutes: 1, description: "Após 1 minuto" },
      { isExpired: true, minutes: 0, description: "Timer expirado" },
    ];

    // Testa preços em ambos os estados
    const activePricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("297.00"),
      paymentMethod: "card",
      installments: 3,
    });

    const expiredPricing = getPricing({
      originalValue: new Decimal("497.00"),
      currentValue: new Decimal("497.00"),
      paymentMethod: "card",
      installments: 3,
    });

    console.log("\n🧪 Teste: Fluxo Completo do Timer");
    console.log("Timer ativo - Total:", "R$ " + activePricing.total.toFixed(2).replace(".", ","));
    console.log("Timer expirado - Total:", "R$ " + expiredPricing.total.toFixed(2).replace(".", ","));

    expect(activePricing.total.lt(expiredPricing.total)).toBe(true);
  });
});
