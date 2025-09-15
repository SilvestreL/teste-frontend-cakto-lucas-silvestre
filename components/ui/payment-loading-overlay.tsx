"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CactusIcon } from "@/components/ui/cactus-icon";

interface PaymentLoadingOverlayProps {
  open: boolean;
  message: string;
}

export function PaymentLoadingOverlay({
  open,
  message,
}: PaymentLoadingOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
          role="dialog"
          aria-modal="true"
          aria-live="assertive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Logo com animação de pulse suave */}
          <motion.div
            className="h-14 w-14 rounded-full bg-brand grid place-content-center text-brand-foreground"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                "0 0 0 8px rgba(34, 197, 94, 0.1)",
                "0 0 0 0 rgba(34, 197, 94, 0.4)",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <CactusIcon className="h-8 w-8" />
          </motion.div>

          {/* Mensagem com tipografia consistente */}
          <motion.div
            className="text-center text-text-primary text-lg font-medium max-w-sm px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {message}
          </motion.div>

          {/* Barra de progresso com gradiente animado */}
          <motion.div
            className="w-56 h-1.5 rounded-full bg-surface-2 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-brand/60 via-brand to-brand/80"
              animate={{ x: ["-100%", "300%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Focus trap */}
          <div tabIndex={0} ref={ref} className="sr-only">
            Processando pagamento
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
