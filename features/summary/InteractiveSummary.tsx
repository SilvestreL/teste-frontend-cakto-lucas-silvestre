"use client";

import { useMemo } from "react";
import { useCheckoutStore } from "@/lib/state/checkoutStore";
import { formatBRL } from "@/lib/currency";
import { getPricing } from "@/lib/pricing";
import { useCountdown } from "@/lib/hooks/useCountdown";
import Decimal from "decimal.js";

interface InteractiveSummaryProps {
  product: {
    originalPrice: number;
    currentPrice: number;
  };
}

export default function InteractiveSummary({
  product,
}: InteractiveSummaryProps) {
  // Seletores primitivos do Zustand para evitar re-renders desnecessários
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const installments = useCheckoutStore((state) => state.installments);
  const { isExpired } = useCountdown(10); // 10 minutos de desconto

  // Usa preço promocional se o timer não expirou, senão usa preço original
  const effectivePrice = isExpired
    ? product.originalPrice
    : product.currentPrice;

  // Calcula preços dinâmicos baseado no estado atual
  const pricing = useMemo(() => {
    const pricingResult = getPricing({
      originalValue: new Decimal(product.originalPrice),
      currentValue: new Decimal(effectivePrice),
      paymentMethod,
      installments,
    });

    return {
      total: pricingResult.total.toNumber(),
      monthly: pricingResult.monthlyValue.toNumber(),
      savings: pricingResult.savings.toNumber(),
      feeAmount: pricingResult.feeAmount.toNumber(),
      netValue: pricingResult.netValue.toNumber(),
    };
  }, [paymentMethod, installments, product, effectivePrice]);

  return (
    <div className="p-4 bg-surface-2/60 border border-border/30 rounded-lg">
      <div className="text-center space-y-2">
        <div className="text-xs sm:text-sm text-text-secondary">
          {paymentMethod === "pix"
            ? "PIX"
            : `Cartão ${installments > 1 ? `${installments}x` : "à vista"}`}
        </div>
        <div className="text-2xl md:text-3xl font-bold text-text-primary">
          {formatBRL(pricing.total)}
        </div>
        {paymentMethod === "card" && installments > 1 && (
          <div className="text-xs sm:text-sm text-text-secondary">
            ({installments}x de {formatBRL(pricing.monthly)} no cartão)
          </div>
        )}
        {paymentMethod === "pix" && (
          <div className="text-xs sm:text-sm text-text-secondary">
            (PIX • 0% taxa • Acesso imediato)
          </div>
        )}
      </div>
    </div>
  );
}
