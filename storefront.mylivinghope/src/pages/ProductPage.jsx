import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct, centsToDollars } from '../hooks/useProducts'
import { useCart } from '../stores/cart'
import { usePageMeta } from '../lib/seo'

// Per-product visual themes. Default is the MLH look; products with
// theme === 'abide' (or an abide-* slug) get the Abide brand skin.
const THEMES = {
  mlh: {
    page: '',
    imageFrame: 'bg-gradient-to-br from-soft-blush to-blush-light',
    backLink: 'text-text-muted hover:text-forest-green',
    title: '',
    subtitle: 'font-heading italic text-text-secondary',
    price: 'text-forest-green',
    thumbActive: 'border-forest-green',
    button: 'bg-forest-green hover:bg-green-dark',
  },
  abide: {
    page: 'bg-abide-andrea/40',
    imageFrame: 'bg-gradient-to-br from-abide-andrea to-abide-lilac',
    backLink: 'text-abide-navy/60 hover:text-abide-navy',
    title: 'font-abide-heading text-abide-navy tracking-tight',
    subtitle: 'font-abide-body italic text-abide-navy/70',
    price: 'text-abide-navy',
    thumbActive: 'border-abide-navy',
    button: 'bg-abide-navy hover:bg-[#0a1156]',
  },
}

function resolveTheme(product) {
  if (product?.theme === 'abide' || product?.slug?.startsWith('abide')) return 'abide'
  return 'mlh'
}

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { product, loading } = useProduct(slug)
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  usePageMeta(
    product ? product.seo?.title || `${product.title} — My Living Hope` : undefined,
    product ? product.seo?.description || product.subtitle : undefined,
  )

  if (loading) {
    return (
      <div id="main-content" className="mt-[80px] md:mt-[90px] max-w-5xl mx-auto px-[5%] py-32 text-center text-text-muted">
        Loading…
      </div>
    )
  }

  if (!product) {
    return (
      <div id="main-content" className="mt-[80px] md:mt-[90px] max-w-5xl mx-auto px-[5%] py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/" className="text-forest-green underline">Back to home</Link>
      </div>
    )
  }

  const t = THEMES[resolveTheme(product)]
  const isAbide = resolveTheme(product) === 'abide'
  const images = product.images || []
  const mainImage = images[activeImage] ?? images[0]
  const maxQty = product.inventory ?? 99
  const outOfStock = product.inventory != null && product.inventory <= 0

  function handleAdd() {
    add(product, qty)
    navigate('/cart')
  }

  return (
    <div id="main-content" className={`mt-[80px] md:mt-[90px] ${t.page}`}>
      <div className="max-w-5xl mx-auto px-[5%] py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Images */}
        <div>
          <div className={`aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center ${t.imageFrame}`}>
            {mainImage ? (
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-text-muted text-sm px-6 text-center">Product photo coming soon</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === activeImage}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage ? t.thumbActive : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.title} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Obi — Abide mascot, shown under the gallery on the booklet page */}
          {isAbide && (
            <div className="mt-8 flex items-end gap-4 rounded-2xl bg-abide-lilac/50 p-5">
              <img
                src="/images/abide/obi.png"
                alt="Obi, the Abide mascot"
                className="w-20 sm:w-24 h-auto shrink-0"
              />
              <p className="font-abide-body text-sm text-abide-navy/80 leading-relaxed pb-1">
                <span className="font-abide-heading text-xl text-abide-navy block leading-none mb-1">Meet Obi</span>
                The simple ways to live a simple faith.
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Link to="/shop" className={`text-sm transition-colors ${t.backLink}`}>← Back to shop</Link>
          <h1 className={`text-3xl md:text-4xl font-bold mt-4 mb-2 ${t.title}`}>{product.title}</h1>
          {product.subtitle && (
            <p className={`text-lg mb-4 ${t.subtitle}`}>{product.subtitle}</p>
          )}
          <p className={`text-2xl font-bold mb-6 ${t.price}`}>${centsToDollars(product.priceNZD)} NZD</p>
          {product.description && (
            <p className={`leading-relaxed mb-8 whitespace-pre-line ${isAbide ? 'text-abide-navy/80 font-abide-body' : 'text-text-secondary'}`}>
              {product.description}
            </p>
          )}

          {/* Qty stepper */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-gray-300 rounded-full bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 text-lg leading-none hover:bg-gray-50 rounded-l-full"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center" aria-live="polite">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                className="w-10 h-10 text-lg leading-none hover:bg-gray-50 rounded-r-full"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`btn-interactive inline-flex items-center gap-2 text-white font-semibold px-10 py-4 rounded-full text-base disabled:opacity-60 disabled:cursor-not-allowed ${t.button}`}
          >
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
