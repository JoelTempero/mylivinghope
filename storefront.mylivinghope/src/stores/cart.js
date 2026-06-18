import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Cart item shape: { productId, slug, title, priceNZD, image, qty }
// priceNZD is integer cents and is display-only — the Cloud Function re-prices
// every line against Firestore at checkout, so client prices are never trusted.

export const useCart = create(
  persist(
    (set) => ({
      items: [],

      add: (product, qty = 1) =>
        set((state) => {
          const q = Math.max(1, Math.floor(qty) || 1)
          const existing = state.items.find((i) => i.productId === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, qty: i.qty + q } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                title: product.title,
                priceNZD: product.priceNZD,
                image: product.images?.[0] ?? null,
                qty: q,
              },
            ],
          }
        }),

      setQty: (productId, qty) =>
        set((state) => {
          const q = Math.max(1, Math.floor(qty) || 1)
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, qty: q } : i
            ),
          }
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'mlh-cart-v1' }
  )
)

export const selectCount = (s) => s.items.reduce((n, i) => n + i.qty, 0)
export const selectSubtotal = (s) => s.items.reduce((n, i) => n + i.priceNZD * i.qty, 0)
