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
      <div className="space-y-4 sm:space-y-6">
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

        {/* Desktop: Pricing Section */}
        <div className="hidden sm:block space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-text-primary">
              Resumo do pedido
            </h4>
            {savings > 0 && (
              <Badge className="bg-brand/10 text-brand border-brand/20 font-semibold">
                <TrendingDown className="h-3 w-3 mr-1" />
                {savingsPercent}% OFF
              </Badge>
            )}
          </div>

          {/* Bloco 1: Preços - DESTAQUE PRINCIPAL */}
          <div className="space-y-4 p-4 bg-surface-2/80 rounded-lg border border-border/50">
            {/* Preço original - menor, em cinza */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Preço original
              </span>
              <span className="text-xs text-text-secondary line-through">
                {formatBRL(product.originalPrice)}
              </span>
            </div>

            {/* Preço promocional - ELEMENTO PRINCIPAL */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {isExpired ? "Preço original" : "Preço promocional"}
              </span>
              <span className="text-3xl font-bold text-text-primary">
                {formatBRL(effectivePrice)}
              </span>
            </div>

            {/* Economia - badge verde pequeno */}
            {savings > 0 && (
              <div className="flex items-center justify-center">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs px-2 py-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Economiza {formatBRL(savings)}
                </Badge>
              </div>
            )}
          </div>

          {/* Bloco 2: Tempo limitado */}
          <div className="p-3 bg-amber-50/5 border border-amber-200/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Tempo limitado:</span>
              <CountdownTimer initialMinutes={10} inline={true} />
            </div>
          </div>

          {/* Bloco 3: Visualizações */}
          <div className="p-3 bg-surface-2 border border-border/30 rounded-lg">
            <SocialProof />
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Detalhes em accordion */}
        <div className="block sm:hidden">
          <MobileDetailsAccordion title="Detalhes do pagamento">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  Método escolhido
                </span>
                <div className="flex items-center space-x-2">
                  {formData.paymentMethod === "pix" ? (
                    <Badge className="bg-brand text-brand-foreground text-xs px-2 py-0.5 h-auto">
                      <Zap className="h-3 w-3 mr-1" />
                      PIX • 0% taxa
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-surface-2 text-text-primary border-border text-xs px-2 py-0.5 h-auto"
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      Cartão • {formattedPricing.rate}
                    </Badge>
                  )}
                </div>
              </div>

              {formData.paymentMethod === "card" &&
                formData.installments > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      Parcelamento
                    </span>
                    <span className="text-xs font-medium text-text-primary">
                      {formData.installments}x de {formatBRL(monthlyValue)}
                    </span>
                  </div>
                )}

              {feeAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Taxa do cartão
                  </span>
                  <span className="text-xs text-text-primary">
                    + {formatBRL(feeAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">
                  Produtor recebe (líquido)
                </span>
                <span className="font-semibold text-text-primary">
                  {formatBRL(netValue)}
                </span>
              </div>
            </div>
          </MobileDetailsAccordion>
        </div>

        {/* Desktop: Payment Details Section */}
        <div className="hidden sm:block space-y-4">
          <h5 className="font-semibold text-text-primary">
            Detalhes do pagamento
          </h5>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Método escolhido
              </span>
              <div className="flex items-center space-x-2">
                {formData.paymentMethod === "pix" ? (
                  <Badge className="bg-brand text-brand-foreground">
                    <Zap className="h-3 w-3 mr-1" />
                    PIX • 0% taxa
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-surface-2 text-text-primary border-border"
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Cartão • {formattedPricing.rate}
                  </Badge>
                )}
              </div>
            </div>

            {formData.paymentMethod === "card" && formData.installments > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Parcelamento
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {formData.installments}x de {formatBRL(monthlyValue)}
                </span>
              </div>
            )}

            {feeAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Taxa do cartão
                </span>
                <span className="text-sm text-text-primary">
                  + {formatBRL(feeAmount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                Produtor recebe (líquido)
              </span>
              <span className="font-semibold text-text-primary">
                {formatBRL(netValue)}
              </span>
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

        {/* Desktop: Total Section */}
        <div className="hidden sm:block space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-text-primary">
              Total a pagar
            </span>
            <span className="text-2xl font-bold text-text-primary">
              {formatBRL(total)}
            </span>
          </div>

          {/* Payment Method Benefits */}
          {formData.paymentMethod === "pix" ? (
            <div className="p-4 rounded-xl bg-brand/10 border border-brand/20">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-brand" />
                </div>
                <div className="space-y-1">
                  <p className="text-brand font-bold text-sm">
                    PIX - Aprovação instantânea!
                  </p>
                  <p className="text-xs text-brand/80">
                    Sem taxas • Acesso imediato • Pagamento seguro
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-surface-2 border border-border">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 border border-border">
                  <Shield className="h-5 w-5 text-text-secondary" />
                </div>
                <div className="space-y-1">
                  <p className="text-text-primary font-semibold text-sm">
                    Cartão de Crédito
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Aprovação em minutos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Pagamento seguro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
