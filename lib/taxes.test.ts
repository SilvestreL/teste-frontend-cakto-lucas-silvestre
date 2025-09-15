// Jest globals são importados automaticamente
import { calcRate, calcTotal, calcInstallment, calcNet, generateInstallmentOptions } from "./taxes"

describe("Cálculos de Impostos", () => {
  describe("calcRate", () => {
    it("deve retornar 0% para PIX", () => {
      expect(calcRate("pix")).toBe(0)
    })

    it("deve retornar 3.99% para cartão 1x", () => {
      expect(calcRate("card", 1)).toBe(0.0399)
    })

    it("deve retornar 6.99% para cartão 2x", () => {
      expect(calcRate("card", 2)).toBe(0.0699) // 4.99% + 2% * 1
    })

    it("deve retornar 8.99% para cartão 3x", () => {
      expect(calcRate("card", 3)).toBe(0.0899) // 4.99% + 2% * 2
    })

    it("deve retornar taxa correta para cartão 12x", () => {
      expect(calcRate("card", 12)).toBe(0.2699) // 4.99% + 2% * 11
    })
  })

  describe("calcTotal", () => {
    it("deve calcular total com taxa", () => {
      expect(calcTotal(100, 0.1)).toBe(110)
    })

    it("deve retornar mesmo valor para taxa 0%", () => {
      expect(calcTotal(100, 0)).toBe(100)
    })
  })

  describe("calcInstallment", () => {
    it("deve calcular parcela mensal", () => {
      expect(calcInstallment(120, 12)).toBe(10)
    })
  })

  describe("calcNet", () => {
    it("deve calcular valor líquido para produtor", () => {
      expect(calcNet(100, 110)).toBe(90)
    })
  })

  describe("generateInstallmentOptions", () => {
    it("deve gerar 12 opções de parcelamento", () => {
      const options = generateInstallmentOptions(100)
      expect(options).toHaveLength(12)
    })

    it("deve ter labels corretos", () => {
      const options = generateInstallmentOptions(100)
      expect(options[0].label).toBe("1x sem juros")
      expect(options[1].label).toBe("2x de")
    })
  })
})
