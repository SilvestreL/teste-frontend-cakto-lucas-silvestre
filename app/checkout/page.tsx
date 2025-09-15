"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { CheckoutForm } from "@/features/checkout/CheckoutForm";
import { Summary } from "@/features/checkout/Summary";
import { MobileSummary } from "@/features/checkout/MobileSummary";
import type { CheckoutInput } from "@/types/checkout";
import { defaultProduct, generateMockOrderId } from "@/mocks";
import { saveOrder } from "@/mocks/orders";
import { CactusIcon } from "@/components/ui/cactus-icon";
import { useCheckoutStore } from "@/lib/state/checkoutStore";
import { CheckoutStateHydrator } from "@/features/checkout/CheckoutStateHydrator";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (formData: CheckoutInput) => {
      if (isSubmitting) return; // Prevent double submission

      setIsSubmitting(true);

      // Minimum delay to show loading (800-1200ms)
      const minDelay = new Promise((resolve) => setTimeout(resolve, 900));

      // Simulate API call (always successful for frontend testing)
      const apiCall = new Promise((resolve) => {
        setTimeout(() => {
          resolve("success");
        }, 1500);
      });

      // Wait for both minimum delay and API call
      await Promise.all([minDelay, apiCall]);

      // Generate mock order ID
      const orderId = generateMockOrderId();

      // Save order data to mock database
      saveOrder(orderId, formData);

      // Redirect to success page with only order ID
      router.push(`/success?id=${orderId}`);
    },
    [router, isSubmitting]
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Hydrator do estado do checkout */}
      <CheckoutStateHydrator />

      {/* Header simples focado no checkout */}
      <div className="border-b border-border bg-bg/95 backdrop-blur sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                <CactusIcon className="text-brand-foreground text-lg" />
              </div>
              <span className="text-xl font-bold text-text-primary">
                Demonstração de Checkout
              </span>
            </div>
          </div>
        </Container>
      </div>

      <div className="lg:hidden">
        <MobileSummary product={defaultProduct} />
      </div>

      {/* Main Content */}
      <Container className="py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
                Finalizar compra
              </h1>
            </div>

            <CheckoutForm
              product={defaultProduct}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <Summary product={defaultProduct} />
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
