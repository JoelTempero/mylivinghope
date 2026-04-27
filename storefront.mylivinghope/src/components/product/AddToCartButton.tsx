'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
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
  const [added, setAdded] = useState(false)
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
      setAdded(true)
      openCart()
      setTimeout(() => setAdded(false), 2000)
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
        className="w-full py-4 px-8 bg-charcoal/20 text-text-muted font-semibold rounded-full cursor-not-allowed text-base"
      >
        Sold Out
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className="w-full py-4 px-8 bg-forest-green hover:bg-green-dark text-white font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 text-base shadow-md hover:shadow-lg"
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart
        </>
      ) : adding ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  )
}
