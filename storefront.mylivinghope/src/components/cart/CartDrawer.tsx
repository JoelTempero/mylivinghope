'use client'

import { useEffect } from 'react'
import { X, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import CartLineItem from './CartLine'

export default function CartDrawer() {
  const { cart, isOpen, closeCart } = useCartStore()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-charcoal/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        role="presentation"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-forest-green" />
            <h2 className="font-heading text-xl font-bold text-charcoal">
              Your Cart
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full bg-charcoal/5 hover:bg-charcoal/10 flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* Cart lines */}
        <div className="flex-1 overflow-y-auto px-6">
          {!cart || cart.lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-soft-blush/50 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-forest-green/40" />
              </div>
              <p className="font-heading text-lg text-charcoal mb-2">
                Your cart is empty
              </p>
              <p className="text-text-secondary text-sm mb-6">
                Add some Prayer Portals to get started
              </p>
              <button
                onClick={closeCart}
                className="text-forest-green font-semibold text-sm hover:text-green-dark transition-colors"
              >
                Continue shopping &rarr;
              </button>
            </div>
          ) : (
            <div className="divide-y divide-charcoal/10 py-2">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.length > 0 && (
          <div className="p-6 border-t border-charcoal/10 space-y-4 bg-white">
            <div className="flex justify-between items-baseline">
              <span className="font-heading text-lg font-bold text-charcoal">
                Total
              </span>
              <span className="text-2xl font-bold text-forest-green">
                ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}{' '}
                <span className="text-sm font-normal text-text-muted">
                  {cart.cost.totalAmount.currencyCode}
                </span>
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="block w-full py-4 bg-forest-green hover:bg-green-dark text-white text-center rounded-full font-semibold transition-colors shadow-md text-base"
            >
              Checkout
            </a>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-text-secondary hover:text-charcoal transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
