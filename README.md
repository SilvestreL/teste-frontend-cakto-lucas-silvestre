# Teste Front-End Cakto - Lucas Silvestre

## Decisões Técnicas

Optei por uma arquitetura baseada em Next.js 14 com App Router para aproveitar as funcionalidades modernas de React Server Components e streaming. Implementei uma estrutura modular com separação clara entre componentes de UI reutilizáveis (`components/ui/`) e features específicas (`features/checkout/`), facilitando manutenção e escalabilidade.

Para o gerenciamento de estado, utilizei Zustand por sua simplicidade e performance superior ao Redux para este caso de uso. A validação de formulários foi implementada com React Hook Form + Zod, proporcionando validação robusta tanto no cliente quanto no servidor. O sistema de pricing foi desenvolvido com uma arquitetura flexível que permite fácil adição de novas regras de cálculo e métodos de pagamento, seguindo princípios SOLID e design patterns como Strategy.

A containerização com Docker foi implementada para facilitar a execução do projeto, eliminando a necessidade de instalação local de dependências. Isso garante que qualquer pessoa possa executar a aplicação com um simples comando, melhorando significativamente a experiência de avaliação e deploy.

## Como Executar

### Opção 1: Local (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/SilvestreL/checkoutpage-next.git
cd checkoutpage-next

# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev
```

### Opção 2: Docker

```bash
# Executar com Docker
./docker-scripts.sh start
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
outr

---

## 🐳 Containerização

Este projeto utiliza Docker para garantir consistência, isolamento e facilidade na execução em diferentes ambientes.

Estrutura
	•	Dockerfile.dev – Configuração otimizada para ambiente de desenvolvimento.
	•	docker-compose.yml – Orquestração dos serviços necessários.
	•	docker-scripts.sh – Script utilitário para padronizar os comandos mais usados.

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
### Patterns

1. Singleton + Strategy Pattern
Destaque: Combinação elegante para sistema de pricing
Impacto: Demonstra conhecimento em patterns fundamentais
Relevância: Resolve problema real de negócio

3. Server/Client Component Separation
Destaque: Arquitetura moderna do Next.js 14
Impacto: Mostra domínio das funcionalidades mais avançadas
Relevância: Performance e SEO otimizados

4. State Management + Custom Hooks
Destaque: Performance otimizada com Zustand
Impacto: Demonstra conhecimento em otimização
Relevância: Reutilização de lógica e evitar re-renders

### Funcionalidades Implementadas

- ✅ Validação de CPF em tempo real
- ✅ Cálculo dinâmico de taxas por método de pagamento
- ✅ Simulação de parcelamento no cartão
- ✅ Máscara de entrada para CPF
- ✅ Estados de loading e submissão
- ✅ Design responsivo
- ✅ Interface em português

## 🎨 Interface

### Responsividade

- Layout adaptativo para mobile e desktop
- Resumo do pedido em sidebar (desktop) ou seção separada (mobile)
- Navegação otimizada para touch

## 🔧 Scripts Disponíveis

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor de produção
pnpm lint         # Verificação de código
pnpm test         # Executar testes
pnpm test:coverage # Testes com coverage
```
