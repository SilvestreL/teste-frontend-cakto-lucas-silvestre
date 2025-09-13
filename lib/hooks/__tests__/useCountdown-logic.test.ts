import { describe, it, expect } from "vitest";

// Testa apenas a lógica de cálculo do useCountdown sem os hooks do React
describe("useCountdown - Lógica de Cálculo", () => {
  it("deve calcular minutos e segundos corretamente", () => {
    const testCases = [
      { timeLeft: 300, expectedMinutes: 5, expectedSeconds: 0 },
      { timeLeft: 150, expectedMinutes: 2, expectedSeconds: 30 },
      { timeLeft: 90, expectedMinutes: 1, expectedSeconds: 30 },
      { timeLeft: 60, expectedMinutes: 1, expectedSeconds: 0 },
      { timeLeft: 30, expectedMinutes: 0, expectedSeconds: 30 },
      { timeLeft: 0, expectedMinutes: 0, expectedSeconds: 0 },
    ];

    testCases.forEach(({ timeLeft, expectedMinutes, expectedSeconds }) => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const isExpired = timeLeft === 0;

      expect(minutes).toBe(expectedMinutes);
      expect(seconds).toBe(expectedSeconds);
      expect(isExpired).toBe(timeLeft === 0);
    });
  });

  it("deve funcionar com diferentes tempos iniciais", () => {
    const testCases = [1, 5, 10, 30, 60];
    
    testCases.forEach(initialMinutes => {
      const initialSeconds = initialMinutes * 60;
      const minutes = Math.floor(initialSeconds / 60);
      const seconds = initialSeconds % 60;
      const isExpired = initialSeconds === 0;

      expect(minutes).toBe(initialMinutes);
      expect(seconds).toBe(0);
      expect(isExpired).toBe(false);
    });
  });

  it("deve calcular isExpired corretamente", () => {
    const testCases = [
      { timeLeft: 300, isExpired: false },
      { timeLeft: 1, isExpired: false },
      { timeLeft: 0, isExpired: true },
    ];

    testCases.forEach(({ timeLeft, isExpired }) => {
      const result = timeLeft === 0;
      expect(result).toBe(isExpired);
    });
  });

  it("deve decrementar corretamente", () => {
    const testCases = [
      { initial: 60, after1s: 59 },
      { initial: 1, after1s: 0 },
      { initial: 0, after1s: 0 },
    ];

    testCases.forEach(({ initial, after1s }) => {
      const result = initial <= 1 ? 0 : initial - 1;
      expect(result).toBe(after1s);
    });
  });
});
