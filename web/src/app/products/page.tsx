import { Metadata } from 'next';
import { getAllProducts, isShopifyConfigured } from '@/lib/shopify';
import { ProductCard } from '@/components/commerce/ProductCard';

export const metadata: Metadata = {
  title: 'Shop Prayer Portals',
  description: 'Browse our collection of Scripture-based prayer cards designed to deepen your relationship with God.',
};

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];

  if (isShopifyConfigured()) {
    try {
      products = await getAllProducts(20);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <header className="text-center mb-16">
          <span className="section-tag">Shop</span>
          <h1 className="mb-4">Prayer Portals</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Explore our collection of Scripture-based prayer cards designed to guide you into deeper, more meaningful prayer.
          </p>
        </header>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
