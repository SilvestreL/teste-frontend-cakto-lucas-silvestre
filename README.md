# Teste Front-End Cakto - Lucas Silvestre

## Decisões Técnicas

Optei por uma arquitetura baseada em Next.js 14 com App Router para aproveitar as funcionalidades modernas de React Server Components e streaming. A escolha do TypeScript garante type safety e melhor experiência de desenvolvimento, enquanto o Tailwind CSS oferece estilização eficiente e responsiva. Implementei uma estrutura modular com separação clara entre componentes de UI reutilizáveis (`components/ui/`) e features específicas (`features/checkout/`), facilitando manutenção e escalabilidade.

Para o gerenciamento de estado, utilizei Zustand por sua simplicidade e performance superior ao Redux para este caso de uso. A validação de formulários foi implementada com React Hook Form + Zod, proporcionando validação robusta tanto no cliente quanto no servidor. O sistema de pricing foi desenvolvido com uma arquitetura flexível que permite fácil adição de novas regras de cálculo e métodos de pagamento, seguindo princípios SOLID e design patterns como Strategy.

A containerização com Docker foi implementada para facilitar a execução do projeto, eliminando a necessidade de instalação local de dependências. Isso garante que qualquer pessoa possa executar a aplicação com um simples comando, melhorando significativamente a experiência de avaliação e deploy.

## Como Executar

### Opção 1: Docker (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/teste-frontend-cakto-Lucas-Silvestre.git
cd teste-frontend-cakto-Lucas-Silvestre

# Executar com Docker
./docker-scripts.sh start
```

### Opção 2: Local

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev
```

A aplicação estará disponível em: `http://localhost:3000`

## Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar testes no container Docker
./docker-scripts.sh test
```

## Resposta Bônus

**"Se tivesse mais tempo, o que você faria para aumentar a conversão deste checkout?"**

Para aumentar a conversão, implementaria as seguintes otimizações:

**1. Elementos de Urgência e Escassez:** Adicionaria um contador regressivo para ofertas limitadas, indicadores de "últimas vagas disponíveis" e badges de "mais vendido" ou "recomendado". Implementaria também notificações de "X pessoas visualizando este produto agora".

**2. Social Proof Avançado:** Criaria uma seção com depoimentos de clientes reais, logos de empresas que usam o produto, contadores de alunos formados e avaliações com estrelas. Adicionaria também uma seção de "Últimas compras" mostrando transações recentes (com dados anonimizados).

**3. Garantias e Redução de Risco:** Implementaria badges de "Garantia de 30 dias", "Suporte 24/7", "Certificado de conclusão" e "Acesso vitalício". Adicionaria também uma seção de FAQ destacando objeções comuns e suas respostas.

**4. Otimização de UX:** Criaria um processo de checkout em etapas (steps) com progress bar, salvamento automático do progresso, opções de pagamento mais visíveis (especialmente PIX com QR Code), e um resumo mais detalhado com benefícios do produto.

**5. Personalização e Segmentação:** Implementaria diferentes versões do checkout baseadas no perfil do usuário, ofertas personalizadas baseadas em comportamento, e testes A/B para diferentes layouts e copywriting.

---

## 🐳 Containerização

Este projeto inclui configuração simples de Docker para facilitar a execução:

- **Dockerfile.dev**: Configuração para desenvolvimento
- **docker-compose.yml**: Orquestração de serviços
- **Scripts auxiliares**: `docker-scripts.sh` para facilitar o uso

### Vantagens da Containerização

- ✅ **Instalação zero**: Não precisa instalar Node.js ou pnpm
- ✅ **Ambiente isolado**: Não interfere com outras aplicações
- ✅ **Hot reload**: Mudanças no código são refletidas automaticamente
- ✅ **Comando simples**: Apenas `./docker-scripts.sh start`

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

## 🛠️ Decisões Técnicas Detalhadas

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
pnpm test         # Executar testes
pnpm test:coverage # Testes com coverage
```