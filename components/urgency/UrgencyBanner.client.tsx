"use client";

import { memo } from "react";
import { CountdownTimerClient } from "./CountdownTimer.client";
import { SocialProof } from "./SocialProof";
import { useCountdown } from "@/lib/hooks/useCountdown";

interface UrgencyBannerClientProps {
  initialMinutes: number;
  isMobile?: boolean;
  showSocialProof?: boolean;
  className?: string;
}

/**
 * Banner de urgência isolado que não força re-renders no componente pai.
 *
 * Regras:
 * - Apenas props primitivas
 * - Memoizado para evitar re-renders desnecessários
 * - Isolado em seu próprio estado de timer
 */
export const UrgencyBannerClient = memo(function UrgencyBannerClient({
  initialMinutes,
  isMobile = false,
  showSocialProof = true,
  className = "",
}: UrgencyBannerClientProps) {
  const { isExpired, totalSecondsLeft = 0 } = useCountdown(initialMinutes);

  // Determina o estilo baseado no tempo restante (primitivos)
  const getUrgencyClasses = () => {
    if (isExpired) {
      return "bg-surface-2 text-text-secondary border-border";
    }
    if (totalSecondsLeft < 120) {
      return "bg-red-900/25 text-red-300 border-red-600/40 animate-pulse";
    }
    if (totalSecondsLeft < 300) {
      return "bg-amber-900/20 text-amber-300 border-amber-600/40";
    }
    return isMobile
      ? "bg-orange-900/20 border-orange-600/30 text-orange-400"
      : "bg-orange-900/15 border-orange-400/25 text-orange-300";
  };

  const urgencyClasses = getUrgencyClasses();
  const iconSize = isMobile ? "sm" : "md";
  const textSize = isMobile ? "text-xs" : "text-sm";

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Texto de urgência */}
      <div className="text-center">
        <span className={`text-text-primary font-bold ${textSize}`}>
          Oferta por tempo limitado!
        </span>
      </div>

      {/* Temporizador isolado */}
      <div className="flex justify-center">
        <div className={`px-3 py-1.5 border rounded-full ${urgencyClasses}`}>
          <CountdownTimerClient
            initialMinutes={initialMinutes}
            inline={true}
            iconSize={iconSize}
          />
        </div>
      </div>

      {/* Social Proof (opcional) */}
      {showSocialProof && (
        <div className="flex justify-center">
          <div className="px-3 py-1.5 bg-surface-2 border border-border/30 rounded-full">
            <div className={textSize}>
              <SocialProof />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
