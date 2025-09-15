import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/checkout";

export const revalidate = 600; // Cache por 10 minutos

interface ProductHeroProps {
  product: Product;
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <div className="space-y-4">
      {/* Imagem do produto */}
      <div className="relative w-full h-48 rounded-lg bg-surface-2 border border-border overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-center"
          style={{ objectPosition: "30% 10%" }}
          priority // Prioridade para imagem principal
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Informações do produto */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary leading-tight">
          {product.name}
        </h2>

        {product.description && (
          <p className="text-sm text-text-secondary leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Metadados */}
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">
            por{" "}
            <span className="font-medium text-text-primary">
              {product.producer}
            </span>
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="text-xs px-2.5 py-1 h-auto bg-surface-2 text-text-secondary border-border"
            >
              Produto digital
            </Badge>
            <Badge className="text-xs px-2.5 py-1 h-auto bg-brand/10 text-brand border-brand/20">
              Liberação imediata
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
