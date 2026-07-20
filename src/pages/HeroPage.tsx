import { useState } from 'react'
import { Check, Crown, Package, Sparkles } from 'lucide-react'
import { AvatarRenderer } from '../components/avatar/AvatarRenderer'
import { AvatarTransformTool } from '../components/avatar/AvatarTransformTool'
import { ITEM_CATEGORY_LABELS } from '../constants/store'
import { useAuth } from '../contexts/auth-context'
import { usePlayer } from '../contexts/player-context'
import { useInventory } from '../hooks/useInventory'
import { equipItem, unequipItem } from '../services/inventoryService'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

export function HeroPage() {
  const { user } = useAuth(); const { player } = usePlayer(); const { items } = useInventory()
  const [busy, setBusy] = useState<string | null>(null); const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  async function toggle(itemId: string, equipped: boolean) { if (!user) return; setBusy(itemId); setMessage(null); try { if (equipped) await unequipItem(user.uid, itemId); else await equipItem(user.uid, itemId); setMessage({ type: 'success', text: equipped ? 'Artefato removido do avatar.' : 'Novo artefato equipado.' }) } catch (cause) { setMessage({ type: 'error', text: getFriendlyFirebaseError(cause) }) } finally { setBusy(null) } }
  if (!player) return <div className="auth-loading">Carregando herói...</div>
  return <main className="hero-page">
    <header><span className="eyebrow"><Crown size={15} /> Câmara do herói</span><h1>{player.characterName}</h1><p>Combine os artefatos conquistados e revele sua própria lenda.</p></header>
    {message && <div role="status" className={`hero-message ${message.type}`}>{message.text}</div>}
    <div className="hero-customizer"><section className="avatar-preview-panel"><div className="avatar-preview-aura" /><AvatarRenderer avatar={player.avatar} inventory={items} /><div className="avatar-nameplate"><span>Nível {player.level}</span><strong>{player.title}</strong></div></section>
      <section className="equipment-slots"><div className="section-title-row"><div><span className="eyebrow"><Sparkles size={13} /> Arsenal visual</span><h2 className="section-heading">Itens disponíveis</h2></div></div>
        {items.length ? <div className="equipment-list">{items.map(item => <article key={item.id} className={item.equipped ? 'equipped' : ''}><div><img src={item.imageUrl} alt="" /></div><div className="min-w-0 flex-1"><span>{ITEM_CATEGORY_LABELS[item.category]}</span><h3>{item.name}</h3></div><button onClick={() => void toggle(item.id, item.equipped)} disabled={busy === item.id}>{busy === item.id ? '...' : item.equipped ? <><Check size={14} /> Equipado</> : 'Equipar'}</button></article>)}</div> : <div className="tasks-empty min-h-72"><Package className="text-gold" /><h2>Nenhum equipamento</h2><p>Adquira artefatos no mercado para personalizar seu herói.</p></div>}
      </section>
    </div><AvatarTransformTool items={items} />
  </main>
}
