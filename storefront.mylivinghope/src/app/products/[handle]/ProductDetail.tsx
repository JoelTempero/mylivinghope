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
    <div className="mt-[80px] md:mt-[90px]">
      <div className="max-w-[1400px] mx-auto px-[5%] py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-3xl bg-white shadow-md">
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
                <div className="w-full h-full bg-gradient-to-br from-soft-blush/30 to-blush-light flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                      <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <p className="text-text-muted">Product image</p>
                  </div>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                      idx === selectedImageIdx
                        ? 'border-forest-green shadow-md'
                        : 'border-transparent hover:border-forest-green/30'
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

          {/* Product info */}
          <div className="flex flex-col justify-center">
            {product.productType && (
              <p className="section-tag mb-3">{product.productType}</p>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-forest-green">
                ${parseFloat(selectedVariant.price.amount).toFixed(2)}
              </span>
              {selectedVariant.compareAtPrice &&
                parseFloat(selectedVariant.compareAtPrice.amount) >
                  parseFloat(selectedVariant.price.amount) && (
                  <span className="text-xl text-text-muted line-through">
                    $
                    {parseFloat(
                      selectedVariant.compareAtPrice.amount
                    ).toFixed(2)}
                  </span>
                )}
              <span className="text-sm text-text-muted">
                {selectedVariant.price.currencyCode}
              </span>
            </div>

            <div className="space-y-6 mb-8">
              <VariantSelector
                variants={product.variants}
                selectedVariantId={selectedVariantId}
                onSelect={setSelectedVariantId}
              />
            </div>

            <div className="mb-8">
              <AddToCartButton
                variantId={selectedVariantId}
                availableForSale={selectedVariant.availableForSale}
              />
            </div>

            {product.descriptionHtml && (
              <div className="border-t border-charcoal/10 pt-8">
                <h3 className="font-heading text-lg font-bold text-charcoal mb-4">
                  About this product
                </h3>
                <div
                  className="prose-mlh text-text-secondary leading-relaxed space-y-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml,
                  }}
                />
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-forest-green bg-forest-green/10 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
