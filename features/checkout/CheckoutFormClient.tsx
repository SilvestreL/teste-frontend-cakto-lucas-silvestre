"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckoutForm } from "./CheckoutForm";
import type { CheckoutInput, Product } from "@/types/checkout";
import { generateMockOrderId } from "@/mocks";
import { saveOrder } from "@/mocks/orders";

interface CheckoutFormClientProps {
  product: Product;
}

export default function CheckoutFormClient({
  product,
}: CheckoutFormClientProps) {
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
    <CheckoutForm
      product={product}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
