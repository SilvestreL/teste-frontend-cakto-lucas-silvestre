"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SuccessState } from "@/features/checkout/SuccessState";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const encodedData = searchParams.get("data");

  if (!orderId) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-h1 text-text-primary">Pedido não encontrado</h1>
            <p className="text-text-secondary">
              ID do pedido não foi fornecido ou é inválido.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  // Parse form data if available
  let formData = null;
  if (encodedData) {
    try {
      formData = JSON.parse(decodeURIComponent(encodedData));
    } catch (error) {
      console.error("Erro ao decodificar dados do formulário:", error);
    }
  }

  return <SuccessState orderId={orderId} formData={formData} />;
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
