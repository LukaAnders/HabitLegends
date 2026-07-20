import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import { usePlayer } from '../contexts/player-context'
import { useInventory } from './useInventory'
import { useJourney } from './useJourney'
import { useTaskCompletions } from './useTaskCompletions'
import { evaluateAchievements, subscribeToAchievements, subscribeToUserAchievements } from '../services/achievementService'
import type { AchievementDefinition, AchievementStats, AchievementView, UserAchievement } from '../types/achievements'
import { getAchievementProgress } from '../utils/achievementUtils'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

export function useAchievements() {
  const { user } = useAuth(), { player, loading: playerLoading } = usePlayer(), { items, loading: itemsLoading } = useInventory(), { completions, loading: completionLoading } = useTaskCompletions(), { regions, loading: journeyLoading } = useJourney()
  const [definitions, setDefinitions] = useState<AchievementDefinition[]>([]), [progress, setProgress] = useState<UserAchievement[]>([]), [loaded, setLoaded] = useState({ definitions: false, progress: false }), [error, setError] = useState<string | null>(null), [newlyUnlocked, setNewlyUnlocked] = useState<AchievementDefinition | null>(null)
  const evaluating = useRef(false)
  useEffect(() => subscribeToAchievements(value => { setDefinitions(value); setLoaded(current => ({ ...current, definitions: true })) }, cause => { setError(getFriendlyFirebaseError(cause)); setLoaded(current => ({ ...current, definitions: true })) }), [])
  useEffect(() => { if (!user) return; return subscribeToUserAchievements(user.uid, value => { setProgress(value); setLoaded(current => ({ ...current, progress: true })) }, cause => { setError(getFriendlyFirebaseError(cause)); setLoaded(current => ({ ...current, progress: true })) }) }, [user])
  const stats = useMemo<AchievementStats>(() => ({ completedTasks: player?.completedTasks ?? 0, currentStreak: player?.streak ?? 0, longestStreak: player?.longestStreak ?? 0, level: player?.level ?? 1, totalXp: player?.totalXp ?? 0, totalGoldEarned: completions.reduce((sum, item) => sum + item.goldEarned + item.levelBonusGold, 0) + regions.filter(region => region.userProgress?.rewardClaimed).reduce((sum, region) => sum + region.reward.gold, 0) + progress.filter(item => item.rewardClaimed).reduce((sum, item) => sum + (definitions.find(definition => definition.id === item.achievementId)?.reward.gold ?? 0), 0), purchasedItems: items.length, equippedItems: new Set(items.filter(item => item.equipped).map(item => item.category)).size, epicTasksCompleted: completions.filter(item => item.difficulty === 'epic').length, legendaryTasksCompleted: completions.filter(item => item.difficulty === 'legendary').length, journeyRegionsCompleted: regions.filter(region => region.userProgress?.rewardClaimed).length }), [player, completions, regions, items, progress, definitions])
  const loading = playerLoading || itemsLoading || completionLoading || journeyLoading || !loaded.definitions || !loaded.progress
  useEffect(() => { if (!user || loading || evaluating.current) return; evaluating.current = true; evaluateAchievements(user.uid, definitions, progress, stats).then(value => { if (value[0]) setNewlyUnlocked(value[0]) }).catch(cause => setError(getFriendlyFirebaseError(cause))).finally(() => { evaluating.current = false }) }, [user, loading, definitions, progress, stats])
  const progressMap = useMemo(() => new Map(progress.map(item => [item.achievementId, item])), [progress])
  const achievements = useMemo<AchievementView[]>(() => definitions.map(definition => { const item = progressMap.get(definition.id) ?? null, current = item?.currentProgress ?? getAchievementProgress(definition.requirement.type, stats); return { ...definition, progress: item, currentProgress: Math.min(current, definition.requirement.target), percent: Math.min(100, Math.round(current / definition.requirement.target * 100)), unlocked: item?.unlocked ?? false, rewardClaimed: item?.rewardClaimed ?? false } }), [definitions, progressMap, stats])
  return { achievements, stats, loading, error, newlyUnlocked, dismissUnlock: () => setNewlyUnlocked(null) }
}
