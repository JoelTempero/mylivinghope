import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'

interface ProductCardProps {
  product: ShopifyProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.variants[0]?.price
  const comparePrice = product.variants[0]?.compareAtPrice
  const onSale =
    comparePrice &&
    parseFloat(comparePrice.amount) > parseFloat(price?.amount || '0')

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square relative overflow-hidden">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-soft-blush/30 to-blush-light flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-forest-green/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <p className="text-sm text-text-muted">Prayer Portals</p>
            </div>
          </div>
        )}

        {/* Badges */}
        {!product.availableForSale && (
          <div className="absolute top-3 left-3 bg-charcoal text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Sold out
          </div>
        )}
        {onSale && product.availableForSale && (
          <div className="absolute top-3 left-3 bg-forest-green text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Sale
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-heading font-bold text-charcoal group-hover:text-forest-green transition-colors mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-forest-green font-bold text-lg">
            ${parseFloat(price?.amount || '0').toFixed(2)}
          </span>
          {onSale && (
            <span className="text-sm text-text-muted line-through">
              ${parseFloat(comparePrice.amount).toFixed(2)}
            </span>
          )}
          {price?.currencyCode && (
            <span className="text-xs text-text-muted">
              {price.currencyCode}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
