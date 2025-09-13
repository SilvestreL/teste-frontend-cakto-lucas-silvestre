"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Página inicial que redireciona automaticamente para o checkout
 * Foco apenas no teste de funcionalidade de checkout
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona automaticamente para a página de checkout
    router.replace("/checkout");
  }, [router]);

  // Tela de carregamento simples enquanto redireciona
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center mx-auto">
          <span className="text-brand-foreground font-bold">C</span>
        </div>
        <p className="text-text-secondary">Redirecionando para o checkout...</p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand mx-auto"></div>
      </div>
    </div>
  );
}
