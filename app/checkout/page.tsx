import { Container } from "@/components/layout/Container";
import { CactusIcon } from "@/components/ui/cactus-icon";
import { getProductWithPricing } from "@/lib/server/data";
import { MobileSummary } from "@/features/checkout/MobileSummary";
import ProductHero from "@/features/product/ProductHero";
import ServerSummary from "@/features/summary/ServerSummary";
import InteractiveSummary from "@/features/summary/InteractiveSummary";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic imports para componentes client
const CheckoutFormClient = dynamic(
  () =>
    import("@/features/checkout/CheckoutFormClient").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="rounded-lg border border-border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 bg-surface-2 rounded" />
            <div className="h-4 w-64 bg-surface-2 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-12 bg-surface-2 rounded" />
                <div className="h-12 w-full bg-surface-2 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-12 bg-surface-2 rounded" />
                <div className="h-12 w-full bg-surface-2 rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 bg-surface-2 rounded" />
            <div className="h-4 w-64 bg-surface-2 rounded" />
            <div className="h-32 w-full bg-surface-2 rounded" />
          </div>
        </div>
      </div>
    ),
  }
);

const CheckoutStateHydrator = dynamic(
  () =>
    import("@/features/checkout/CheckoutStateHydrator").then((mod) => ({
      default: mod.CheckoutStateHydrator,
    })),
  {
    ssr: false,
  }
);

export const revalidate = 600; // Cache por 10 minutos

export default async function CheckoutPage() {
  // Busca dados do produto no servidor
  const { product, pricing } = await getProductWithPricing(
    "curso-marketing-digital"
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
        <MobileSummary product={product} />
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

            <Suspense
              fallback={
                <div className="space-y-6">
                  <div className="rounded-lg border border-border p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 w-48 bg-surface-2 rounded" />
                      <div className="h-4 w-64 bg-surface-2 rounded" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="h-4 w-12 bg-surface-2 rounded" />
                          <div className="h-12 w-full bg-surface-2 rounded" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-12 bg-surface-2 rounded" />
                          <div className="h-12 w-full bg-surface-2 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <CheckoutFormClient product={product} />
            </Suspense>
          </div>

          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <ProductHero product={product} />
              <ServerSummary product={product} initialPricing={pricing} />
              <InteractiveSummary product={product} />
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
