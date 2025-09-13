"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, CreditCard, Zap, Clock } from "lucide-react";
import { getFormattedPricing } from "@/lib/pricing";
import Decimal from "decimal.js";

interface PaymentOptionsProps {
  selected: "pix" | "card";
  onSelect: (method: "pix" | "card") => void;
  productValue: number;
  installments?: number;
}

export function PaymentOptions({
  selected,
  onSelect,
  productValue,
  installments = 1,
}: PaymentOptionsProps) {
  // Usa o novo sistema de preços para cálculos precisos
  const pixPricing = getFormattedPricing({
    originalValue: new Decimal(productValue),
    currentValue: new Decimal(productValue),
    paymentMethod: "pix",
    installments: 1,
  });

  const cardPricing = getFormattedPricing({
    originalValue: new Decimal(productValue),
    currentValue: new Decimal(productValue),
    paymentMethod: "card",
    installments,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        className={`
          p-6 cursor-pointer transition-all duration-200 relative overflow-hidden
          ${
            selected === "pix"
              ? "bg-surface border-2 border-brand shadow-lg ring-2 ring-brand/20"
              : "bg-surface-2 border-border hover:border-brand/50 hover:shadow-md"
          }
        `}
        onClick={() => onSelect("pix")}
      >
        {/* Highlight indicator for selected state */}
        {selected === "pix" && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-brand">
            <div className="absolute -top-[18px] -right-[2px]">
              <Zap className="h-3 w-3 text-brand-foreground" />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-brand/15 flex items-center justify-center">
                <QrCode className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary">PIX</h3>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand" />
                  <p className="text-sm text-brand font-medium">
                    Receba acesso imediato
                  </p>
                </div>
              </div>
            </div>
            <Badge className="bg-brand text-brand-foreground font-semibold px-3 py-1">
              0% taxa
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-text-primary">
              {pixPricing.total}
            </p>
            <p className="text-sm text-text-secondary">
              Pagamento à vista • Aprovação instantânea
            </p>
          </div>
        </div>
      </Card>

      <Card
        className={`
          p-6 cursor-pointer transition-all duration-200 relative
          ${
            selected === "card"
              ? "bg-surface border-2 border-brand shadow-lg ring-2 ring-brand/20"
              : "bg-surface-2 border-border hover:border-brand/50 hover:shadow-md"
          }
        `}
        onClick={() => onSelect("card")}
      >
        {/* Highlight indicator for selected state */}
        {selected === "card" && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-brand">
            <div className="absolute -top-[18px] -right-[2px]">
              <CreditCard className="h-3 w-3 text-brand-foreground" />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-border">
                <CreditCard className="h-6 w-6 text-text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary">
                  Cartão de Crédito
                </h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-text-secondary" />
                  <p className="text-sm text-text-secondary">
                    Até 12x sem juros
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="font-semibold px-3 py-1">
              A partir de 3,99%
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-text-primary">
              {cardPricing.total}
            </p>
            <p className="text-sm text-text-secondary">
              {installments}x no cartão • Aprovação em minutos
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
