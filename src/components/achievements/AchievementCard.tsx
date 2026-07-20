import { motion, useReducedMotion } from 'framer-motion'
import { Award, Check, Coins, Eye, Gem, Lock, Map, ScrollText, Shield, ShoppingBag, Sparkles, Star, Trophy, Zap } from 'lucide-react'
import type { AchievementCategory, AchievementView } from '../../types/achievements'
import { achievementCategoryLabels, achievementRarityLabels } from '../../utils/achievementUtils'

const icons: Record<AchievementCategory, typeof Trophy> = { missions: ScrollText, consistency: Zap, progression: Star, market: ShoppingBag, collection: Gem, journey: Map, secret: Eye }
export function AchievementProgress({ value, target }: { value: number; target: number }) { const percent = Math.min(100, value / target * 100); return <div className="achievement-progress"><div><span>Progresso</span><strong>{value} / {target}</strong></div><i><motion.b initial={{ width: 0 }} animate={{ width: `${percent}%` }} /></i></div> }
export function AchievementCard({ achievement, busy, onDetails, onClaim }: { achievement: AchievementView; busy: boolean; onDetails: () => void; onClaim: () => void }) {
  const reduced = useReducedMotion(), Icon = icons[achievement.category], hidden = achievement.secret && !achievement.unlocked, claimable = achievement.unlocked && !achievement.rewardClaimed
  return <motion.article layout whileHover={reduced ? undefined : { y: -5 }} className={`achievement-card ${achievement.rarity} ${achievement.unlocked ? 'unlocked' : 'locked'} ${claimable ? 'claimable' : ''}`}>
    <div className="achievement-medal"><span><Icon size={31} /></span>{!achievement.unlocked && <i><Lock size={15} /></i>}</div>
    <div className="achievement-card-head"><small>{achievementCategoryLabels[achievement.category]}</small><span>{achievementRarityLabels[achievement.rarity]}</span></div>
    <h2>{hidden ? 'Conquista secreta' : achievement.name}</h2><p>{hidden ? 'Continue sua jornada para descobrir.' : achievement.description}</p>
    {!hidden && <AchievementProgress value={achievement.currentProgress} target={achievement.requirement.target} />}
    <div className="achievement-rewards"><span><Sparkles size={12} /> +{achievement.reward.xp} XP</span><span><Coins size={12} /> +{achievement.reward.gold}</span></div>
    <div className="achievement-state">{achievement.rewardClaimed ? <span className="done"><Check size={13} /> Concluída</span> : claimable ? <button disabled={busy} onClick={onClaim}><Award size={14} /> {busy ? 'Resgatando...' : 'Resgatar recompensa'}</button> : achievement.unlocked ? <span><Trophy size={13} /> Conquista obtida</span> : <span><Shield size={13} /> Em progresso</span>}<button aria-label="Ver detalhes" className="details" onClick={onDetails}><Eye size={15} /></button></div>
  </motion.article>
}
