"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";
import { useCountdown } from "@/lib/hooks/useCountdown";

interface CountdownTimerProps {
  initialMinutes?: number;
  className?: string;
  inline?: boolean;
}

export function CountdownTimer({
  initialMinutes = 10,
  className = "",
  inline = false,
}: CountdownTimerProps) {
  const { minutes, seconds, isExpired } = useCountdown(initialMinutes);

  // Determinar estado baseado no tempo restante
  const getTimerState = () => {
    if (isExpired) return "expired";
    if (minutes < 3) return "danger";
    if (minutes < 10) return "warning";
    return "neutral";
  };

  const getTimerStyles = () => {
    const state = getTimerState();

    switch (state) {
      case "danger":
        return "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse";
      case "warning":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "neutral":
        return "bg-brand/10 text-brand border-brand/20";
      default:
        return "bg-surface-2 text-text-secondary border-border";
    }
  };

  const getIcon = () => {
    const state = getTimerState();
    return state === "neutral" ? Zap : Clock;
  };

  const IconComponent = getIcon();

  if (isExpired) {
    if (inline) {
      return <span className="text-text-secondary">Tempo esgotado</span>;
    }
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Badge
          variant="secondary"
          className="bg-surface-2 text-text-secondary border-border text-xs px-2.5 py-1 h-auto"
        >
          <Clock className="h-3 w-3 mr-1.5" />
          Tempo esgotado — preço promocional indisponível
        </Badge>
      </div>
    );
  }

  if (inline) {
    return (
      <span
        className={`font-mono font-semibold ${className}`}
        aria-live="polite"
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Badge
        variant="secondary"
        className={`text-xs px-2.5 py-1 h-auto font-medium ${getTimerStyles()}`}
        aria-live="polite"
      >
        <IconComponent className="h-3 w-3 mr-1.5" />
        <span className="font-mono">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </Badge>
    </div>
  );
}
