import type { Timestamp } from 'firebase/firestore'

export type ItemCategory = 'hair' | 'outfit' | 'weapon' | 'accessory' | 'pet' | 'background'
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type AvatarSlot = 'background'|'body'|'outfit'|'hair'|'faceAccessory'|'chestAccessory'|'backAccessory'|'leftHandWeapon'|'rightHandWeapon'|'pet'|'foreground'
export type AvatarTransform = { x:number; y:number; scale:number; rotation:number; flipX?:boolean }

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
  avatarSlot: AvatarSlot
  avatarTransform?: AvatarTransform
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
  avatarSlot?: AvatarSlot
  avatarTransform?: AvatarTransform
}

export interface PurchaseResult {
  item: StoreItem
  newGold: number
}
