import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct, centsToDollars } from '../hooks/useProducts'
import { useCart } from '../stores/cart'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { product, loading } = useProduct(slug)
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

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

  const images = product.images || []
  const mainImage = images[activeImage] ?? images[0]
  const maxQty = product.inventory ?? 99
  const outOfStock = product.inventory != null && product.inventory <= 0

  function handleAdd() {
    add(product, qty)
    navigate('/cart')
  }

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="max-w-5xl mx-auto px-[5%] py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-soft-blush to-blush-light flex items-center justify-center">
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
                    i === activeImage ? 'border-forest-green' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.title} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Link to="/" className="text-sm text-text-muted hover:text-forest-green transition-colors">← Back</Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-2">{product.title}</h1>
          {product.subtitle && (
            <p className="font-heading italic text-lg text-text-secondary mb-4">{product.subtitle}</p>
          )}
          <p className="text-2xl font-bold text-forest-green mb-6">${centsToDollars(product.priceNZD)} NZD</p>
          {product.description && (
            <p className="text-text-secondary leading-relaxed mb-8 whitespace-pre-line">{product.description}</p>
          )}

          {/* Qty stepper */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-gray-300 rounded-full">
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
            className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
