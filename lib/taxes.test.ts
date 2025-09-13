import { describe, it, expect } from "vitest"
import { calcRate, calcTotal, calcInstallment, calcNet, generateInstallmentOptions } from "./taxes"

describe("Tax calculations", () => {
  describe("calcRate", () => {
    it("should return 0% for PIX", () => {
      expect(calcRate("pix")).toBe(0)
    })

    it("should return 3.99% for card 1x", () => {
      expect(calcRate("card", 1)).toBe(0.0399)
    })

    it("should return 5.99% for card 2x", () => {
      expect(calcRate("card", 2)).toBe(0.0599) // 3.99% + 2% * 1
    })

    it("should return 7.99% for card 3x", () => {
      expect(calcRate("card", 3)).toBe(0.0799) // 3.99% + 2% * 2
    })

    it("should return correct rate for card 12x", () => {
      expect(calcRate("card", 12)).toBe(0.2599) // 3.99% + 2% * 11
    })
  })

  describe("calcTotal", () => {
    it("should calculate total with rate", () => {
      expect(calcTotal(100, 0.1)).toBe(110)
    })

    it("should return same value for 0% rate", () => {
      expect(calcTotal(100, 0)).toBe(100)
    })
  })

  describe("calcInstallment", () => {
    it("should calculate monthly installment", () => {
      expect(calcInstallment(120, 12)).toBe(10)
    })
  })

  describe("calcNet", () => {
    it("should calculate net value for producer", () => {
      expect(calcNet(100, 110)).toBe(90)
    })
  })

  describe("generateInstallmentOptions", () => {
    it("should generate 12 installment options", () => {
      const options = generateInstallmentOptions(100)
      expect(options).toHaveLength(12)
    })

    it("should have correct labels", () => {
      const options = generateInstallmentOptions(100)
      expect(options[0].label).toBe("1x sem juros")
      expect(options[1].label).toBe("2x de")
    })
  })
})
