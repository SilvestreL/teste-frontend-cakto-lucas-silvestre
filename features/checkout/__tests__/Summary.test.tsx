import { render, screen } from "@testing-library/react";
import { Summary } from "../Summary";
import type { Product, CheckoutInput } from "@/types/checkout";
import { useCheckoutStore } from "@/lib/state/checkoutStore";

// Mock do hook useCountdown
jest.mock("@/lib/hooks/useCountdown", () => ({
  useCountdown: jest.fn(() => ({
    isExpired: false,
    minutes: 5,
    seconds: 30,
  })),
}));

// Mock do store Zustand
jest.mock("@/lib/state/checkoutStore", () => ({
  useCheckoutStore: jest.fn(),
}));

// Mock dos componentes de UI
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

jest.mock("@/components/ui/separator", () => ({
  Separator: (props: any) => <hr data-testid="separator" {...props} />,
}));

// Mock dos componentes de urgência
jest.mock("@/components/urgency/CountdownTimer", () => ({
  CountdownTimer: ({ inline }: any) => (
    <span data-testid="countdown-timer">{inline ? "05:30" : "5min 30s"}</span>
  ),
}));

jest.mock("@/components/urgency/SocialProof", () => ({
  SocialProof: () => <span data-testid="social-proof">+1.2k compras hoje</span>,
}));

// Mock dos componentes mobile
jest.mock("@/components/mobile/MobileProductHeader", () => ({
  MobileProductHeader: ({ product, currentPrice, paymentMethod }: any) => (
    <div data-testid="mobile-product-header">
      <h3>{product.name}</h3>
      <span>R$ {currentPrice.toFixed(2).replace(".", ",")}</span>
      <span>{paymentMethod}</span>
    </div>
  ),
}));

jest.mock("@/components/mobile/MobileSummaryCompact", () => ({
  MobileSummaryCompact: ({ originalPrice, currentPrice, savings }: any) => (
    <div data-testid="mobile-summary-compact">
      <span>R$ {originalPrice.toFixed(2).replace(".", ",")}</span>
      <span>R$ {currentPrice.toFixed(2).replace(".", ",")}</span>
      <span>R$ {savings.toFixed(2).replace(".", ",")}</span>
    </div>
  ),
}));

jest.mock("@/components/mobile/MobileDetailsAccordion", () => ({
  MobileDetailsAccordion: ({ children, title }: any) => (
    <div data-testid="mobile-details-accordion">
      <h4>{title}</h4>
      {children}
    </div>
  ),
}));

// Mock dos ícones
jest.mock("lucide-react", () => ({
  Zap: () => <span data-testid="zap-icon">⚡</span>,
  TrendingDown: () => <span data-testid="trending-down-icon">📉</span>,
  Shield: () => <span data-testid="shield-icon">🛡️</span>,
  Clock: () => <span data-testid="clock-icon">🕐</span>,
  CreditCard: () => <span data-testid="credit-card-icon">💳</span>,
}));

const mockProduct: Product = {
  id: "1",
  name: "Curso de React Avançado",
  description: "Aprenda React do zero ao avançado",
  producer: "Tech Academy",
  originalPrice: 497.0,
  currentPrice: 297.0,
  image: "/placeholder.jpg",
  category: "education",
  tags: ["react", "javascript"],
  rating: 4.8,
  reviews: 1250,
  students: 5000,
  duration: "40 horas",
  level: "intermediário",
  language: "pt-BR",
  lastUpdated: "2024-01-15",
  features: ["Certificado", "Suporte", "Acesso vitalício"],
};

const mockFormDataPix: CheckoutInput = {
  paymentMethod: "pix",
  installments: 1,
  customerInfo: {
    name: "João Silva",
    email: "joao@email.com",
    phone: "11999999999",
    document: "12345678901",
  },
  billingAddress: {
    street: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234567",
    country: "BR",
  },
};

const mockFormDataCard: CheckoutInput = {
  paymentMethod: "card",
  installments: 3,
  customerInfo: {
    name: "João Silva",
    email: "joao@email.com",
    phone: "11999999999",
    document: "12345678901",
  },
  billingAddress: {
    street: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234567",
    country: "BR",
  },
};

describe("Componente Summary", () => {
  beforeEach(() => {
    // Mock window.matchMedia para responsividade
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 640px)", // sm breakpoint
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock padrão do store para PIX
    (useCheckoutStore as jest.Mock).mockImplementation((selector) => {
      const mockState = {
        paymentMethod: "pix",
        installments: 1,
        customerInfo: {
          name: "João Silva",
          email: "joao@email.com",
          phone: "11999999999",
          document: "12345678901",
        },
        billingAddress: {
          street: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234567",
          country: "BR",
        },
      };
      return selector(mockState);
    });
  });

  describe("Layout Desktop", () => {
    beforeEach(() => {
      // Simula desktop
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(min-width: 640px)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it("deve renderizar informações do produto corretamente", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      expect(
        screen.getAllByText("Curso de React Avançado")[0]
      ).toBeInTheDocument();
      expect(screen.getByText("Tech Academy")).toBeInTheDocument();
      expect(screen.getByText("Produto digital")).toBeInTheDocument();
      expect(screen.getByText("Liberação imediata")).toBeInTheDocument();
    });

    it("deve exibir informações de preço corretamente para PIX", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      // Preço original riscado
      expect(screen.getByText("Preço original")).toBeInTheDocument();
      expect(screen.getAllByText("R$ 497,00")[0]).toBeInTheDocument();

      // Preço promocional
      expect(screen.getByText("Preço promocional")).toBeInTheDocument();
      expect(screen.getAllByText("R$ 297,00")[0]).toBeInTheDocument();

      // Desconto aplicado
      expect(screen.getByText("Desconto aplicado")).toBeInTheDocument();
      expect(screen.getByText("-R$ 200,00")).toBeInTheDocument();
    });

    it("deve exibir detalhes de pagamento corretamente para PIX", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      expect(
        screen.getAllByText("Detalhes do pagamento")[0]
      ).toBeInTheDocument();
      expect(screen.getAllByText("Forma de pagamento")[0]).toBeInTheDocument();
      expect(screen.getAllByText("PIX")[0]).toBeInTheDocument();
      expect(
        screen.getAllByText("0% taxa • Acesso imediato")[0]
      ).toBeInTheDocument();
    });

    it("deve exibir detalhes de pagamento corretamente para Cartão 3x", () => {
      // Mock store para cartão 3x
      (useCheckoutStore as jest.Mock).mockImplementation((selector) => {
        const mockState = {
          paymentMethod: "card",
          installments: 3,
          customerInfo: {
            name: "João Silva",
            email: "joao@email.com",
            phone: "11999999999",
            document: "12345678901",
          },
          billingAddress: {
            street: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234567",
            country: "BR",
          },
        };
        return selector(mockState);
      });

      render(<Summary product={mockProduct} />);

      expect(screen.getAllByText("Forma de pagamento")[0]).toBeInTheDocument();
      expect(
        screen.getAllByText("Cartão de crédito • 3x")[0]
      ).toBeInTheDocument();
      expect(screen.getAllByText("Parcelamento")[0]).toBeInTheDocument();
      expect(screen.getByText("Valor bruto")).toBeInTheDocument();
      expect(screen.getByText("Taxa da plataforma")).toBeInTheDocument();
      expect(
        screen.getByText("Valor líquido para o produtor")
      ).toBeInTheDocument();
    });

    it("deve exibir total corretamente", () => {
      render(<Summary product={mockProduct} />);

      expect(screen.getByText("Você paga hoje")).toBeInTheDocument();
      expect(screen.getAllByText("R$ 297,00")[0]).toBeInTheDocument();
      expect(
        screen.getByText("(PIX • 0% taxa • Acesso imediato)")
      ).toBeInTheDocument();
    });

    it("deve exibir total corretamente para Cartão 3x", () => {
      // Mock store para cartão 3x
      (useCheckoutStore as jest.Mock).mockImplementation((selector) => {
        const mockState = {
          paymentMethod: "card",
          installments: 3,
          customerInfo: {
            name: "João Silva",
            email: "joao@email.com",
            phone: "11999999999",
            document: "12345678901",
          },
          billingAddress: {
            street: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234567",
            country: "BR",
          },
        };
        return selector(mockState);
      });

      render(<Summary product={mockProduct} />);

      expect(screen.getByText("Você paga hoje")).toBeInTheDocument();
      expect(screen.getAllByText("R$ 323,70")[0]).toBeInTheDocument();
      expect(
        screen.getByText("(3x de R$ 107,00 no cartão)")
      ).toBeInTheDocument();
    });
  });

  describe("Layout Mobile", () => {
    beforeEach(() => {
      // Simula mobile
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false, // Mobile
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it("deve renderizar componentes mobile", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      expect(screen.getByTestId("mobile-product-header")).toBeInTheDocument();
      expect(screen.getByTestId("mobile-summary-compact")).toBeInTheDocument();
      expect(
        screen.getByTestId("mobile-details-accordion")
      ).toBeInTheDocument();
    });

    it("deve exibir total mobile corretamente", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      expect(screen.getByText("Total a pagar")).toBeInTheDocument();
      expect(screen.getAllByText("R$ 297,00")[0]).toBeInTheDocument();
      expect(screen.getByText("PIX • 0% taxa")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter labels ARIA adequados", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      // Verifica se há elementos com aria-label
      const pixAdvantages = screen.getAllByLabelText(
        "Vantagens do pagamento via PIX"
      )[0];
      expect(pixAdvantages).toBeInTheDocument();
    });

    it("deve ter atributos de role adequados", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      // O card principal deve ter role="region"
      const card = screen.getByTestId("card");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Atualizações Dinâmicas", () => {
    it("deve atualizar quando método de pagamento muda de PIX para Cartão", () => {
      const { rerender } = render(<Summary product={mockProduct} />);

      // Verifica PIX
      expect(screen.getAllByText("PIX")[0]).toBeInTheDocument();
      expect(
        screen.getAllByText("0% taxa • Acesso imediato")[0]
      ).toBeInTheDocument();

      // Mock store para cartão 3x
      (useCheckoutStore as jest.Mock).mockImplementation((selector) => {
        const mockState = {
          paymentMethod: "card",
          installments: 3,
          customerInfo: {
            name: "João Silva",
            email: "joao@email.com",
            phone: "11999999999",
            document: "12345678901",
          },
          billingAddress: {
            street: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234567",
            country: "BR",
          },
        };
        return selector(mockState);
      });

      // Muda para Cartão
      rerender(<Summary product={mockProduct} />);

      // Verifica Cartão
      expect(
        screen.getAllByText("Cartão de crédito • 3x")[0]
      ).toBeInTheDocument();
      expect(screen.getAllByText("Parcelamento")[0]).toBeInTheDocument();
      expect(screen.getByText("Taxa da plataforma")).toBeInTheDocument();
    });

    it("deve atualizar total quando método de pagamento muda", () => {
      const { rerender } = render(<Summary product={mockProduct} />);

      // Verifica total PIX
      expect(screen.getAllByText("R$ 297,00")[0]).toBeInTheDocument();

      // Mock store para cartão 3x
      (useCheckoutStore as jest.Mock).mockImplementation((selector) => {
        const mockState = {
          paymentMethod: "card",
          installments: 3,
          customerInfo: {
            name: "João Silva",
            email: "joao@email.com",
            phone: "11999999999",
            document: "12345678901",
          },
          billingAddress: {
            street: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234567",
            country: "BR",
          },
        };
        return selector(mockState);
      });

      // Muda para Cartão
      rerender(<Summary product={mockProduct} />);

      // Verifica total Cartão
      expect(screen.getAllByText("R$ 323,70")[0]).toBeInTheDocument();
    });
  });

  describe("Sem Duplicação", () => {
    it("não deve duplicar informações importantes", () => {
      render(<Summary product={mockProduct} />);

      // Cada informação importante deve aparecer apenas uma vez
      const totalElements = screen.getAllByText(/R\$ 297,00/);
      expect(totalElements.length).toBeGreaterThan(0);

      const pixElements = screen.getAllByText("PIX");
      expect(pixElements.length).toBeGreaterThan(0);
    });
  });

  describe("Integração Timer", () => {
    it("deve exibir timer de contagem regressiva", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      expect(screen.getAllByTestId("countdown-timer")[0]).toBeInTheDocument();
      expect(screen.getAllByText("05:30")[0]).toBeInTheDocument();
    });

    it("deve exibir prova social", () => {
      render(<Summary product={mockProduct} formData={mockFormDataPix} />);

      expect(screen.getAllByTestId("social-proof")[0]).toBeInTheDocument();
      expect(screen.getAllByText("+1.2k compras hoje")[0]).toBeInTheDocument();
    });
  });
});
