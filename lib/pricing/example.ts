import Decimal from "decimal.js";
import { getPricing, getFormattedPricing, pricingService } from "./pricingService";

/**
 * Exemplo de uso do novo sistema de preços
 */
export function demonstratePricingSystem() {
  console.log("🚀 Sistema de Preços Avançado - Exemplo de Uso\n");

  // Exemplo 1: PIX (sem juros)
  console.log("1️⃣ PIX - Pagamento à vista");
  const pixPricing = getPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"), // Preço promocional
    paymentMethod: "pix",
    installments: 1,
  });

  const pixFormatted = getFormattedPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"),
    paymentMethod: "pix",
    installments: 1,
  });

  console.log(`   Preço original: ${pixFormatted.originalValue}`);
  console.log(`   Preço atual: ${pixFormatted.effectiveValue}`);
  console.log(`   Total a pagar: ${pixFormatted.total}`);
  console.log(`   Economia: ${pixFormatted.savings}`);
  console.log(`   Taxa: ${pixFormatted.rate}`);
  console.log(`   Válido: ${pixPricing.isValid ? "✅" : "❌"}\n`);

  // Exemplo 2: Cartão 1x (com juros)
  console.log("2️⃣ Cartão - 1x com juros");
  const card1xPricing = getPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"),
    paymentMethod: "card",
    installments: 1,
  });

  const card1xFormatted = getFormattedPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"),
    paymentMethod: "card",
    installments: 1,
  });

  console.log(`   Preço original: ${card1xFormatted.originalValue}`);
  console.log(`   Preço atual: ${card1xFormatted.effectiveValue}`);
  console.log(`   Total a pagar: ${card1xFormatted.total}`);
  console.log(`   Taxa: ${card1xFormatted.rate}`);
  console.log(`   Válido: ${card1xPricing.isValid ? "✅" : "❌"}\n`);

  // Exemplo 3: Cartão 3x (com juros)
  console.log("3️⃣ Cartão - 3x com juros");
  const card3xPricing = getPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"),
    paymentMethod: "card",
    installments: 3,
  });

  const card3xFormatted = getFormattedPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"),
    paymentMethod: "card",
    installments: 3,
  });

  console.log(`   Preço original: ${card3xFormatted.originalValue}`);
  console.log(`   Preço atual: ${card3xFormatted.effectiveValue}`);
  console.log(`   Total a pagar: ${card3xFormatted.total}`);
  console.log(`   Parcela: ${card3xFormatted.monthlyValue}`);
  console.log(`   Taxa: ${card3xFormatted.rate}`);
  console.log(`   Válido: ${card3xPricing.isValid ? "✅" : "❌"}\n`);

  // Exemplo 4: Cartão 11x (alta taxa)
  console.log("4️⃣ Cartão - 11x com alta taxa");
  const card11xPricing = getPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"),
    paymentMethod: "card",
    installments: 11,
  });

  const card11xFormatted = getFormattedPricing({
    originalValue: new Decimal("397.00"),
    currentValue: new Decimal("297.00"),
    paymentMethod: "card",
    installments: 11,
  });

  console.log(`   Preço original: ${card11xFormatted.originalValue}`);
  console.log(`   Preço atual: ${card11xFormatted.effectiveValue}`);
  console.log(`   Total a pagar: ${card11xFormatted.total}`);
  console.log(`   Parcela: ${card11xFormatted.monthlyValue}`);
  console.log(`   Taxa: ${card11xFormatted.rate}`);
  console.log(`   Válido: ${card11xPricing.isValid ? "✅" : "❌"}\n`);

  // Exemplo 5: Opções de parcelamento
  console.log("5️⃣ Opções de Parcelamento");
  const installmentOptions = card3xPricing.installmentOptions;
  console.log(`   Total de opções: ${installmentOptions.length}`);
  
  installmentOptions.slice(0, 5).forEach((option, index) => {
    const formatted = getFormattedPricing({
      originalValue: new Decimal("397.00"),
      currentValue: new Decimal("297.00"),
      paymentMethod: "card",
      installments: option.value,
    });
    
    console.log(`   ${option.label} ${formatted.monthlyValue} (${formatted.rate})`);
  });
  console.log("   ...\n");

  // Exemplo 6: Cache e performance
  console.log("6️⃣ Cache e Performance");
  const cacheStats = pricingService.getCacheStats();
  console.log(`   Itens em cache: ${cacheStats.size}`);
  console.log(`   Chaves: ${cacheStats.keys.slice(0, 3).join(", ")}...\n`);

  // Exemplo 7: Validação de entrada
  console.log("7️⃣ Validação de Entrada");
  const invalidPricing = getPricing({
    originalValue: new Decimal("100.00"),
    currentValue: new Decimal("100.00"),
    paymentMethod: "card",
    installments: 15, // Muitas parcelas
  });

  console.log(`   Parcelas: 15`);
  console.log(`   Válido: ${invalidPricing.isValid ? "✅" : "❌"}`);
  console.log(`   Motivo: ${invalidPricing.validationReason}\n`);

  // Exemplo 8: Comparação de métodos
  console.log("8️⃣ Comparação de Métodos");
  const methods = ["pix", "card"] as const;
  const installments = [1, 3, 6, 12];
  
  console.log("   Método | Parcelas | Total     | Taxa      | Válido");
  console.log("   -------|----------|-----------|-----------|--------");
  
  methods.forEach(method => {
    installments.forEach(inst => {
      const pricing = getPricing({
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: method,
        installments: inst,
      });
      
      const formatted = getFormattedPricing({
        originalValue: new Decimal("297.00"),
        currentValue: new Decimal("297.00"),
        paymentMethod: method,
        installments: inst,
      });
      
      console.log(`   ${method.toUpperCase().padEnd(6)} | ${inst.toString().padEnd(8)} | ${formatted.total.padEnd(9)} | ${formatted.rate.padEnd(9)} | ${pricing.isValid ? "✅" : "❌"}`);
    });
  });

  console.log("\n✨ Sistema de preços implementado com sucesso!");
  console.log("   • Precisão decimal com Big/Decimal");
  console.log("   • Single source of truth");
  console.log("   • Testes unitários completos");
  console.log("   • Parcela mínima e última parcela ajustada");
  console.log("   • Formatadores centralizados e memoização");
  console.log("   • Cache inteligente para performance");
}

// Executar exemplo se chamado diretamente
if (require.main === module) {
  demonstratePricingSystem();
}
