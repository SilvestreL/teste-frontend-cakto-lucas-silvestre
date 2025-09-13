"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateInstallmentOptions } from "@/lib/taxes"
import { formatBRL } from "@/lib/currency"

interface InstallmentsSelectProps {
  value: number
  onChange: (installments: number) => void
  productValue: number
}

export function InstallmentsSelect({ value, onChange, productValue }: InstallmentsSelectProps) {
  const options = generateInstallmentOptions(productValue)

  return (
    <Select value={value.toString()} onValueChange={(val) => onChange(Number.parseInt(val))}>
      <SelectTrigger className="bg-surface-2 border-border text-text-primary">
        <SelectValue placeholder="Selecione o parcelamento" />
      </SelectTrigger>
      <SelectContent className="bg-surface border-border">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()} className="text-text-primary">
            <div className="flex items-center justify-between w-full">
              <span>
                {option.label} {option.value > 1 && formatBRL(option.monthlyValue)}
              </span>
              {option.value > 1 && <span className="text-text-secondary ml-2">({option.rate * 100}%)</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
