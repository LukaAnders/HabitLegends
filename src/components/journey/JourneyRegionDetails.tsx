import { motion } from 'framer-motion'
import { Check, ChevronRight, Lock, Shield, Swords } from 'lucide-react'
import type { JourneyRegionView } from '../../types/journey'
import { JourneyRewardPanel } from './JourneyRewardPanel'

export function JourneyRegionDetails({ region, busy, onClaim }: {
  region: JourneyRegionView
  busy: boolean
  onClaim: () => void
}) {
  return <motion.aside key={region.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className={`journey-details ${region.accent}`}>
    <div className="journey-details-art" style={{ backgroundImage: `linear-gradient(180deg, transparent 10%, #111522 96%), url(${region.imageUrl})` }}>
      <span>Região {region.order}</span>
      <div><small>Nível mínimo {region.minimumLevel}</small><h2>{region.name}</h2></div>
    </div>
    <div className="journey-details-body">
      <p className="journey-lore">“{region.lore}”</p>
      <p>{region.description}</p>
      <div className="journey-objectives-title"><Swords size={17} /><strong>Provações</strong><span>{region.progressPercent}%</span></div>
      <div className="journey-objectives">
        {region.objectiveProgress.map(objective => <div className={objective.completed ? 'done' : ''} key={objective.id}>
          <span>{objective.completed ? <Check size={15} /> : <Shield size={15} />}</span>
          <p>{objective.label}<small>{objective.current} / {objective.target}</small></p>
        </div>)}
      </div>
      <JourneyRewardPanel region={region} />
      {region.state === 'locked' ? <div className="journey-locked-note"><Lock size={16} />Alcance o nível necessário e conclua a região anterior.</div> : region.state === 'completed' ? <div className="journey-complete-note"><Check size={17} />Recompensa resgatada</div> : <button className="journey-claim-button" disabled={!region.canClaim || busy} onClick={onClaim}>
        {busy ? 'Selando conquista...' : region.canClaim ? 'Concluir região' : 'Complete todas as provações'}<ChevronRight size={17} />
      </button>}
    </div>
  </motion.aside>
}
