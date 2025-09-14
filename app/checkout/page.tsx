"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { CheckoutForm } from "@/features/checkout/CheckoutForm";
import { Summary } from "@/features/checkout/Summary";
import { MobileSummary } from "@/features/checkout/MobileSummary";
import type { CheckoutInput } from "@/types/checkout";
import { defaultProduct, generateMockOrderId } from "@/mocks";

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutInput>({
    email: "lucas.silvestre@gmail.com",
    cpf: "07822816489",
    paymentMethod: "pix",
    installments: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = useCallback((data: Partial<CheckoutInput>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleSubmit = useCallback(
    async (data: CheckoutInput) => {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock order ID
      const orderId = generateMockOrderId();

      // Encode form data to pass to success page
      const encodedData = encodeURIComponent(
        JSON.stringify({
          email: data.email,
          cpf: data.cpf,
          paymentMethod: data.paymentMethod,
          installments: data.installments,
        })
      );

      // Redirect to success page with order ID and form data
      router.push(`/success?id=${orderId}&data=${encodedData}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Header simples focado no checkout */}
      <div className="border-b border-border bg-bg/95 backdrop-blur sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-brand-foreground font-bold">C</span>
              </div>
              <span className="text-xl font-bold text-text-primary">
                Demonstração de Checkout
              </span>
            </div>
          </div>
        </Container>
      </div>

      <div className="lg:hidden">
        <MobileSummary product={defaultProduct} formData={formData} />
      </div>

      {/* Main Content */}
      <Container className="py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
                Finalizar compra
              </h1>
              <p className="text-text-secondary leading-relaxed">
                Preencha seus dados para concluir a compra do curso
              </p>
            </div>

            <CheckoutForm
              data={formData}
              product={defaultProduct}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <Summary product={defaultProduct} formData={formData} />
            </div>
          </div>
        </div>
      </Container>

      {/* Footer minimalista */}
      <footer className="border-t border-border bg-surface/50 mt-12">
        <Container>
          <div className="py-6 text-center">
            <p className="text-sm text-text-secondary">
              © 2025 Demonstração de Checkout
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
