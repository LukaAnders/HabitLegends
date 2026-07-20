import type { PlayerAvatar } from '../../types/firebase'
import type { InventoryItem, ItemCategory } from '../../types/store'

const defaults: Record<string, string> = {
  background_default: '/assets/items/background.svg', body_default: '/assets/items/body.svg',
  outfit_default: '/assets/items/outfit.svg', hair_default: '/assets/items/hair.svg',
}
const order: Array<'background' | 'body' | ItemCategory> = ['background', 'body', 'outfit', 'hair', 'accessory', 'weapon', 'pet']

export function AvatarRenderer({ avatar, inventory, includeBackground = true, className = '' }: { avatar: PlayerAvatar; inventory: InventoryItem[]; includeBackground?: boolean; className?: string }) {
  const inventoryMap = new Map(inventory.map(item => [item.itemId, item.imageUrl]))
  const sources = order.map(category => {
    if (category === 'body') return { category, src: defaults[avatar.body] ?? defaults.body_default }
    const itemId = avatar[category]
    return { category, src: itemId ? inventoryMap.get(itemId) ?? defaults[itemId] : undefined }
  }).filter(layer => layer.src && (includeBackground || layer.category !== 'background'))
  return <div className={`avatar-renderer ${className}`} aria-label="Avatar equipado">{sources.map(layer => <img key={layer.category} src={layer.src} alt="" data-layer={layer.category} />)}</div>
}
