import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../contexts/auth-context'
import { usePlayer } from '../contexts/player-context'
import { db, requireFirebase } from '../lib/firebase'
import { subscribeToJourneyProgress, subscribeToJourneyRegions } from '../services/journeyService'
import type { JourneyObjectiveType, JourneyRegion, JourneyRegionState, JourneyRegionView, UserJourneyProgress } from '../types/journey'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'
import { useInventory } from './useInventory'
import { useTaskCompletions } from './useTaskCompletions'

export function useJourney() {
  const { user } = useAuth()
  const { player, loading: playerLoading } = usePlayer()
  const { items: inventory, loading: inventoryLoading } = useInventory()
  const { completions, loading: completionsLoading } = useTaskCompletions()
  const [regions, setRegions] = useState<JourneyRegion[]>([])
  const [progress, setProgress] = useState<UserJourneyProgress[]>([])
  const [achievementCount, setAchievementCount] = useState(0)
  const [loaded, setLoaded] = useState({ regions: false, progress: false, achievements: false })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => subscribeToJourneyRegions(
    data => { setRegions(data); setLoaded(value => ({ ...value, regions: true })) },
    cause => { setError(getFriendlyFirebaseError(cause)); setLoaded(value => ({ ...value, regions: true })) },
  ), [])

  useEffect(() => {
    if (!user) return
    const fail = (cause: Error) => { setError(getFriendlyFirebaseError(cause)); setLoaded(value => ({ ...value, progress: true })) }
    return subscribeToJourneyProgress(user.uid, data => {
      setProgress(data)
      setLoaded(value => ({ ...value, progress: true }))
    }, fail)
  }, [user])

  useEffect(() => {
    if (!user) return
    return onSnapshot(collection(requireFirebase(db, 'Cloud Firestore'), 'users', user.uid, 'achievements'), snapshot => {
      setAchievementCount(snapshot.docs.filter(item => item.data().unlockedAt).length)
      setLoaded(value => ({ ...value, achievements: true }))
    }, () => setLoaded(value => ({ ...value, achievements: true })))
  }, [user])

  const values = useMemo<Record<JourneyObjectiveType, number>>(() => ({
    completedTasks: player?.completedTasks ?? 0,
    streak: player?.streak ?? 0,
    purchasedItems: inventory.length,
    level: player?.level ?? 1,
    epicTasksCompleted: completions.filter(item => item.difficulty === 'epic').length,
    legendaryTasksCompleted: completions.filter(item => item.difficulty === 'legendary').length,
    achievementsUnlocked: achievementCount,
  }), [player, inventory, completions, achievementCount])

  const progressMap = useMemo(() => new Map(progress.map(item => [item.regionId, item])), [progress])
  const journey = useMemo<JourneyRegionView[]>(() => regions.map(region => {
    const userProgress = progressMap.get(region.id) ?? null
    const objectiveProgress = region.objectives.map(objective => ({
      ...objective,
      current: Math.min(values[objective.type], objective.target),
      completed: values[objective.type] >= objective.target,
    }))
    const previousComplete = !region.previousRegionId || Boolean(progressMap.get(region.previousRegionId)?.rewardClaimed)
    const unlocked = (player?.level ?? 1) >= region.minimumLevel && previousComplete
    const objectivesComplete = objectiveProgress.every(objective => objective.completed)
    const hasProgress = objectiveProgress.some(objective => objective.current > 0)
    let state: JourneyRegionState = 'locked'
    if (userProgress?.rewardClaimed) state = 'completed'
    else if (unlocked && objectivesComplete) state = 'available'
    else if (unlocked && hasProgress) state = 'in_progress'
    else if (unlocked) state = 'available'
    const total = objectiveProgress.reduce((sum, objective) => sum + objective.target, 0)
    const current = objectiveProgress.reduce((sum, objective) => sum + objective.current, 0)
    return {
      ...region,
      state,
      objectiveProgress,
      progressPercent: total ? Math.round(current / total * 100) : 100,
      canClaim: unlocked && objectivesComplete && !userProgress,
      userProgress,
    }
  }), [regions, progressMap, values, player])

  return {
    regions: journey,
    loading: playerLoading || inventoryLoading || completionsLoading || !loaded.regions || !loaded.progress || !loaded.achievements,
    error,
  }
}
