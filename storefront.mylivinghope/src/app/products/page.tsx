import type { Metadata } from 'next'
import { getProducts } from '@/lib/shopify'
import ProductGrid from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Shop — My Living Hope',
  description: 'Browse our collection of Prayer Portals and other products.',
}

export const revalidate = 60

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = []
  try {
    products = await getProducts()
  } catch {
    // Shopify token not configured yet
  }

  return (
    <div className="mt-[80px] md:mt-[90px]">
      {/* Page header */}
      <div className="bg-gradient-to-r from-forest-green to-green-dark py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Shop
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Browse our collection of Prayer Portals &mdash; beautiful, practical
            tools for your spiritual journey
          </p>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-20">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
