'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/stores/cart'

const CART_ID_KEY = 'mlh-cart-id'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { setCart, setLoading } = useCartStore()

  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return

    setLoading(true)
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', cartId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) setCart(data.cart)
        else localStorage.removeItem(CART_ID_KEY)
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY))
      .finally(() => setLoading(false))
  }, [setCart, setLoading])

  return <>{children}</>
}

export async function cartAction(
  action: 'create' | 'add' | 'update' | 'remove',
  params: Record<string, unknown> = {}
) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params }),
  })
  const data = await res.json()

  if (data.cart) {
    localStorage.setItem(CART_ID_KEY, data.cart.id)
    useCartStore.getState().setCart(data.cart)
  }

  return data.cart
}
