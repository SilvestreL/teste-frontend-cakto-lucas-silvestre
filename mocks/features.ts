import { Zap, QrCode, Receipt, Shield, Clock, TrendingUp, Users, BarChart3 } from "lucide-react"

/**
 * Dados mockados das funcionalidades da plataforma
 */

export interface FeatureData {
  id: string
  iconName: string
  title: string
  description: string
  highlight?: boolean
}

export const mockFeatures: FeatureData[] = [
  {
    id: "conversion-optimized",
    iconName: "Zap",
    title: "Conversão otimizada",
    description: "Checkout inteligente que aumenta suas vendas com UX focada em conversão",
    highlight: true,
  },
  {
    id: "pix-instant",
    iconName: "QrCode",
    title: "PIX instantâneo",
    description: "Receba na hora com 0% de taxa. Seus clientes pagam e você recebe imediatamente",
    highlight: true,
  },
  {
    id: "transparent-rates",
    iconName: "Receipt",
    title: "Taxas transparentes",
    description: "Sem surpresas. Taxas claras e competitivas para todos os métodos de pagamento",
    highlight: true,
  },
  {
    id: "secure-payments",
    iconName: "Shield",
    title: "Pagamentos seguros",
    description: "Criptografia de ponta a ponta e compliance com as melhores práticas de segurança",
  },
  {
    id: "fast-approval",
    iconName: "Clock",
    title: "Aprovação rápida",
    description: "Pagamentos aprovados em segundos com nossa tecnologia de análise de risco",
  },
  {
    id: "analytics",
    iconName: "BarChart3",
    title: "Analytics avançado",
    description: "Relatórios detalhados sobre conversões, abandono e performance de vendas",
  },
  {
    id: "multi-channel",
    iconName: "TrendingUp",
    title: "Multi-canal",
    description: "Integre com e-commerce, marketplace, redes sociais e muito mais",
  },
  {
    id: "customer-support",
    iconName: "Users",
    title: "Suporte especializado",
    description: "Equipe técnica dedicada para ajudar você a maximizar suas conversões",
  },
]

/**
 * Mapa de ícones para renderização
 */
export const iconMap = {
  Zap,
  QrCode,
  Receipt,
  Shield,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
} as const

/**
 * Funcionalidades destacadas (para homepage)
 */
export const featuredFeatures = mockFeatures.filter(feature => feature.highlight)

/**
 * Função para buscar funcionalidade por ID
 */
export function getFeatureById(id: string): FeatureData | undefined {
  return mockFeatures.find(feature => feature.id === id)
}
