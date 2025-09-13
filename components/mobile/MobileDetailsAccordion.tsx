"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileDetailsAccordionProps {
  children: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  className?: string;
}

export function MobileDetailsAccordion({
  children,
  title,
  defaultOpen = false,
  className = "",
}: MobileDetailsAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between p-0 h-auto text-xs text-text-secondary hover:text-text-primary"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <>
          <Separator className="bg-border/40" />
          <div className="space-y-3">{children}</div>
        </>
      )}
    </div>
  );
}
