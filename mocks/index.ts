/**
 * Arquivo central de exportação dos mocks
 * Facilita a importação de todos os dados mockados
 */

// Produtos
export * from "./products"

// Métodos de pagamento
export * from "./payment-methods"

// Funcionalidades
export * from "./features"

// Navegação e links
export * from "./navigation"

// Re-exportações úteis
export { defaultProduct, mockProducts } from "./products"
export { mockPaymentMethods, featuredPaymentMethods, paymentIconMap } from "./payment-methods"
export { mockFeatures, featuredFeatures, iconMap } from "./features"
export { mockNavLinks, mockFooterLinks, brandConfig } from "./navigation"
