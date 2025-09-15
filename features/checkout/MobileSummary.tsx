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
import { useCountdown } from "@/lib/hooks/useCountdown";
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
  const savings = pricing.savings.toNumber();
  const netValue = pricing.netValue.toNumber();
  const feeAmount = pricing.feeAmount.toNumber();
  const rate = pricing.rate.toNumber();
  const savingsPercent = pricing.savingsPercentage.toFixed(0);

  return (
    <div className="border-b border-border bg-surface/50 backdrop-blur sticky top-0 z-40">
      <div className="px-3 py-1.5">
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
              <div className="flex-1 min-w-0">
                {/* Topo: Título + Badges */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-text-primary line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0.5 h-auto bg-surface-2 text-text-secondary border-border"
                    >
                      Produto digital
                    </Badge>
                    <Badge className="text-[9px] px-1.5 py-0.5 h-auto bg-brand/10 text-brand border-brand/20">
                      Liberação imediata
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Lado direito: Preço + Forma de pagamento */}
              <div className="flex flex-col items-end space-y-1">
                {/* Preço final em destaque */}
                <div className="text-right">
                  <div className="text-base font-bold text-text-primary">
                    {formatBRL(total)}
                  </div>
                </div>

                {/* Pílula de forma de pagamento */}
                <div className="flex items-center space-x-1">
                  {formData.paymentMethod === "pix" ? (
                    <>
                      <Zap className="h-3 w-3 text-brand" />
                      <span className="text-xs text-text-secondary">PIX</span>
                      <Badge className="bg-brand/10 text-brand border-brand/20 text-[9px] px-1.5 py-0.5">
                        0% taxa
                      </Badge>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-3 w-3 text-text-primary" />
                      <span className="text-xs text-text-secondary">
                        Cartão
                      </span>
                      <Badge className="bg-surface-2 text-text-secondary border-border text-[9px] px-1.5 py-0.5">
                        até 12x
                      </Badge>
                    </>
                  )}
                </div>

                {/* Botão para expandir */}
                <div className="flex items-center space-x-1">
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
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3">
            <Card className="p-3 bg-surface border-border space-y-3">
              {/* Bloco central: Resumo de valores */}
              <div className="space-y-2">
                {/* Preço original */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Preço original</span>
                  <span className="text-text-secondary line-through">
                    {formatBRL(product.originalPrice)}
                  </span>
                </div>

                {/* Desconto aplicado */}
                {savings > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      Desconto aplicado
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-primary font-medium">
                        -{formatBRL(savings)}
                      </span>
                      <Badge className="bg-success/10 text-success border-success/20 text-[9px] px-1.5 py-0.5">
                        {savingsPercent}% OFF
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Preço promocional - hierarquia reduzida */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Preço promocional</span>
                  <span className="text-text-primary font-medium">
                    {formatBRL(effectivePrice)}
                  </span>
                </div>

                {/* Taxa do cartão (se aplicável) */}
                {feeAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Taxa do cartão</span>
                    <span className="text-text-primary">
                      + {formatBRL(feeAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Rodapé: Total a pagar com destaque */}
              <div className="border-t border-border/40 pt-3">
                <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs text-text-secondary mb-1">
                      Total a pagar
                    </div>
                    <div className="text-xl font-bold text-text-primary">
                      {formatBRL(total)}
                    </div>
                    {formData.paymentMethod === "card" &&
                      formData.installments > 1 && (
                        <div className="text-xs text-text-secondary mt-1">
                          {formData.installments}x de{" "}
                          {formatBRL(pricing.monthlyValue.toNumber())}
                        </div>
                      )}
                    {formData.paymentMethod === "pix" && (
                      <div className="text-xs text-text-secondary mt-1">
                        PIX • 0% taxa
                      </div>
                    )}
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
