import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "../useCountdown";

// Mock do Date.now para controlar o tempo
const mockDateNow = jest.spyOn(Date, "now");

describe("useCountdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset do mock do Date.now
    mockDateNow.mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("deve inicializar com timer ativo", () => {
    const { result } = renderHook(() => useCountdown(10));
    
    expect(result.current.isExpired).toBe(false);
    expect(result.current.totalSecondsLeft).toBe(600); // 10 minutos em segundos
  });

  it("deve expirar após o tempo especificado", () => {
    // Inicia em 0
    mockDateNow.mockReturnValue(0);
    
    const { result } = renderHook(() => useCountdown(10));
    
    expect(result.current.isExpired).toBe(false);
    
    // Avança o tempo para 10 minutos e 1 segundo
    act(() => {
      mockDateNow.mockReturnValue(10 * 60 * 1000 + 1000);
    });
    
    // Força re-render
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.isExpired).toBe(true);
  });

  it("deve atualizar timeLeft corretamente", () => {
    const { result } = renderHook(() => useCountdown(5));
    
    expect(result.current.totalSecondsLeft).toBe(300); // 5 minutos em segundos
    
    // Avança 1 minuto
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });
    
    expect(result.current.totalSecondsLeft).toBe(240); // 4 minutos em segundos
  });

  it("deve funcionar com diferentes durações", () => {
    // Testa com 1 minuto
    const { result: result1 } = renderHook(() => useCountdown(1));
    expect(result1.current.totalSecondsLeft).toBe(60);
    
    // Testa com 30 minutos
    const { result: result2 } = renderHook(() => useCountdown(30));
    expect(result2.current.totalSecondsLeft).toBe(1800);
  });

  it("deve lidar com timer já expirado", () => {
    // Inicia com tempo já expirado
    const { result } = renderHook(() => useCountdown(0));
    
    expect(result.current.isExpired).toBe(true);
    expect(result.current.totalSecondsLeft).toBe(0);
  });

  it("deve limpar timers ao desmontar", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    
    const { unmount } = renderHook(() => useCountdown(10));
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("deve atualizar a cada segundo", () => {
    const { result } = renderHook(() => useCountdown(2));
    
    expect(result.current.totalSecondsLeft).toBe(120);
    
    // Avança 1 segundo
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.totalSecondsLeft).toBe(119);
    
    // Avança mais 1 segundo
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.totalSecondsLeft).toBe(118);
  });
});
