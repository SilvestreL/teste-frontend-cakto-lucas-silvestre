import React from "react";

interface CactusIconProps {
  className?: string;
  size?: number;
}

export function CactusIcon({ className = "", size = 24 }: CactusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
      className={className}
    >
      {/* tronco */}
      <path d="M12 21V7a2.5 2.5 0 0 1 2.5-2.5h0A2.5 2.5 0 0 1 17 7v2.2a2.3 2.3 0 0 0 2.3 2.3h.2A2.5 2.5 0 0 0 22 9V8.4" />
      {/* braço esquerdo */}
      <path d="M12 11.5h-1.2A2.8 2.8 0 0 1 8 8.7V7.4A2.4 2.4 0 0 0 5.6 5h0A2.4 2.4 0 0 0 3.2 7.4V8" />
      {/* base/vaso */}
      <path d="M7 21h10M8.5 21c.2-1.7 1.1-2.5 3.5-2.5S16.3 19.3 16.5 21" />
    </svg>
  );
}
