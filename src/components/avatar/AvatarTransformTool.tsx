import { useState } from 'react'
import { DEFAULT_AVATAR_TRANSFORMS, getLegacyAvatarSlot } from '../../constants/avatar'
import type { AvatarTransform, InventoryItem } from '../../types/store'
import { AvatarLayer } from './AvatarLayer'
export function AvatarTransformTool({ items }: { items: InventoryItem[] }) {
  const [selected, setSelected] = useState(items[0]?.itemId ?? '')
  const item = items.find(value => value.itemId === selected)
  const slot = item ? item.avatarSlot ?? getLegacyAvatarSlot(item) : null
  const [transform, setTransform] = useState<AvatarTransform>(() =>
    item && slot ? item.avatarTransform ?? DEFAULT_AVATAR_TRANSFORMS[slot] : { x: 50, y: 50, scale: 1, rotation: 0 },
  )
  if (!import.meta.env.DEV || !item || !slot) return null
  function select(itemId: string) { const next = items.find(value => value.itemId === itemId); setSelected(itemId); if (next) { const nextSlot = next.avatarSlot ?? getLegacyAvatarSlot(next); setTransform(next.avatarTransform ?? DEFAULT_AVATAR_TRANSFORMS[nextSlot]) } }
  const field = (key: keyof Omit<AvatarTransform, 'flipX'>, step: number) => <label>{key}<input type="range" min={key === 'scale' ? .05 : key === 'rotation' ? -180 : 0} max={key === 'scale' ? 1.5 : key === 'rotation' ? 180 : 100} step={step} value={transform[key]} onChange={event => setTransform(value => ({ ...value, [key]: Number(event.target.value) }))} /><b>{transform[key]}</b></label>
  return <details className="avatar-transform-tool"><summary>Ajustar composição (DEV)</summary><select value={selected} onChange={event => select(event.target.value)}>{items.map(value => <option key={value.itemId} value={value.itemId}>{value.name}</option>)}</select><div className="avatar-tool-preview avatar-debug"><i className="avatar-grid" /><b className="avatar-center" /><AvatarLayer debug item={{ name: item.name, imageUrl: item.imageUrl, avatarSlot: slot, avatarTransform: transform }} /></div>{field('x', 1)}{field('y', 1)}{field('scale', .01)}{field('rotation', 1)}<button onClick={() => navigator.clipboard.writeText(JSON.stringify(transform, null, 2))}>Copiar JSON</button><pre>{JSON.stringify(transform, null, 2)}</pre></details>
}
