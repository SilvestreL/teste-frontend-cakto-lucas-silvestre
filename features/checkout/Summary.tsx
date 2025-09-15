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
import type { Product } from "@/types/checkout";
import { useCheckoutStore } from "@/lib/state/checkoutStore";
import { formatBRL, formatPercent } from "@/lib/currency";
import { getPricing, getFormattedPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { Zap, TrendingDown, Shield, Clock, CreditCard } from "lucide-react";

interface SummaryProps {
  product: Product;
}

export function Summary({ product }: SummaryProps) {
  // Usar seletores primitivos para evitar re-renders desnecessários
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const installments = useCheckoutStore((state) => state.installments);
  const { isExpired } = useCountdown(10); // 10 minutos de desconto

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

  const formattedPricing = getFormattedPricing({
    originalValue: new Decimal(product.originalPrice),
    currentValue: new Decimal(effectivePrice),
    paymentMethod,
    installments,
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

  // Calcula economia do PIX vs cartão 1x (referência para PIX)
  const cardOneShotPricing = getPricing({
    originalValue: new Decimal(product.originalPrice),
    currentValue: new Decimal(effectivePrice),
    paymentMethod: "card",
    installments: 1,
  });
  const pixSavings = cardOneShotPricing.feeAmount.toNumber();

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

        {/* Desktop: Product Section - SIMPLIFICADO */}
        <div className="hidden sm:block space-y-4">
          {/* Imagem compacta */}
          <div className="relative w-full h-40 rounded-lg bg-surface-2 border border-border overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: "30% 10%" }}
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
                <span className="font-bold">Oferta por tempo limitado!</span>
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

        {/* Desktop: Pricing Section - NEUTRO */}
        <div className="hidden sm:block space-y-3">
          <h4 className="text-base sm:text-lg font-bold text-text-primary">
            Resumo do pedido
          </h4>

          {/* Preço + Desconto - BLOCO NEUTRO */}
          <div className="p-4 sm:p-5 bg-surface-2 border border-border/30 rounded-lg">
            <div className="space-y-2">
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
                    <span className="text-sm font-semibold text-text-primary">
                      -{formatBRL(savings)}
                    </span>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs px-2 py-1 font-bold">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {savingsPercent}% OFF
                    </Badge>
                  </div>
                </div>
              )}

              {/* Preço promocional - REDUZIDO */}
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-sm font-semibold text-text-primary">
                  Preço promocional
                </span>
                <span className="text-2xl font-bold text-text-primary">
                  {formatBRL(effectivePrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Urgência e Social Proof - DISCRETOS */}
          <div className="space-y-2">
            {/* Texto de urgência */}
            <div className="text-center">
              <span className="text-sm text-text-primary">
                <span className="font-bold">Oferta por tempo limitado!</span>
              </span>
            </div>

            {/* Temporizador */}
            <div className="flex justify-center">
              <div className="px-3 py-1.5 bg-orange-900/15 border border-orange-400/25 rounded-full">
                <div className="flex items-center gap-2 text-orange-300 text-sm">
                  <Clock className="h-4 w-4" />
                  <CountdownTimer initialMinutes={10} inline={true} />
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex justify-center">
              <div className="px-3 py-1.5 bg-surface-2 border border-border/30 rounded-full">
                <div className="text-sm text-text-secondary">
                  <SocialProof />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Detalhes em accordion */}
        <div className="block sm:hidden">
          <MobileDetailsAccordion title="Detalhes do pagamento">
            <div className="space-y-1">
              {/* Bloco PIX - Vantagens (apenas quando PIX) */}
              {paymentMethod === "pix" && (
                <div
                  className="p-2.5 bg-surface-2/50 border border-border/30 rounded-lg mb-3"
                  aria-label="Vantagens do pagamento via PIX"
                >
                  <div className="space-y-2">
                    {/* Valor original */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        Valor original
                      </span>
                      <span className="text-xs text-text-secondary line-through">
                        {formatBRL(product.originalPrice)}
                      </span>
                    </div>

                    {/* Valor com desconto */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary">
                        Valor com desconto
                      </span>
                      <span className="text-sm font-bold text-text-primary">
                        {formatBRL(effectivePrice)}
                      </span>
                    </div>

                    {/* Vantagem do PIX */}
                    <div className="pt-2 border-t border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-secondary">
                          Vantagem do PIX
                        </span>
                        <Badge className="bg-brand/10 text-brand border-brand/20 text-xs px-1.5 py-0.5">
                          0% taxa • Acesso imediato
                        </Badge>
                      </div>
                      <div className="text-xs text-text-secondary">
                        Economia no PIX vs cartão 1x: +{formatBRL(pixSavings)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. Forma de pagamento */}
              <div className="flex items-center justify-between h-8">
                <div className="flex items-center gap-2">
                  {paymentMethod === "pix" ? (
                    <Zap className="h-3 w-3 text-text-secondary opacity-60" />
                  ) : (
                    <CreditCard className="h-3 w-3 text-text-secondary opacity-60" />
                  )}
                  <span className="text-xs text-text-secondary">
                    Forma de pagamento
                  </span>
                </div>
                <span className="text-xs text-text-primary">
                  {paymentMethod === "pix"
                    ? "PIX"
                    : `Cartão de crédito${
                        installments > 1 ? ` • ${installments}x` : ""
                      }`}
                </span>
              </div>

              {/* 2. Parcelamento (apenas se installments > 1) */}
              {paymentMethod === "card" && installments > 1 && (
                <div className="flex items-center justify-between h-8">
                  <span className="text-xs text-text-secondary">
                    Parcelamento
                  </span>
                  <span className="text-xs text-text-primary">
                    {installments}x de {formatBRL(monthlyValue)}
                  </span>
                </div>
              )}

              {/* 3. Taxa do cartão (apenas se feeAmount > 0) */}
              {paymentMethod === "card" && feeAmount > 0 && (
                <div className="flex items-center justify-between h-8">
                  <span className="text-xs text-text-secondary">
                    Taxa do cartão
                  </span>
                  <span className="text-xs text-text-primary">
                    +{formatBRL(feeAmount)} ({feePercent}%
                    {installments > 1 ? ` • ${installments}x` : ""})
                  </span>
                </div>
              )}
            </div>
          </MobileDetailsAccordion>
        </div>

        {/* Desktop: Payment Details Section - NEUTRO */}
        <div className="hidden sm:block">
          <div className="p-4 bg-surface-2/50 border border-border/30 rounded-lg">
            <h5 className="text-base sm:text-lg font-bold text-text-primary mb-3">
              Detalhes do pagamento
            </h5>

            <div className="space-y-1">
              {/* Bloco PIX - Vantagens (apenas quando PIX) */}
              {paymentMethod === "pix" && (
                <div
                  className="p-3 bg-surface-2/50 border border-border/30 rounded-lg mb-3"
                  aria-label="Vantagens do pagamento via PIX"
                >
                  <div className="space-y-2">
                    {/* Valor original */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Valor original
                      </span>
                      <span className="text-sm text-text-secondary line-through">
                        {formatBRL(product.originalPrice)}
                      </span>
                    </div>

                    {/* Valor com desconto */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-primary">
                        Valor com desconto
                      </span>
                      <span className="text-lg font-bold text-text-primary">
                        {formatBRL(effectivePrice)}
                      </span>
                    </div>

                    {/* Vantagem do PIX */}
                    <div className="pt-2 border-t border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-text-secondary">
                          Vantagem do PIX
                        </span>
                        <Badge className="bg-brand/10 text-brand border-brand/20 text-xs px-2 py-1">
                          0% taxa • Acesso imediato
                        </Badge>
                      </div>
                      <div className="text-xs text-text-secondary">
                        Economia no PIX vs cartão 1x: +{formatBRL(pixSavings)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. Forma de pagamento */}
              <div className="flex items-center justify-between h-10">
                <div className="flex items-center gap-2">
                  {paymentMethod === "pix" ? (
                    <Zap className="h-4 w-4 text-text-secondary opacity-60" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-text-secondary opacity-60" />
                  )}
                  <span className="text-sm text-text-secondary">
                    Forma de pagamento
                  </span>
                </div>
                <span className="text-sm text-text-primary">
                  {paymentMethod === "pix"
                    ? "PIX"
                    : `Cartão de crédito${
                        installments > 1 ? ` • ${installments}x` : ""
                      }`}
                </span>
              </div>

              {/* 2. Parcelamento (apenas se installments > 1) */}
              {paymentMethod === "card" && installments > 1 && (
                <div className="flex items-center justify-between h-10">
                  <span className="text-sm text-text-secondary">
                    Parcelamento
                  </span>
                  <span className="text-sm text-text-primary">
                    {installments}x de {formatBRL(monthlyValue)}
                  </span>
                </div>
              )}

              {/* 3. Valor bruto */}
              <div className="flex items-center justify-between h-10">
                <span className="text-sm text-text-secondary">Valor bruto</span>
                <span className="text-sm text-text-primary">
                  {formatBRL(effectivePrice)}
                </span>
              </div>

              {/* 4. Taxa da plataforma (apenas se feeAmount > 0) */}
              {feeAmount > 0 && (
                <div className="flex items-center justify-between h-10">
                  <span className="text-sm text-text-secondary">
                    Taxa da plataforma
                  </span>
                  <span className="text-sm font-medium text-amber-400">
                    +{formatBRL(feeAmount)} ({feePercent}%
                    {installments > 1 ? ` • ${installments}x` : ""})
                  </span>
                </div>
              )}

              {/* 5. Valor líquido para o produtor */}
              <div className="flex items-center justify-between h-10">
                <span className="text-sm text-text-secondary">
                  Valor líquido para o produtor
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {formatBRL(netValue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Mobile: Total compacto - REDUZIDO */}
        <div className="block sm:hidden">
          <div className="p-3 bg-surface-2/60 border border-border/30 rounded-lg">
            <div className="text-center space-y-2">
              <div className="text-xs text-text-secondary">Total a pagar</div>
              <div className="text-xl font-bold text-text-primary">
                {formatBRL(total)}
              </div>
              {paymentMethod === "card" && installments > 1 && (
                <div className="text-xs text-text-secondary">
                  {installments}x de {formatBRL(monthlyValue)}
                </div>
              )}
              {paymentMethod === "pix" && (
                <div className="text-xs text-text-secondary">PIX • 0% taxa</div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: Total Section - REDUZIDO */}
        <div className="hidden sm:block">
          <div className="p-4 bg-surface-2/60 border border-border/30 rounded-lg">
            <div className="text-center space-y-2">
              <div className="text-xs sm:text-sm text-text-secondary">
                Você paga hoje
              </div>
              <div className="text-2xl md:text-3xl font-bold text-text-primary">
                {formatBRL(total)}
              </div>
              {paymentMethod === "card" && installments > 1 && (
                <div className="text-xs sm:text-sm text-text-secondary">
                  ({installments}x de {formatBRL(monthlyValue)} no cartão)
                </div>
              )}
              {paymentMethod === "pix" && (
                <div className="text-xs sm:text-sm text-text-secondary">
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
