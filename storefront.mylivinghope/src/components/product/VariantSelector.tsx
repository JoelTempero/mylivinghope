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
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#212021]">Options</label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            disabled={!variant.availableForSale}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              selectedVariantId === variant.id
                ? 'border-[#336F49] bg-[#336F49] text-white'
                : variant.availableForSale
                  ? 'border-gray-300 hover:border-[#336F49] text-[#212021]'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {variant.title}
          </button>
        ))}
      </div>
    </div>
  )
}
