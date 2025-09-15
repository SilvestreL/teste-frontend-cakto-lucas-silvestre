"use client";

import { useState, useMemo } from "react";
import { useCheckoutStore } from "@/lib/state/checkoutStore";
import { formatBRL } from "@/lib/currency";
import { getPricing } from "@/lib/pricing";
import Decimal from "decimal.js";

interface ClientSummaryProps {
  initialPricing: {
    total: number;
    monthly: number;
    savings: number;
    savingsPercent: number;
    feeAmount: number;
    netValue: number;
    pixSavings: number;
  };
}

export default function ClientSummary({ initialPricing }: ClientSummaryProps) {
  // Seletores primitivos do Zustand para evitar re-renders desnecessários
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const installments = useCheckoutStore((state) => state.installments);

  // Calcula preços dinâmicos baseado no estado atual
  const dynamicPricing = useMemo(() => {
    const pricing = getPricing({
      originalValue: new Decimal(initialPricing.total + initialPricing.savings), // Reconstitui preço original
      currentValue: new Decimal(
        initialPricing.total + initialPricing.savings - initialPricing.savings
      ), // Preço promocional
      paymentMethod,
      installments,
    });

    return {
      total: pricing.total.toNumber(),
      monthly: pricing.monthlyValue.toNumber(),
      savings: pricing.savings.toNumber(),
      feeAmount: pricing.feeAmount.toNumber(),
      netValue: pricing.netValue.toNumber(),
    };
  }, [paymentMethod, installments, initialPricing]);

  // Calcula economia do PIX vs cartão 1x
  const pixSavings = useMemo(() => {
    if (paymentMethod === "pix") return 0;

    const cardPricing = getPricing({
      originalValue: new Decimal(initialPricing.total + initialPricing.savings),
      currentValue: new Decimal(
        initialPricing.total + initialPricing.savings - initialPricing.savings
      ),
      paymentMethod: "card",
      installments: 1,
    });

    return cardPricing.feeAmount.toNumber();
  }, [paymentMethod, initialPricing]);

  return (
    <div className="space-y-3">
      {/* Resumo dinâmico baseado no estado atual */}
      <div className="p-3 bg-surface-2/30 border border-border/20 rounded-lg">
        <div className="text-center space-y-1">
          <div className="text-xs text-text-secondary">
            {paymentMethod === "pix"
              ? "PIX"
              : `Cartão ${installments > 1 ? `${installments}x` : "à vista"}`}
          </div>
          <div className="text-lg font-bold text-text-primary">
            {formatBRL(dynamicPricing.total)}
          </div>
          {paymentMethod === "card" && installments > 1 && (
            <div className="text-xs text-text-secondary">
              {installments}x de {formatBRL(dynamicPricing.monthly)}
            </div>
          )}
          {paymentMethod === "pix" && (
            <div className="text-xs text-text-secondary">0% taxa</div>
          )}
        </div>
      </div>

      {/* Detalhes adicionais apenas se mudou do padrão */}
      {(paymentMethod !== "pix" || installments !== 1) && (
        <div className="text-xs text-text-secondary text-center">
          {paymentMethod === "card" && installments > 1 && (
            <span>Taxa: +{formatBRL(dynamicPricing.feeAmount)}</span>
          )}
          {paymentMethod === "card" && installments === 1 && (
            <span>Taxa: +{formatBRL(dynamicPricing.feeAmount)}</span>
          )}
        </div>
      )}
    </div>
  );
}
