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

describe("Regras de Preços", () => {
  describe("calcularTaxa", () => {
    it("deve retornar 0 para PIX", () => {
      expect(calculateRate("pix")).toEqual(new Decimal(0));
    });

    it("deve retornar taxa base para cartão 1x", () => {
      expect(calculateRate("card", 1)).toEqual(new Decimal("0.0399"));
    });

    it("deve calcular taxa correta para cartão múltiplas parcelas", () => {
      // 3x: 4.99% + (2 * 2%) = 8.99%
      expect(calculateRate("card", 3)).toEqual(new Decimal("0.0899"));
      
      // 12x: 4.99% + (11 * 2%) = 26.99%
      expect(calculateRate("card", 12)).toEqual(new Decimal("0.2699"));
    });
  });

  describe("calcularTotal", () => {
    it("deve calcular total com taxa", () => {
      const result = calculateTotal(new Decimal(100), new Decimal("0.1"));
      expect(result.toFixed(2)).toBe("110.00");
    });

    it("deve retornar mesmo valor para taxa 0%", () => {
      const result = calculateTotal(new Decimal(100), new Decimal(0));
      expect(result.toFixed(2)).toBe("100.00");
    });

    it("deve lidar com alta precisão", () => {
      const result = calculateTotal(new Decimal("297.00"), new Decimal("0.0899"));
      expect(result.toFixed(2)).toBe("323.70");
    });
  });

  describe("calcularParcela", () => {
    it("deve lidar com parcela única", () => {
      const result = calculateInstallment(new Decimal(100), 1, new Decimal("5.00"));
      expect(result.monthlyValue.toFixed(2)).toBe("100.00");
      expect(result.lastValue.toFixed(2)).toBe("100.00");
    });

    it("deve calcular parcelas iguais quando possível", () => {
      const result = calculateInstallment(new Decimal(120), 3, new Decimal("5.00"));
      expect(result.monthlyValue.toFixed(2)).toBe("40.00");
      expect(result.lastValue.toFixed(2)).toBe("40.00");
    });

    it("deve ajustar última parcela para divisão desigual", () => {
      const result = calculateInstallment(new Decimal(100), 3, new Decimal("5.00"));
      expect(result.monthlyValue.toFixed(2)).toBe("33.00");
      expect(result.lastValue.toFixed(2)).toBe("34.00");
    });

    it("deve respeitar valor mínimo de parcela", () => {
      const result = calculateInstallment(new Decimal(10), 3, new Decimal("5.00"));
      expect(result.monthlyValue.toFixed(2)).toBe("5.00"); // Mínimo R$ 5,00
      expect(result.lastValue.toFixed(2)).toBe("0.00");
    });
  });

  describe("calcularValorLiquido", () => {
    it("deve calcular valor líquido corretamente", () => {
      const result = calculateNetValue(new Decimal(100), new Decimal(110));
      expect(result.toFixed(2)).toBe("90.00");
    });

    it("deve lidar com diferença zero", () => {
      const result = calculateNetValue(new Decimal(100), new Decimal(100));
      expect(result.toFixed(2)).toBe("100.00");
    });
  });

  describe("gerarOpcoesParcelamento", () => {
    it("deve gerar opções para todas as parcelas", () => {
      const options = generateInstallmentOptions(new Decimal(100));
      expect(options).toHaveLength(12);
    });

    it("deve calcular valores corretos para cada opção", () => {
      const options = generateInstallmentOptions(new Decimal(297));
      
      // PIX (1x sem juros)
      expect(options[0].value).toBe(1);
      expect(options[0].rate.toFixed(4)).toBe("0.0399");
      
      // Cartão 3x
      expect(options[2].value).toBe(3);
      expect(options[2].rate.toFixed(4)).toBe("0.0899");
    });
  });

  describe("validarParcela", () => {
    it("deve validar PIX corretamente", () => {
      expect(validateInstallment(new Decimal(100), 1, "pix").isValid).toBe(true);
      expect(validateInstallment(new Decimal(100), 2, "pix").isValid).toBe(false);
    });

    it("deve validar parcelas de cartão corretamente", () => {
      expect(validateInstallment(new Decimal(100), 1, "card").isValid).toBe(true);
      expect(validateInstallment(new Decimal(100), 3, "card").isValid).toBe(true);
      expect(validateInstallment(new Decimal(100), 12, "card").isValid).toBe(true);
    });

    it("deve rejeitar muitas parcelas", () => {
      expect(validateInstallment(new Decimal(100), 13, "card").isValid).toBe(false);
    });

    it("deve rejeitar contagem de parcelas inválida", () => {
      expect(validateInstallment(new Decimal(100), 0, "card").isValid).toBe(false);
      expect(validateInstallment(new Decimal(100), -1, "card").isValid).toBe(false);
    });
  });

  describe("configuração PRICING_RULES", () => {
    it("deve ter configuração PIX correta", () => {
      const pixRule = PRICING_RULES.rules.find(r => r.method === "pix");
      expect(pixRule?.baseRate.toFixed(4)).toBe("0.0000");
      expect(pixRule?.maxInstallments).toBe(1);
    });

    it("deve ter configuração de cartão correta", () => {
      const cardRule = PRICING_RULES.rules.find(r => r.method === "card");
      expect(cardRule?.baseRate.toFixed(4)).toBe("0.0399");
      expect(cardRule?.additionalRatePerInstallment.toFixed(2)).toBe("0.02");
      expect(cardRule?.minInstallmentValue.toFixed(2)).toBe("5.00");
      expect(cardRule?.maxInstallments).toBe(12);
    });

    it("deve ter configuração de moeda correta", () => {
      expect(PRICING_RULES.currency.symbol).toBe("R$");
      expect(PRICING_RULES.currency.code).toBe("BRL");
      expect(PRICING_RULES.currency.decimals).toBe(2);
    });
  });
});