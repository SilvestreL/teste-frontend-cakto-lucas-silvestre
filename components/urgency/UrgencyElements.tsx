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
            Você tem{" "}
            <span className="font-semibold text-text-primary">
              tempo limitado
            </span>{" "}
            para aproveitar o preço promocional.
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
