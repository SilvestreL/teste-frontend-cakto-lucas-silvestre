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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
      className={className}
    >
      <path d="M5 8v6a2 2 0 0 0 2 2h2"/>
      <path d="M15 14h2a2 2 0 0 0 2-2V6"/>
      <path d="M9 22V5a3 3 0 1 1 6 0v17"/>
      <path d="M7 22h10"/>
    </svg>
  );
}
