"use client";
import { useState } from "react";
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
import { getPricing, getFormattedPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingDown,
  CreditCard,
} from "lucide-react";

interface MobileSummaryProps {
  product: Product;
  formData: CheckoutInput;
}

export function MobileSummary({ product, formData }: MobileSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Usa o novo sistema de preços para cálculos precisos
  const pricing = getPricing({
    originalValue: new Decimal(product.originalPrice),
    currentValue: new Decimal(product.currentPrice),
    paymentMethod: formData.paymentMethod,
    installments: formData.installments,
  });

  const formattedPricing = getFormattedPricing({
    originalValue: new Decimal(product.originalPrice),
    currentValue: new Decimal(product.currentPrice),
    paymentMethod: formData.paymentMethod,
    installments: formData.installments,
  });

  // Valores para compatibilidade com o código existente
  const total = pricing.total.toNumber();
  const savings = pricing.savings.toNumber();
  const netValue = pricing.netValue.toNumber();
  const feeAmount = pricing.feeAmount.toNumber();
  const rate = pricing.rate.toNumber();
  const savingsPercent = pricing.savingsPercentage.toFixed(0);

  return (
    <div className="border-b border-border bg-surface/50 backdrop-blur sticky top-0 z-40">
      <div className="px-3 py-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-start p-0 h-auto hover:bg-transparent min-h-[40px] space-x-3"
            >
              {/* Thumbnail do produto */}
              <div className="w-12 h-12 rounded-lg bg-surface-2 overflow-hidden border border-border flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Conteúdo principal */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Linha 1: Título + Botão */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text-primary line-clamp-1 flex-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 ml-2">
                    <span className="text-xs text-text-secondary">
                      Ver resumo
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-3 w-3 text-text-secondary" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-text-secondary" />
                    )}
                  </div>
                </div>

                {/* Linha 2: Badges Secundárias */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 h-auto bg-surface-2 text-text-secondary border-border"
                  >
                    Produto digital
                  </Badge>
                  <Badge
                    className="text-[10px] px-2 py-0.5 h-auto bg-brand/10 text-brand border-brand/20"
                    aria-label="Liberação imediata após pagamento"
                  >
                    Liberação imediata
                  </Badge>
                </div>

                {/* Linha 3: Preço + Método de Pagamento */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-text-primary">
                    {formatBRL(total)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {formData.paymentMethod === "pix" ? (
                      <>
                        <Zap className="h-4 w-4 text-brand" />
                        <span className="text-sm font-medium text-text-primary">
                          PIX
                        </span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 text-text-primary" />
                        <span className="text-sm font-medium text-text-primary">
                          Cartão de crédito
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Economia/Desconto - Destaque Horizontal */}
                {savings > 0 && (
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="h-3 w-3 text-success" />
                    <span className="text-xs text-success font-medium">
                      Você economiza {formatBRL(savings)} ({savingsPercent}%
                      OFF)
                    </span>
                  </div>
                )}
              </div>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <Card className="p-3 bg-surface border-border">
              <div className="space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Preço original</span>
                    <span className="text-text-secondary line-through">
                      {formatBRL(product.originalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      Preço promocional
                    </span>
                    <span className="text-text-primary font-semibold">
                      {formatBRL(product.currentPrice)}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="flex items-center justify-between text-sm p-2 rounded bg-brand/10 border border-brand/20">
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-3 w-3 text-brand" />
                        <span className="text-brand font-medium">Economia</span>
                      </div>
                      <span className="text-brand font-semibold">
                        {formatBRL(savings)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/40 pt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      Método de pagamento
                    </span>
                    <span className="text-text-primary font-medium">
                      {formData.paymentMethod === "pix"
                        ? "PIX"
                        : "Cartão de crédito"}
                    </span>
                  </div>

                  {feeAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        Taxa do cartão
                      </span>
                      <span className="text-text-primary">
                        + {formatBRL(feeAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Produtor recebe</span>
                    <span className="text-text-primary font-medium">
                      {formatBRL(netValue)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">
                      Total a pagar
                    </span>
                    <span className="font-bold text-lg text-text-primary">
                      {formatBRL(total)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
