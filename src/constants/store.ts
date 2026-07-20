import type { ItemCategory, ItemRarity } from '../types/store'

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  hair: 'Cabelos', outfit: 'Trajes', weapon: 'Armas', accessory: 'Acessórios', pet: 'Companheiros', background: 'Cenários',
}
export const ITEM_RARITY_LABELS: Record<ItemRarity, string> = {
  common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário',
}
export const ITEM_RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#22C55E', rare: '#3B82F6', epic: '#A855F7', legendary: '#F2B84B',
}
