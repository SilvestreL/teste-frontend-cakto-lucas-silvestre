"use client";

import { CountdownTimer } from "@/components/urgency/CountdownTimer";
import { SocialProof } from "@/components/urgency/SocialProof";

interface MobileUrgencyElementsProps {
  showCountdown?: boolean;
  showSocialProof?: boolean;
  countdownMinutes?: number;
  className?: string;
}

export function MobileUrgencyElements({
  showCountdown = true,
  showSocialProof = true,
  countdownMinutes = 10,
  className = "",
}: MobileUrgencyElementsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {showCountdown && (
        <div className="space-y-1.5">
          <p className="text-xs text-text-secondary leading-relaxed">
            Tempo limitado para o preço promocional
          </p>
          <CountdownTimer initialMinutes={countdownMinutes} />
        </div>
      )}

      {showSocialProof && (
        <div>
          <SocialProof />
        </div>
      )}
    </div>
  );
}
