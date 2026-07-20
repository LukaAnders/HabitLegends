import type { Timestamp } from 'firebase/firestore'

export type ItemCategory = 'hair' | 'outfit' | 'weapon' | 'accessory' | 'pet' | 'background'
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface StoreItem {
  id: string
  name: string
  description: string
  category: ItemCategory
  rarity: ItemRarity
  price: number
  requiredLevel: number
  imageUrl: string
  layerOrder: number
  isAvailable: boolean
  createdAt: Timestamp
}

export interface InventoryItem {
  id: string
  itemId: string
  name: string
  category: ItemCategory
  rarity: ItemRarity
  imageUrl: string
  purchasedPrice: number
  purchasedAt: Timestamp
  equipped: boolean
}

export interface PurchaseResult {
  item: StoreItem
  newGold: number
}
