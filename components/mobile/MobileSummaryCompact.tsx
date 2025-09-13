"use client";

import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { formatBRL } from "@/lib/currency";

interface MobileSummaryCompactProps {
  originalPrice: number;
  currentPrice: number;
  savings: number;
  savingsPercent: number;
  className?: string;
}

export function MobileSummaryCompact({
  originalPrice,
  currentPrice,
  savings,
  savingsPercent,
  className = "",
}: MobileSummaryCompactProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-text-primary">
          Resumo do pedido
        </h4>
        {savings > 0 && (
          <Badge className="bg-brand/10 text-brand border-brand/20 font-semibold text-xs px-2 py-0.5 h-auto">
            <TrendingDown className="h-3 w-3 mr-1" />
            {savingsPercent}% OFF
          </Badge>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Preço original</span>
          <span className="text-xs text-text-secondary line-through">
            {formatBRL(originalPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Preço promocional</span>
          <span className="text-sm font-bold text-text-primary">
            {formatBRL(currentPrice)}
          </span>
        </div>

        {savings > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-brand/5 border border-brand/20">
            <div className="flex items-center space-x-1.5">
              <TrendingDown className="h-3 w-3 text-brand" />
              <span className="text-brand font-semibold text-xs">
                Você economiza
              </span>
            </div>
            <span className="text-brand font-bold text-sm">
              {formatBRL(savings)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
