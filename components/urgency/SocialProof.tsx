"use client";

import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useSocialProof } from "@/lib/hooks/useSocialProof";

interface SocialProofProps {
  className?: string;
}

export function SocialProof({ className = "" }: SocialProofProps) {
  const { viewers, lastUpdate } = useSocialProof();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Badge
        variant="secondary"
        className="bg-surface-2 text-text-secondary border-border text-xs px-2.5 py-1 h-auto font-medium"
      >
        <Eye className="h-3 w-3 mr-1.5" />
        <span>
          <span className="font-semibold text-text-primary">{viewers}</span>{" "}
          pessoas visualizaram este curso {lastUpdate}
        </span>
      </Badge>
    </div>
  );
}
