"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Product, CheckoutInput } from "@/types/checkout";
import { formatBRL, formatPercent } from "@/lib/currency";
import { getPricing } from "@/lib/pricing";
import { useCountdown } from "@/lib/hooks/useCountdown";
import Decimal from "decimal.js";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingDown,
  CreditCard,
  Check,
  Clock,
} from "lucide-react";

interface MobileSummaryProps {
  product: Product;
  formData: CheckoutInput;
}

export function MobileSummary({ product, formData }: MobileSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isExpired,
    minutes = 0,
    seconds = 0,
    totalSecondsLeft = 0,
  } = useCountdown(10); // 10 minutos de desconto

  // Helpers para o timer de oferta
  const totalDurationSec = 10 * 60; // 600 segundos (10 minutos)
  const fmt2 = (n: number) => String(n).padStart(2, "0");
  const timeLeft = `${fmt2(minutes)}:${fmt2(seconds)}`;

  const urgency: "calm" | "warning" | "urgent" = isExpired
    ? "calm"
    : totalSecondsLeft < 120
    ? "urgent"
    : totalSecondsLeft < 300
    ? "warning"
    : "calm";

  const progress = Math.max(
    0,
    Math.min(1, totalSecondsLeft / totalDurationSec)
  );

  // Memoizar cálculos para evitar re-renders custosos
  const calculations = useMemo(() => {
    // Usa preço promocional se o timer não expirou, senão usa preço original
    const effectivePrice = isExpired
      ? product.originalPrice
      : product.currentPrice;

    // Usa o novo sistema de preços para cálculos precisos
    const pricing = getPricing({
      originalValue: new Decimal(product.originalPrice),
      currentValue: new Decimal(effectivePrice),
      paymentMethod: formData.paymentMethod,
      installments: formData.installments,
    });

    // Calcular total do cartão para comparação (apenas para PIX)
    const cardPricing =
      formData.paymentMethod === "pix"
        ? getPricing({
            originalValue: new Decimal(product.originalPrice),
            currentValue: new Decimal(effectivePrice),
            paymentMethod: "card",
            installments: formData.installments,
          })
        : null;

    return {
      effectivePrice,
      pricing,
      cardPricing,
      total: pricing.total.toNumber(),
      savings: pricing.savings.toNumber(),
      netValue: pricing.netValue.toNumber(),
      feeAmount: pricing.feeAmount.toNumber(),
      rate: pricing.rate.toNumber(),
      savingsPercent: pricing.savingsPercentage.toFixed(0),
      cardTotal: cardPricing?.total.toNumber() || 0,
      diffPixVsCard: cardPricing
        ? cardPricing.total.toNumber() - pricing.total.toNumber()
        : 0,
    };
  }, [
    product.originalPrice,
    product.currentPrice,
    formData.paymentMethod,
    formData.installments,
    isExpired,
  ]);

  // Desestruturar valores calculados
  const {
    effectivePrice,
    pricing,
    total,
    savings,
    netValue,
    feeAmount,
    rate,
    savingsPercent,
    diffPixVsCard,
  } = calculations;

  // Regras de visibilidade otimizadas
  const isPix = formData.paymentMethod === "pix";
  const shouldShowOriginalPrice = product.originalPrice > total;
  const shouldShowPromotionalPrice = effectivePrice !== total;
  const shouldShowSavings = product.originalPrice > total;
  const shouldShowFee = !isPix && feeAmount > 0;
  const shouldShowNetValue = !isPix && netValue !== effectivePrice;
  const shouldShowFinancialSummary = shouldShowFee || shouldShowNetValue;

  // Helpers de formatação
  const fmt = (value: number) => formatBRL(value);

  // Cálculos para descritivos (memoizados)
  const originalSavings = product.originalPrice - effectivePrice;
  const economyPercent = Math.round(
    (originalSavings / product.originalPrice) * 100
  );

  // Helper para label de parcelas do cartão (mais amigável)
  const getInstallmentLabel = () => {
    if (formData.installments === 1) {
      return `1x no cartão: ${fmt(total)} (inclui ${fmt(feeAmount)} de taxa)`;
    }

    const monthlyValue = pricing.monthlyValue.toNumber();
    return `${formData.installments}x no cartão: ${fmt(monthlyValue)} por mês`;
  };

  // Helper para linha de benefício do PIX (microcopy curta)
  const getPixBenefitText = () => {
    if (!shouldShowSavings) return "";

    let text = `Economia: ${fmt(originalSavings)} (${economyPercent}%)`;

    if (diffPixVsCard > 0) {
      const labelCard =
        formData.installments === 1 ? "1x" : `${formData.installments}x`;
      text += ` • vs cartão ${labelCard}: -${fmt(diffPixVsCard)}`;
    }

    return text;
  };

  return (
    <div className="border-b border-border bg-surface/50 backdrop-blur sticky top-0 z-40 max-w-full">
      <div className="px-4 py-3 md:px-4 md:py-4 max-w-full">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-start p-0 h-auto hover:bg-transparent min-h-[60px] space-x-4"
              aria-expanded={isOpen}
              aria-controls="mobile-summary-details"
            >
              {/* Thumbnail do produto */}
              <div className="w-16 h-16 rounded-xl bg-surface-2 overflow-hidden border border-border flex-shrink-0 shadow-sm">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Conteúdo principal */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* HEADER */}
                <div className="flex flex-col gap-3">
                  {/* 1) Título + Botão */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 flex-1 text-base md:text-lg font-semibold text-text-primary">
                      {product.name}
                    </h3>
                    <div
                      className="shrink-0 flex items-center gap-1 text-xs text-text-secondary cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      aria-controls="mobile-summary-details"
                      aria-label={isOpen ? "Ocultar detalhes" : "Ver detalhes"}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setIsOpen(!isOpen);
                        }
                      }}
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* 2) Chip PIX com reforço */}
                  {isPix && (
                    <div className="flex flex-col items-center gap-1.5 mt-2">
                      <div className="flex flex-wrap items-center justify-center gap-2 min-w-0">
                        <span className="md:hidden">
                          <Badge className="bg-brand/10 text-brand border-brand/20 text-[11px] px-3 py-1.5">
                            PIX • 0% taxa
                          </Badge>
                        </span>
                        <span className="hidden md:inline">
                          <Badge className="bg-brand/10 text-brand border-brand/20 text-[11px] px-3 py-1.5">
                            PIX • 0% taxa • Acesso imediato
                          </Badge>
                        </span>
                      </div>
                      <div className="text-[11px] text-success font-medium text-center">
                        Melhor preço garantido com PIX
                      </div>

                      {/* TIMER BADGE - integrado com PIX */}
                      <div className="flex justify-center">
                        {!isExpired ? (
                          <span
                            className={[
                              "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium",
                              urgency === "calm" &&
                                "bg-surface-2 text-text-secondary border-border",
                              urgency === "warning" &&
                                "bg-amber-900/20 text-amber-300 border-amber-600/40",
                              urgency === "urgent" &&
                                "bg-red-900/25 text-red-300 border-red-600/40 animate-pulse",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            aria-live="polite"
                            aria-atomic="true"
                            title={`Oferta por tempo limitado. Termina em ${timeLeft}`}
                            data-testid="deal-timer-badge"
                            style={{ fontFeatureSettings: "'tnum' 1" }}
                          >
                            <Clock className="h-3 w-3" />
                            Oferta termina em{" "}
                            <span className="tabular-nums">{timeLeft}</span>
                          </span>
                        ) : (
                          <span
                            className="text-[11px] text-red-300/80 font-medium"
                            data-testid="deal-timer-expired"
                          >
                            ⚠ Oferta encerrada — preço original aplicado
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3) Descritivo de parcelas para Cartão */}
                  {!isPix && (
                    <div className="text-center py-1 mt-2">
                      <p className="text-xs text-text-primary font-medium leading-tight line-clamp-1 break-words min-w-0">
                        {getInstallmentLabel()}
                      </p>

                      {/* TIMER BADGE - integrado com Cartão */}
                      <div className="flex justify-center mt-1.5">
                        {!isExpired ? (
                          <span
                            className={[
                              "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium",
                              urgency === "calm" &&
                                "bg-surface-2 text-text-secondary border-border",
                              urgency === "warning" &&
                                "bg-amber-900/20 text-amber-300 border-amber-600/40",
                              urgency === "urgent" &&
                                "bg-red-900/25 text-red-300 border-red-600/40 animate-pulse",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            aria-live="polite"
                            aria-atomic="true"
                            title={`Oferta por tempo limitado. Termina em ${timeLeft}`}
                            data-testid="deal-timer-badge"
                            style={{ fontFeatureSettings: "'tnum' 1" }}
                          >
                            <Clock className="h-3 w-3" />
                            Oferta termina em{" "}
                            <span className="tabular-nums">{timeLeft}</span>
                          </span>
                        ) : (
                          <span
                            className="text-[11px] text-red-300/80 font-medium"
                            data-testid="deal-timer-expired"
                          >
                            ⚠ Oferta encerrada — preço original aplicado
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent id="mobile-summary-details" className="mt-2">
            <Card className="p-3 md:p-4 bg-surface border-border">
              <div className="space-y-3">
                {/* PIX: Preço original apenas dentro de "Ver detalhes" */}
                {isPix && shouldShowOriginalPrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Preço original</span>
                    <span className="text-text-secondary line-through">
                      {formatBRL(product.originalPrice)}
                    </span>
                  </div>
                )}

                {/* Cartão: Preço original e promocional */}
                {!isPix && shouldShowOriginalPrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Preço original</span>
                    <span className="text-text-secondary line-through">
                      {formatBRL(product.originalPrice)}
                    </span>
                  </div>
                )}

                {!isPix && shouldShowPromotionalPrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      Preço promocional
                    </span>
                    <span className="text-text-primary font-semibold">
                      {formatBRL(effectivePrice)}
                    </span>
                  </div>
                )}

                {/* Forma de pagamento */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Forma de pagamento
                  </span>
                  <div className="flex items-center space-x-1">
                    {isPix ? (
                      <>
                        <Zap className="h-3 w-3 text-brand" />
                        <span className="text-text-primary font-medium">
                          PIX
                        </span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-3 w-3 text-text-primary" />
                        <span className="text-text-primary font-medium">
                          Cartão ({formData.installments}x)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Resumo financeiro */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="text-xs md:text-sm text-text-secondary font-medium">
                    Resumo financeiro
                  </div>

                  {/* Valor bruto (mesmo para PIX e Cartão) */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Valor bruto</span>
                    <span className="text-text-primary">
                      {formatBRL(effectivePrice)}
                    </span>
                  </div>

                  {isPix ? (
                    <>
                      {/* PIX: taxa grátis */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">
                          Taxa da plataforma
                        </span>
                        <span className="text-success font-medium">
                          grátis (0%)
                        </span>
                      </div>

                      {/* PIX: líquido = bruto (valor cheio) */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">
                          Líquido para o produtor
                        </span>
                        <span className="text-text-primary font-medium">
                          100%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Cartão: taxa e líquido como já era */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">
                          Taxa da plataforma
                        </span>
                        <span className="text-text-primary">
                          +{formatBRL(feeAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">
                          Líquido para o produtor
                        </span>
                        <span className="text-text-primary font-medium">
                          {formatBRL(netValue)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Footer do card: Total a pagar (sempre visível) */}
        <div
          className="mt-2 pt-2 border-t border-border/40"
          data-testid="total-footer"
        >
          <div className="text-center">
            <div className="text-xs md:text-sm text-text-secondary mb-1">
              Total a pagar
            </div>
            <div
              className="text-lg md:text-xl font-bold text-text-primary"
              aria-live="polite"
              role="text"
              aria-label={`Total a pagar: ${formatBRL(total)}`}
              data-testid="total-to-pay"
            >
              {formatBRL(total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
