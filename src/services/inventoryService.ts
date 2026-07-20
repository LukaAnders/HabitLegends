import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db, requireFirebase } from '../lib/firebase'
import type { PlayerProfile } from '../types/firebase'
import type { InventoryItem, ItemCategory } from '../types/store'

const defaultAvatarValue: Record<ItemCategory, string | null> = {
  hair: 'hair_default', outfit: 'outfit_default', background: 'background_default',
  weapon: null, accessory: null, pet: null,
}

export async function equipItem(userId: string, itemId: string) {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const profileRef = doc(firestore, 'users', userId)
  const itemRef = doc(firestore, 'users', userId, 'inventory', itemId)

  await runTransaction(firestore, async transaction => {
    const profileSnapshot = await transaction.get(profileRef)
    const itemSnapshot = await transaction.get(itemRef)
    if (!profileSnapshot.exists()) throw new Error('player/profile-not-found')
    if (!itemSnapshot.exists()) throw new Error('inventory/item-not-owned')
    const profile = profileSnapshot.data() as PlayerProfile
    const item = { id: itemSnapshot.id, ...itemSnapshot.data() } as InventoryItem
    const previousId = profile.avatar[item.category]
    let previousRef = null
    if (previousId && previousId !== itemId && !previousId.endsWith('_default')) {
      previousRef = doc(firestore, 'users', userId, 'inventory', previousId)
      await transaction.get(previousRef)
    }
    transaction.update(profileRef, { [`avatar.${item.category}`]: itemId, updatedAt: serverTimestamp() })
    transaction.update(itemRef, { equipped: true })
    if (previousRef) transaction.update(previousRef, { equipped: false })
  })
}

export async function unequipItem(userId: string, itemId: string) {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const profileRef = doc(firestore, 'users', userId)
  const itemRef = doc(firestore, 'users', userId, 'inventory', itemId)
  await runTransaction(firestore, async transaction => {
    const profileSnapshot = await transaction.get(profileRef)
    const itemSnapshot = await transaction.get(itemRef)
    if (!profileSnapshot.exists()) throw new Error('player/profile-not-found')
    if (!itemSnapshot.exists()) throw new Error('inventory/item-not-owned')
    const profile = profileSnapshot.data() as PlayerProfile
    const item = { id: itemSnapshot.id, ...itemSnapshot.data() } as InventoryItem
    if (profile.avatar[item.category] !== itemId) throw new Error('inventory/item-not-equipped')
    transaction.update(profileRef, { [`avatar.${item.category}`]: defaultAvatarValue[item.category], updatedAt: serverTimestamp() })
    transaction.update(itemRef, { equipped: false })
  })
}
