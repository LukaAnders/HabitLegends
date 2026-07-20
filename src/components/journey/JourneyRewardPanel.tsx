import { Coins, Crown, Gift, Sparkles } from 'lucide-react'
import type { JourneyRegionView } from '../../types/journey'

export function JourneyRewardPanel({ region }: { region: JourneyRegionView }) {
  return <section className="journey-reward-panel">
    <div className="journey-reward-title"><Gift size={18} /><span>Tesouro da região</span></div>
    <div className="journey-reward-grid">
      <span><Sparkles size={16} /><strong>+{region.reward.xp}</strong> XP</span>
      <span><Coins size={16} /><strong>+{region.reward.gold}</strong> ouro</span>
      {region.reward.title && <span className="title"><Crown size={16} /><strong>{region.reward.title}</strong></span>}
    </div>
  </section>
}
