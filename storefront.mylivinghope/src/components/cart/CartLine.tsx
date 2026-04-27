'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { ShopifyCartLine } from '@/types/shopify'
import { useCartStore } from '@/stores/cart'
import { cartAction } from '@/components/cart/CartProvider'

interface CartLineProps {
  line: ShopifyCartLine
}

export default function CartLineItem({ line }: CartLineProps) {
  const { cart } = useCartStore()

  const updateQuantity = async (quantity: number) => {
    if (!cart) return
    if (quantity === 0) {
      await cartAction('remove', { cartId: cart.id, lineIds: [line.id] })
    } else {
      await cartAction('update', {
        cartId: cart.id,
        lineId: line.id,
        quantity,
      })
    }
  }

  return (
    <div className="flex gap-4 py-5">
      <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-sm">
        {line.merchandise.product.featuredImage ? (
          <Image
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-soft-blush/30 to-blush-light flex items-center justify-center">
            <span className="text-xs text-text-muted">No img</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-charcoal truncate">
          {line.merchandise.product.title}
        </h4>
        {line.merchandise.title !== 'Default Title' && (
          <p className="text-xs text-text-muted mt-0.5">
            {line.merchandise.title}
          </p>
        )}
        <p className="text-sm font-bold text-forest-green mt-1">
          ${parseFloat(line.merchandise.price.amount).toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(line.quantity - 1)}
            className="w-11 h-11 rounded-full border border-charcoal/15 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-medium w-6 text-center">
            {line.quantity}
          </span>
          <button
            onClick={() => updateQuantity(line.quantity + 1)}
            className="w-11 h-11 rounded-full border border-charcoal/15 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <button
        onClick={() => updateQuantity(0)}
        className="w-11 h-11 flex items-center justify-center rounded-full text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors self-start"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
