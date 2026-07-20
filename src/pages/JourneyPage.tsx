import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Map, Sparkles, X } from 'lucide-react'
import { JourneyMap } from '../components/journey/JourneyMap'
import { JourneyRegionDetails } from '../components/journey/JourneyRegionDetails'
import { useAuth } from '../contexts/auth-context'
import { usePlayer } from '../contexts/player-context'
import { useJourney } from '../hooks/useJourney'
import { claimJourneyRegionReward } from '../services/journeyService'
import type { JourneyClaimResult, JourneyRegionView } from '../types/journey'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

export function JourneyPage() {
  const { user } = useAuth()
  const { player } = usePlayer()
  const { regions, loading, error } = useJourney()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reward, setReward] = useState<JourneyClaimResult | null>(null)

  const defaultRegion = regions.find(region => region.state === 'in_progress' || region.state === 'available') ?? regions.at(-1)
  const effectiveSelectedId = selectedId ?? defaultRegion?.id ?? null
  const selected = useMemo(() => regions.find(region => region.id === effectiveSelectedId) ?? regions[0] ?? null, [regions, effectiveSelectedId])
  const completed = regions.filter(region => region.state === 'completed').length

  async function claim(region: JourneyRegionView) {
    if (!user || busy || !region.canClaim) return
    setBusy(true)
    setActionError(null)
    try { setReward(await claimJourneyRegionReward(user.uid, region.id)) }
    catch (cause) { setActionError(getFriendlyFirebaseError(cause)) }
    finally { setBusy(false) }
  }

  if (loading) return <main className="journey-page"><div className="journey-loading"><Compass className="animate-spin" /><span>Desenrolando o mapa...</span></div></main>

  return <main className="journey-page">
    <header className="journey-hero">
      <div><span className="eyebrow"><Compass size={15} />Crônicas do caminho</span><h1>Jornada da Lenda</h1><p>Cada hábito vencido revela uma nova fronteira do reino.</p></div>
      <div className="journey-overview"><Map size={23} /><span><small>Regiões dominadas</small><strong>{completed} de {regions.length}</strong></span><i><b style={{ width: `${regions.length ? completed / regions.length * 100 : 0}%` }} /></i></div>
    </header>
    {(error || actionError) && <div className="journey-error">{actionError ?? error}</div>}
    {!regions.length ? <section className="journey-empty"><Map size={34} /><h2>O mapa ainda não foi revelado</h2><p>Execute o seed das regiões para iniciar a jornada.</p></section> : <div className="journey-layout">
      <JourneyMap regions={regions} selectedId={effectiveSelectedId} onSelect={region => setSelectedId(region.id)} />
      {selected && <JourneyRegionDetails region={selected} busy={busy} onClaim={() => void claim(selected)} />}
    </div>}
    <footer className="journey-footer">Herói nível {player?.level ?? 1} · O caminho responde às suas conquistas reais.</footer>
    {reward && <motion.div className="journey-reward-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.section initial={{ scale: .82, y: 30 }} animate={{ scale: 1, y: 0 }}>
        <button aria-label="Fechar" onClick={() => setReward(null)}><X /></button><Sparkles className="journey-reward-spark" />
        <span>Região conquistada</span><h2>{reward.region.name}</h2><p>Seu nome agora ecoa por estas terras.</p>
        <div><strong>+{reward.xpEarned} XP</strong><strong>+{reward.goldEarned} ouro</strong></div>
        {reward.titleUnlocked && <small>Novo título: {reward.titleUnlocked}</small>}
      </motion.section>
    </motion.div>}
  </main>
}
