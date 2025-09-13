import type React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockPaymentMethods,
  mockFeatures,
  brandConfig,
  paymentIconMap,
  iconMap,
} from "@/mocks";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <Container>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-brand/10 text-brand-foreground border-brand/20 px-4 py-2">
                {brandConfig.tagline}
              </Badge>
              <h1 className="text-display text-text-primary text-balance">
                Na Cakto, a taxa é{" "}
                <span className="text-brand">0% no Pix!</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto text-pretty">
                {brandConfig.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/checkout">
                <Button
                  size="lg"
                  className="bg-brand hover:bg-brand-hover text-brand-foreground px-8 py-4 text-lg"
                >
                  {brandConfig.cta.primary}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-text-primary hover:bg-surface px-8 py-4 text-lg bg-transparent"
              >
                {brandConfig.cta.secondary}
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
              <h2 className="text-h1 text-text-primary">
                Aceite todos os métodos de pagamento
              </h2>
              <p className="text-lg text-text-secondary max-w-xl mx-auto">
                Ofereça a melhor experiência para seus clientes com múltiplas
                opções de pagamento
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
            {mockFeatures.slice(0, 3).map((feature) => {
              const IconComponent =
                iconMap[feature.iconName as keyof typeof iconMap];
              return (
                <FeatureCard
                  key={feature.id}
                  icon={<IconComponent className="h-8 w-8 text-brand" />}
                  title={feature.title}
                  description={feature.description}
                />
              );
            })}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

function PaymentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockPaymentMethods.map((method) => {
        const IconComponent =
          paymentIconMap[method.iconName as keyof typeof paymentIconMap];
        return (
          <PaymentMethodCard
            key={method.id}
            {...method}
            icon={<IconComponent className="h-8 w-8" />}
          />
        );
      })}
    </div>
  );
}

interface PaymentMethodCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  highlight: boolean;
  badge: string;
}

function PaymentMethodCard({
  name,
  icon,
  description,
  highlight,
  badge,
}: PaymentMethodCardProps) {
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
          ${
            highlight
              ? "bg-brand/10 text-brand"
              : "bg-surface-2 text-text-secondary"
          }
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
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-8 bg-surface border-border hover:border-border/60 transition-colors">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto">
          {icon}
        </div>
        <h3 className="text-h3 text-text-primary">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>
    </Card>
  );
}
