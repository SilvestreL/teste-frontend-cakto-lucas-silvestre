import { render, screen, act } from "@testing-library/react";
import InteractiveSummary from "../InteractiveSummary";
import { useCheckoutStore } from "@/lib/state/checkoutStore";

// Mock do Zustand store
jest.mock("@/lib/state/checkoutStore", () => ({
  useCheckoutStore: jest.fn(),
}));

// Mock do hook useCountdown
jest.mock("@/lib/hooks/useCountdown", () => ({
  useCountdown: jest.fn(() => ({ isExpired: false })),
}));

const mockUseCheckoutStore = useCheckoutStore as jest.MockedFunction<
  typeof useCheckoutStore
>;

const mockProduct = {
  originalPrice: 497.0,
  currentPrice: 297.0,
};

describe("InteractiveSummary", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock do Zustand store para retornar valores corretos
    mockUseCheckoutStore.mockImplementation((selector) => {
      if (selector.toString().includes("paymentMethod")) {
        return "pix";
      }
      if (selector.toString().includes("installments")) {
        return 1;
      }
      return selector({ paymentMethod: "pix", installments: 1 });
    });
  });

  it("deve exibir preços corretos para PIX", () => {
    render(<InteractiveSummary product={mockProduct} />);

    expect(screen.getByText("PIX")).toBeInTheDocument();
    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
    expect(screen.getByText("0% taxa")).toBeInTheDocument();
  });

  it("deve exibir preços corretos para cartão à vista", () => {
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<InteractiveSummary product={mockProduct} />);

    expect(screen.getByText("Cartão à vista")).toBeInTheDocument();
    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
  });

  it("deve exibir preços corretos para cartão parcelado", () => {
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(12);

    render(<InteractiveSummary product={mockProduct} />);

    expect(screen.getByText("Cartão 12x")).toBeInTheDocument();
    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
    expect(screen.getByText("(12x de R$ 24,75 no cartão)")).toBeInTheDocument();
  });

  it("deve atualizar preços quando paymentMethod muda", () => {
    const { rerender } = render(<InteractiveSummary product={mockProduct} />);

    // Inicialmente PIX
    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    expect(screen.getByText("PIX")).toBeInTheDocument();

    // Muda para cartão
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(1);

    rerender(<InteractiveSummary product={mockProduct} />);

    expect(screen.getByText("Cartão à vista")).toBeInTheDocument();
  });

  it("deve atualizar preços quando installments muda", () => {
    const { rerender } = render(<InteractiveSummary product={mockProduct} />);

    // Inicialmente 1x
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(1);

    expect(screen.getByText("Cartão à vista")).toBeInTheDocument();

    // Muda para 6x
    mockUseCheckoutStore.mockReturnValue("card");
    mockUseCheckoutStore.mockReturnValue(6);

    rerender(<InteractiveSummary product={mockProduct} />);

    expect(screen.getByText("Cartão 6x")).toBeInTheDocument();
    expect(screen.getByText("(6x de R$ 49,50 no cartão)")).toBeInTheDocument();
  });

  it("deve considerar timer expirado corretamente", () => {
    const { useCountdown } = require("@/lib/hooks/useCountdown");
    useCountdown.mockReturnValue({ isExpired: true });

    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<InteractiveSummary product={mockProduct} />);

    // Com timer expirado, deve usar preço original
    expect(screen.getByText("R$ 497,00")).toBeInTheDocument();
  });

  it("deve considerar timer ativo corretamente", () => {
    const { useCountdown } = require("@/lib/hooks/useCountdown");
    useCountdown.mockReturnValue({ isExpired: false });

    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    render(<InteractiveSummary product={mockProduct} />);

    // Com timer ativo, deve usar preço promocional
    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();
  });

  it("deve recalcular preços quando produto muda", () => {
    const { rerender } = render(<InteractiveSummary product={mockProduct} />);

    mockUseCheckoutStore.mockReturnValue("pix");
    mockUseCheckoutStore.mockReturnValue(1);

    expect(screen.getByText("R$ 297,00")).toBeInTheDocument();

    // Muda produto
    const newProduct = {
      originalPrice: 1000.0,
      currentPrice: 800.0,
    };

    rerender(<InteractiveSummary product={newProduct} />);

    expect(screen.getByText("R$ 800,00")).toBeInTheDocument();
  });
});
