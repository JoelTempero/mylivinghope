import { create } from 'zustand'
import type { ShopifyCart } from '@/types/shopify'

interface CartState {
  cart: ShopifyCart | null
  isOpen: boolean
  loading: boolean
  openCart: () => void
  closeCart: () => void
  setCart: (cart: ShopifyCart) => void
  setLoading: (loading: boolean) => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isOpen: false,
  loading: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ loading }),
}))
