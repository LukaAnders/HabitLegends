import { motion } from 'framer-motion'
import { Check, Coins, Lock, PackageCheck, ShoppingBag } from 'lucide-react'
import { ITEM_CATEGORY_LABELS, ITEM_RARITY_COLORS, ITEM_RARITY_LABELS } from '../../constants/store'
import type { StoreItem } from '../../types/store'

export function StoreItemCard({ item, owned, playerLevel, playerGold, busy, onPurchase }: { item: StoreItem; owned: boolean; playerLevel: number; playerGold: number; busy: boolean; onPurchase: () => void }) {
  const levelLocked = playerLevel < item.requiredLevel; const goldLocked = playerGold < item.price; const color = ITEM_RARITY_COLORS[item.rarity]
  return <motion.article layout whileHover={{ y: -5 }} className={`real-store-item rarity-${item.rarity}`} style={{ '--rarity-color': color } as React.CSSProperties}><div className="real-item-stage"><div className="real-item-aura" style={{ backgroundColor: color }} /><img src={item.imageUrl} alt="" /><span className="real-item-rarity">{ITEM_RARITY_LABELS[item.rarity]}</span>{levelLocked && <span className="real-item-lock"><Lock size={12} />Nível {item.requiredLevel}</span>}{owned && <span className="real-item-owned"><Check size={12} />Adquirido</span>}</div><span className="real-item-category">{ITEM_CATEGORY_LABELS[item.category]}</span><h3>{item.name}</h3><p>{item.description}</p><div className="real-item-footer"><strong><Coins size={15} />{item.price}</strong><button onClick={onPurchase} disabled={busy || owned || levelLocked || goldLocked || !item.isAvailable}>{busy ? 'Negociando...' : owned ? <><PackageCheck size={14} />No inventário</> : levelLocked ? `Requer nível ${item.requiredLevel}` : goldLocked ? 'Ouro insuficiente' : <><ShoppingBag size={14} />Comprar</>}</button></div></motion.article>
}
