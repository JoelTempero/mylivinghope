import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

/**
 * Hook for real-time Firestore collection access with CRUD operations
 * @param {string} collectionName - Name of the Firestore collection
 * @param {Object} options - Query options
 * @param {string} options.orderByField - Field to order by
 * @param {string} options.orderDirection - 'asc' or 'desc'
 * @param {Array} options.filters - Array of filter objects [{field, operator, value}]
 * @returns {Object} Collection data and CRUD methods
 */
export function useCollection(collectionName, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    orderByField = 'createdAt',
    orderDirection = 'desc',
    filters = [],
  } = options

  // Subscribe to collection
  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      let q = collection(db, collectionName)

      // Apply filters
      const constraints = []
      filters.forEach(({ field, operator, value }) => {
        if (value !== undefined && value !== null && value !== '') {
          constraints.push(where(field, operator, value))
        }
      })

      // Apply ordering
      if (orderByField) {
        constraints.push(orderBy(orderByField, orderDirection))
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints)
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setData(items)
          setLoading(false)
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err)
          setError(err.message)
          setLoading(false)
        }
      )

      return unsubscribe
    } catch (err) {
      console.error(`Error setting up ${collectionName} listener:`, err)
      setError(err.message)
      setLoading(false)
    }
  }, [collectionName, orderByField, orderDirection, JSON.stringify(filters)])

  // Add a new document
  const add = useCallback(
    async (newData) => {
      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...newData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        return docRef.id
      } catch (err) {
        console.error(`Error adding to ${collectionName}:`, err)
        throw err
      }
    },
    [collectionName]
  )

  // Update a document
  const update = useCallback(
    async (id, updates) => {
      try {
        await updateDoc(doc(db, collectionName, id), {
          ...updates,
          updatedAt: serverTimestamp(),
        })
      } catch (err) {
        console.error(`Error updating ${collectionName}/${id}:`, err)
        throw err
      }
    },
    [collectionName]
  )

  // Delete a document
  const remove = useCallback(
    async (id) => {
      try {
        await deleteDoc(doc(db, collectionName, id))
      } catch (err) {
        console.error(`Error deleting ${collectionName}/${id}:`, err)
        throw err
      }
    },
    [collectionName]
  )

  return {
    data,
    loading,
    error,
    add,
    update,
    remove,
  }
}

export default useCollection
