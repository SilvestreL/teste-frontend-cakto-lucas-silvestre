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

          <MobileUrgencyElements
            showCountdown={true}
            showSocialProof={true}
            countdownMinutes={10}
          />
        </div>

        {/* Desktop: Pricing Section - COMPACTO E FOCADO */}
        <div className="hidden sm:block space-y-3">
          <h4 className="text-lg font-bold text-text-primary">
            Resumo do pedido
          </h4>

          {/* Preço original vs Promocional - SEM DUPLICIDADE */}
          <div className="p-4 bg-surface-2/80 rounded-lg border border-border/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Preço original
                </span>
                <span className="text-sm text-text-secondary line-through">
                  {formatBRL(product.originalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    Preço promocional
                  </span>
                  {savings > 0 && (
                    <Badge className="bg-success/10 text-success border-success/20 text-xs px-2 py-0.5">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {savingsPercent}% OFF
                    </Badge>
                  )}
                </div>
                <span className="text-2xl font-bold text-text-primary">
                  {formatBRL(effectivePrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Urgência e Social Proof - COMPACTO */}
          <div className="space-y-2">
            <div className="p-1.5 bg-amber-50/5 border border-amber-200/20 rounded-md">
              <div className="flex items-center justify-center gap-1.5 text-amber-600">
                <Clock className="h-2.5 w-2.5" />
                <span className="text-xs font-medium">Tempo limitado:</span>
                <CountdownTimer initialMinutes={10} inline={true} />
              </div>
            </div>
            <div className="p-1.5 bg-surface-2 border border-border/30 rounded-md">
              <SocialProof />
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Detalhes em accordion */}
        <div className="block sm:hidden">
          <MobileDetailsAccordion title="Detalhes do pagamento">
            <div className="space-y-3">
              {/* Cálculo completo - HIERARQUIA VISUAL CLARA */}
              <div className="space-y-2">
                {/* 1. Valor original */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Valor original
                  </span>
                  <span className="text-xs text-text-secondary line-through">
                    {formatBRL(product.originalPrice)}
                  </span>
                </div>

                {/* 2. Desconto aplicado */}
                {savings > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      Desconto aplicado
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-success">
                        -{formatBRL(savings)}
                      </span>
                      <Badge className="bg-success text-success-foreground text-xs px-1.5 py-0.5 font-bold">
                        {savingsPercent}% OFF
                      </Badge>
                    </div>
                  </div>
                )}

                {/* 3. Novo valor com desconto - DESTAQUE COMO PONTO DE PARTIDA */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Valor com desconto
                  </span>
                  <span className="text-base font-bold text-white">
                    {formatBRL(effectivePrice)}
                  </span>
                </div>

                {/* 4. Taxa do cartão (quando houver) - MAIS CLARA */}
                {formData.paymentMethod === "card" && feeAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary/70">
                      Taxa do cartão ({formData.installments}x) incluída
                    </span>
                    <span className="text-xs text-text-secondary/70">
                      +{formatBRL(feeAmount)}
                    </span>
                  </div>
                )}

                {/* Separador visual - SIMBOLIZA SOMA FINAL */}
                <Separator className="bg-border/40" />

                {/* 5. Valor final - REMOVIDO PARA EVITAR REDUNDÂNCIA */}
                {/* O valor final será mostrado apenas no "Total a pagar" abaixo */}
              </div>

              {/* Forma de pagamento - RODAPÉ EM CINZA CLARO */}
              <div className="flex items-center justify-center pt-3 border-t border-border/20">
                {formData.paymentMethod === "pix" ? (
                  <div className="flex items-center gap-1.5 text-text-secondary/70">
                    <Zap className="h-3 w-3" />
                    <span className="text-xs">PIX</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-text-secondary/70">
                    <CreditCard className="h-3 w-3" />
                    <span className="text-xs">
                      Cartão de crédito • {formData.installments}x de{" "}
                      {formatBRL(monthlyValue)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </MobileDetailsAccordion>
        </div>

        {/* Desktop: Payment Details Section - SIMPLIFICADO */}
        <div className="hidden sm:block">
          <div className="p-4 bg-surface-2/50 rounded-lg border border-border/30">
            <h5 className="text-sm font-semibold text-text-primary mb-4">
              Detalhes do pagamento
            </h5>

            <div className="space-y-4">
              {/* Cálculo completo - HIERARQUIA VISUAL CLARA */}
              <div className="space-y-3">
                {/* 1. Valor original */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Valor original
                  </span>
                  <span className="text-sm text-text-secondary line-through">
                    {formatBRL(product.originalPrice)}
                  </span>
                </div>

                {/* 2. Desconto aplicado */}
                {savings > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Desconto aplicado
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-success">
                        -{formatBRL(savings)}
                      </span>
                      <Badge className="bg-success text-success-foreground text-xs px-2 py-1 font-bold">
                        {savingsPercent}% OFF
                      </Badge>
                    </div>
                  </div>
                )}

                {/* 3. Novo valor com desconto - DESTAQUE COMO PONTO DE PARTIDA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Valor com desconto
                  </span>
                  <span className="text-xl font-bold text-white">
                    {formatBRL(effectivePrice)}
                  </span>
                </div>

                {/* 4. Taxa do cartão (quando houver) - MAIS CLARA */}
                {formData.paymentMethod === "card" && feeAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary/70">
                      Taxa do cartão ({formData.installments}x) incluída
                    </span>
                    <span className="text-xs text-text-secondary/70">
                      +{formatBRL(feeAmount)}
                    </span>
                  </div>
                )}

                {/* Separador visual - SIMBOLIZA SOMA FINAL */}
                <Separator className="bg-border/40" />

                {/* 5. Valor final - REMOVIDO PARA EVITAR REDUNDÂNCIA */}
                {/* O valor final será mostrado apenas no "Total a pagar" abaixo */}
              </div>

              {/* Forma de pagamento - RODAPÉ EM CINZA CLARO */}
              <div className="flex items-center justify-center pt-3 border-t border-border/20">
                {formData.paymentMethod === "pix" ? (
                  <div className="flex items-center gap-2 text-text-secondary/70">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">PIX</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-text-secondary/70">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">
                      Cartão de crédito • {formData.installments}x de{" "}
                      {formatBRL(monthlyValue)}
                    </span>
                  </div>
                )}
              </div>
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

        {/* Desktop: Total Section - DESTAQUE MÁXIMO */}
        <div className="hidden sm:block">
          <div className="p-4 bg-brand/5 border-2 border-brand/20 rounded-lg">
            <div className="text-center mb-3">
              <span className="text-xs text-text-secondary/70 font-medium">
                Resumo final
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-text-primary">
                Total a pagar
              </span>
              <span className="text-3xl font-bold text-brand">
                {formatBRL(total)}
              </span>
            </div>

            {/* Payment Method Benefits - Integrado */}
            {formData.paymentMethod === "pix" ? (
              <div className="flex items-center justify-center">
                <div className="bg-brand text-brand-foreground px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium">
                  <Zap className="h-3 w-3" />
                  <span>PIX • 0% taxa • Acesso imediato</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="bg-surface-2 text-text-secondary px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium">
                  <CreditCard className="h-3 w-3" />
                  <span>Cartão • Parcelamento • Aprovação rápida</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
