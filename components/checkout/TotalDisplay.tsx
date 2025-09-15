import { formatBRL } from "@/lib/currency";

interface TotalDisplayProps {
  total: number;
  paymentMethod: "pix" | "card";
  installments: number;
  monthlyValue: number;
  isMobile?: boolean;
  className?: string;
}

/**
 * Server Component para exibição do total a pagar.
 * Não re-renderiza porque é um Server Component (sem "use client").
 * Recebe apenas props primitivas calculadas no servidor.
 */
export function TotalDisplay({
  total,
  paymentMethod,
  installments,
  monthlyValue,
  isMobile = false,
  className = "",
}: TotalDisplayProps) {
  const isPix = paymentMethod === "pix";
  const padding = isMobile ? "p-3" : "p-4";
  const totalSize = isMobile ? "text-xl" : "text-2xl md:text-3xl";
  const subtitleSize = isMobile ? "text-xs" : "text-xs sm:text-sm";

  return (
    <div
      className={`bg-surface-2/60 border border-border/30 rounded-lg ${padding} ${className}`}
    >
      <div className="text-center space-y-2">
        <div className={`text-text-secondary ${subtitleSize}`}>
          {isMobile ? "Total a pagar" : "Você paga hoje"}
        </div>
        <div className={`font-bold text-text-primary ${totalSize}`}>
          {formatBRL(total)}
        </div>
        {!isPix && installments > 1 && (
          <div className={`text-text-secondary ${subtitleSize}`}>
            {isMobile
              ? `${installments}x de ${formatBRL(monthlyValue)}`
              : `(${installments}x de ${formatBRL(monthlyValue)} no cartão)`}
          </div>
        )}
        {isPix && (
          <div className={`text-text-secondary ${subtitleSize}`}>
            PIX • 0% taxa{!isMobile && " • Acesso imediato"}
          </div>
        )}
      </div>
    </div>
  );
}
