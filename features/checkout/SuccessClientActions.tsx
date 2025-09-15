"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, ArrowRight } from "lucide-react";
import { PaymentLoadingOverlay } from "@/components/ui/payment-loading-overlay";

interface SuccessClientActionsProps {
  pixCode?: string | null;
  orderId: string;
  isConfirmed: boolean;
}

export default function SuccessClientActions({
  pixCode,
  orderId,
  isConfirmed,
}: SuccessClientActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const copyPixCode = async () => {
    if (pixCode) {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNavigateHome = () => {
    setIsNavigating(true);
    // Simular delay de navegação
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  // Se tem PIX code, renderiza botão de copiar
  if (pixCode) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={copyPixCode}
        className="ml-2 shrink-0 bg-transparent border-border text-text-primary hover:bg-surface"
      >
        <Copy className="h-4 w-4" />
        {copied ? "Copiado!" : "Copiar"}
      </Button>
    );
  }

  // Caso contrário, renderiza botões de ação
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        {isConfirmed && (
          <Button className="bg-brand hover:bg-brand-hover text-brand-foreground flex-1">
            <Download className="h-4 w-4 mr-2" />
            Acessar produto
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full bg-transparent border-border text-text-primary hover:bg-surface flex-1"
          onClick={handleNavigateHome}
          disabled={isNavigating}
        >
          Voltar ao início
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Navigation Loading Overlay */}
      <PaymentLoadingOverlay
        open={isNavigating}
        message="Redirecionando para o início..."
      />
    </>
  );
}
