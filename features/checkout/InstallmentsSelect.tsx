"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateInstallmentOptions } from "@/lib/taxes";
import { formatBRLFixed, formatPercentFixed } from "@/lib/currency";

interface InstallmentsSelectProps {
  value: number;
  onChange: (installments: number) => void;
  productValue: number;
}

export function InstallmentsSelect({
  value,
  onChange,
  productValue,
}: InstallmentsSelectProps) {
  const options = generateInstallmentOptions(productValue);

  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onChange(Number.parseInt(val))}
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
                    {formatBRLFixed(option.monthlyValue, 2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {option.value > 1 && (
                  <span className="text-text-secondary text-sm">
                    ({formatPercentFixed(option.rate, 2)})
                  </span>
                )}
                {option.value > 1 && (
                  <span className="text-text-secondary text-sm font-medium">
                    Total:{" "}
                    {formatBRLFixed(option.monthlyValue * option.value, 2)}
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
