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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#212021]">Shop</h1>
        <p className="mt-2 text-gray-600">
          Browse our collection of Prayer Portals
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  )
}
