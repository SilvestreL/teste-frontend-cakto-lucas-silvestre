"use client"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { CheckoutForm } from "@/features/checkout/CheckoutForm"
import { Summary } from "@/features/checkout/Summary"
import { MobileSummary } from "@/features/checkout/MobileSummary"
import type { CheckoutInput, Product } from "@/types/checkout"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock product data
const mockProduct: Product = {
  id: "curso-nextjs",
  name: "Curso Completo de Next.js",
  originalPrice: 497,
  currentPrice: 297,
  description: "Aprenda Next.js do zero ao avançado com projetos práticos",
  image: "/nextjs-course-thumbnail.jpg",
}

export default function CheckoutPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CheckoutInput>({
    email: "",
    cpf: "",
    paymentMethod: "pix",
    installments: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormChange = useCallback((data: Partial<CheckoutInput>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const handleSubmit = useCallback(
    async (data: CheckoutInput) => {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock order ID
      const orderId = `CKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      // Redirect to success page
      router.push(`/success?id=${orderId}`)
    },
    [router],
  )

  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-border bg-bg/95 backdrop-blur sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-brand-foreground font-bold">C</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Cakto</span>
            </div>
          </div>
        </Container>
      </div>

      <div className="lg:hidden">
        <MobileSummary product={mockProduct} formData={formData} />
      </div>

      {/* Main Content */}
      <Container className="py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Finalizar compra</h1>
              <p className="text-text-secondary leading-relaxed">Preencha seus dados para concluir a compra do curso</p>
            </div>

            <CheckoutForm
              data={formData}
              product={mockProduct}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <Summary product={mockProduct} formData={formData} />
            </div>
          </div>
        </div>
      </Container>

      <footer className="border-t border-border bg-surface/50 mt-12">
        <Container>
          <div className="py-6 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-text-secondary">
              <Link href="/terms" className="hover:text-text-primary transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="hover:text-text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/support" className="hover:text-text-primary transition-colors">
                Suporte
              </Link>
            </div>
            <p className="text-xs text-text-secondary mt-2">© 2024 Cakto. Todos os direitos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
