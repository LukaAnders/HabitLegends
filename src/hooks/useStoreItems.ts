import { useEffect, useState } from 'react'
import { subscribeToStoreItems } from '../services/storeService'
import type { StoreItem } from '../types/store'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

export function useStoreItems() {
  const [items, setItems] = useState<StoreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => subscribeToStoreItems(data => { setItems(data); setLoading(false); setError(null) }, cause => { setError(getFriendlyFirebaseError(cause)); setLoading(false) }), [])
  return { items, loading, error }
}
