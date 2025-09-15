"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPricing } from "@/lib/pricing";
import Decimal from "decimal.js";
import { useCheckoutStore } from "@/lib/state/checkoutStore";
interface InstallmentsSelectProps {
  productValue: number;
  onChange?: (installments: number) => void;
}

export function InstallmentsSelect({
  productValue,
  onChange,
}: InstallmentsSelectProps) {
  // Usar selectors específicos para evitar re-renders desnecessários
  const installments = useCheckoutStore((state) => state.installments);
  // Usa o novo sistema de preços para obter opções precisas
  const pricing = getPricing({
    originalValue: new Decimal(productValue),
    currentValue: new Decimal(productValue),
    paymentMethod: "card",
    installments: 1,
    includeInstallmentOptions: true,
  });

  const options = pricing.installmentOptions;

  return (
    <Select
      value={installments.toString()}
      onValueChange={(val) => onChange?.(Number.parseInt(val))}
    >
      <SelectTrigger className="bg-surface-2 border-border text-text-primary">
        <SelectValue placeholder="Selecione o parcelamento" />
      </SelectTrigger>
      <SelectContent className="bg-surface border-border min-w-[380px]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            className="text-text-primary"
          >
            <div className="flex items-center justify-between w-full py-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{option.label}</span>
                {option.value > 1 && (
                  <span className="text-text-primary font-semibold">
                    {option.monthlyValue.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {option.value > 1 && (
                  <span className="text-text-secondary text-sm">
                    ({option.rate.mul(100).toFixed(2).replace(".", ",")}%)
                  </span>
                )}
                {option.value > 1 && (
                  <span className="text-text-secondary text-sm font-medium">
                    Total: {option.adjustedTotal.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
