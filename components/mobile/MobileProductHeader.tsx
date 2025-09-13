"use client";

import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import type { Product } from "@/types/checkout";
import { formatBRL } from "@/lib/currency";

interface MobileProductHeaderProps {
  product: Product;
  currentPrice: number;
  paymentMethod: string;
  className?: string;
}

export function MobileProductHeader({
  product,
  currentPrice,
  paymentMethod,
  className = "",
}: MobileProductHeaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cabeçalho compacto */}
      <div className="flex gap-3">
        {/* Thumbnail pequena */}
        <div className="w-16 h-12 rounded-lg bg-surface-2 overflow-hidden border border-border flex-shrink-0">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Título e preço */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-1">
            <span className="text-lg font-bold text-text-primary">
              {formatBRL(currentPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Badges contextuais */}
      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5 h-auto bg-surface-2 text-text-secondary border-border"
        >
          Produto digital
        </Badge>
        <Badge className="text-xs px-2 py-0.5 h-auto bg-brand/10 text-brand border-brand/20">
          Liberação imediata
        </Badge>
        {paymentMethod === "pix" && (
          <Badge className="text-xs px-2 py-0.5 h-auto bg-brand/10 text-brand border-brand/20">
            <Zap className="h-3 w-3 mr-1" />
            0% PIX
          </Badge>
        )}
      </div>
    </div>
  );
}
