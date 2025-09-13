import type { Product } from "@/types/checkout"

/**
 * Dados mockados de produtos para desenvolvimento e testes
 */

export const mockProducts: Product[] = [
  {
    id: "curso-nextjs",
    name: "Curso Completo de Next.js",
    originalPrice: 497,
    currentPrice: 297,
    description: "Aprenda Next.js do zero ao avançado com projetos práticos",
    image: "/nextjs-course-thumbnail.jpg",
  },
  {
    id: "curso-react",
    name: "React Avançado",
    originalPrice: 397,
    currentPrice: 197,
    description: "Domine React com hooks, context e performance",
    image: "/placeholder.jpg",
  },
  {
    id: "curso-typescript",
    name: "TypeScript Completo",
    originalPrice: 297,
    currentPrice: 147,
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
