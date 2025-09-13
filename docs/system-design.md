# System Design - Frontend Cakto

## 📋 Visão Geral

O **Cakto** é uma aplicação de checkout inteligente construída com **Next.js 14** e **TypeScript**, focada em conversão e experiência do usuário. O sistema oferece uma interface moderna e responsiva para processamento de pagamentos com destaque para PIX com taxa 0%.

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

- **Framework**: Next.js 14.2.16 (App Router)
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9 + CSS Custom Properties
- **UI Components**: Radix UI + shadcn/ui
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React
- **Gerenciador de Pacotes**: pnpm

### Estrutura de Pastas

```
checkoutpage-next/
├── app/                          # App Router (Next.js 14)
│   ├── checkout/                 # Página de checkout
│   ├── success/                  # Página de sucesso
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout raiz
│   └── page.tsx                 # Homepage
├── components/                   # Componentes reutilizáveis
│   ├── layout/                  # Componentes de layout
│   │   ├── Container.tsx        # Container responsivo
│   │   ├── Footer.tsx           # Rodapé
│   │   └── Navbar.tsx           # Navegação
│   ├── ui/                      # Componentes base (shadcn/ui)
│   └── theme-provider.tsx       # Provedor de tema
├── features/                    # Features específicas
│   └── checkout/                # Feature de checkout
│       ├── CheckoutForm.tsx     # Formulário principal
│       ├── InstallmentsSelect.tsx # Seletor de parcelas
│       ├── MobileSummary.tsx    # Resumo mobile
│       ├── PaymentOptions.tsx   # Opções de pagamento
│       ├── SuccessState.tsx     # Estado de sucesso
│       └── Summary.tsx          # Resumo do pedido
├── lib/                         # Utilitários e helpers
│   ├── cpf.ts                   # Validação e máscara de CPF
│   ├── currency.ts              # Formatação de moeda
│   ├── taxes.ts                 # Cálculos de taxas
│   └── utils.ts                 # Utilitários gerais
├── mocks/                       # Dados mockados para desenvolvimento
│   ├── products.ts              # Produtos mockados
│   ├── payment-methods.ts       # Métodos de pagamento
│   ├── features.ts              # Funcionalidades da plataforma
│   ├── navigation.ts            # Links de navegação
│   └── index.ts                 # Exportações centralizadas
├── types/                       # Definições de tipos
│   └── checkout.ts              # Tipos do checkout
└── public/                      # Assets estáticos
```

## 🎨 Design System

### Paleta de Cores

O sistema utiliza um design **dark-first** com cores personalizadas:

```css
/* Cores Base */
--bg: #0b0b0b                    /* Fundo principal */
--surface: #111213               /* Superfícies */
--surface-2: #151718             /* Superfícies secundárias */
--border: #1f2427                /* Bordas */

/* Texto */
--text-primary: #ffffff          /* Texto principal */
--text-secondary: #b0b0b0        /* Texto secundário */
--muted: #8a8f98                 /* Texto muted */

/* Brand */
--brand: #00c853                 /* Verde Cakto */
--brand-foreground: #0b0b0b      /* Texto sobre brand */
--brand-hover: #06e066           /* Hover do brand */

/* Estados */
--danger: #ef4444                /* Erro */
--warning: #f59e0b               /* Aviso */
--success: #22c55e               /* Sucesso */
--info: #3b82f6                  /* Informação */
```

### Tipografia

- **Fonte Principal**: Inter (Google Fonts)
- **Sistema de Escalas**: Responsivo com clamp()
- **Hierarquia**: Display → H1 → H2 → H3 → Body → Caption

### Componentes Base

Todos os componentes seguem o padrão **shadcn/ui** com customizações para o design system Cakto:

- **Button**: Variações primária, secundária, outline
- **Card**: Containers com bordas arredondadas
- **Input**: Campos de formulário com validação
- **Badge**: Indicadores de status e tags
- **Separator**: Divisores visuais

## 📦 Sistema de Mocks

### Organização dos Dados Mockados

A pasta `mocks/` centraliza todos os dados mockados utilizados durante o desenvolvimento e testes:

#### **`mocks/products.ts`**

- **Produtos disponíveis**: Lista de produtos com preços e descrições
- **Produto padrão**: Produto usado no checkout de exemplo
- **Funções auxiliares**: `getProductById()`, `generateMockOrderId()`

#### **`mocks/payment-methods.ts`**

- **Métodos de pagamento**: PIX, cartão, boleto, carteiras digitais
- **Configurações**: Taxas, ícones, descrições, disponibilidade
- **Destaques**: Métodos em evidência na homepage

#### **`mocks/features.ts`**

- **Funcionalidades da plataforma**: Conversão, PIX, taxas transparentes
- **Ícones e descrições**: Dados para cards de funcionalidades
- **Categorização**: Funcionalidades destacadas vs. completas

#### **`mocks/navigation.ts`**

- **Links de navegação**: Menu principal e rodapé
- **Configuração da marca**: Nome, tagline, CTAs
- **Links externos**: Redes sociais e recursos

#### **`mocks/index.ts`**

- **Exportações centralizadas**: Facilita imports
- **Re-exportações úteis**: Dados mais utilizados
- **API unificada**: Interface consistente para todos os mocks

### Vantagens da Estrutura

- **Centralização**: Todos os dados mockados em um local
- **Reutilização**: Dados compartilhados entre componentes
- **Manutenção**: Fácil atualização e modificação
- **Tipagem**: TypeScript para type safety
- **Organização**: Separação clara por domínio

## 🔧 Funcionalidades Principais

### 1. Homepage (`/`)

**Componentes**:

- `Navbar`: Navegação principal com menu mobile
- `PaymentGrid`: Grid de métodos de pagamento
- `FeatureCard`: Cards de funcionalidades
- `Footer`: Rodapé com links

**Características**:

- Design responsivo
- Animações suaves
- Call-to-actions destacados
- Destaque para PIX com 0% de taxa

### 2. Checkout (`/checkout`)

**Componentes Principais**:

- `CheckoutForm`: Formulário principal com validação
- `Summary`: Resumo do pedido (desktop)
- `MobileSummary`: Resumo mobile
- `PaymentOptions`: Seleção de método de pagamento
- `InstallmentsSelect`: Parcelamento para cartão

**Fluxo de Dados**:

```typescript
interface CheckoutInput {
  email: string;
  cpf: string;
  paymentMethod: "pix" | "card";
  installments: number;
}
```

**Validações**:

- Email: Validação com regex
- CPF: Validação matemática + máscara
- Método de pagamento: Enum restrito
- Parcelas: 1-12 para cartão, 1 para PIX

### 3. Sucesso (`/success`)

**Funcionalidades**:

- Confirmação de pagamento
- ID do pedido
- Próximos passos
- Loading state

## 💰 Sistema de Cálculos

### Taxas de Pagamento

```typescript
// PIX: 0% de taxa
if (method === "pix") return 0;

// Cartão: Taxa base + incremento por parcela
if (method === "card") {
  if (installments === 1) return 0.0399; // 3,99%
  return 0.0499 + 0.02 * (installments - 1); // +2% por parcela extra
}
```

### Cálculos Disponíveis

- `calcRate()`: Calcula taxa baseada no método e parcelas
- `calcTotal()`: Valor total com taxas
- `calcInstallment()`: Valor da parcela
- `calcNet()`: Valor líquido para o produtor

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Estratégias

- **Mobile First**: Design baseado em mobile
- **Container Responsivo**: Largura máxima com padding
- **Grid Adaptativo**: CSS Grid com breakpoints
- **Componentes Condicionais**: MobileSummary vs Summary

## 🔒 Validações e Segurança

### Validação de CPF

```typescript
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, "");

  // Validação de formato
  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  // Validação dos dígitos verificadores
  // ... algoritmo matemático
}
```

### Validação de Formulário

- **React Hook Form**: Gerenciamento de estado
- **Zod**: Schema de validação
- **Validação em Tempo Real**: onChange com debounce
- **Feedback Visual**: Mensagens de erro contextuais

## 🎯 Performance

### Otimizações Implementadas

- **Next.js 14**: App Router com otimizações automáticas
- **Code Splitting**: Carregamento sob demanda
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts com display: swap
- **CSS-in-JS**: Tailwind com purging automático

### Métricas de Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🧪 Testes

### Estrutura de Testes

- **Vitest**: Framework de testes
- **Testing Library**: Utilitários para testes de componentes
- **Testes Unitários**: Funções de cálculo e validação
- **Testes de Integração**: Fluxos completos

### Cobertura

- **lib/taxes.ts**: 100% cobertura
- **lib/cpf.ts**: 100% cobertura
- **lib/currency.ts**: 100% cobertura

## 🚀 Deploy e Build

### Scripts Disponíveis

```json
{
  "dev": "next dev", // Desenvolvimento
  "build": "next build", // Build de produção
  "start": "next start", // Servidor de produção
  "lint": "next lint" // Linting
}
```

### Variáveis de Ambiente

- `NEXT_PUBLIC_API_URL`: URL da API
- `NEXT_PUBLIC_ENVIRONMENT`: Ambiente (dev/prod)

## 📈 Monitoramento

### Analytics

- **Vercel Analytics**: Métricas de performance
- **Error Tracking**: Captura de erros
- **User Behavior**: Tracking de conversões

### Métricas de Negócio

- **Taxa de Conversão**: Checkout completado
- **Abandono de Carrinho**: Pontos de saída
- **Método de Pagamento**: Preferências dos usuários
- **Tempo de Conversão**: Tempo médio de checkout

## 🔄 Fluxo de Dados

### Estado Global

```typescript
// Estado local do checkout
const [formData, setFormData] = useState<CheckoutInput>({
  email: "",
  cpf: "",
  paymentMethod: "pix",
  installments: 1,
});
```

### Comunicação entre Componentes

- **Props**: Dados passados para baixo
- **Callbacks**: Eventos passados para cima
- **Context**: Estado compartilhado (quando necessário)
- **URL State**: Parâmetros de rota

## 🎨 Customizações do Design

### Animações

- **Hover Effects**: Transições suaves
- **Loading States**: Spinners e skeletons
- **Micro-interactions**: Feedback visual
- **Page Transitions**: Navegação fluida

### Acessibilidade

- **ARIA Labels**: Descrições para screen readers
- **Keyboard Navigation**: Navegação por teclado
- **Color Contrast**: Contraste adequado
- **Focus Management**: Estados de foco visíveis

## 📚 Próximos Passos

### Melhorias Planejadas

1. **PWA**: Service Worker e cache offline
2. **Internacionalização**: Suporte a múltiplos idiomas
3. **A/B Testing**: Testes de conversão
4. **Analytics Avançado**: Heatmaps e session recording
5. **Performance**: Lazy loading e otimizações

### Refatorações

1. **State Management**: Context API ou Zustand
2. **Error Boundaries**: Tratamento de erros global
3. **Loading States**: Skeleton components
4. **Testing**: Cobertura completa de componentes

---

## 📞 Contato

Para dúvidas sobre o system design ou sugestões de melhorias, entre em contato com a equipe de desenvolvimento.

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024
