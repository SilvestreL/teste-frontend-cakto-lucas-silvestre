/**
 * Dados mockados de navegação e links
 */

export interface NavLink {
  href: string
  label: string
  external?: boolean
}

export interface FooterLink {
  href: string
  label: string
  external?: boolean
}

export const mockNavLinks: NavLink[] = [
  { href: "#taxas", label: "Taxas" },
  { href: "#integracoes", label: "Integrações" },
  { href: "#planos", label: "Planos" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#blog", label: "Blog" },
]

export const mockFooterLinks: FooterLink[] = [
  { href: "/terms", label: "Termos de Uso" },
  { href: "/privacy", label: "Política de Privacidade" },
  { href: "/support", label: "Suporte" },
  { href: "/contact", label: "Contato" },
  { href: "/about", label: "Sobre nós" },
]

export const mockSocialLinks: FooterLink[] = [
  { href: "https://twitter.com/cakto", label: "Twitter", external: true },
  { href: "https://linkedin.com/company/cakto", label: "LinkedIn", external: true },
  { href: "https://instagram.com/cakto", label: "Instagram", external: true },
  { href: "https://github.com/cakto", label: "GitHub", external: true },
]

/**
 * Configurações da marca
 */
export const brandConfig = {
  name: "Cakto",
  tagline: "Taxa 0% no PIX",
  description: "Na Cakto, a taxa é 0% no Pix! Checkout inteligente com as melhores condições do mercado.",
  logo: {
    text: "C",
    color: "brand",
  },
  cta: {
    primary: "Testar checkout",
    secondary: "Criar minha conta",
  },
} as const
