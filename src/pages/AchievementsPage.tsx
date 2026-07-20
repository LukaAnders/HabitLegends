import { useMemo, useState } from 'react'
import type { AchievementCategory, AchievementClaimResult, AchievementView } from '../types/achievements'
import { useAchievements } from '../hooks/useAchievements'
import { useAuth } from '../contexts/auth-context'
import { claimAchievementReward } from '../services/achievementService'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'
import { AchievementCard } from '../components/achievements/AchievementCard'
import { AchievementFilters, type AchievementStateFilter } from '../components/achievements/AchievementFilters'
import { AchievementsHeader } from '../components/achievements/AchievementsHeader'
import { AchievementDetailsModal, AchievementEmptyState, AchievementRewardModal, AchievementUnlockModal } from '../components/achievements/AchievementModals'
import { AchievementGrid } from '../components/achievements/AchievementGrid'

export function AchievementsPage() {
  const { user } = useAuth(), { achievements, loading, error, newlyUnlocked, dismissUnlock } = useAchievements(), [category, setCategory] = useState<'all' | AchievementCategory>('all'), [state, setState] = useState<AchievementStateFilter>('all'), [selected, setSelected] = useState<AchievementView | null>(null), [busy, setBusy] = useState<string | null>(null), [message, setMessage] = useState<string | null>(null), [reward, setReward] = useState<AchievementClaimResult | null>(null)
  const filtered = useMemo(() => achievements.filter(item => (category === 'all' || item.category === category) && (state === 'all' || (state === 'progress' && !item.unlocked) || (state === 'unlocked' && item.unlocked) || (state === 'available' && item.unlocked && !item.rewardClaimed) || (state === 'completed' && item.rewardClaimed))), [achievements, category, state])
  async function claim(achievement: AchievementView | { id: string }) { if (!user || busy) return; setBusy(achievement.id); setMessage(null); try { const result = await claimAchievementReward(user.uid, achievement.id); setReward(result); setSelected(null); dismissUnlock(); setMessage('Recompensa adicionada ao seu tesouro.') } catch (cause) { setMessage(getFriendlyFirebaseError(cause)) } finally { setBusy(null) } }
  const unlocked = achievements.filter(item => item.unlocked).length
  return <main className="achievements-page"><AchievementsHeader unlocked={unlocked} total={achievements.length} /><AchievementFilters category={category} state={state} onCategory={setCategory} onState={setState} />{(error || message) && <div className={`achievement-toast ${error ? 'error' : ''}`}>{error ?? message}</div>}{loading ? <AchievementGrid>{Array.from({ length: 8 }, (_, index) => <div className="achievement-skeleton" key={index} />)}</AchievementGrid> : achievements.length === 0 ? <AchievementEmptyState /> : filtered.length === 0 ? <AchievementEmptyState filtered /> : <AchievementGrid>{filtered.map(item => <AchievementCard key={item.id} achievement={item} busy={busy === item.id} onDetails={() => setSelected(item)} onClaim={() => claim(item)} />)}</AchievementGrid>}<AchievementDetailsModal achievement={selected} onClose={() => setSelected(null)} busy={busy === selected?.id} onClaim={() => selected && claim(selected)} /><AchievementUnlockModal achievement={newlyUnlocked} onClose={dismissUnlock} onClaim={() => newlyUnlocked && claim(newlyUnlocked)} /><AchievementRewardModal result={reward} onClose={() => setReward(null)} /></main>
}
