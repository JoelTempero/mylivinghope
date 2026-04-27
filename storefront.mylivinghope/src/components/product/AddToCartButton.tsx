'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { cartAction } from '@/components/cart/CartProvider'

interface AddToCartButtonProps {
  variantId: string
  availableForSale: boolean
}

export default function AddToCartButton({
  variantId,
  availableForSale,
}: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false)
  const { cart, openCart } = useCartStore()

  const handleAdd = async () => {
    setAdding(true)
    try {
      if (!cart) {
        const newCart = await cartAction('create')
        await cartAction('add', { cartId: newCart.id, variantId })
      } else {
        await cartAction('add', { cartId: cart.id, variantId })
      }
      openCart()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setAdding(false)
    }
  }

  if (!availableForSale) {
    return (
      <button
        disabled
        className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
      >
        Sold Out
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className="w-full py-3 px-6 bg-[#336F49] hover:bg-[#2a5a3b] text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <ShoppingBag className="w-5 h-5" />
      {adding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
