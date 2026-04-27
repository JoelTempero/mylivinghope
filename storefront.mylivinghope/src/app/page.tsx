import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
import ProductGrid from '@/components/product/ProductGrid'

export const revalidate = 60

export default async function Home() {
  let products: Awaited<ReturnType<typeof getProducts>> = []
  try {
    products = await getProducts(4)
  } catch {
    // Shopify token not configured yet — show page without products
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-sm text-[#336F49] font-medium tracking-wider uppercase mb-4">
          Light in the Darkness
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-[#212021] mb-6">
          Go Deeper With <span className="text-[#336F49]">Jesus</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Prayer Portals are beautifully designed cards that help you bring both
          your joys and struggles to God. Connect your emotions with Scripture
          and discover new ways to pray.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-[#336F49] hover:bg-[#2a5a3b] text-white rounded-lg font-medium transition-colors"
        >
          Explore Cards
        </Link>
      </section>

      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-[#212021] mb-8">
            Featured Products
          </h2>
          <ProductGrid products={products} />
        </section>
      )}
    </div>
  )
}
