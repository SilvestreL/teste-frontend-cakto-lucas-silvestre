import type React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Banknote, Zap, Apple, Chrome, QrCode, Receipt } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/layout/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <Container>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-brand/10 text-brand-foreground border-brand/20 px-4 py-2">Taxa 0% no PIX</Badge>
              <h1 className="text-display text-text-primary text-balance">
                Na Cakto, a taxa é <span className="text-brand">0% no Pix!</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto text-pretty">
                O checkout mais inteligente do Brasil. Receba seus pagamentos com as melhores condições do mercado e
                aumente suas conversões.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/checkout">
                <Button size="lg" className="bg-brand hover:bg-brand-hover text-brand-foreground px-8 py-4 text-lg">
                  Testar checkout
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-text-primary hover:bg-surface px-8 py-4 text-lg bg-transparent"
              >
                Criar minha conta
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Payment Methods Grid */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-h1 text-text-primary">Aceite todos os métodos de pagamento</h2>
              <p className="text-lg text-text-secondary max-w-xl mx-auto">
                Ofereça a melhor experiência para seus clientes com múltiplas opções de pagamento
              </p>
            </div>

            <PaymentGrid />
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-brand" />}
              title="Conversão otimizada"
              description="Checkout inteligente que aumenta suas vendas com UX focada em conversão"
            />
            <FeatureCard
              icon={<QrCode className="h-8 w-8 text-brand" />}
              title="PIX instantâneo"
              description="Receba na hora com 0% de taxa. Seus clientes pagam e você recebe imediatamente"
            />
            <FeatureCard
              icon={<Receipt className="h-8 w-8 text-brand" />}
              title="Taxas transparentes"
              description="Sem surpresas. Taxas claras e competitivas para todos os métodos de pagamento"
            />
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  )
}

function PaymentGrid() {
  const paymentMethods = [
    {
      name: "PIX",
      icon: <QrCode className="h-8 w-8" />,
      description: "Instantâneo e gratuito",
      highlight: true,
      badge: "0% taxa",
    },
    {
      name: "Cartão de Crédito",
      icon: <CreditCard className="h-8 w-8" />,
      description: "Até 12x sem juros",
      highlight: false,
      badge: "A partir de 3,99%",
    },
    {
      name: "Boleto",
      icon: <Banknote className="h-8 w-8" />,
      description: "Tradicional e confiável",
      highlight: false,
      badge: "2,99%",
    },
    {
      name: "Nupay",
      icon: <Smartphone className="h-8 w-8" />,
      description: "Carteira digital Nubank",
      highlight: false,
      badge: "3,49%",
    },
    {
      name: "PicPay",
      icon: <Smartphone className="h-8 w-8" />,
      description: "Pagamento social",
      highlight: false,
      badge: "3,49%",
    },
    {
      name: "Google Pay",
      icon: <Chrome className="h-8 w-8" />,
      description: "Pagamento rápido Google",
      highlight: false,
      badge: "3,99%",
    },
    {
      name: "Apple Pay",
      icon: <Apple className="h-8 w-8" />,
      description: "Touch ID e Face ID",
      highlight: false,
      badge: "3,99%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paymentMethods.map((method) => (
        <PaymentMethodCard key={method.name} {...method} />
      ))}
    </div>
  )
}

interface PaymentMethodCardProps {
  name: string
  icon: React.ReactNode
  description: string
  highlight: boolean
  badge: string
}

function PaymentMethodCard({ name, icon, description, highlight, badge }: PaymentMethodCardProps) {
  return (
    <Card
      className={`
      p-6 transition-all duration-200 cursor-pointer group
      ${
        highlight
          ? "bg-surface border-brand/50 shadow-cakto-2 hover:border-brand"
          : "bg-surface border-border hover:border-border/60"
      }
      hover:shadow-cakto-2 hover:-translate-y-1
    `}
    >
      <div className="space-y-4">
        <div
          className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${highlight ? "bg-brand/10 text-brand" : "bg-surface-2 text-text-secondary"}
          group-hover:scale-110 transition-transform duration-200
        `}
        >
          {icon}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 text-text-primary">{name}</h3>
            <Badge
              variant={highlight ? "default" : "secondary"}
              className={highlight ? "bg-brand text-brand-foreground" : ""}
            >
              {badge}
            </Badge>
          </div>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
      </div>
    </Card>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-8 bg-surface border-border hover:border-border/60 transition-colors">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto">{icon}</div>
        <h3 className="text-h3 text-text-primary">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>
    </Card>
  )
}
