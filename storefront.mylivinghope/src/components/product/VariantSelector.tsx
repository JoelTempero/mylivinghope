'use client'

import type { ShopifyProductVariant } from '@/types/shopify'

interface VariantSelectorProps {
  variants: ShopifyProductVariant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length <= 1) return null

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-charcoal uppercase tracking-wider">
        Options
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            disabled={!variant.availableForSale}
            className={`px-5 py-2.5 text-sm font-medium rounded-full border-2 transition-all duration-200 ${
              selectedVariantId === variant.id
                ? 'border-forest-green bg-forest-green text-white shadow-md'
                : variant.availableForSale
                  ? 'border-charcoal/20 text-charcoal hover:border-forest-green'
                  : 'border-charcoal/10 text-text-muted cursor-not-allowed line-through'
            }`}
          >
            {variant.title}
          </button>
        ))}
      </div>
    </div>
  )
}
