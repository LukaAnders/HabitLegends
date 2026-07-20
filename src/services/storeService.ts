import { collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import { db, requireFirebase } from '../lib/firebase'
import type { PlayerProfile } from '../types/firebase'
import type { InventoryItem, PurchaseResult, StoreItem } from '../types/store'

export function subscribeToStoreItems(onData: (items: StoreItem[]) => void, onError: (error: Error) => void): Unsubscribe {
  const storeQuery = query(collection(requireFirebase(db, 'Cloud Firestore'), 'storeItems'), orderBy('price', 'asc'))
  return onSnapshot(storeQuery, snapshot => onData(snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as StoreItem)), onError)
}

export function subscribeToInventory(userId: string, onData: (items: InventoryItem[]) => void, onError: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'inventory'), snapshot => onData(snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as InventoryItem)), onError)
}

// Mantém um contrato único para futura substituição por uma Cloud Function callable.
export async function purchaseItem(userId: string, itemId: string): Promise<PurchaseResult> {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const profileRef = doc(firestore, 'users', userId)
  const itemRef = doc(firestore, 'storeItems', itemId)
  const inventoryRef = doc(firestore, 'users', userId, 'inventory', itemId)

  return runTransaction(firestore, async transaction => {
    const profileSnapshot = await transaction.get(profileRef)
    const itemSnapshot = await transaction.get(itemRef)
    const inventorySnapshot = await transaction.get(inventoryRef)
    if (!profileSnapshot.exists()) throw new Error('player/profile-not-found')
    if (!itemSnapshot.exists()) throw new Error('store/item-not-found')
    if (inventorySnapshot.exists()) throw new Error('store/already-owned')

    const player = profileSnapshot.data() as PlayerProfile
    const item = { id: itemSnapshot.id, ...itemSnapshot.data() } as StoreItem
    if (!item.isAvailable) throw new Error('store/unavailable')
    if (player.level < item.requiredLevel) throw new Error('store/level-required')
    if (player.gold < item.price) throw new Error('store/insufficient-gold')
    const newGold = player.gold - item.price

    transaction.update(profileRef, { gold: newGold, updatedAt: serverTimestamp() })
    transaction.set(inventoryRef, {
      itemId: item.id, name: item.name, category: item.category, rarity: item.rarity,
      imageUrl: item.imageUrl, purchasedPrice: item.price,
      purchasedAt: serverTimestamp(), equipped: false,
    })
    return { item, newGold }
  })
}
