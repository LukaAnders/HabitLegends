import { motion } from 'framer-motion'
import { Check, Lock, MapPin, Sparkles } from 'lucide-react'
import type { JourneyRegionView } from '../../types/journey'

const stateLabel = {
  locked: 'Bloqueada',
  available: 'Disponível',
  in_progress: 'Em andamento',
  completed: 'Concluída',
}

export function JourneyRegionNode({ region, selected, onSelect }: {
  region: JourneyRegionView
  selected: boolean
  onSelect: () => void
}) {
  const Icon = region.state === 'locked' ? Lock : region.state === 'completed' ? Check : region.state === 'available' ? Sparkles : MapPin
  return <motion.button
    type="button"
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: region.order * .08 }}
    whileHover={region.state === 'locked' ? undefined : { y: -6, scale: 1.02 }}
    onClick={onSelect}
    className={`journey-region-node ${region.state} ${selected ? 'selected' : ''}`}
    aria-label={`${region.name}, ${stateLabel[region.state]}`}
  >
    <span className="journey-region-emblem"><Icon size={22} /></span>
    <span className="journey-region-copy">
      <small>Capítulo {region.order}</small>
      <strong>{region.name}</strong>
      <span>{stateLabel[region.state]} · Nível {region.minimumLevel}</span>
    </span>
    {region.state !== 'locked' && <span className="journey-node-progress"><i style={{ width: `${region.progressPercent}%` }} /></span>}
  </motion.button>
}
