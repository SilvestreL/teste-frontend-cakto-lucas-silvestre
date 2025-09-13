"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { PaymentOptions } from "./PaymentOptions"
import { InstallmentsSelect } from "./InstallmentsSelect"
import type { CheckoutInput, Product } from "@/types/checkout"
import { maskCPF, isValidCPF } from "@/lib/cpf"
import { Shield, Zap, Loader2 } from "lucide-react"

const checkoutSchema = z.object({
  email: z.string().email("Email inválido"),
  cpf: z.string().refine(isValidCPF, "CPF inválido"),
  paymentMethod: z.enum(["pix", "card"]),
  installments: z.number().min(1).max(12),
})

interface CheckoutFormProps {
  data: CheckoutInput
  product: Product
  onChange: (data: Partial<CheckoutInput>) => void
  onSubmit: (data: CheckoutInput) => void
  isSubmitting: boolean
}

export function CheckoutForm({ data, product, onChange, onSubmit, isSubmitting }: CheckoutFormProps) {
  const [cpfValue, setCpfValue] = useState("")
  const isInitialRender = useRef(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: data,
    mode: "onChange",
  })

  const email = watch("email")
  const cpf = watch("cpf")
  const paymentMethod = watch("paymentMethod")
  const installments = watch("installments")

  const formData = useCallback(
    () => ({
      email,
      cpf,
      paymentMethod,
      installments,
    }),
    [email, cpf, paymentMethod, installments],
  )

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    onChange(formData())
  }, [email, cpf, paymentMethod, installments, onChange, formData])

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPF(e.target.value)
    setCpfValue(masked)
    setValue("cpf", masked.replace(/\D/g, ""))
  }

  const handlePaymentMethodChange = (method: "pix" | "card") => {
    setValue("paymentMethod", method)
    if (method === "pix") {
      setValue("installments", 1)
    }
  }

  const handleInstallmentsChange = (installments: number) => {
    setValue("installments", installments)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-surface border-border">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Dados pessoais</h2>
            <p className="text-sm text-text-secondary">Preencha com seus dados para finalizar a compra</p>
          </div>

          {/* Personal Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-surface-2 border-border text-text-primary placeholder:text-muted h-12"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-danger flex items-center gap-1">{errors.email.message}</p>}
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
              {errors.cpf && <p className="text-sm text-danger flex items-center gap-1">{errors.cpf.message}</p>}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-surface border-border">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Método de pagamento</h2>
            <p className="text-sm text-text-secondary">Escolha como deseja pagar</p>
          </div>

          <PaymentOptions
            selected={paymentMethod}
            onSelect={handlePaymentMethodChange}
            productValue={product.currentPrice}
          />

          {/* Installments (only for card) */}
          {paymentMethod === "card" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <Label className="text-text-primary font-medium">Parcelamento</Label>
              <InstallmentsSelect
                value={installments}
                onChange={handleInstallmentsChange}
                productValue={product.currentPrice}
              />
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-brand hover:bg-brand-hover text-brand-foreground py-6 text-lg font-semibold transition-all duration-200 disabled:opacity-50"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processando pagamento...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {paymentMethod === "pix" ? <Zap className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
              Finalizar compra
            </div>
          )}
        </Button>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
            <Shield className="h-4 w-4" />
            <span>Pagamento 100% seguro</span>
          </div>
          {paymentMethod === "pix" && (
            <div className="flex items-center justify-center gap-2 text-sm text-brand">
              <Zap className="h-4 w-4" />
              <span>Receba acesso imediato após o pagamento</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
