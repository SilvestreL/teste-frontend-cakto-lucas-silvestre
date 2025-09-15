import { Container } from "@/components/layout/Container";
import { SuccessState } from "@/features/checkout/SuccessState";
import { redirect } from "next/navigation";

// Força renderização dinâmica para SSR sem cache
export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: {
    id?: string;
  };
}

// Função para gerar dados mock baseados no ID
function generateMockOrderData(orderId: string) {
  // Simular dados baseados no ID para qualquer pedido
  const isPix = Math.random() > 0.5; // 50% chance de ser PIX
  const installments = isPix ? 1 : Math.floor(Math.random() * 3) + 1; // 1-3 parcelas para cartão

  return {
    formData: {
      email: `cliente-${orderId.slice(-6)}@exemplo.com`,
      cpf: "12345678901",
      paymentMethod: isPix ? ("pix" as const) : ("card" as const),
      installments: installments,
    },
  };
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.id;

  // Validar se o ID foi fornecido
  if (!orderId) {
    // Redirecionar para a página inicial se não houver ID
    redirect("/");
  }

  // Gerar dados mock para qualquer ID (bambiarra para teste)
  const order = generateMockOrderData(orderId);

  return (
    <div className="min-h-screen bg-bg">
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          <SuccessState orderId={orderId} formData={order.formData} />
        </div>
      </Container>
    </div>
  );
}
