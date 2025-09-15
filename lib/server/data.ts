import { getProductById } from "@/mocks/products";
import { getPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
import type { Product } from "@/types/checkout";

export const revalidate = 600; // Cache por 10 minutos

/**
 * Busca produto por ID (simula API call)
 */
export async function getProduct(productId: string): Promise<Product> {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const product = getProductById(productId);
  if (!product) {
    throw new Error(`Produto com ID ${productId} não encontrado`);
  }
  
  return product;
}

/**
 * Calcula preços para um produto
 */
export async function getPricingFor(product: Product) {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const pricing = getPricing({
    originalValue: new Decimal(product.originalPrice),
    currentValue: new Decimal(product.currentPrice),
    paymentMethod: "pix", // Default para cálculo no servidor
    installments: 1,
  });

  return {
    total: pricing.total.toNumber(),
    monthly: pricing.monthlyValue.toNumber(),
    savings: pricing.savings.toNumber(),
    savingsPercent: Number(pricing.savingsPercentage.toFixed(0)),
    feeAmount: pricing.feeAmount.toNumber(),
    netValue: pricing.netValue.toNumber(),
    pixSavings: pricing.feeAmount.toNumber(), // PIX não tem taxa
  };
}

/**
 * Busca dados completos do produto com preços
 */
export async function getProductWithPricing(productId: string) {
  const product = await getProduct(productId);
  const pricing = await getPricingFor(product);
  
  return {
    product,
    pricing,
  };
}
