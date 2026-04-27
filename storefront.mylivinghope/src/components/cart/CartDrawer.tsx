'use client'

import { X } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import CartLineItem from './CartLine'

export default function CartDrawer() {
  const { cart, isOpen, closeCart } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={closeCart}
        role="presentation"
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FDF8F5] z-50 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#336F49]/10">
          <h2 className="text-lg font-bold text-[#212021]">Cart</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-[#212021] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {!cart || cart.lines.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {cart && cart.lines.length > 0 && (
          <div className="p-4 border-t border-[#336F49]/10 space-y-4">
            <div className="flex justify-between text-lg font-bold text-[#212021]">
              <span>Total</span>
              <span>
                ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}{' '}
                {cart.cost.totalAmount.currencyCode}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="block w-full py-3 bg-[#336F49] hover:bg-[#2a5a3b] text-white text-center rounded-lg font-medium transition-colors"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  )
}
