"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Product, CheckoutInput } from "@/types/checkout"
import { formatBRL, formatPercent } from "@/lib/currency"
import { calcRate, calcTotal, calcNet } from "@/lib/taxes"
import { ChevronDown, ChevronUp, Zap, TrendingDown, CreditCard } from "lucide-react"

interface MobileSummaryProps {
  product: Product
  formData: CheckoutInput
}

export function MobileSummary({ product, formData }: MobileSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rate = calcRate(formData.paymentMethod, formData.installments)
  const total = calcTotal(product.currentPrice, rate)
  const savings = product.originalPrice - product.currentPrice
  const netValue = calcNet(product.currentPrice, total)
  const feeAmount = total - product.currentPrice

  return (
    <div className="border-b border-border bg-surface/50 backdrop-blur sticky top-0 z-40">
      <div className="px-4 py-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-surface-2 overflow-hidden border border-border">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-text-primary text-sm leading-tight">{product.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-bold text-text-primary">{formatBRL(total)}</span>
                    {formData.paymentMethod === "pix" ? (
                      <Badge className="bg-brand text-brand-foreground text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        0% PIX
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {formatPercent(rate)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Ver resumo</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <Card className="p-4 bg-surface border-border">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Preço original</span>
                    <span className="text-text-secondary line-through">{formatBRL(product.originalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Preço promocional</span>
                    <span className="text-text-primary font-semibold">{formatBRL(product.currentPrice)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex items-center justify-between text-sm p-2 rounded bg-brand/10 border border-brand/20">
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-3 w-3 text-brand" />
                        <span className="text-brand font-medium">Economia</span>
                      </div>
                      <span className="text-brand font-semibold">{formatBRL(savings)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/40 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Método de pagamento</span>
                    <span className="text-text-primary font-medium capitalize">{formData.paymentMethod}</span>
                  </div>

                  {feeAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Taxa do cartão</span>
                      <span className="text-text-primary">+ {formatBRL(feeAmount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Produtor recebe</span>
                    <span className="text-text-primary font-medium">{formatBRL(netValue)}</span>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">Total a pagar</span>
                    <span className="font-bold text-lg text-text-primary">{formatBRL(total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
