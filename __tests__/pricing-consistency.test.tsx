import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ServerSummary from "@/features/summary/ServerSummary";
import InteractiveSummary from "@/features/summary/InteractiveSummary";
import { MobileSummary } from "@/features/checkout/MobileSummary";
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

describe("Pricing Consistency Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Consistência de preços entre componentes", () => {
    it("deve exibir preços consistentes para PIX em todos os componentes", () => {
      mockUseCheckoutStore.mockReturnValue("pix");
      mockUseCheckoutStore.mockReturnValue(1);

      const { container: serverContainer } = render(
        <ServerSummary product={mockProduct} />
      );

      const { container: interactiveContainer } = render(
        <InteractiveSummary product={mockProduct} />
      );

      const { container: mobileContainer } = render(
        <MobileSummary product={mockProduct} />
      );

      // Verifica se todos os componentes exibem o mesmo preço
      expect(serverContainer.textContent).toContain("R$ 297,00");
      expect(interactiveContainer.textContent).toContain("R$ 297,00");
      expect(mobileContainer.textContent).toContain("R$ 297,00");
    });

    it("deve exibir preços consistentes para cartão parcelado em todos os componentes", () => {
      mockUseCheckoutStore.mockReturnValue("card");
      mockUseCheckoutStore.mockReturnValue(6);

      const { container: serverContainer } = render(
        <ServerSummary product={mockProduct} />
      );

      const { container: interactiveContainer } = render(
        <InteractiveSummary product={mockProduct} />
      );

      const { container: mobileContainer } = render(
        <MobileSummary product={mockProduct} />
      );

      // Verifica se todos os componentes exibem o mesmo preço total
      expect(serverContainer.textContent).toContain("R$ 297,00");
      expect(interactiveContainer.textContent).toContain("R$ 297,00");
      expect(mobileContainer.textContent).toContain("R$ 297,00");
    });

    it("deve exibir preços consistentes quando timer expira", () => {
      const { useCountdown } = require("@/lib/hooks/useCountdown");
      useCountdown.mockReturnValue({ isExpired: true });

      mockUseCheckoutStore.mockReturnValue("pix");
      mockUseCheckoutStore.mockReturnValue(1);

      const { container: serverContainer } = render(
        <ServerSummary product={mockProduct} />
      );

      const { container: interactiveContainer } = render(
        <InteractiveSummary product={mockProduct} />
      );

      const { container: mobileContainer } = render(
        <MobileSummary product={mockProduct} />
      );

      // Com timer expirado, todos devem usar preço original
      expect(serverContainer.textContent).toContain("R$ 497,00");
      expect(interactiveContainer.textContent).toContain("R$ 497,00");
      expect(mobileContainer.textContent).toContain("R$ 497,00");
    });

    it("deve exibir preços consistentes quando timer está ativo", () => {
      const { useCountdown } = require("@/lib/hooks/useCountdown");
      useCountdown.mockReturnValue({ isExpired: false });

      mockUseCheckoutStore.mockReturnValue("pix");
      mockUseCheckoutStore.mockReturnValue(1);

      const { container: serverContainer } = render(
        <ServerSummary product={mockProduct} />
      );

      const { container: interactiveContainer } = render(
        <InteractiveSummary product={mockProduct} />
      );

      const { container: mobileContainer } = render(
        <MobileSummary product={mockProduct} />
      );

      // Com timer ativo, todos devem usar preço promocional
      expect(serverContainer.textContent).toContain("R$ 297,00");
      expect(interactiveContainer.textContent).toContain("R$ 297,00");
      expect(mobileContainer.textContent).toContain("R$ 297,00");
    });
  });

  describe("Consistência de informações de pagamento", () => {
    it("deve exibir informações de PIX consistentes", () => {
      mockUseCheckoutStore.mockReturnValue("pix");
      mockUseCheckoutStore.mockReturnValue(1);

      const { container: serverContainer } = render(
        <ServerSummary product={mockProduct} />
      );

      const { container: interactiveContainer } = render(
        <InteractiveSummary product={mockProduct} />
      );

      const { container: mobileContainer } = render(
        <MobileSummary product={mockProduct} />
      );

      // Verifica se todos exibem informações de PIX
      expect(serverContainer.textContent).toContain("PIX");
      expect(interactiveContainer.textContent).toContain("PIX");
      expect(mobileContainer.textContent).toContain("PIX");

      // Verifica se todos exibem 0% taxa
      expect(serverContainer.textContent).toContain("0% taxa");
      expect(interactiveContainer.textContent).toContain("0% taxa");
      expect(mobileContainer.textContent).toContain("0% taxa");
    });

    it("deve exibir informações de cartão consistentes", () => {
      mockUseCheckoutStore.mockReturnValue("card");
      mockUseCheckoutStore.mockReturnValue(6);

      const { container: serverContainer } = render(
        <ServerSummary product={mockProduct} />
      );

      const { container: interactiveContainer } = render(
        <InteractiveSummary product={mockProduct} />
      );

      const { container: mobileContainer } = render(
        <MobileSummary product={mockProduct} />
      );

      // Verifica se todos exibem informações de cartão
      expect(serverContainer.textContent).toContain("Cartão");
      expect(interactiveContainer.textContent).toContain("Cartão");
      expect(mobileContainer.textContent).toContain("Cartão");
    });
  });

  describe("Consistência de cálculos de desconto", () => {
    it("deve calcular desconto consistentemente", () => {
      mockUseCheckoutStore.mockReturnValue("pix");
      mockUseCheckoutStore.mockReturnValue(1);

      const { container: serverContainer } = render(
        <ServerSummary product={mockProduct} />
      );

      const { container: interactiveContainer } = render(
        <InteractiveSummary product={mockProduct} />
      );

      const { container: mobileContainer } = render(
        <MobileSummary product={mockProduct} />
      );

      // Verifica se todos calculam o mesmo desconto
      expect(serverContainer.textContent).toContain("40% OFF");
      expect(interactiveContainer.textContent).toContain("40% OFF");
      expect(mobileContainer.textContent).toContain("40% OFF");

      expect(serverContainer.textContent).toContain("-R$ 200,00");
      expect(interactiveContainer.textContent).toContain("-R$ 200,00");
      expect(mobileContainer.textContent).toContain("-R$ 200,00");
    });
  });

  describe("Consistência de responsividade", () => {
    it("deve renderizar componentes mobile corretamente", () => {
      mockUseCheckoutStore.mockReturnValue("pix");
      mockUseCheckoutStore.mockReturnValue(1);

      render(<ServerSummary product={mockProduct} />);
      render(<MobileSummary product={mockProduct} />);

      // Verifica se componentes mobile são renderizados
      expect(screen.getAllByTestId("mobile-product-header")).toHaveLength(1);
      expect(screen.getAllByTestId("mobile-summary-compact")).toHaveLength(1);
      expect(screen.getAllByTestId("mobile-details-accordion")).toHaveLength(1);
    });

    it("deve renderizar componentes de urgência corretamente", () => {
      mockUseCheckoutStore.mockReturnValue("pix");
      mockUseCheckoutStore.mockReturnValue(1);

      render(<ServerSummary product={mockProduct} />);
      render(<MobileSummary product={mockProduct} />);

      // Verifica se componentes de urgência são renderizados
      expect(screen.getAllByTestId("countdown-timer")).toHaveLength(2);
      expect(screen.getAllByTestId("social-proof")).toHaveLength(2);
    });
  });
});
