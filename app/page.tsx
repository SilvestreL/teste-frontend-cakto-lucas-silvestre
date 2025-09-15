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

  // Retorna null para não mostrar nada durante o redirecionamento
  return null;
}
