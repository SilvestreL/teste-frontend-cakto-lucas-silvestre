# 📱 Responsive Design - Cakto Frontend

## 🎯 Visão Geral

O projeto Cakto implementa uma estratégia **Mobile-First** robusta, utilizando Tailwind CSS para criar interfaces responsivas que se adaptam perfeitamente a diferentes tamanhos de tela e dispositivos.

## 📏 Breakpoints Definidos

### **Sistema de Breakpoints Tailwind CSS**

```css
/* Breakpoints padrão do Tailwind */
sm: 640px   /* Mobile grande */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

### **Breakpoints Customizados**

```css
/* Breakpoints específicos do Cakto */
mobile: < 768px      /* Smartphones */
tablet: 768px - 1024px  /* Tablets */
desktop: > 1024px    /* Desktops */
```

## 🏗️ Estratégia Mobile-First

### **1. Abordagem de Design**

- **Base**: Design otimizado para mobile
- **Expansão**: Melhorias progressivas para telas maiores
- **Performance**: Carregamento otimizado para dispositivos móveis

### **2. Tipografia Responsiva**

```css
/* Título principal - escala fluida */
.text-display {
  font-size: clamp(2rem, 4vw, 3.5rem); /* 32px → 56px */
  line-height: 1.05;
  font-weight: 800;
}

/* Hierarquia de títulos */
.text-h1 {
  font-size: 2rem; /* 32px */
  line-height: 1.1;
  font-weight: 800;
}

.text-h2 {
  font-size: 1.5rem; /* 24px */
  line-height: 1.2;
  font-weight: 700;
}

.text-h3 {
  font-size: 1.25rem; /* 20px */
  line-height: 1.25;
  font-weight: 700;
}
```

## 📦 Sistema de Container Responsivo

### **Container Component**

```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-2xl", // 672px
  md: "max-w-4xl", // 896px
  lg: "max-w-6xl", // 1152px
  xl: "max-w-7xl", // 1280px
};

// Padding responsivo
className = "mx-auto px-4 md:px-6 lg:px-8";
```

### **Uso do Container**

```typescript
<Container size="lg" className="py-6 lg:py-8">
  {/* Conteúdo responsivo */}
</Container>
```

## 🎨 Sistema de Grid Responsivo

### **1. Homepage - Métodos de Pagamento**

```typescript
// Grid adaptativo: 1 → 2 → 3 → 4 colunas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {mockPaymentMethods.map((method) => (
    <PaymentMethodCard key={method.id} {...method} />
  ))}
</div>
```

### **2. Homepage - Funcionalidades**

```typescript
// Grid adaptativo: 1 → 3 colunas
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {mockFeatures.slice(0, 3).map((feature) => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</div>
```

### **3. Checkout - Layout Principal**

```typescript
// Grid adaptativo: 1 coluna → 5 colunas (3 + 2)
<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
  {/* Formulário - 3 colunas no desktop */}
  <div className="lg:col-span-3 space-y-6">
    <CheckoutForm {...props} />
  </div>

  {/* Resumo - 2 colunas no desktop, oculto no mobile */}
  <div className="hidden lg:block lg:col-span-2">
    <Summary {...props} />
  </div>
</div>
```

## 📱 Componentes Condicionais

### **1. MobileSummary vs Summary**

```typescript
{
  /* Mobile: Resumo colapsível no topo */
}
<div className="lg:hidden">
  <MobileSummary product={defaultProduct} formData={formData} />
</div>;

{
  /* Desktop: Resumo fixo na sidebar */
}
<div className="hidden lg:block lg:col-span-2">
  <div className="sticky top-24">
    <Summary product={defaultProduct} formData={formData} />
  </div>
</div>;
```

### **2. Navegação Responsiva**

```typescript
{
  /* Desktop: Menu horizontal */
}
<div className="hidden md:flex items-center space-x-8">
  {mockNavLinks.map((link) => (
    <Link key={link.href} href={link.href}>
      {link.label}
    </Link>
  ))}
</div>;

{
  /* Mobile: Menu hambúrguer */
}
<button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
</button>;

{
  /* Mobile: Menu dropdown */
}
{
  isOpen && (
    <div className="md:hidden py-4 border-t border-border">
      {/* Links do menu mobile */}
    </div>
  );
}
```

## 📐 Espaçamentos Responsivos

### **1. Padding e Margin**

```typescript
// Padding vertical responsivo
<section className="py-12 md:py-24 lg:py-32">

// Padding horizontal responsivo
<Container className="px-4 md:px-6 lg:px-8">

// Gaps responsivos
<div className="gap-6 lg:gap-8">
```

### **2. Flexbox Responsivo**

```typescript
// Botões: empilhados no mobile, lado a lado no desktop
<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  <Button>Testar checkout</Button>
  <Button variant="outline">Criar conta</Button>
</div>
```

## 🎯 Estrutura por Dispositivo

### **📱 Mobile (< 768px)**

#### **Características:**

- **Layout**: 1 coluna para todos os grids
- **Navegação**: Menu hambúrguer
- **Resumo**: MobileSummary colapsível
- **Padding**: Reduzido (px-4)
- **Botões**: Empilhados verticalmente
- **Tipografia**: Tamanhos menores

#### **Componentes Específicos:**

```typescript
// MobileSummary - Resumo colapsível
<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger>
    <Button variant="ghost" className="w-full">
      {/* Preview do resumo */}
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent>{/* Detalhes completos */}</CollapsibleContent>
</Collapsible>
```

### **📱 Tablet (768px - 1024px)**

#### **Características:**

- **Layout**: 2-3 colunas para grids
- **Navegação**: Menu horizontal aparece
- **Padding**: Médio (px-6)
- **Botões**: Lado a lado (sm:flex-row)
- **Tipografia**: Tamanhos intermediários

#### **Exemplos:**

```typescript
// Grid de métodos de pagamento
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* 2 colunas no tablet */}
</div>

// Grid de funcionalidades
<div className="grid grid-cols-1 md:grid-cols-3">
  {/* 3 colunas no tablet */}
</div>
```

### **💻 Desktop (> 1024px)**

#### **Características:**

- **Layout**: 3-4 colunas para grids
- **Navegação**: Menu horizontal completo
- **Sidebar**: Resumo fixo no checkout
- **Padding**: Amplo (px-8)
- **Tipografia**: Tamanhos máximos

#### **Exemplos:**

```typescript
// Layout do checkout
<div className="grid grid-cols-1 lg:grid-cols-5">
  <div className="lg:col-span-3">{/* Formulário - 3 colunas */}</div>
  <div className="hidden lg:block lg:col-span-2">
    {/* Resumo - 2 colunas fixas */}
  </div>
</div>
```

## 🎨 Classes CSS Responsivas

### **1. Display Responsivo**

```css
/* Ocultar no mobile, mostrar no desktop */
.hidden lg:block

/* Mostrar no mobile, ocultar no desktop */
.block lg:hidden

/* Mostrar apenas no tablet */
.hidden md:block lg:hidden
```

### **2. Grid Responsivo**

```css
/* 1 coluna → 2 colunas → 3 colunas */
.grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* 1 coluna → 5 colunas */
.grid-cols-1 lg:grid-cols-5
```

### **3. Flexbox Responsivo**

```css
/* Coluna no mobile, linha no desktop */
.flex-col sm:flex-row

/* Centralizar no mobile, espaçar no desktop */
.justify-center lg:justify-between
```

### **4. Espaçamento Responsivo**

```css
/* Padding responsivo */
.p-4 md:p-6 lg:p-8

/* Gap responsivo */
.gap-4 md:gap-6 lg:gap-8

/* Margin responsivo */
.m-4 md:m-6 lg:m-8
```

## 🚀 Vantagens da Estrutura Atual

### **1. Performance**

- **Mobile-First**: Carregamento otimizado para dispositivos móveis
- **CSS Otimizado**: Apenas estilos necessários carregados
- **Imagens Responsivas**: Next.js Image com otimização automática

### **2. Experiência do Usuário**

- **Touch-Friendly**: Botões e elementos otimizados para toque
- **Navegação Intuitiva**: Menu adaptado para cada dispositivo
- **Conteúdo Acessível**: Informações organizadas por prioridade

### **3. Manutenibilidade**

- **Classes Tailwind**: Sistema consistente e previsível
- **Componentes Reutilizáveis**: Container e outros componentes modulares
- **Código Limpo**: Estrutura clara e bem organizada

### **4. Flexibilidade**

- **Breakpoints Customizáveis**: Fácil ajuste de pontos de quebra
- **Componentes Condicionais**: Lógica clara para diferentes dispositivos
- **Escalabilidade**: Fácil adicionar novos breakpoints

## 📋 Checklist de Responsividade

### **✅ Mobile (< 768px)**

- [ ] Layout em 1 coluna
- [ ] Menu hambúrguer funcional
- [ ] MobileSummary implementado
- [ ] Botões empilhados
- [ ] Padding reduzido (px-4)
- [ ] Touch targets adequados (44px+)

### **✅ Tablet (768px - 1024px)**

- [ ] Grid 2-3 colunas
- [ ] Menu horizontal visível
- [ ] Padding médio (px-6)
- [ ] Botões lado a lado
- [ ] Transições suaves

### **✅ Desktop (> 1024px)**

- [ ] Grid 3-4 colunas
- [ ] Sidebar fixa no checkout
- [ ] Padding amplo (px-8)
- [ ] Layout otimizado para mouse
- [ ] Hover states implementados

## 🔧 Ferramentas e Recursos

### **1. Tailwind CSS**

- **Breakpoints**: sm, md, lg, xl, 2xl
- **Grid System**: grid-cols-_, gap-_
- **Flexbox**: flex-col, flex-row, justify-_, items-_
- **Spacing**: p-_, m-_, space-\*

### **2. Next.js**

- **Image Optimization**: next/image
- **Font Optimization**: next/font
- **CSS Modules**: Suporte nativo

### **3. Componentes Customizados**

- **Container**: Sistema de larguras responsivas
- **MobileSummary**: Resumo colapsível para mobile
- **Navbar**: Navegação adaptativa

## 📚 Referências

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Mobile-First Design Principles](https://web.dev/responsive-web-design-basics/)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024  
**Mantenedor**: Equipe de Desenvolvimento Cakto
