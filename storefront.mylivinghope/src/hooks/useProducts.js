import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

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
        setProducts(docs)
      } catch (err) {
        console.error('[useProducts] fetch error:', err)
        setError(err)
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
