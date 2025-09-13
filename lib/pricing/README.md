# Sistema de Preços Avançado

Sistema robusto e preciso para cálculos de preços, taxas e parcelamentos com foco em performance e confiabilidade.

## 🚀 Características

- **Precisão Decimal**: Usa `decimal.js` para evitar erros de ponto flutuante
- **Single Source of Truth**: Regras centralizadas e consistentes
- **Testes Unitários**: Cobertura completa de todas as regras
- **Parcela Ajustada**: Última parcela ajustada para divisões exatas
- **Formatação Centralizada**: Formatadores com memoização
- **Cache Inteligente**: Performance otimizada com cache
- **Validação Robusta**: Validação de entrada e regras de negócio

## 📁 Estrutura

```
lib/pricing/
├── pricingRules.ts      # Regras de preços e cálculos
├── formatters.ts        # Formatadores com memoização
├── pricingService.ts    # Serviço centralizado (Singleton)
├── index.ts            # Exports centralizados
├── example.ts          # Exemplos de uso
├── README.md           # Documentação
└── __tests__/          # Testes unitários
    ├── pricingRules.test.ts
    └── pricingService.test.ts
```

## 🔧 Uso Básico

### Importação

```typescript
import { getPricing, getFormattedPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
```

### Cálculo de Preços

```typescript
// PIX - Sem juros
const pixPricing = getPricing({
  originalValue: new Decimal("397.00"),
  currentValue: new Decimal("297.00"),
  paymentMethod: "pix",
  installments: 1,
});

// Cartão - Com juros
const cardPricing = getPricing({
  originalValue: new Decimal("397.00"),
  currentValue: new Decimal("297.00"),
  paymentMethod: "card",
  installments: 3,
});
```

### Formatação

```typescript
const formatted = getFormattedPricing({
  originalValue: new Decimal("397.00"),
  currentValue: new Decimal("297.00"),
  paymentMethod: "card",
  installments: 3,
});

console.log(formatted.total); // "R$ 320,73"
console.log(formatted.monthlyValue); // "R$ 106,00"
console.log(formatted.rate); // "7,99% (taxa moderada)"
```

## 📊 Regras de Preços

### PIX

- **Taxa**: 0% (sempre)
- **Parcelas**: 1x apenas
- **Validação**: Sempre válido

### Cartão de Crédito

- **Taxa Base**: 3,99% (1x)
- **Taxa Adicional**: 2% por parcela extra
- **Parcelas**: 1x a 12x
- **Parcela Mínima**: R$ 5,00
- **Validação**: Verifica limite de parcelas e valor mínimo

### Fórmulas

```typescript
// Taxa para cartão
rate = baseRate + (additionalRate × (installments - 1))

// Total a pagar
total = value × (1 + rate)

// Parcela (com ajuste)
monthlyValue = total ÷ installments
lastValue = total - (monthlyValue × (installments - 1))
```

## 🧪 Testes

```bash
# Executar todos os testes
pnpm vitest run lib/pricing

# Executar com watch
pnpm vitest lib/pricing

# Executar exemplo
pnpm tsx lib/pricing/example.ts
```

## 📈 Performance

### Cache

- **Formatação**: Cache automático de valores formatados
- **Cálculos**: Cache de resultados de preços
- **Limpeza**: `pricingService.clearCache()`

### Memoização

- **Formatadores**: Evita recálculos desnecessários
- **Validação**: Cache de validações
- **Opções**: Cache de opções de parcelamento

## 🔍 Validação

### Regras de Validação

- **Parcelas**: 1 ≤ installments ≤ 12
- **Valor Mínimo**: Parcela ≥ R$ 5,00
- **Método**: "pix" ou "card"
- **Valores**: Positivos e válidos

### Exemplo de Validação

```typescript
const pricing = getPricing({
  originalValue: new Decimal("100.00"),
  currentValue: new Decimal("100.00"),
  paymentMethod: "card",
  installments: 15, // Inválido
});

console.log(pricing.isValid); // false
console.log(pricing.validationReason); // "Máximo de 12 parcelas"
```

## 🎯 Exemplos Avançados

### Comparação de Métodos

```typescript
const methods = ["pix", "card"] as const;
const installments = [1, 3, 6, 12];

methods.forEach((method) => {
  installments.forEach((inst) => {
    const pricing = getPricing({
      originalValue: new Decimal("297.00"),
      currentValue: new Decimal("297.00"),
      paymentMethod: method,
      installments: inst,
    });

    console.log(`${method} ${inst}x: ${pricing.total}`);
  });
});
```

### Opções de Parcelamento

```typescript
const pricing = getPricing({
  originalValue: new Decimal("297.00"),
  currentValue: new Decimal("297.00"),
  paymentMethod: "card",
  installments: 1,
  includeInstallmentOptions: true,
});

pricing.installmentOptions.forEach((option) => {
  console.log(`${option.label} ${option.monthlyValue} (${option.rate})`);
});
```

## 🔄 Migração

### Antes (taxes.ts)

```typescript
import { calcRate, calcTotal } from "@/lib/taxes";

const rate = calcRate("card", 3);
const total = calcTotal(297, rate);
```

### Depois (pricing/)

```typescript
import { getPricing } from "@/lib/pricing";

const pricing = getPricing({
  originalValue: new Decimal("297.00"),
  currentValue: new Decimal("297.00"),
  paymentMethod: "card",
  installments: 3,
});

const total = pricing.total;
```

## 🛠️ Configuração

### Regras Personalizadas

```typescript
// Em pricingRules.ts
export const PRICING_RULES: PricingConfig = {
  rules: [
    {
      method: "pix",
      baseRate: new Decimal(0),
      additionalRatePerInstallment: new Decimal(0),
      minInstallmentValue: new Decimal(0),
      maxInstallments: 1,
    },
    {
      method: "card",
      baseRate: new Decimal("0.0399"), // 3,99%
      additionalRatePerInstallment: new Decimal("0.02"), // 2%
      minInstallmentValue: new Decimal("5.00"), // R$ 5,00
      maxInstallments: 12,
    },
  ],
  currency: {
    symbol: "R$",
    code: "BRL",
    decimals: 2,
  },
};
```

## 📝 Logs e Debug

### Estatísticas de Cache

```typescript
const stats = pricingService.getCacheStats();
console.log(`Cache size: ${stats.size}`);
console.log(`Keys: ${stats.keys.join(", ")}`);
```

### Limpeza de Cache

```typescript
// Limpar cache de preços
pricingService.clearCache();

// Limpar cache de formatação
import { clearFormatCache } from "@/lib/pricing";
clearFormatCache();
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de precisão decimal**

   - Use `Decimal` ao invés de `number`
   - Configure precisão: `Decimal.set({ precision: 10 })`

2. **Cache não atualiza**

   - Limpe o cache: `pricingService.clearCache()`
   - Verifique se os parâmetros mudaram

3. **Validação falha**
   - Verifique `pricing.isValid`
   - Leia `pricing.validationReason`

### Debug

```typescript
// Habilitar logs detalhados
const pricing = getPricing(input);
console.log("Pricing result:", {
  isValid: pricing.isValid,
  validationReason: pricing.validationReason,
  rate: pricing.rate.toString(),
  total: pricing.total.toString(),
});
```

## 📚 Referências

- [Decimal.js](https://mikemcl.github.io/decimal.js/) - Biblioteca de precisão decimal
- [Vitest](https://vitest.dev/) - Framework de testes
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação

---

**Desenvolvido com ❤️ para máxima precisão e performance**
