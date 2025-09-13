import type { Product } from "@/types/checkout"

/**
 * Dados mockados de produtos para desenvolvimento e testes
 */

export const mockProducts: Product[] = [
  {
    id: "curso-marketing-digital",
    name: "Curso de Marketing Digital 2025",
    originalPrice: 497.00,
    currentPrice: 297.00,
    producer: "João Silva",
    format: "digital",
    deliveryTime: "imediato",
    description: "Curso completo de marketing digital com estratégias atualizadas para 2025",
    image: "/viverdemkt.png",
  },
  {
    id: "curso-react",
    name: "React Avançado",
    originalPrice: 397,
    currentPrice: 197,
    producer: "Maria Santos",
    format: "digital",
    deliveryTime: "imediato",
    description: "Domine React com hooks, context e performance",
    image: "/placeholder.jpg",
  },
  {
    id: "curso-typescript",
    name: "TypeScript Completo",
    originalPrice: 297,
    currentPrice: 147,
    producer: "Carlos Oliveira",
    format: "digital",
    deliveryTime: "imediato",
    description: "TypeScript do básico ao avançado com projetos reais",
    image: "/placeholder.jpg",
  },
]

/**
 * Produto padrão usado no checkout
 */
export const defaultProduct: Product = mockProducts[0]

/**
 * Função para buscar produto por ID
 */
export function getProductById(id: string): Product | undefined {
  return mockProducts.find(product => product.id === id)
}

/**
 * Função para gerar ID de pedido mockado
 */
export function generateMockOrderId(): string {
  return `CKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}
