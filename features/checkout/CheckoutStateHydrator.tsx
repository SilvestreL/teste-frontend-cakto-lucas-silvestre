"use client";
import { useEffect, useRef } from "react";
import {
  useCheckoutStore,
  type PaymentMethod,
} from "@/lib/state/checkoutStore";

interface CheckoutStateHydratorProps {
  initial?: {
    email?: string;
    cpf?: string;
    paymentMethod?: PaymentMethod;
    installments?: number;
  };
}

export function CheckoutStateHydrator({ initial }: CheckoutStateHydratorProps) {
  const hydrated = useRef(false);
  const hydrate = useCheckoutStore((s) => s.hydrate);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    // Valores padrão se não fornecido initial
    const defaultData = {
      email: "lucas.silvestre@gmail.com",
      cpf: "07822816489",
      paymentMethod: "pix" as PaymentMethod,
      installments: 1,
    };

    hydrate(initial || defaultData);
  }, [hydrate, initial]);

  return null;
}
