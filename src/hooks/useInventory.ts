import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import { subscribeToInventory } from '../services/storeService'
import type { InventoryItem } from '../types/store'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

export function useInventory() {
  const { user } = useAuth()
  const [state, setState] = useState<{ uid: string | null; items: InventoryItem[]; error: string | null }>({ uid: null, items: [], error: null })
  useEffect(() => { if (!user) return; return subscribeToInventory(user.uid, items => setState({ uid: user.uid, items, error: null }), cause => setState({ uid: user.uid, items: [], error: getFriendlyFirebaseError(cause) })) }, [user])
  return useMemo(() => ({ items: state.uid === user?.uid ? state.items : [], loading: Boolean(user && state.uid !== user.uid), error: state.uid === user?.uid ? state.error : null }), [state, user])
}
