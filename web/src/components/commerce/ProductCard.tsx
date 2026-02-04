'use client';

import Image from 'next/image';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { formatPrice, truncateText } from '@/lib/utils';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const firstVariant = product.variants.edges[0]?.node;

  // Determine badge
  let badge: string | null = null;
  if (isOnSale) badge = 'Sale';
  else if (product.tags.includes('best-seller')) badge = 'Best Seller';
  else if (product.tags.includes('new')) badge = 'New';

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group relative product-card">
      {/* Badge */}
      {badge && (
        <span
          className={`absolute top-4 left-4 z-10 px-4 py-1 rounded-full text-xs font-semibold ${
            badge === 'Sale' ? 'bg-charcoal text-white' : 'bg-forest text-white'
          }`}
        >
          {badge}
        </span>
      )}

      {/* Image */}
      <div className="block relative aspect-[4/3] overflow-hidden">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover product-card-image"
          />
        ) : (
          <div className="w-full h-full bg-cream flex items-center justify-center text-text-muted">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="text-xl mb-2">{product.title}</h3>

        <p className="text-[0.9375rem] text-text-muted mb-6 leading-relaxed">
          {truncateText(product.description, 100)}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-heading text-3xl font-bold text-charcoal">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {isOnSale && (
            <span className="text-text-muted line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {firstVariant && (
          <AddToCartButton
            variantId={firstVariant.id}
            availableForSale={product.availableForSale}
            className="w-full"
          />
        )}
      </div>
    </article>
  );
}
