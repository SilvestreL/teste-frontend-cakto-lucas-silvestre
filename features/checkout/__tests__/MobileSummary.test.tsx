import { render, screen, act } from "@testing-library/react";
import { MobileSummary } from "../MobileSummary";
import { useCheckoutStore } from "@/lib/state/checkoutStore";
import type { Product } from "@/types/checkout";

// Mock do Zustand store
jest.mock("@/lib/state/checkoutStore", () => ({
  useCheckoutStore: jest.fn(),
}));

// Mock do hook useCountdown
jest.mock("@/lib/hooks/useCountdown", () => ({
  useCountdown: jest.fn(() => ({ isExpired: false })),
}));

// Mock dos componentes mobile
jest.mock("@/components/mobile/MobileProductHeader", () => ({
  MobileProductHeader: ({ product, currentPrice, paymentMethod }: any) => (
    <div data-testid="mobile-product-header">
      {product.name} - {currentPrice} - {paymentMethod}
    </div>
  ),
}));

jest.mock("@/components/mobile/MobileSummaryCompact", () => ({
  MobileSummaryCompact: ({
    originalPrice,
    currentPrice,
    savings,
    savingsPercent,
  }: any) => (
    <div data-testid="mobile-summary-compact">
      {originalPrice} - {currentPrice} - {savings} - {savingsPercent}%
    </div>
  ),
}));

jest.mock("@/components/mobile/MobileDetailsAccordion", () => ({
  MobileDetailsAccordion: ({ children }: any) => (
    <div data-testid="mobile-details-accordion">{children}</div>
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

const mockUseCheckoutStore = useCheckoutStore as jest.MockedFunction<
  typeof useCheckoutStore
>;

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

describe("MobileSummary", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it("deve renderizar informações do produto corretamente", () => {
    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<MobileSummary product={mockProduct} />);

    expect(screen.getByText("Curso de Teste")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
  });

  it("deve exibir preços corretos para PIX", () => {
    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<MobileSummary product={mockProduct} />);

    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
    expect(screen.getByText("0% taxa")).toBeInTheDocument();
  });

  it("deve exibir preços corretos para cartão parcelado", () => {
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(6);

    render(<MobileSummary product={mockProduct} />);

    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
    expect(screen.getByText("6x de R$ 49,50")).toBeInTheDocument();
  });

  it("deve considerar timer expirado corretamente", () => {
    const { useCountdown } = require("@/lib/hooks/useCountdown");
    useCountdown.mockReturnValue({ isExpired: true });

    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<MobileSummary product={mockProduct} />);

    // Com timer expirado, deve usar preço original
    expect(screen.getByText("R$ 497,00")).toBeInTheDocument();
  });

  it("deve considerar timer ativo corretamente", () => {
    const { useCountdown } = require("@/lib/hooks/useCountdown");
    useCountdown.mockReturnValue({ isExpired: false });

    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<MobileSummary product={mockProduct} />);

    // Com timer ativo, deve usar preço promocional
    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
  });

  it("deve exibir informações de desconto corretamente", () => {
    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<MobileSummary product={mockProduct} />);

    expect(screen.getByText("40% OFF")).toBeInTheDocument();
    expect(screen.getByText("-R$ 200,00")).toBeInTheDocument();
  });

  it("deve exibir vantagens do PIX corretamente", () => {
    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<MobileSummary product={mockProduct} />);

    expect(screen.getByText("0% taxa • Acesso imediato")).toBeInTheDocument();
  });

  it("deve exibir informações de parcelamento para cartão", () => {
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(12);

    render(<MobileSummary product={mockProduct} />);

    expect(screen.getByText("12x de R$ 24,75")).toBeInTheDocument();
  });

  it("deve renderizar componentes de urgência", () => {
    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<MobileSummary product={mockProduct} />);

    expect(screen.getByTestId("countdown-timer")).toBeInTheDocument();
    expect(screen.getByTestId("social-proof")).toBeInTheDocument();
  });

  it("deve atualizar preços quando paymentMethod muda", () => {
    const { rerender } = render(<MobileSummary product={mockProduct} />);

    // Inicialmente PIX
    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    expect(screen.getByText("0% taxa")).toBeInTheDocument();

    // Muda para cartão
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(1);

    rerender(<MobileSummary product={mockProduct} />);

    // Deve mostrar informações de cartão
    expect(screen.getByText("Cartão de crédito")).toBeInTheDocument();
  });

  it("deve atualizar preços quando installments muda", () => {
    const { rerender } = render(<MobileSummary product={mockProduct} />);

    // Inicialmente 1x
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(1);

    expect(screen.getByText("Cartão de crédito")).toBeInTheDocument();

    // Muda para 6x
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(6);

    rerender(<MobileSummary product={mockProduct} />);

    expect(screen.getByText("6x de R$ 49,50")).toBeInTheDocument();
  });
});
