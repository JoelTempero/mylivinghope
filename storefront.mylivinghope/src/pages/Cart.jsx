import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart, selectSubtotal } from '../stores/cart'
import { centsToDollars } from '../hooks/useProducts'
import { startCheckout } from '../lib/checkout'

// Display-only — the Cloud Function (functions/index.js SHIPPING_FLAT_CENTS) is the
// source of truth. Will expand to NZ + international rates later.
const SHIPPING_FLAT_CENTS = 700

export default function Cart() {
  const items = useCart((s) => s.items)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const subtotal = useCart(selectSubtotal)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleCheckout() {
    if (!items.length || busy) return
    setBusy(true)
    setError(null)
    try {
      await startCheckout(items.map((i) => ({ productId: i.productId, qty: i.qty })))
    } catch (err) {
      console.error('Checkout failed:', err)
      setError('Something went wrong starting checkout. Please try again.')
      setBusy(false)
    }
  }

  if (!items.length) {
    return (
      <div id="main-content" className="mt-[80px] md:mt-[90px] max-w-3xl mx-auto px-[5%] py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-text-secondary mb-8">Find a card pack that speaks to where you are.</p>
        <Link
          to="/"
          className="btn-interactive inline-flex items-center bg-forest-green hover:bg-green-dark text-white font-semibold px-8 py-3 rounded-full"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="max-w-3xl mx-auto px-[5%] py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your cart</h1>

        <ul className="divide-y divide-gray-200">
          {items.map((i) => (
            <li key={i.productId} className="py-5 flex items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-soft-blush flex-shrink-0">
                {i.image && <img src={i.image} alt={i.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{i.title}</p>
                <p className="text-sm text-text-muted">${centsToDollars(i.priceNZD)} each</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-full">
                <button onClick={() => setQty(i.productId, i.qty - 1)} className="w-9 h-9 leading-none hover:bg-gray-50 rounded-l-full" aria-label="Decrease quantity">−</button>
                <span className="w-8 text-center">{i.qty}</span>
                <button onClick={() => setQty(i.productId, i.qty + 1)} className="w-9 h-9 leading-none hover:bg-gray-50 rounded-r-full" aria-label="Increase quantity">+</button>
              </div>
              <p className="w-20 text-right font-semibold hidden sm:block">${centsToDollars(i.priceNZD * i.qty)}</p>
              <button onClick={() => remove(i.productId)} className="text-text-muted hover:text-red-600 text-sm transition-colors" aria-label={`Remove ${i.title}`}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-text-secondary mb-2">
            <span>Subtotal</span>
            <span>${centsToDollars(subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-secondary mb-1">
            <span>Shipping <span className="text-text-muted">(NZ flat rate)</span></span>
            <span>${centsToDollars(SHIPPING_FLAT_CENTS)}</span>
          </div>
          <p className="text-xs text-text-muted mb-3">Or choose free pickup in Christchurch at checkout.</p>
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3 mb-6">
            <span>Total</span>
            <span>${centsToDollars(subtotal + SHIPPING_FLAT_CENTS)} NZD</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={busy}
            className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? 'Heading to checkout…' : 'Checkout'}
          </button>
          {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  )
}
