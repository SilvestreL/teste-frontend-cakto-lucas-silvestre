"use client";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Copy,
  Download,
  ArrowRight,
  QrCode,
  CreditCard,
  Clock,
  Zap,
} from "lucide-react";
import { RiCactusLine } from "react-icons/ri";
import { formatBRL } from "@/lib/currency";
import { maskCPF } from "@/lib/cpf";
import { getPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
import Link from "next/link";
import { PaymentLoadingOverlay } from "@/components/ui/payment-loading-overlay";

interface SuccessStateProps {
  orderId: string;
  formData?: {
    email: string;
    cpf: string;
    paymentMethod: "pix" | "card";
    installments: number;
  } | null;
}

// Mock order data based on the order ID and form data
function getMockOrderData(
  orderId: string,
  formData?: SuccessStateProps["formData"]
) {
  // Extract timestamp from order ID to simulate realistic data
  const timestamp = orderId.split("-")[1];
  const isRecent = Date.now() - Number.parseInt(timestamp) < 300000; // 5 minutes

  // Use form data if available, otherwise simulate
  const isPix = formData?.paymentMethod === "pix";
  const installments = formData?.installments || 1;

  // Calculate pricing based on form data - use the same pricing logic as the checkout
  const basePrice = 297; // Promotional price
  const originalPrice = 497;

  // Use the same pricing system as the checkout
  const pricing = getPricing({
    originalValue: new Decimal(originalPrice),
    currentValue: new Decimal(basePrice),
    paymentMethod: formData?.paymentMethod || (isPix ? "pix" : "card"),
    installments: installments,
  });

  const totalPrice = pricing.total.toNumber();
  const monthlyValue = pricing.monthlyValue.toNumber();

  return {
    id: orderId,
    status: isPix ? "confirmed" : "processing",
    paymentMethod: formData?.paymentMethod || (isPix ? "pix" : "card"),
    product: {
      name: "Curso de Marketing Digital 2025",
      price: totalPrice,
      originalPrice: originalPrice,
      producer: "João Silva",
      format: "digital",
      deliveryTime: "imediato",
    },
    customer: {
      email: formData?.email || "cliente@exemplo.com",
      cpf: formData?.cpf ? maskCPF(formData.cpf) : "***.***.***-**",
    },
    payment: {
      installments: installments,
      monthlyValue: monthlyValue,
      rate: isPix ? 0 : pricing.rate.toNumber(),
      total: totalPrice,
    },
    createdAt: new Date(Number.parseInt(timestamp)),
    pixCode: isPix
      ? "00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540529705802BR5925CAKTO PAGAMENTOS LTDA6009SAO PAULO62070503***6304"
      : null,
  };
}

export function SuccessState({ orderId, formData }: SuccessStateProps) {
  const [orderData] = useState(() => getMockOrderData(orderId, formData));
  const [copied, setCopied] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const copyPixCode = async () => {
    if (orderData.pixCode) {
      await navigator.clipboard.writeText(orderData.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNavigateHome = () => {
    setIsNavigating(true);
    // Simular delay de navegação
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const isPix = orderData.paymentMethod === "pix";
  const isConfirmed = orderData.status === "confirmed";

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-border bg-bg/95 backdrop-blur">
        <Container>
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-brand flex items-center justify-center">
                <RiCactusLine className="text-brand-foreground text-sm" />
              </div>
              <span className="text-h3 text-text-primary">
                Demonstração de Checkout
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div className="space-y-2">
              <h1 className="text-h1 text-text-primary">
                {isConfirmed
                  ? "Pagamento confirmado!"
                  : "Pedido criado com sucesso!"}
              </h1>
              <p className="text-text-secondary">
                {isConfirmed
                  ? "Seu pagamento foi processado e você já tem acesso ao produto."
                  : "Aguardando confirmação do pagamento."}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <Card className="p-6 bg-surface border-border space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-h3 text-text-primary">
                  Detalhes do pedido
                </h2>
                <Badge
                  variant={isConfirmed ? "default" : "secondary"}
                  className={isConfirmed ? "bg-success text-white" : ""}
                >
                  {isConfirmed ? "Confirmado" : "Processando"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">ID do pedido</span>
                  <span className="text-text-primary font-mono text-sm">
                    {orderData.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Data</span>
                  <span className="text-text-primary">
                    {orderData.createdAt.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Email</span>
                  <span className="text-text-primary">
                    {orderData.customer.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">CPF</span>
                  <span className="text-text-primary">
                    {orderData.customer.cpf}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Product Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">Produto</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-text-primary font-medium">
                    {orderData.product.name}
                  </span>
                  <span className="text-text-primary font-semibold">
                    {formatBRL(orderData.product.price)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-surface-2 text-text-secondary px-2.5 py-1 rounded-md">
                    por {orderData.product.producer}
                  </span>
                  <span className="text-xs bg-surface-2 text-text-secondary px-2.5 py-1 rounded-md">
                    Produto digital
                  </span>
                  <span className="text-xs bg-brand/10 text-brand px-2.5 py-1 rounded-md">
                    Liberação imediata
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Payment Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {isPix ? (
                  <QrCode className="h-5 w-5 text-brand" />
                ) : (
                  <CreditCard className="h-5 w-5 text-text-secondary" />
                )}
                <h3 className="font-semibold text-text-primary">
                  {isPix ? "Pagamento PIX" : "Pagamento no Cartão"}
                </h3>
                {isPix && (
                  <Badge className="bg-brand text-brand-foreground">
                    0% taxa
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                {!isPix && orderData.payment.installments > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Parcelamento</span>
                    <span className="text-text-primary">
                      {orderData.payment.installments}x de{" "}
                      {formatBRL(orderData.payment.monthlyValue)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total pago</span>
                  <span className="text-text-primary font-bold text-lg">
                    {formatBRL(orderData.payment.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* PIX Code */}
            {isPix && orderData.pixCode && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">
                    Código PIX
                  </h3>
                  <div className="p-4 bg-surface-2 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-text-primary font-mono break-all">
                        {orderData.pixCode}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyPixCode}
                        className="ml-2 shrink-0 bg-transparent border-border text-text-primary hover:bg-surface"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Status Card */}
          {isPix ? (
            <Card className="p-6 bg-brand/10 border-brand/20">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-brand" />
                <div>
                  <h3 className="font-semibold text-brand">
                    Pagamento instantâneo confirmado!
                  </h3>
                  <p className="text-brand/80">
                    Você já tem acesso completo ao produto.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-surface border-border">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-warning" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Processando pagamento
                  </h3>
                  <p className="text-text-secondary">
                    Seu pagamento está sendo processado. Você receberá um email
                    de confirmação em breve.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isConfirmed && (
              <Button className="bg-brand hover:bg-brand-hover text-brand-foreground flex-1">
                <Download className="h-4 w-4 mr-2" />
                Acessar produto
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full bg-transparent border-border text-text-primary hover:bg-surface flex-1"
              onClick={handleNavigateHome}
              disabled={isNavigating}
            >
              Voltar ao início
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Support */}
          <div className="text-center space-y-2">
            <p className="text-text-secondary text-sm">
              Precisa de ajuda? Entre em contato com nosso suporte.
            </p>
            <Button
              variant="link"
              className="text-brand hover:text-brand-hover p-0"
            >
              suporte@cakto.com
            </Button>
          </div>
        </div>
      </Container>

      {/* Navigation Loading Overlay */}
      <PaymentLoadingOverlay
        open={isNavigating}
        message="Redirecionando para o início..."
      />
    </div>
  );
}
