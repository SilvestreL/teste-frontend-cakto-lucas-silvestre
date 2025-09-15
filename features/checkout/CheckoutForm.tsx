"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PaymentOptions } from "./PaymentOptions";
import { InstallmentsSelect } from "./InstallmentsSelect";
import type { CheckoutInput, Product } from "@/types/checkout";
import { maskCPF } from "@/lib/cpf";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { Shield, Zap, Loader2 } from "lucide-react";
import { PaymentLoadingOverlay } from "@/components/ui/payment-loading-overlay";
import {
  useCheckoutStore,
  selEmail,
  selCpf,
  selPM,
  selInst,
  selSetters,
} from "@/lib/state/checkoutStore";

const checkoutSchema = z.object({
  email: z
    .string()
    .min(1, "Por favor, digite seu email")
    .email("Por favor, digite um email válido (ex: seu@email.com)"),
  cpf: z
    .string()
    .min(1, "Por favor, digite seu CPF"),
  paymentMethod: z.enum(["pix", "card"]),
  installments: z.number().min(1).max(12),
});

interface CheckoutFormProps {
  product: Product;
  onSubmit: (formData: CheckoutInput) => void;
  isSubmitting: boolean;
}

export function CheckoutForm({
  product,
  onSubmit,
  isSubmitting,
}: CheckoutFormProps) {
  // React Hook Form como source of truth
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    control,
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      cpf: "",
      paymentMethod: "pix",
      installments: 1,
    },
    mode: "onChange", // Validação em tempo real
  });

  // Seletores primitivos do Zustand para persistência
  const setEmail = useCheckoutStore((s) => s.setEmail);
  const setCpf = useCheckoutStore((s) => s.setCpf);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setInstallments = useCheckoutStore((s) => s.setInstallments);

  const [cpfValue, setCpfValue] = useState("");
  const { isExpired } = useCountdown(10); // 10 minutos de desconto
  const isInitialized = useRef(false);

  // Usa preço promocional se o timer não expirou, senão usa preço original
  const effectivePrice = isExpired
    ? product.originalPrice
    : product.currentPrice;

  // Watch form values para usar no submit
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedCpf = useWatch({ control, name: "cpf" });
  const watchedPaymentMethod = useWatch({ control, name: "paymentMethod" });
  const watchedInstallments = useWatch({ control, name: "installments" });

  // Hidratação única na montagem (sem dependências problemáticas)
  useEffect(() => {
    if (isInitialized.current) return;

    // Valores padrão para hidratação (campos vazios para produção)
    reset({
      email: "",
      cpf: "",
      paymentMethod: "pix",
      installments: 1,
    });
    setCpfValue("");
    isInitialized.current = true;
  }, [reset]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPF(e.target.value);
    setCpfValue(masked);
    const unmaskedCPF = masked.replace(/\D/g, "");
    setValue("cpf", unmaskedCPF, { shouldValidate: true });
    // Sincronizar com Zustand apenas quando necessário
    setCpf(unmaskedCPF);
  };

  const handlePaymentMethodChange = (method: "pix" | "card") => {
    setValue("paymentMethod", method, { shouldValidate: true });
    setPaymentMethod(method);
    if (method === "pix") {
      setValue("installments", 1, { shouldValidate: true });
      setInstallments(1);
    }
  };

  const handleInstallmentsChange = (installments: number) => {
    setValue("installments", installments, { shouldValidate: true });
    setInstallments(installments);
  };

  const handleFormSubmit = useCallback(() => {
    if (isValid && !isSubmitting) {
      // Get current form values
      const formData = {
        email: watchedEmail || "",
        cpf: watchedCpf || "",
        paymentMethod: watchedPaymentMethod || "pix",
        installments: watchedInstallments || 1,
      };
      onSubmit(formData);
    }
  }, [
    isValid,
    isSubmitting,
    onSubmit,
    watchedEmail,
    watchedCpf,
    watchedPaymentMethod,
    watchedInstallments,
  ]);

  return (
    <div className="space-y-6" aria-busy={isSubmitting}>
      <Card className="p-6 bg-surface border-border">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Informações pessoais
            </h2>
            <p className="text-sm text-text-secondary">
              Preencha seus dados para finalizar a compra
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary font-medium">
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setEmail(e.target.value); // Sincronizar com Zustand
                    }}
                    className="bg-surface-2 border-border text-text-primary placeholder:text-muted h-12"
                  />
                )}
              />
              {errors.email && (
                <p className="text-sm text-danger flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-text-primary font-medium">
                CPF
              </Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpfValue}
                onChange={handleCPFChange}
                className="bg-surface-2 border-border text-text-primary placeholder:text-muted h-12"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-sm text-danger flex items-center gap-1">
                  {errors.cpf.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-surface border-border">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Método de pagamento
            </h2>
            <p className="text-sm text-text-secondary">
              Escolha como deseja pagar
            </p>
          </div>

          <PaymentOptions
            productValue={effectivePrice}
            onPaymentMethodChange={handlePaymentMethodChange}
          />

          {/* Installments (only for card) */}
          {watchedPaymentMethod === "card" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <Label className="text-text-primary font-medium">
                Parcelamento
              </Label>
              <InstallmentsSelect
                productValue={effectivePrice}
                onChange={handleInstallmentsChange}
              />
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <Button
          type="submit"
          onClick={handleFormSubmit}
          className="w-full bg-brand hover:bg-brand-hover text-brand-foreground py-6 text-lg font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processando pagamento...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Finalizar compra
            </div>
          )}
        </Button>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Shield className="h-4 w-4" />
          <span>Pagamento 100% seguro e criptografado</span>
        </div>
      </div>

      {isSubmitting && (
        <PaymentLoadingOverlay
          open={isSubmitting}
          message="Processando pagamento..."
        />
      )}
    </div>
  );
}
