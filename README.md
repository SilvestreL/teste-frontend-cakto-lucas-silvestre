# Demonstração de Checkout - Next.js

Este projeto é uma demonstração de funcionalidade de checkout desenvolvida em Next.js, focada especificamente na avaliação técnica de implementação de fluxo de pagamento.

## 🎯 Objetivo

Demonstrar um fluxo completo de checkout com:

- Formulário de dados pessoais (email, CPF)
- Seleção de método de pagamento (PIX e Cartão de Crédito)
- Cálculo de taxas e parcelamento
- Tela de confirmação de pedido
- Simulação de processamento de pagamento

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Instalação e Execução

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar versão de produção
pnpm start
```

O projeto estará disponível em: `http://localhost:3000`

## 📱 Fluxo da Aplicação

### 1. Redirecionamento Automático

- A página inicial (`/`) redireciona automaticamente para `/checkout`
- Interface limpa e focada apenas no teste de checkout

### 2. Página de Checkout (`/checkout`)

- **Formulário de Dados Pessoais**: Email e CPF com validação
- **Seleção de Pagamento**:
  - PIX (0% taxa, aprovação instantânea)
  - Cartão de Crédito (3,99% taxa, até 12x)
- **Resumo do Pedido**: Cálculo dinâmico de valores e taxas
- **Responsivo**: Layout adaptado para mobile e desktop

### 3. Página de Sucesso (`/success`)

- Confirmação de pedido criado
- Detalhes do pagamento processado
- Código PIX (quando aplicável)
- Status de processamento

## 🛠️ Decisões Técnicas

### Arquitetura

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **React Hook Form** com validação Zod
- **Lucide React** para ícones

### Estrutura de Componentes

```
app/
├── page.tsx              # Redirecionamento para checkout
├── checkout/page.tsx     # Fluxo principal de checkout
└── success/page.tsx      # Confirmação de pedido

components/
├── ui/                   # Componentes base reutilizáveis
└── layout/               # Container e layouts simples

features/checkout/         # Componentes específicos do checkout
├── CheckoutForm.tsx      # Formulário principal
├── PaymentOptions.tsx    # Seleção de pagamento
├── Summary.tsx           # Resumo do pedido
└── SuccessState.tsx      # Estado de sucesso

lib/                      # Utilitários
├── currency.ts           # Formatação de valores
├── taxes.ts              # Cálculo de taxas
└── cpf.ts                # Validação de CPF
```

### Funcionalidades Implementadas

- ✅ Validação de CPF em tempo real
- ✅ Cálculo dinâmico de taxas por método de pagamento
- ✅ Simulação de parcelamento no cartão
- ✅ Máscara de entrada para CPF
- ✅ Estados de loading e submissão
- ✅ Design responsivo
- ✅ Interface em português

### Dados Mockados

- Produto: "Curso de Marketing Digital 2025" por João Silva (R$ 297,00)
- Formato: Digital com entrega imediata
- Taxas: PIX (0%), Cartão (3,99%)
- Simulação de processamento com delay de 2s
- Geração de ID de pedido único

## 🎨 Interface

### Design System

- **Cores**: Paleta escura com acentos em azul
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Cards, badges, botões com estados
- **Feedback Visual**: Loading states, validações, confirmações

### Responsividade

- Layout adaptativo para mobile e desktop
- Resumo do pedido em sidebar (desktop) ou seção separada (mobile)
- Navegação otimizada para touch

## 📋 Avaliação Técnica

Este projeto demonstra:

1. **Organização de Código**: Estrutura modular e componentização
2. **TypeScript**: Tipagem forte e interfaces bem definidas
3. **Validação**: Formulários com validação robusta
4. **UX/UI**: Interface intuitiva e responsiva
5. **Performance**: Otimizações de React e Next.js
6. **Manutenibilidade**: Código limpo e bem documentado

## 🔧 Scripts Disponíveis

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor de produção
pnpm lint         # Verificação de código
```
