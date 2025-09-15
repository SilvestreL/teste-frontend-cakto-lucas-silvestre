import { Badge } from "@/components/ui/badge";
import { Zap, CreditCard } from "lucide-react";
import { formatBRL } from "@/lib/currency";

interface PaymentDetailsProps {
  paymentMethod: "pix" | "card";
  installments: number;
  effectivePrice: number;
  feeAmount: number;
  netValue: number;
  pixSavings: number;
  isMobile?: boolean;
  className?: string;
}

/**
 * Server Component para detalhes do pagamento.
 * Não re-renderiza porque é um Server Component (sem "use client").
 * Recebe apenas props primitivas calculadas no servidor.
 */
export function PaymentDetails({
  paymentMethod,
  installments,
  effectivePrice,
  feeAmount,
  netValue,
  pixSavings,
  isMobile = false,
  className = "",
}: PaymentDetailsProps) {
  const isPix = paymentMethod === "pix";
  const padding = isMobile ? "" : "p-4";
  const iconSize = isMobile ? "h-3 w-3" : "h-4 w-4";
  const textSize = isMobile ? "text-xs" : "text-sm";
  const itemHeight = isMobile ? "h-8" : "h-10";

  return (
    <div
      className={`bg-surface-2/50 border border-border/30 rounded-lg ${padding} ${className}`}
    >
      {!isMobile && (
        <h5 className="text-base sm:text-lg font-bold text-text-primary mb-3">
          Detalhes do pagamento
        </h5>
      )}

      <div className="space-y-1">
        {/* Bloco PIX - Vantagens */}
        {isPix && (
          <div
            className="p-2.5 bg-surface-2/50 border border-border/30 rounded-lg mb-3"
            aria-label="Vantagens do pagamento via PIX"
          >
            <div className="space-y-2">
              {/* Valor original */}
              <div className="flex items-center justify-between">
                <span className={`text-text-secondary ${textSize}`}>
                  Valor original
                </span>
                <span
                  className={`text-text-secondary line-through ${textSize}`}
                >
                  {formatBRL(effectivePrice + pixSavings)}
                </span>
              </div>

              {/* Valor com desconto */}
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-text-primary ${textSize}`}>
                  Valor com desconto
                </span>
                <span
                  className={`font-bold text-text-primary ${
                    isMobile ? "text-sm" : "text-lg"
                  }`}
                >
                  {formatBRL(effectivePrice)}
                </span>
              </div>

              {/* Vantagem do PIX */}
              <div className="pt-2 border-t border-border/20">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-text-secondary ${textSize}`}>
                    Vantagem do PIX
                  </span>
                  <Badge
                    className={`text-brand border-brand/20 text-xs px-1.5 py-0.5 ${
                      isMobile ? "bg-brand/10" : "bg-brand/10 px-2 py-1"
                    }`}
                  >
                    0% taxa • Acesso imediato
                  </Badge>
                </div>
                <div className={`text-text-secondary ${textSize}`}>
                  Economia no PIX vs cartão 1x: +{formatBRL(pixSavings)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forma de pagamento */}
        <div className={`flex items-center justify-between ${itemHeight}`}>
          <div className="flex items-center gap-2">
            {isPix ? (
              <Zap className={`text-text-secondary opacity-60 ${iconSize}`} />
            ) : (
              <CreditCard
                className={`text-text-secondary opacity-60 ${iconSize}`}
              />
            )}
            <span className={`text-text-secondary ${textSize}`}>
              Forma de pagamento
            </span>
          </div>
          <span className={`text-text-primary ${textSize}`}>
            {isPix
              ? "PIX"
              : `Cartão de crédito${
                  installments > 1 ? ` • ${installments}x` : ""
                }`}
          </span>
        </div>

        {/* Parcelamento (apenas para cartão) */}
        {!isPix && installments > 1 && (
          <div className={`flex items-center justify-between ${itemHeight}`}>
            <span className={`text-text-secondary ${textSize}`}>
              Parcelamento
            </span>
            <span className={`text-text-primary ${textSize}`}>
              {installments}x de {formatBRL(effectivePrice / installments)}
            </span>
          </div>
        )}

        {/* Taxa do cartão (mobile) */}
        {!isPix && feeAmount > 0 && isMobile && (
          <div className="flex items-center justify-between h-8">
            <span className="text-xs text-text-secondary">Taxa do cartão</span>
            <span className="text-xs text-text-primary">
              +{formatBRL(feeAmount)}
            </span>
          </div>
        )}

        {/* Detalhes completos (desktop) */}
        {!isMobile && (
          <>
            <div className="flex items-center justify-between h-10">
              <span className="text-sm text-text-secondary">Valor bruto</span>
              <span className="text-sm text-text-primary">
                {formatBRL(effectivePrice)}
              </span>
            </div>

            {feeAmount > 0 && (
              <div className="flex items-center justify-between h-10">
                <span className="text-sm text-text-secondary">
                  Taxa da plataforma
                </span>
                <span className="text-sm font-medium text-amber-400">
                  +{formatBRL(feeAmount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between h-10">
              <span className="text-sm text-text-secondary">
                Valor líquido para o produtor
              </span>
              <span className="text-sm font-medium text-text-primary">
                {formatBRL(netValue)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
