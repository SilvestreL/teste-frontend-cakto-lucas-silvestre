"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UrgencyElements } from "@/components/urgency/UrgencyElements";
import { CountdownTimer } from "@/components/urgency/CountdownTimer";
import { SocialProof } from "@/components/urgency/SocialProof";
import { MobileProductHeader } from "@/components/mobile/MobileProductHeader";
import { MobileUrgencyElements } from "@/components/mobile/MobileUrgencyElements";
import { MobileSummaryCompact } from "@/components/mobile/MobileSummaryCompact";
import { MobileDetailsAccordion } from "@/components/mobile/MobileDetailsAccordion";
import type { Product, CheckoutInput } from "@/types/checkout";
import { formatBRL, formatPercent } from "@/lib/currency";
import { getPricing, getFormattedPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { Zap, TrendingDown, Shield, Clock, CreditCard } from "lucide-react";

interface SummaryProps {
  product: Product;
  formData: CheckoutInput;
}

export function Summary({ product, formData }: SummaryProps) {
  const { isExpired } = useCountdown(10); // 10 minutos de desconto

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

  const formattedPricing = getFormattedPricing({
    originalValue: new Decimal(product.originalPrice),
    currentValue: new Decimal(effectivePrice),
    paymentMethod: formData.paymentMethod,
    installments: formData.installments,
  });

  // Valores para compatibilidade com o código existente
  const total = pricing.total.toNumber();
  const monthlyValue = pricing.monthlyValue.toNumber();
  const netValue = pricing.netValue.toNumber();
  const savings = pricing.savings.toNumber();
  const feeAmount = pricing.feeAmount.toNumber();
  const savingsPercent = pricing.savingsPercentage.toFixed(0);

  // Calcula percentual da taxa
  const feePercent =
    feeAmount > 0
      ? ((feeAmount / (total - feeAmount)) * 100).toFixed(1)
      : "0.0";

  return (
    <Card className="p-4 sm:p-6 bg-surface border-border">
      <div className="space-y-4 sm:spimage.pngace-y-6">
        {/* Mobile: Cabeçalho compacto */}
        <div className="block sm:hidden">
          <MobileProductHeader
            product={product}
            currentPrice={effectivePrice}
            paymentMethod={formData.paymentMethod}
          />
        </div>

        {/* Desktop: Product Section */}
        <div className="hidden sm:block space-y-4">
          <div className="aspect-video rounded-xl bg-surface-2 overflow-hidden border border-border">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            {/* Título principal */}
            <h3 className="text-lg font-bold text-text-primary leading-tight">
              {product.name}
            </h3>

            {/* Descrição limitada a 2 linhas */}
            {product.description && (
              <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Metadados organizados */}
            <div className="space-y-3">
              {/* Produtor */}
              <p className="text-xs text-text-secondary">
                por{" "}
                <span className="font-medium text-text-primary">
                  {product.producer}
                </span>
              </p>

              {/* Informações do produto */}
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
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Resumo compacto + urgência */}
        <div className="block sm:hidden space-y-3">
          <MobileSummaryCompact
            originalPrice={product.originalPrice}
            currentPrice={effectivePrice}
            savings={savings}
            savingsPercent={Number(savingsPercent)}
          />

          {/* Urgência e Social Proof - LAYOUT INTEGRADO MOBILE */}
          <div className="space-y-3">
            {/* Texto de urgência */}
            <div className="text-center">
              <span className="text-xs text-text-primary">
                Você tem <span className="font-bold">tempo limitado</span> para
                aproveitar o preço promocional.
              </span>
            </div>

            {/* Temporizador */}
            <div className="flex justify-center">
              <div className="px-3 py-1.5 bg-orange-900/20 border border-orange-600/30 rounded-full">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Clock className="h-3 w-3" />
                  <CountdownTimer initialMinutes={10} inline={true} />
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex justify-center">
              <div className="px-3 py-1.5 bg-surface-2 border border-border/30 rounded-full">
                <SocialProof />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Pricing Section - COMPACTO E FOCADO */}
        <div className="hidden sm:block space-y-2">
          <h4 className="text-lg font-bold text-text-primary">
            Resumo do pedido
          </h4>

          {/* Preço + Desconto - BLOCO ÚNICO CONCENTRADO */}
          <div className="p-4 bg-gradient-to-br from-success/5 to-success/10 border border-success/20 rounded-lg">
            <div className="space-y-3">
              {/* Preço original */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Preço original
                </span>
                <span className="text-sm text-text-secondary line-through">
                  {formatBRL(product.originalPrice)}
                </span>
              </div>

              {/* Desconto aplicado */}
              {savings > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Desconto aplicado
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-success">
                      -{formatBRL(savings)}
                    </span>
                    <Badge className="bg-gradient-to-r from-success to-success/80 text-success-foreground text-xs px-2 py-1 font-bold">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {savingsPercent}% OFF
                    </Badge>
                  </div>
                </div>
              )}

              {/* Preço promocional - DESTAQUE MÁXIMO */}
              <div className="flex items-center justify-between pt-2 border-t border-success/20">
                <span className="text-base font-bold text-text-primary">
                  Preço promocional
                </span>
                <span className="text-3xl font-bold text-success">
                  {formatBRL(effectivePrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Urgência e Social Proof - LAYOUT INTEGRADO */}
          <div className="space-y-3">
            {/* Texto de urgência */}
            <div className="text-center">
              <span className="text-sm text-text-primary">
                Você tem <span className="font-bold">tempo limitado</span> para
                aproveitar o preço promocional.
              </span>
            </div>

            {/* Temporizador */}
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-orange-900/20 border border-orange-600/30 rounded-full">
                <div className="flex items-center gap-2 text-orange-400">
                  <Clock className="h-4 w-4" />
                  <CountdownTimer initialMinutes={10} inline={true} />
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-surface-2 border border-border/30 rounded-full">
                <SocialProof />
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Detalhes em accordion */}
        <div className="block sm:hidden">
          <MobileDetailsAccordion title="Detalhes do pagamento">
            <div className="space-y-1">
              {/* 1. Forma de pagamento */}
              <div className="flex items-center justify-between h-8">
                <div className="flex items-center gap-2">
                  {formData.paymentMethod === "pix" ? (
                    <Zap className="h-3 w-3 text-text-secondary opacity-60" />
                  ) : (
                    <CreditCard className="h-3 w-3 text-text-secondary opacity-60" />
                  )}
                  <span className="text-xs text-text-secondary">
                    Forma de pagamento
                  </span>
                </div>
                <span className="text-xs text-text-primary">
                  {formData.paymentMethod === "pix"
                    ? "PIX"
                    : `Cartão de crédito${
                        formData.installments > 1
                          ? ` • ${formData.installments}x`
                          : ""
                      }`}
                </span>
              </div>

              {/* 2. Parcelamento (apenas se installments > 1) */}
              {formData.paymentMethod === "card" &&
                formData.installments > 1 && (
                  <div className="flex items-center justify-between h-8">
                    <span className="text-xs text-text-secondary">
                      Parcelamento
                    </span>
                    <span className="text-xs text-text-primary">
                      {formData.installments}x de {formatBRL(monthlyValue)}
                    </span>
                  </div>
                )}

              {/* 3. Taxa do cartão (apenas se feeAmount > 0) */}
              {formData.paymentMethod === "card" && feeAmount > 0 && (
                <div className="flex items-center justify-between h-8">
                  <span className="text-xs text-text-secondary">
                    Taxa do cartão
                  </span>
                  <span className="text-xs text-text-primary">
                    +{formatBRL(feeAmount)} ({feePercent}%
                    {formData.installments > 1
                      ? ` • ${formData.installments}x`
                      : ""}
                    )
                  </span>
                </div>
              )}
            </div>
          </MobileDetailsAccordion>
        </div>

        {/* Desktop: Payment Details Section - SIMPLIFICADO */}
        <div className="hidden sm:block">
          <div className="p-4 bg-surface-2/50 rounded-lg border border-border/30">
            <h5 className="text-sm font-semibold text-text-primary mb-3">
              Detalhes do pagamento
            </h5>

            <div className="space-y-1">
              {/* 1. Forma de pagamento */}
              <div className="flex items-center justify-between h-10">
                <div className="flex items-center gap-2">
                  {formData.paymentMethod === "pix" ? (
                    <Zap className="h-4 w-4 text-text-secondary opacity-60" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-text-secondary opacity-60" />
                  )}
                  <span className="text-sm text-text-secondary">
                    Forma de pagamento
                  </span>
                </div>
                <span className="text-sm text-text-primary">
                  {formData.paymentMethod === "pix"
                    ? "PIX"
                    : `Cartão de crédito${
                        formData.installments > 1
                          ? ` • ${formData.installments}x`
                          : ""
                      }`}
                </span>
              </div>

              {/* 2. Parcelamento (apenas se installments > 1) */}
              {formData.paymentMethod === "card" &&
                formData.installments > 1 && (
                  <div className="flex items-center justify-between h-10">
                    <span className="text-sm text-text-secondary">
                      Parcelamento
                    </span>
                    <span className="text-sm text-text-primary">
                      {formData.installments}x de {formatBRL(monthlyValue)}
                    </span>
                  </div>
                )}

              {/* 3. Taxa do cartão (apenas se feeAmount > 0) */}
              {formData.paymentMethod === "card" && feeAmount > 0 && (
                <div className="flex items-center justify-between h-10">
                  <span className="text-sm text-text-secondary">
                    Taxa do cartão
                  </span>
                  <span className="text-sm text-text-primary">
                    +{formatBRL(feeAmount)} ({feePercent}%
                    {formData.installments > 1
                      ? ` • ${formData.installments}x`
                      : ""}
                    )
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Total compacto */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-text-primary">
              Total a pagar
            </span>
            <span className="text-lg font-bold text-text-primary">
              {formatBRL(total)}
            </span>
          </div>
        </div>

        {/* Desktop: Total Section - HIGHLIGHT INTEGRADO */}
        <div className="hidden sm:block">
          <div className="p-6 bg-gradient-to-r from-brand/10 to-brand/5 border-2 border-brand/30 rounded-lg">
            <div className="text-center space-y-3">
              <div className="text-sm font-medium text-text-secondary">
                Você paga hoje
              </div>
              <div className="text-4xl font-bold text-brand">
                {formatBRL(total)}
              </div>
              {formData.paymentMethod === "card" &&
                formData.installments > 1 && (
                  <div className="text-sm text-text-secondary">
                    (ou {formData.installments}x de {formatBRL(monthlyValue)} no
                    cartão)
                  </div>
                )}
              {formData.paymentMethod === "pix" && (
                <div className="text-sm text-text-secondary">
                  (PIX • 0% taxa • Acesso imediato)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
