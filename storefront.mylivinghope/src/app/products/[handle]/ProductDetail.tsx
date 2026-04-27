'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'
import VariantSelector from '@/components/product/VariantSelector'
import AddToCartButton from '@/components/product/AddToCartButton'

interface ProductDetailProps {
  product: ShopifyProduct
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id
  )
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-xl bg-white">
            {product.images[selectedImageIdx] ? (
              <Image
                src={product.images[selectedImageIdx].url}
                alt={
                  product.images[selectedImageIdx].altText || product.title
                }
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    idx === selectedImageIdx
                      ? 'border-[#336F49]'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || ''}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#336F49] font-medium mb-2">
              {product.productType}
            </p>
            <h1 className="text-3xl font-bold text-[#212021]">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#336F49]">
              ${parseFloat(selectedVariant.price.amount).toFixed(2)}{' '}
              {selectedVariant.price.currencyCode}
            </span>
            {selectedVariant.compareAtPrice &&
              parseFloat(selectedVariant.compareAtPrice.amount) >
                parseFloat(selectedVariant.price.amount) && (
                <span className="text-lg text-gray-400 line-through">
                  ${parseFloat(selectedVariant.compareAtPrice.amount).toFixed(2)}
                </span>
              )}
          </div>

          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />

          <AddToCartButton
            variantId={selectedVariantId}
            availableForSale={selectedVariant.availableForSale}
          />

          <div
            className="prose prose-green max-w-none text-[#212021]"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>
    </div>
  )
}
