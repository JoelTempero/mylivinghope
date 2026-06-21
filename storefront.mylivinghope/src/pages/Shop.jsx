import { Link } from 'react-router-dom'
import { useProducts, centsToDollars } from '../hooks/useProducts'
import { usePageMeta } from '../lib/seo'

function ProductTile({ product }) {
  const image = product.images?.[0]
  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-soft-blush to-blush-light">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
            Photo coming soon
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold leading-tight mb-1">{product.title}</h2>
        {product.subtitle && (
          <p className="font-heading italic text-text-secondary text-sm mb-3">{product.subtitle}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-forest-green">
            ${centsToDollars(product.priceNZD)} NZD
          </span>
          <span className="text-sm font-medium text-forest-green inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            View
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Shop() {
  const { products, loading } = useProducts()
  usePageMeta(
    'Shop — My Living Hope',
    'Browse My Living Hope — Prayer Cards and the Abide spiritual practices booklet. Resources to help you walk with God in everyday life.',
  )

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="max-w-[1200px] mx-auto px-[5%] py-12 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <p className="section-tag mb-3">Shop</p>
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-tight">Our resources</h1>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            Tools to help you bring your whole self to God — and walk with Him day to day.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-black/5">
                <div className="aspect-[4/3] image-placeholder" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-2/3 rounded bg-black/5" />
                  <div className="h-4 w-1/3 rounded bg-black/5" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-text-muted py-20">No products available right now — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
