import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { previewProducts } from '../lib/previewProducts'

// In DEV, merge in any preview products not already returned by Firestore (matched
// by slug), then re-sort by sortOrder. Inert in production builds (import.meta.env.DEV
// is false). See previewProducts.js for why.
function withPreview(docs) {
  if (!import.meta.env.DEV) return docs
  const slugs = new Set(docs.map((d) => d.slug))
  const extras = previewProducts.filter((p) => !slugs.has(p.slug))
  if (extras.length === 0) return docs
  return [...docs, ...extras].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function centsToDollars(cents) {
  if (cents == null) return ''
  return (cents / 100).toFixed(2)
}

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(
          collection(db, 'storeProducts'),
          where('status', '==', 'published'),
          orderBy('sortOrder', 'asc')
        )
        const snapshot = await getDocs(q)
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setProducts(withPreview(docs))
      } catch (err) {
        console.error('[useProducts] fetch error:', err)
        setError(err)
        // Still surface preview products in DEV even if the live fetch fails.
        setProducts(withPreview([]))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useProduct(slug) {
  const { products, loading, error } = useProducts()
  const product = products.find((p) => p.slug === slug) ?? null
  return { product, loading, error }
}
