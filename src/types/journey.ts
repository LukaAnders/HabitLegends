import type { Timestamp } from 'firebase/firestore'

export type JourneyObjectiveType =
  | 'completedTasks'
  | 'streak'
  | 'purchasedItems'
  | 'level'
  | 'epicTasksCompleted'
  | 'legendaryTasksCompleted'
  | 'achievementsUnlocked'

export type JourneyRegionState = 'locked' | 'available' | 'in_progress' | 'completed'

export interface JourneyObjective {
  id: string
  type: JourneyObjectiveType
  label: string
  target: number
}

export interface JourneyReward {
  xp: number
  gold: number
  title?: string | null
  itemId?: string | null
}

export interface JourneyRegion {
  id: string
  name: string
  description: string
  lore: string
  order: number
  minimumLevel: number
  previousRegionId: string | null
  imageUrl: string
  accent: 'emerald' | 'forest' | 'frost' | 'arcane' | 'gold'
  objectives: JourneyObjective[]
  reward: JourneyReward
}

export interface JourneyObjectiveProgress extends JourneyObjective {
  current: number
  completed: boolean
}

export interface UserJourneyProgress {
  id: string
  regionId: string
  status: 'completed'
  rewardClaimed: boolean
  objectivesSnapshot: Record<string, number>
  completedAt: Timestamp
  claimedAt: Timestamp
  updatedAt: Timestamp
}

export interface JourneyRegionView extends JourneyRegion {
  state: JourneyRegionState
  objectiveProgress: JourneyObjectiveProgress[]
  progressPercent: number
  canClaim: boolean
  userProgress: UserJourneyProgress | null
}

export interface JourneyClaimResult {
  region: JourneyRegion
  xpEarned: number
  goldEarned: number
  titleUnlocked?: string | null
}
