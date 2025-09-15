"use client";
import { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MobileProductHeader } from "@/components/mobile/MobileProductHeader";
import { MobileSummaryCompact } from "@/components/mobile/MobileSummaryCompact";
import { MobileDetailsAccordion } from "@/components/mobile/MobileDetailsAccordion";
import { UrgencyBannerClient } from "@/components/urgency/UrgencyBanner.client";
import { OrderBreakdown } from "@/components/checkout/OrderBreakdown";
import { PaymentDetails } from "@/components/checkout/PaymentDetails";
import { TotalDisplay } from "@/components/checkout/TotalDisplay";
import type { Product } from "@/types/checkout";
import { useCheckoutStore } from "@/lib/state/checkoutStore";
import { formatBRL } from "@/lib/currency";
import { getPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
import { useCountdown } from "@/lib/hooks/useCountdown";

interface SummaryProps {
  product: Product;
}

export const Summary = memo(function Summary({ product }: SummaryProps) {
  // Usar seletores primitivos para evitar re-renders desnecessários
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const installments = useCheckoutStore((state) => state.installments);
  const { isExpired } = useCountdown(10); // 10 minutos de desconto

  // Memoizar cálculos de preço para evitar recálculos desnecessários
  const pricingData = useMemo(() => {
    // Usa preço promocional se o timer não expirou, senão usa preço original
    const effectivePrice = isExpired
      ? product.originalPrice
      : product.currentPrice;

    // Usa o novo sistema de preços para cálculos precisos
    const pricing = getPricing({
      originalValue: new Decimal(product.originalPrice),
      currentValue: new Decimal(effectivePrice),
      paymentMethod,
      installments,
    });

    // Calcula economia do PIX vs cartão 1x (referência para PIX)
    const cardOneShotPricing = getPricing({
      originalValue: new Decimal(product.originalPrice),
      currentValue: new Decimal(effectivePrice),
      paymentMethod: "card",
      installments: 1,
    });

    return {
      effectivePrice,
      total: pricing.total.toNumber(),
      monthlyValue: pricing.monthlyValue.toNumber(),
      netValue: pricing.netValue.toNumber(),
      savings: pricing.savings.toNumber(),
      feeAmount: pricing.feeAmount.toNumber(),
      savingsPercent: Number(pricing.savingsPercentage.toFixed(0)),
      pixSavings: cardOneShotPricing.feeAmount.toNumber(),
    };
  }, [
    product.originalPrice,
    product.currentPrice,
    paymentMethod,
    installments,
    isExpired,
  ]);

  const {
    effectivePrice,
    total,
    monthlyValue,
    netValue,
    savings,
    feeAmount,
    savingsPercent,
    pixSavings,
  } = pricingData;

  // Componentes estáticos memoizados
  const ProductImage = memo(() => (
    <div className="relative w-full h-40 rounded-lg bg-surface-2 border border-border overflow-hidden">
      <img
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        className="w-full h-full object-cover object-center"
        style={{ objectPosition: "30% 10%" }}
      />
    </div>
  ));

  const ProductInfo = memo(() => (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-text-primary leading-tight">
        {product.name}
      </h3>
      {product.description && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {product.description}
        </p>
      )}
      <div className="space-y-3">
        <p className="text-xs text-text-secondary">
          por{" "}
          <span className="font-medium text-text-primary">
            {product.producer}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="text-xs px-2.5 py-1 h-auto bg-surface-2 text-text-secondary border-border"
          >
            Produto digital
          </Badge>
          <Badge className="text-xs px-2.5 py-1 h-auto bg-brand/10 text-brand border-brand/20">
            Liberação imediata
          </Badge>
        </div>
      </div>
    </div>
  ));

  return (
    <Card className="p-4 sm:p-6 bg-surface border-border max-w-[420px] lg:max-w-none">
      <div className="space-y-3">
        {/* Mobile: Cabeçalho compacto */}
        <div className="block sm:hidden">
          <MobileProductHeader
            product={product}
            currentPrice={effectivePrice}
            paymentMethod={paymentMethod}
          />
        </div>

        {/* Desktop: Product Section */}
        <div className="hidden sm:block space-y-4">
          <ProductImage />
          <ProductInfo />
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Resumo compacto */}
        <div className="block sm:hidden space-y-3">
          <MobileSummaryCompact
            originalPrice={product.originalPrice}
            currentPrice={effectivePrice}
            savings={savings}
            savingsPercent={savingsPercent}
          />
        </div>

        {/* Desktop: Pricing Section - SERVER COMPONENT */}
        <div className="hidden sm:block space-y-3">
          <h4 className="text-base sm:text-lg font-bold text-text-primary">
            Resumo do pedido
          </h4>
          <OrderBreakdown
            originalPrice={product.originalPrice}
            currentPrice={effectivePrice}
            savings={savings}
            savingsPercent={savingsPercent}
          />
        </div>

        {/* URGÊNCIA ISOLADA - Não força re-render nos blocos estáticos */}
        <UrgencyBannerClient
          initialMinutes={10}
          isMobile={false}
          showSocialProof={true}
        />

        <Separator className="bg-border/40" />

        {/* Mobile: Detalhes em accordion - SERVER COMPONENT */}
        <div className="block sm:hidden">
          <MobileDetailsAccordion title="Detalhes do pagamento">
            <PaymentDetails
              paymentMethod={paymentMethod}
              installments={installments}
              effectivePrice={effectivePrice}
              feeAmount={feeAmount}
              netValue={netValue}
              pixSavings={pixSavings}
              isMobile={true}
            />
          </MobileDetailsAccordion>
        </div>

        {/* Desktop: Payment Details Section - SERVER COMPONENT */}
        <div className="hidden sm:block">
          <PaymentDetails
            paymentMethod={paymentMethod}
            installments={installments}
            effectivePrice={effectivePrice}
            feeAmount={feeAmount}
            netValue={netValue}
            pixSavings={pixSavings}
            isMobile={false}
          />
        </div>

        <Separator className="bg-border/40" />

        {/* Total Section - SERVER COMPONENT */}
        <TotalDisplay
          total={total}
          paymentMethod={paymentMethod}
          installments={installments}
          monthlyValue={monthlyValue}
          isMobile={false}
        />
      </div>
    </Card>
  );
});
