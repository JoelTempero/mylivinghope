import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'

interface ProductCardProps {
  product: ShopifyProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.variants[0]?.price
  const comparePrice = product.variants[0]?.compareAtPrice

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-square relative overflow-hidden rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {!product.availableForSale && (
          <div className="absolute top-3 right-3 bg-[#212021] text-white text-xs px-2 py-1 rounded">
            Sold out
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-medium text-[#212021] group-hover:text-[#336F49] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#336F49] font-semibold">
            ${parseFloat(price?.amount || '0').toFixed(2)}{' '}
            {price?.currencyCode}
          </span>
          {comparePrice &&
            parseFloat(comparePrice.amount) >
              parseFloat(price?.amount || '0') && (
              <span className="text-sm text-gray-400 line-through">
                ${parseFloat(comparePrice.amount).toFixed(2)}
              </span>
            )}
        </div>
      </div>
    </Link>
  )
}
