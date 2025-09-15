"use client";

import { CountdownTimer } from "./CountdownTimer";
import { SocialProof } from "./SocialProof";

interface UrgencyElementsProps {
  showCountdown?: boolean;
  showSocialProof?: boolean;
  countdownMinutes?: number;
  className?: string;
}

export function UrgencyElements({
  showCountdown = true,
  showSocialProof = true,
  countdownMinutes = 15,
  className = "",
}: UrgencyElementsProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {showCountdown && (
        <div className="space-y-2">
          <p className="text-xs text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">
              Oferta por tempo limitado!
            </span>
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
