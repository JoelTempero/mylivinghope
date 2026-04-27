'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
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
    <div className="flex gap-4 py-4">
      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-white flex-shrink-0">
        {line.merchandise.product.featuredImage ? (
          <Image
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-[#212021] truncate">
          {line.merchandise.product.title}
        </h4>
        {line.merchandise.title !== 'Default Title' && (
          <p className="text-xs text-gray-500">{line.merchandise.title}</p>
        )}
        <p className="text-sm font-semibold text-[#336F49] mt-1">
          ${parseFloat(line.merchandise.price.amount).toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(line.quantity - 1)}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm w-6 text-center">{line.quantity}</span>
          <button
            onClick={() => updateQuantity(line.quantity + 1)}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <button
        onClick={() => updateQuantity(0)}
        className="text-gray-400 hover:text-red-500 transition-colors self-start"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
