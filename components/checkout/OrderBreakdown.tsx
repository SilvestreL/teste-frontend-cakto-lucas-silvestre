import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { formatBRL } from "@/lib/currency";

interface OrderBreakdownProps {
  originalPrice: number;
  currentPrice: number;
  savings: number;
  savingsPercent: number;
  className?: string;
}

/**
 * Server Component para breakdown do pedido.
 * Não re-renderiza porque é um Server Component (sem "use client").
 * Recebe apenas props primitivas calculadas no servidor.
 */
export function OrderBreakdown({
  originalPrice,
  currentPrice,
  savings,
  savingsPercent,
  className = "",
}: OrderBreakdownProps) {
  return (
    <div
      className={`p-4 sm:p-5 bg-surface-2 border border-border/30 rounded-lg ${className}`}
    >
      <div className="space-y-2">
        {/* Preço original */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Preço original</span>
          <span className="text-sm text-text-secondary line-through">
            {formatBRL(originalPrice)}
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

        {/* Preço promocional */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <span className="text-sm font-semibold text-text-primary">
            Preço promocional
          </span>
          <span className="text-2xl font-bold text-text-primary">
            {formatBRL(currentPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
