"use client";

import { memo } from "react";
import { Clock } from "lucide-react";
import { useCountdown } from "@/lib/hooks/useCountdown";

interface CountdownTimerClientProps {
  initialMinutes: number;
  inline?: boolean;
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * CountdownTimer isolado e memoizado que não força re-renders no componente pai.
 *
 * Regras:
 * - Apenas props primitivas (sem objetos inline)
 * - Memoizado para evitar re-renders desnecessários
 * - Isolado em seu próprio estado de timer
 */
export const CountdownTimerClient = memo(function CountdownTimerClient({
  initialMinutes,
  inline = false,
  showIcon = true,
  iconSize = "md",
  className = "",
}: CountdownTimerClientProps) {
  const { minutes, seconds, isExpired } = useCountdown(initialMinutes);

  // Formatação do tempo
  const timeLeft = `${String(minutes || 0).padStart(2, "0")}:${String(
    seconds || 0
  ).padStart(2, "0")}`;

  // Tamanhos do ícone (primitivos para evitar objetos inline)
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (isExpired) {
    return (
      <span className={`text-xs text-red-300/80 font-medium ${className}`}>
        ⚠ Oferta encerrada
      </span>
    );
  }

  if (inline) {
    return (
      <span
        className={`tabular-nums ${className}`}
        style={{ fontFeatureSettings: "'tnum' 1" }}
      >
        {timeLeft}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {showIcon && <Clock className={iconSizes[iconSize]} />}
      <span
        className="tabular-nums"
        style={{ fontFeatureSettings: "'tnum' 1" }}
      >
        {timeLeft}
      </span>
    </div>
  );
});
