import { render, screen } from "@testing-library/react";
import ServerSummary from "../ServerSummary";
import type { Product } from "@/types/checkout";

// Mock do next/dynamic
jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => (
    <div data-testid="dynamic-component">Dynamic Component</div>
  );
  DynamicComponent.displayName = "LoadableComponent";
  return DynamicComponent;
});

// Mock dos componentes de urgência
jest.mock("@/components/urgency/UrgencyElements", () => ({
  UrgencyElements: () => (
    <div data-testid="urgency-elements">Urgency Elements</div>
  ),
}));

jest.mock("@/components/urgency/CountdownTimer", () => ({
  CountdownTimer: () => (
    <div data-testid="countdown-timer">Countdown Timer</div>
  ),
}));

jest.mock("@/components/urgency/SocialProof", () => ({
  SocialProof: () => <div data-testid="social-proof">Social Proof</div>,
}));

// Mock dos componentes mobile
jest.mock("@/components/mobile/MobileProductHeader", () => ({
  MobileProductHeader: () => (
    <div data-testid="mobile-product-header">Mobile Product Header</div>
  ),
}));

jest.mock("@/components/mobile/MobileSummaryCompact", () => ({
  MobileSummaryCompact: () => (
    <div data-testid="mobile-summary-compact">Mobile Summary Compact</div>
  ),
}));

jest.mock("@/components/mobile/MobileDetailsAccordion", () => ({
  MobileDetailsAccordion: () => (
    <div data-testid="mobile-details-accordion">Mobile Details Accordion</div>
  ),
}));

const mockProduct: Product = {
  id: "test-product",
  name: "Curso de Teste",
  originalPrice: 497.0,
  currentPrice: 297.0,
  producer: "João Silva",
  format: "digital",
  deliveryTime: "imediato",
  description: "Curso de teste para validação",
  image: "/test-image.jpg",
};

const mockInitialPricing = {
  total: 297.0,
  monthly: 297.0,
  savings: 200.0,
  savingsPercent: 40,
  feeAmount: 0,
  netValue: 297.0,
  pixSavings: 0,
};

describe("ServerSummary", () => {
  it("deve renderizar informações do produto corretamente", () => {
    render(<ServerSummary product={mockProduct} />);

    expect(screen.getByText("Curso de Teste")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Produto digital")).toBeInTheDocument();
    expect(screen.getByText("Liberação imediata")).toBeInTheDocument();
  });

  it("deve exibir preços corretos quando initialPricing é fornecido", () => {
    render(
      <ServerSummary
        product={mockProduct}
        initialPricing={mockInitialPricing}
      />
    );

    // Verifica se os preços estão sendo exibidos corretamente
    expect(screen.getByText("R$ 497,00")).toBeInTheDocument(); // Preço original
    expect(screen.getByText("R$ 297,00")).toBeInTheDocument(); // Preço promocional
  });

  it("deve calcular preços corretamente quando initialPricing não é fornecido", () => {
    render(<ServerSummary product={mockProduct} />);

    // Verifica se os preços calculados estão corretos
    expect(screen.getByText("R$ 497,00")).toBeInTheDocument(); // Preço original
    expect(screen.getByText("R$ 297,00")).toBeInTheDocument(); // Preço promocional
  });

  it("deve exibir informações de desconto corretamente", () => {
    render(
      <ServerSummary
        product={mockProduct}
        initialPricing={mockInitialPricing}
      />
    );

    expect(screen.getByText("40% OFF")).toBeInTheDocument();
    expect(screen.getByText("-R$ 200,00")).toBeInTheDocument();
  });

  it("deve exibir vantagens do PIX corretamente", () => {
    render(
      <ServerSummary
        product={mockProduct}
        initialPricing={mockInitialPricing}
      />
    );

    expect(screen.getByText("0% taxa • Acesso imediato")).toBeInTheDocument();
    expect(
      screen.getByText("Economia no PIX vs cartão 1x: +R$ 0,00")
    ).toBeInTheDocument();
  });

  it("deve renderizar componentes mobile corretamente", () => {
    render(<ServerSummary product={mockProduct} />);

    expect(screen.getByTestId("mobile-product-header")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-summary-compact")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-details-accordion")).toBeInTheDocument();
  });

  it("deve renderizar componentes de urgência corretamente", () => {
    render(<ServerSummary product={mockProduct} />);

    expect(screen.getByTestId("urgency-elements")).toBeInTheDocument();
    expect(screen.getByTestId("countdown-timer")).toBeInTheDocument();
    expect(screen.getByTestId("social-proof")).toBeInTheDocument();
  });

  it("deve exibir total a pagar corretamente", () => {
    render(
      <ServerSummary
        product={mockProduct}
        initialPricing={mockInitialPricing}
      />
    );

    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
    expect(screen.getByText("PIX • 0% taxa")).toBeInTheDocument();
  });
});
