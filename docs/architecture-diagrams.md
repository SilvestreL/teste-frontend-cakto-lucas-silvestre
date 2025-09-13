# Diagramas de Arquitetura - Cakto Frontend

## 🏗️ Arquitetura Geral do Sistema

```mermaid
graph TB
    A[Usuário] --> B[Next.js App Router]
    B --> C[Layout Root]
    C --> D[Homepage]
    C --> E[Checkout Page]
    C --> F[Success Page]

    E --> G[CheckoutForm]
    E --> H[Summary]
    E --> I[MobileSummary]

    G --> J[PaymentOptions]
    G --> K[InstallmentsSelect]

    L[Components/UI] --> G
    L --> H
    L --> I

    M[Features/Checkout] --> G
    M --> H
    M --> I

    N[Lib/Utils] --> G
    N --> H
    N --> I

    O[Types] --> G
    O --> H
    O --> I

    P[Mocks] --> G
    P --> H
    P --> I
    P --> E
    P --> F
```

## 🔄 Fluxo de Dados do Checkout

```mermaid
sequenceDiagram
    participant U as Usuário
    participant CF as CheckoutForm
    participant PO as PaymentOptions
    participant IS as InstallmentsSelect
    participant S as Summary
    participant API as API/Backend

    U->>CF: Preenche email
    CF->>S: Atualiza dados
    S->>S: Recalcula valores

    U->>CF: Preenche CPF
    CF->>CF: Valida CPF
    CF->>S: Atualiza dados

    U->>PO: Seleciona método de pagamento
    PO->>CF: Notifica mudança
    CF->>IS: Atualiza opções de parcelamento
    CF->>S: Atualiza resumo

    U->>IS: Seleciona parcelas
    IS->>CF: Notifica mudança
    CF->>S: Recalcula valores

    U->>CF: Submete formulário
    CF->>CF: Valida dados
    CF->>API: Envia dados
    API-->>CF: Confirma pagamento
    CF->>U: Redireciona para sucesso
```

## 🎨 Estrutura de Componentes

```mermaid
graph TD
    A[App Layout] --> B[Navbar]
    A --> C[Container]
    A --> D[Footer]

    E[Homepage] --> F[PaymentGrid]
    E --> G[FeatureCard]

    H[Checkout Page] --> I[CheckoutForm]
    H --> J[Summary]
    H --> K[MobileSummary]

    I --> L[PaymentOptions]
    I --> M[InstallmentsSelect]

    N[UI Components] --> O[Button]
    N --> P[Card]
    N --> Q[Input]
    N --> R[Badge]
    N --> S[Separator]

    T[Features] --> I
    T --> J
    T --> K
    T --> L
    T --> M
```

## 💰 Sistema de Cálculos

```mermaid
flowchart TD
    A[Valor do Produto] --> B{Método de Pagamento}
    B -->|PIX| C[Taxa: 0%]
    B -->|Cartão| D[Taxa: 3.99% + 2% por parcela extra]

    C --> E[Total = Valor Original]
    D --> F[Total = Valor × (1 + Taxa)]

    E --> G[Valor Líquido = Valor Original]
    F --> H[Valor Líquido = Valor Original - Taxa]

    I[Parcelas] --> J[Valor da Parcela = Total ÷ Parcelas]

    G --> K[Resumo Final]
    H --> K
    J --> K
```

## 📱 Responsividade

```mermaid
graph LR
    A[Mobile < 768px] --> B[MobileSummary]
    A --> C[Stack Layout]
    A --> D[Touch-friendly UI]

    E[Tablet 768-1024px] --> F[Grid 2 Colunas]
    E --> G[Medium Components]

    H[Desktop > 1024px] --> I[Summary Sidebar]
    H --> J[Grid 3 Colunas]
    H --> K[Full Features]

    L[Breakpoints] --> A
    L --> E
    L --> H
```

## 🔒 Validações e Segurança

```mermaid
flowchart TD
    A[Input do Usuário] --> B[React Hook Form]
    B --> C[Zod Schema]
    C --> D{Validação}

    D -->|Email| E[Regex Email]
    D -->|CPF| F[Validação Matemática]
    D -->|Método| G[Enum Restrito]
    D -->|Parcelas| H[Range 1-12]

    E --> I[Validação Passou?]
    F --> I
    G --> I
    H --> I

    I -->|Sim| J[Permite Submit]
    I -->|Não| K[Mostra Erro]

    K --> L[Feedback Visual]
    L --> A
```

## 🚀 Deploy e Build

```mermaid
graph TD
    A[Desenvolvimento] --> B[pnpm dev]
    B --> C[Next.js Dev Server]
    C --> D[Hot Reload]

    E[Build] --> F[pnpm build]
    F --> G[Next.js Build]
    G --> H[Static Generation]
    H --> I[Optimized Assets]

    J[Produção] --> K[pnpm start]
    K --> L[Next.js Server]
    L --> M[Static Files]
    L --> N[API Routes]

    O[Deploy] --> P[Vercel]
    P --> Q[CDN Global]
    Q --> R[Edge Functions]
```

## 📊 Monitoramento e Analytics

```mermaid
graph TD
    A[User Interaction] --> B[Vercel Analytics]
    A --> C[Custom Events]

    B --> D[Performance Metrics]
    B --> E[User Behavior]

    C --> F[Conversion Tracking]
    C --> G[Error Tracking]

    D --> H[Dashboard]
    E --> H
    F --> H
    G --> H

    H --> I[Insights]
    I --> J[Optimizations]
```

## 📦 Estrutura de Mocks

```mermaid
graph TD
    A[Mocks/] --> B[products.ts]
    A --> C[payment-methods.ts]
    A --> D[features.ts]
    A --> E[navigation.ts]
    A --> F[index.ts]

    B --> G[Produtos Mockados]
    B --> H[Funções Auxiliares]
    B --> I[ID de Pedidos]

    C --> J[Métodos de Pagamento]
    C --> K[Taxas e Configurações]
    C --> L[Ícones e Descrições]

    D --> M[Funcionalidades]
    D --> N[Ícones e Títulos]
    D --> O[Categorização]

    E --> P[Links de Navegação]
    E --> Q[Configuração da Marca]
    E --> R[Links Externos]

    F --> S[Exportações Centralizadas]
    F --> T[Re-exportações Úteis]
    F --> U[API Unificada]

    V[Componentes] --> F
    W[Pages] --> F
    X[Features] --> F
```

## 🧪 Estrutura de Testes

```mermaid
graph TD
    A[Testes Unitários] --> B[lib/taxes.ts]
    A --> C[lib/cpf.ts]
    A --> D[lib/currency.ts]

    E[Testes de Componentes] --> F[CheckoutForm]
    E --> G[Summary]
    E --> H[PaymentOptions]

    I[Testes de Integração] --> J[Fluxo Completo]
    I --> K[Validações]
    I --> L[Navegação]

    M[Vitest] --> A
    M --> E
    M --> I

    N[Coverage] --> O[100% Utils]
    N --> P[80% Components]
    N --> Q[60% Pages]
```

---

_Estes diagramas representam a arquitetura atual do sistema Cakto e podem ser atualizados conforme o projeto evolui._
