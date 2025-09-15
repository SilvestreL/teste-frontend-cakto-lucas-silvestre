import "@testing-library/jest-dom";

// Configuração global para testes
global.console = {
  ...console,
  // Suprime logs durante os testes, exceto erros
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};

// Mock para Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock para Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Configuração de timeout para testes
jest.setTimeout(10000);

// Configuração para testes assíncronos
beforeEach(() => {
  // Limpa todos os mocks antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Limpa timers e intervals após cada teste
  jest.clearAllMocks();
  jest.clearAllTimers();
});
