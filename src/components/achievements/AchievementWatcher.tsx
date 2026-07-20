import { useState } from 'react'
import { useAchievements } from '../../hooks/useAchievements'
import { useAuth } from '../../contexts/auth-context'
import { claimAchievementReward } from '../../services/achievementService'
import { AchievementRewardModal, AchievementUnlockModal } from './AchievementModals'
import type { AchievementClaimResult } from '../../types/achievements'

export function AchievementWatcher() { const { user } = useAuth(), { newlyUnlocked, dismissUnlock } = useAchievements(), [reward, setReward] = useState<AchievementClaimResult | null>(null); async function claim() { if (!user || !newlyUnlocked) return; try { setReward(await claimAchievementReward(user.uid, newlyUnlocked.id)); dismissUnlock() } catch { dismissUnlock() } } return <><AchievementUnlockModal achievement={newlyUnlocked} onClose={dismissUnlock} onClaim={claim} /><AchievementRewardModal result={reward} onClose={() => setReward(null)} /></> }
